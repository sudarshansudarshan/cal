from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.exceptions import ValidationError

from ..constants import *


class Roles(models.TextChoices):
    SUPERADMIN = 'superadmin', 'Super Admin'
    ADMIN = 'admin', 'Admin'
    MODERATOR = 'moderator', 'Moderator'
    INSTRUCTOR = 'instructor', 'Instructor'
    STAFF = 'staff', 'Staff'
    STUDENT = 'student', 'Student'

STAFF_ROLES = [Roles.SUPERADMIN, Roles.ADMIN, Roles.MODERATOR, Roles.STAFF]

class UserManager(BaseUserManager):
    """Manager for custom User model."""
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'superadmin')  # Superuser is always superadmin
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model."""

    first_name = models.CharField(max_length=USER_FNAME_MAX_LEN)
    last_name = models.CharField(max_length=USER_LNAME_MAX_LEN)
    username = models.CharField(max_length=USERNAME_MAX_LEN, unique=True)
    email = models.EmailField(max_length=USER_EMAIL_MAX_LEN, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for Django Admin
    courses = models.ManyToManyField('course.Course', related_name='%(class)ss', through='UserCourse')
    institutions = models.ManyToManyField('institution.Institution', related_name='%(class)ss', through='UserInstitution')
    role = models.CharField(choices=Roles.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'  # Use 'username' for authentication
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.username
