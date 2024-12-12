from django.db import models

from .constants import LOG_DESCRIPTION_MAX_LEN


class LogType(models.TextChoices):
    ACTIVITY = 'Activity', 'Activity'
    ERROR = 'Error', 'Error'
    AUDIT = 'Audit', 'Audit'


class Severity(models.TextChoices):
    INFO = 'Info', 'Info'
    WARNING = 'Warning', 'Warning'
    CRITICAL = 'Critical', 'Critical'


class Log(models.Model):
    user = models.ForeignKey('user.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    log_type = models.CharField(choices=LogType.choices)
    severity = models.CharField(choices=Severity.choices, null=True, blank=True)
    description = models.TextField(max_length=LOG_DESCRIPTION_MAX_LEN)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.log_type} - {self.description[:50]}"
