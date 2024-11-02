from django.db import models
from django.forms import ValidationError

from ..data_handlers import *
from ..constants import *

class Chapter(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=CHAPTER_TITLE_MAX_LEN)
    videos = models.JSONField(default=list, blank=True)
    assessments = models.ManyToManyField('Assessment', through='ChapterAssessmentBind', related_name='chapters') # TO REVIEW

    def clean(self):
        if not isinstance(self.videos, list):
            raise ValidationError("Videos should be a list of dictionaries.")

        for video_json in self.videos:
            try:
                video = deserialize_video(video_json)
            except BaseException as e:
                raise ValidationError(f'Invalid video data: {e}')

            validate_video(video)

    def __str__(self):
        return f'{self.title} (# {self.id})'
