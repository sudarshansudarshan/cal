from django.db import models

from . import User, Roles


class Student(User):
    courses = models.ManyToManyField('course.Course', related_name='students')

    def save(self, *args, **kwargs):
        self.role = Roles.STUDENT.value
        super().save(*args, **kwargs)
