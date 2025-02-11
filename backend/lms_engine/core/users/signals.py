from django.db.models.signals import post_save
from django.dispatch import receiver
import requests
from .models import UserCourseInstance
import os
from course.models import Course  # Import Course model if necessary


AE_HOST = os.getenv("ACTIVITY_ENGINE_URL", "/")  # Default to localhost if not set  # Default to 3001 if not set

AE_URL = f"{AE_HOST}/course-progress/initialize-progress"


@receiver(post_save, sender=UserCourseInstance)
def send_course_instance_data(sender, instance, created, **kwargs):
    if created:  # Ensure we only send data when a new instance is created
        course = instance.course
        print('course', course)
        course = Course.objects.get(id=course.id)
        print
        modules = course.modules.all()
        modules_payload = []

        for module in modules:
            sections_payload = []
            for section in module.sections.all():
                items_payload = [
                    {
                        "sectionItemId": item.prefixed_item_id,
                        "sequence": item.sequence,
                    }
                    for item in section.section_item_info.all()
                ]
                sections_payload.append({
                    "sectionId": str(section.id),
                    "sequence": section.sequence,
                    "sectionItems": items_payload,
                })

            modules_payload.append({
                "moduleId": str(module.id),
                "sequence": module.sequence,
                "sections": sections_payload,
            })

        payload = {
            "courseInstanceId": str(course.id),
            "studentIds": [str(instance.user.id)],
            "modules": modules_payload,
        }

        print("Sending course initialization...", payload)

        # Send the POST request
        try:
            response = requests.post(AE_URL, json=payload)
            response.raise_for_status()
            print("Successfully sent!")
        except requests.exceptions.RequestException as e:
            print(f"Error sending course initialization: {e}")

#
# @receiver(post_save, sender=UserInstitution)
# def assign_permissions_on_save(sender, instance, created, **kwargs):
#     """Assign default object-level permissions when a user is added to an institution based on their role."""
#     if created:
#         user = instance.user
#         institution = instance.institution
#
#         # Check the user's role (group)
#         user_groups = user.groups.values_list("name", flat=True)
#
#         # Assign permissions based on the user's role
#         if "superuser" in user_groups:
#             assign_perm("view_institution", user, institution)
#             assign_perm("change_institution", user, institution)
#             assign_perm("delete_institution", user, institution)
#         elif "admin" in user_groups:
#             assign_perm("view_institution", user, institution)
#             assign_perm("change_institution", user, institution)
#         elif "moderator" in user_groups:
#             assign_perm("view_institution", user, institution)
#             assign_perm("change_institution", user, institution)
#         elif "instructor" in user_groups:
#             assign_perm("view_institution", user, institution)
#         elif "ta" in user_groups:
#             assign_perm("view_institution", user, institution)
#         elif "student" in user_groups:
#             assign_perm("view_institution", user, institution)
#
# @receiver(post_delete, sender=UserInstitution)
# def remove_permissions_on_delete(sender, instance, **kwargs):
#     """Remove object-level permissions when a user is removed from an institution."""
#     user = instance.user
#     institution = instance.institution
#
#     # Remove all permissions
#     remove_perm("view_institution", user, institution)
#     remove_perm("change_institution", user, institution)
#     remove_perm("delete_institution", user, institution)
#
# @receiver(m2m_changed, sender=User.groups.through)
# def update_permissions_on_group_change(sender, instance, action, **kwargs):
#     """Update permissions if the user's group (role) changes."""
#     if action in ["post_add", "post_remove", "post_clear"]:
#         user = instance
#
#         # Remove existing permissions for all institutions
#         for institution in user.institutions.all():
#             remove_perm("view_institution", user, institution)
#             remove_perm("change_institution", user, institution)
#             remove_perm("delete_institution", user, institution)
#
#         # Reassign permissions based on the updated role
#         for institution in user.institutions.all():
#             assign_permissions_on_save(UserInstitution, instance=UserInstitution(user=user, institution=institution), created=True)
