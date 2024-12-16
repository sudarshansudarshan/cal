from django.db import models

from . import Course
from ..constants import MODULE_TITLE_MAX_LEN, MODULE_DESCRIPTION_MAX_LEN

class ModuleManager(models.Manager):
    def accessible_by(self, user):
        return self.filter(course__in=Course.objects.accessible_by(user))

class Module(models.Model):  # Higher-level grouping, replaces Week
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=MODULE_TITLE_MAX_LEN)
    description = models.TextField(max_length=MODULE_DESCRIPTION_MAX_LEN)
    sequence = models.PositiveIntegerField(help_text="The order of this module in the course.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects: ModuleManager = ModuleManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['course', 'sequence'],
                name='module_sequence_in_course'
            )
        ]
        ordering = ['sequence']

    def __str__(self):
        return f"Module {self.sequence}: {self.title}"
