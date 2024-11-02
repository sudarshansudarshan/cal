from django.db import models
from django.core.validators import MinValueValidator

class CourseChapterBind(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    chapter = models.ForeignKey('Chapter', verbose_name='Chapter Title', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(validators=[MinValueValidator(1)], unique=True)

    class Meta:
        verbose_name = 'Course Chapter'
        verbose_name_plural = 'Course Chapters'
        ordering = ['order']