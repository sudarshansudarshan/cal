import pandas as pd
import requests
import random
import string
from tqdm import tqdm
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Define API endpoints
SIGNUP_URL = "http://192.168.1.18:8000/api/v1/auth/signup/"
COURSES_URL = "http://192.168.1.18:8000/api/v1/course/course-instances"  # Change to your actual API URL
USER_COURSE_INSTANCE_URL = "http://192.168.1.18:8000/api/v1/users/user-course-instances/"  # Endpoint for assigning users to course instances
FETCH_USER_URL = "http://192.168.1.18:8000/api/v1/users/users/by-email"  # Endpoint to fetch user by email

AUTH_TOKEN = os.getenv("AUTH_TOKEN")
if not AUTH_TOKEN:
    raise ValueError("No token found in the environment variables.")

# Function to generate a secure random password
def generate_password(length=10):
    chars = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    while True:
        password = ''.join(random.choices(chars, k=length))
        if (any(c.isupper() for c in password) and
            any(c.islower() for c in password) and
            any(c.isdigit() for c in password) and
            any(c in "!@#$%^&*()-_=+" for c in password)):
            return password

# Function to fetch available course instances
def fetch_courses():
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
    response = requests.get(COURSES_URL, headers=headers)

    if response.status_code == 200:
        data = response.json()
        course_instances = data.get("results", [])  # Extract courses from the paginated response

        if not course_instances:
            print("No course instances available.")
            return None

        print("Available Course Instances:")
        for idx, instance in enumerate(course_instances, start=1):
            print(f"{idx}. {instance['course']['name']} (Instance ID: {instance['id']}, Course ID: {instance['course']['id']})")

        while True:
            try:
                choice = int(input("Select a course instance by number: "))
                if 1 <= choice <= len(course_instances):
                    return course_instances[choice - 1]['id']  # Return the selected course instance's ID
                else:
                    print("Invalid selection. Please choose a valid instance number.")
            except ValueError:
                print("Invalid input. Please enter a number.")
    else:
        print(f"Failed to fetch course instances: {response.status_code} - {response.text}")
        return None

# Function to fetch a user's Firebase UUID by email
def fetch_user_firebase_uuid(email):
    headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
    response = requests.get(f"{FETCH_USER_URL}?email={email}", headers=headers)
    
    if response.status_code == 200:
        user_data = response.json()
        if user_data and "firebase_uid" in user_data:
            return user_data["id"]
    print(f"Failed to fetch Firebase UUID for {email} - {response.status_code} - {response.text}")
    return user_data["id"]

# Function to register users to a course instance
def assign_user_to_course(firebase_uuid, course_instance_id):
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "user": firebase_uuid,
        "course": course_instance_id
    }
    print(course_instance_id,firebase_uuid)
    response = requests.post(USER_COURSE_INSTANCE_URL, json=payload, headers=headers)
    if response.status_code == 200:
        print(f"Successfully assigned user {firebase_uuid} to course instance {course_instance_id}.")
    else:
        print(f"Failed to assign user {firebase_uuid} - {response.status_code} - {response.text}")

# Function to bulk signup users from CSV
# Function to bulk signup users from CSV
def bulk_signup(csv_file, course_instance_id):
    df = pd.read_csv(csv_file)
    df = df[40:]  # Skipping first 100 rows (if needed)

    required_columns = {"first_name", "last_name", "email"}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"CSV must contain columns: {required_columns}")

    # Fill NaN values in relevant columns
    df.fillna("", inplace=True)

    df["password"] = df.apply(lambda _: generate_password(10), axis=1)
    updated_csv_file = "updated_" + csv_file
    df.to_csv(updated_csv_file, index=False)
    print(f"Updated CSV with passwords saved as: {updated_csv_file}")

    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }

    success_count = 0
    failed_count = 0

    for _, row in tqdm(df.iterrows(), total=df.shape[0], desc="Processing Signups"):
        # Ensure all required fields are strings and don't contain NaN values
        payload = {
            "first_name": str(row["first_name"]),
            "last_name": str(row["last_name"]),
            "email": str(row["email"]),
            "password": str(row["password"])
        }

        response = requests.post(SIGNUP_URL, json=payload, headers=headers)

        success_count += 1
        firebase_uuid = fetch_user_firebase_uuid(row["email"])
        if firebase_uuid:
            assign_user_to_course(firebase_uuid, course_instance_id)

    print(f"Signup Completed: {success_count} Success, {failed_count} Failed")

# Main execution
def main():
    course_instance_id = fetch_courses()
    if course_instance_id:
        csv_file = input("Enter the path to the CSV file: ")
        bulk_signup(csv_file, course_instance_id)

if __name__ == "__main__":
    main()
