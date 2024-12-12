from django.db.models.signals import m2m_changed
from django.core.exceptions import ValidationError

from .models import User, Roles

COURSE_ROLES = [Roles.INSTRUCTOR, Roles.STUDENT, Roles.STAFF]


def validate_institutions(sender, instance, action, **kwargs):
    if action in ["post_add", "post_remove", "post_clear"]:
        # Check institution validation
        if instance.role == Roles.SUPERADMIN and instance.institutions.exists():
            raise ValidationError("Super Admin users cannot be assigned to any institution.")

        # Check courses validation
        if instance.role not in COURSE_ROLES and instance.courses.exists():
            raise ValidationError(f"{instance.role} users cannot have associated courses.")

m2m_changed.connect(validate_institutions, sender=User.institutions.through)
m2m_changed.connect(validate_institutions, sender=User.courses.through)
