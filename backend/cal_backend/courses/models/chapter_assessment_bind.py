from django.db import models

class ChapterAssessmentBind(models.Model):
    course = models.ForeignKey('Chapter', on_delete=models.CASCADE)
    chapter = models.ForeignKey('Assessment', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']