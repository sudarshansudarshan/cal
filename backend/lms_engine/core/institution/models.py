from django.db import models

from .constants import INSTITUTION_NAME_MAX_LEN, INSTITUTION_DESCRIPTION_MAX_LEN

class Institution(models.Model):
    name = models.CharField(max_length=INSTITUTION_NAME_MAX_LEN, unique=True)
    description = models.TextField(null=True, blank=True, max_length=INSTITUTION_DESCRIPTION_MAX_LEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name
