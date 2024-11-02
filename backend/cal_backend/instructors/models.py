from django.db import models

class Instructor(models.Model):
    user = models.OneToOneField('cal_users.CalUser', on_delete=models.CASCADE, related_name='instructor_profile')

    def __str__(self):
        return f'Instructor {self.user.first_name} {self.user.last_name} (# {self.user.id})'
