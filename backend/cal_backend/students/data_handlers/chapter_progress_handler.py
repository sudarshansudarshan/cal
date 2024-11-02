from datetime import datetime
from django.forms import ValidationError

from .assessment_progress_handler import *
from ..data.chapter_progress import ChapterProgress


def deserialize_chapter_progress(progress_json):
    return ChapterProgress(
        chapter_id=progress_json['chapter_id'],
        last_accessed=datetime.fromisoformat(progress_json['last_accessed']),
        assessment_progress=[deserialize_assessment_progress(ap) for ap in progress_json['assessment_progress']]
    )

def validate_chapter_progress(progress: ChapterProgress):
    for assessment_progress in progress.assessment_progress:
        validate_assessment_progress(assessment_progress)

    if not progress.last_accessed == get_last_accessed_assessment(progress.assessment_progress):
        raise ValidationError("Last accessed date of chapter progress should be equal to that of the last accessed assessment.")
