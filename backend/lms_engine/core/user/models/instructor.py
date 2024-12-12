from django.db import models

from . import User, Roles


class Instructor(User):
    courses = models.ManyToManyField('course.Course', related_name='instructors')

    def save(self, *args, **kwargs):
        self.role = Roles.INSTRUCTOR.value
        super().save(*args, **kwargs)
