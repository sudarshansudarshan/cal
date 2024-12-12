from django.db import models

from . import SectionItem
from ..constants import ARTICLE_MAX_LENGTH


class Article(SectionItem):
    content = models.TextField(max_length=ARTICLE_MAX_LENGTH)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.item_type = 'article'
        super().save(*args, **kwargs)
