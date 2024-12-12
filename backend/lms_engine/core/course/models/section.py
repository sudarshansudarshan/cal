from django.db import models

from . import Module
from ..constants import SECTION_TITLE_MAX_LEN, SECTION_DESCRIPTION_MAX_LEN

class Section(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='sections')
    title = models.CharField(max_length=SECTION_TITLE_MAX_LEN)
    description = models.TextField(max_length=SECTION_DESCRIPTION_MAX_LEN)
    sequence = models.PositiveIntegerField(help_text="The order of this section within the module.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['module', 'sequence'],
                name='section_sequence_in_module'
            )
        ]
        ordering = ['sequence']  # Default order by sequence

    def __str__(self):
        return f"Section {self.sequence}: {self.title} (Module {self.module.sequence})"
