
```markdown
# Deployment Guide for CAL Activity Engine

## Prerequisites
Before starting, ensure you have downloaded the [Google Cloud CLI installer](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe) and created a Google Cloud project called "CAL Activity Engine".

## Steps to Deploy

### Step 1: Download Code From GitHub to Local Environment
Clone the repository to your local machine using the following command:
```bash
git clone https://github.com/Amritkumarchanchal/activity-deployment.git
```

### Step 2: Install Google Cloud CLI and Create Project
Install the Google Cloud CLI from the link provided in the prerequisites and create your project following the instructions [here](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/creating-project?cloudshell=true).

### Step 3: Enable Required APIs
Enable access to the required APIs in the Google Cloud Console as detailed in the Google Cloud documentation.

### Step 4: Setup Local Environment
Open Google Cloud CLI on your PC and navigate to your project directory:
```bash
cd "C:\Users\mramr\Downloads\lms_engine-LMS3-Testing\lms_engine-LMS3-Testing"  # or the Activity engine directory
```

### Step 5: Create Configuration Files
Create `app.yaml` and `.gcloudignore` files in your local code directory with the following configurations:

- **app.yaml**
    ```yaml
    runtime: nodejs20

    env_variables:
      DATABASE_URL: "postgresql://postgres.ucvqgjbokcojtmhvcguc:9oSvDva1HQp0yH7B@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
    ```

- **package.json** (Updated Code)
    ```json
    {
      "name": "my-express-app",
      "version": "1.0.0",
      "main": "dist/server.js",
      "scripts": {
        "prisma": "prisma generate",
        "build": "tsc && npm run prisma",
        "prestart": "npm run build",
        "start": "node dist/server.js",
        "dev": "npx nodemon server.ts",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "description": "",
      "dependencies": {
        "@prisma/client": "^6.2.1",
        "@types/express": "^5.0.0",
        "@types/node": "^22.10.10",
        "axios": "^1.7.9",
        "cors": "^2.8.5",
        "express": "^4.21.2",
        "pg": "^8.13.1",
        "@types/cors": "^2.8.17",
        "nodemon": "^3.1.9",
        "ts-node": "^10.9.2",
        "typescript": "^5.7.3",
        "prisma": "^6.2.1"
      }
    }
    ```

### Step 6: Local Testing
Run these commands in your local environment to install dependencies and build the project:
```bash
npm install        # Installs all node modules
npm run build      # Builds the dist folder
npx prisma migrate # Runs migrations
npm run dev        # Runs the development server
```

### Step 7: Deploy to Google Cloud Platform
Deploy your application to Google Cloud Platform using the following command:
```bash
gcloud app deploy --no-cache
```

### Step 8: Verification Post-Deployment
After successful deployment, you can access your application at:
[Your Own Link](https://cal-activity-engine.el.r.appspot.com/)

For logs and troubleshooting, use:
```bash
gcloud app logs tail -s default    # Stream logs from the command line
gcloud app browse                   # View your application in the web browser
```
```
