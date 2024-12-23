from django.db import models
from django.core.exceptions import ValidationError


class CourseInstance(models.Model):
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="instances"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    personnel = models.ManyToManyField(
        "user.User", through="CoursePersonnel", related_name="personnel_courses"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course", "start_date", "end_date"],
                name="unique_course_instance",
            )
        ]

    def __str__(self):
        return f"{self.course} - {self.start_date} to {self.end_date}"


class PersonnelAllowedRoles(models.TextChoices):
    MODERATOR = "moderator", "Moderator"
    STAFF = "staff", "Staff"
    ADMIN = "admin", "Admin"

    @classmethod
    def choices_to_string(cls):
        return ", ".join([choice[1] for choice in cls.choices])


class CoursePersonnel(models.Model):
    course = models.ForeignKey(CourseInstance, on_delete=models.CASCADE)
    personnel = models.ForeignKey("user.User", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course", "personnel"], name="unique_course_personnel"
            )
        ]

    def save(self, *args, **kwargs):
        if self.personnel.role not in PersonnelAllowedRoles.choices:
            raise ValidationError(
                f"Only users with one of {PersonnelAllowedRoles.choices_to_string()} role can be added to the instructors."
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.personnel} - {self.course}"
