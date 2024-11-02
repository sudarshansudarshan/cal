from django.db import models

class Staff(models.Model):
    user = models.OneToOneField('cal_users.CalUser', on_delete=models.CASCADE, related_name='staff_profile')

    class Meta:
        verbose_name_plural = "Staff"

    def __str__(self):
        return f'Staff {self.user.first_name} {self.user.last_name} (# {self.user.id})'