from django.db import models

class ChapterAssessmentBind(models.Model):
    chapter = models.ForeignKey('Chapter', on_delete=models.CASCADE)
    assessment = models.ForeignKey('Assessment', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Chapter Assessment'
        verbose_name_plural = 'Chapter Assessments'
        ordering = ['order']