from django.db import models

class Student(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    enrolled_courses = models.ManyToManyField('courses.Course', related_name='students')
