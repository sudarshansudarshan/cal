from django.db import models
from django.core.exceptions import ValidationError

from cal_backend.courses.constants import *

class Chapter(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=CHAPTER_TITLE_MAX_LEN)
    videos = models.JSONField(default=list, blank=True)
    assessmentIDs = models.ManyToManyField('Assessment', through='ChapterAssessmentBind', related_name='chapters') # TO REVIEW

    def clean(self):
        validate_videos(self.videos)

    def __str__(self):
        return f'{self.title} (# {self.id})'

def validate_videos(videos):
    if not isinstance(videos, list):
        raise ValidationError('Videos must be a list')

    for video in videos:
        if not isinstance(video, dict):
            raise ValidationError('Each video must be a dictionary')

        if 'title' not in video:
            raise ValidationError('Each video must contain a title field')

        if not isinstance(video['title'], str):
            raise ValidationError('Title must be a string')

        if 'source' not in video:
            raise ValidationError('Each video must contain a source field')

        if not isinstance(video['source'], str):
            raise ValidationError('source must be a string')
