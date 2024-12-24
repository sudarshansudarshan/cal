from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from ...course.models import SectionItem
from ..constants import *

class Assessment(SectionItem):
    title = models.CharField(max_length=ASSESSMENT_TITLE_MAX_LEN)
    question_visibility_limit = models.IntegerField(
        validators=[
            MinValueValidator(ASSESSMENT_QUESTION_VISIBILITY_LIMIT_MIN_VAL),
            MaxValueValidator(ASSESSMENT_QUESTION_VISIBILITY_LIMIT_MAX_VAL)
        ]
    )
    time_limit = models.IntegerField(
        validators=[
            MinValueValidator(ASSESSMENT_TIME_LIMIT_MIN_VAL),
            MaxValueValidator(ASSESSMENT_TIME_LIMIT_MAX_VAL)
        ],
        help_text='Time limit in seconds'
    )
