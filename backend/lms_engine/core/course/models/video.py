from django.db import models

from . import SectionItem
from ..constants import VIDEO_TRANSCRIPT_MAX_LEN


class Video(SectionItem):
    source = models.ForeignKey('Source', on_delete=models.CASCADE, related_name='videos')
    assessment = models.OneToOneField('assessment.Assessment', on_delete=models.CASCADE, related_name='video')
    transcript = models.TextField(null=True, blank=True, max_length=VIDEO_TRANSCRIPT_MAX_LEN)
    start_time = models.PositiveIntegerField()
    end_time = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['source', 'start_time', 'end_time'],
                name='unique_video_segment'
            )
        ]

    def save(self, *args, **kwargs):
        self.item_type = 'video'
        super().save(*args, **kwargs)
