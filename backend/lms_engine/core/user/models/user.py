from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

from ...utils.models import TimestampMixin
from ..constants import *


class Roles(models.TextChoices):
    SUPERADMIN = "superadmin", "Super Admin"
    ADMIN = "admin", "Admin"
    MODERATOR = "moderator", "Moderator"
    INSTRUCTOR = "instructor", "Instructor"
    STAFF = "staff", "Staff"
    STUDENT = "student", "Student"


STAFF_ROLES = [Roles.SUPERADMIN, Roles.ADMIN, Roles.MODERATOR, Roles.STAFF]


class UserManager(BaseUserManager):
    """Manager for custom User model."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "superadmin")  # Superuser is always superadmin
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimestampMixin):
    """Custom User model."""

    first_name = models.CharField(max_length=USER_FNAME_MAX_LEN)
    last_name = models.CharField(max_length=USER_LNAME_MAX_LEN)
    email = models.EmailField(max_length=USER_EMAIL_MAX_LEN, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for Django Admin
    courses = models.ManyToManyField(
        "course.CourseInstance", related_name="%(class)ss", through="UserCourseInstance"
    )
    institutions = models.ManyToManyField(
        "institution.Institution", related_name="%(class)ss", through="UserInstitution"
    )
    role = models.CharField(choices=Roles.choices)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"
