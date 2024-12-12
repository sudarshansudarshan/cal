from django.db import models

class CourseAssessmentCount(models.Model):
    course = models.OneToOneField('course.Course', on_delete=models.CASCADE, related_name='assessment_count')
    count = models.PositiveIntegerField(default=0)
