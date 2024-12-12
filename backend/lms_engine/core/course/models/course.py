from django.db import models

from ..constants import COURSE_NAME_MAX_LEN, COURSE_DESCRIPTION_MAX_LEN


class VisibilityChoices(models.TextChoices):
    PUBLIC = 'public', 'Public'
    PRIVATE = 'private', 'Private'
    UNLISTED = 'unlisted', 'Unlisted'

class PersonnelAllowedRoles(models.TextChoices):
    MODERATOR = 'moderator', 'Moderator'
    STAFF = 'staff', 'Staff'
    ADMIN = 'admin', 'Admin'

    @classmethod
    def choices_to_string(cls):
        return ', '.join([choice[1] for choice in cls.choices])


class Course(models.Model):
    name = models.CharField(max_length=COURSE_NAME_MAX_LEN)
    description = models.TextField(max_length=COURSE_DESCRIPTION_MAX_LEN)
    visibility = models.CharField(
        choices=VisibilityChoices.choices,
        default=VisibilityChoices.PUBLIC.value,
        help_text="Set the visibility of the course."
    )
    institutions = models.ManyToManyField('institution.Institution', related_name='courses')
    instructors = models.ManyToManyField('user.User', through='CourseInstructor', related_name='instructor_courses')
    personnel = models.ManyToManyField('user.User', through='CoursePersonnel', related_name='personnel_courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CourseInstructor(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    instructor = models.ForeignKey('user.User', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['course', 'instructor'], name='unique_course_instructor')
        ]

    def save(self, *args, **kwargs):
        if self.instructor.role != 'instructor':
            raise ValueError("Only users with the 'instructor' role can be added to the instructors.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.instructor} - {self.course}"


class CoursePersonnel(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    personnel = models.ForeignKey('user.User', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['course', 'personnel'], name='unique_course_personnel')
        ]

    def save(self, *args, **kwargs):
        if self.personnel.role not in PersonnelAllowedRoles.choices:
            raise ValueError(f"Only users with one of {PersonnelAllowedRoles.choices_to_string()} role can be added to the instructors.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.personnel} - {self.course}"
