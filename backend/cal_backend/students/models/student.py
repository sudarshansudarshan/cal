from django.db import models

class Student(models.Model):
    user = models.OneToOneField('cal_users.CalUser', on_delete=models.CASCADE, related_name='student_profile')
    enrolled_courses = models.ManyToManyField('courses.Course', through='CourseEnrollmentBind', related_name='students')

    def __str__(self):
        return f'Student {self.user.first_name} {self.user.last_name} (# {self.user.id})'