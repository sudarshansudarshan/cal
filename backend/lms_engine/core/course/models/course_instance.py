from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Q

from ...utils.models import TimestampMixin
from . import VisibilityChoices
from ...user.models import User, Roles


class CourseInstanceManager(models.Manager):
    def accessible_by(self, user: User):
        if user.role == Roles.SUPERADMIN:
            return self.all()

        elif user.role == Roles.ADMIN:
            return self.filter(
                course_institution_id__in=user.institutions.values_list("id", flat=True)
            )

        elif user.role == Roles.MODERATOR:
            return self.filter(
                course_institution_id__in=user.institutions.values_list("id", flat=True)
            )

        elif user.role == Roles.INSTRUCTOR:
            user_institutions = user.institutions.values_list("id", flat=True)

            return self.filter(
                Q(course_visibility=VisibilityChoices.PUBLIC)
                | Q(
                    course_institutions__id__in=user_institutions,
                    course_visibility=VisibilityChoices.PRIVATE,
                )
                | Q(course_instructors__contains=user)
            )

        elif user.role == Roles.STAFF:
            user_institutions = user.institutions.values_list("id", flat=True)

            return self.filter(
                Q(course_visibility=VisibilityChoices.PUBLIC)
                | Q(
                    course_institutions__id__in=user_institutions,
                    course_visibility=VisibilityChoices.PRIVATE,
                )
                | Q(course_personnel__contains=user)
            )

        elif user.role == Roles.STUDENT:
            return user.courses.all()


class CourseInstance(TimestampMixin ,models.Model):
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="instances"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    personnel = models.ManyToManyField(
        "user.User", through="CoursePersonnel", related_name="personnel_courses"
    )

    objects: CourseInstanceManager = CourseInstanceManager()

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
