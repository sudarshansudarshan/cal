from django.db import models
from django.contrib.auth import models as auth_models

from .constants import *

class CalUserManager(auth_models.BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class CalUser(auth_models.AbstractBaseUser, auth_models.PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=USER_FNAME_MAX_LENGTH)
    last_name = models.CharField(max_length=USER_LNAME_MAX_LENGTH)
    email = models.EmailField(unique=True)

    objects: CalUserManager = CalUserManager()

    USERNAME_FIELD = 'email'

    @property
    def is_staff(self):
        return self.is_superuser or hasattr(self, 'staff_profile')

    @property
    def is_student(self):
        return hasattr(self, 'student_profile')

    @property
    def is_instructor(self):
        return hasattr(self, 'instructor_profile')

    def __str__(self):
        return f'User {self.first_name} {self.last_name} (# {self.id})'
