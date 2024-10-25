from django.db import models

class CourseChapterBind(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    chapter = models.ForeignKey('courses.Chapter', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']