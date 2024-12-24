from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from ...utils.models import TimestampMixin

from ..constants import *


class QuestionType(models.TextChoices):
    MCQ =  'MCQ', 'Multiple Choice Question'
    MSQ = 'MSQ', 'Multiple Select Question'
    NAT = 'NAT', 'Numerical Answer Type'
    DESC = 'DESC', 'Descriptive Question'


class Question(TimestampMixin, models.Model):
    assessment = models.ForeignKey('Assessment', on_delete=models.CASCADE, related_name='questions')
    text = models.TextField(max_length=QUESTION_TEXT_MAX_LEN)
    hint = models.TextField(null=True, blank=True, max_length=QUESTION_HINT_MAX_LEN)
    type = models.CharField(choices=QuestionType.choices)
    partial_marking = models.BooleanField(default=False, null=True)
    marks = models.IntegerField(
        validators=[
            MinValueValidator(QUESTION_MARKS_MIN_VAL),
            MaxValueValidator(QUESTION_MARKS_MAX_VAL)
        ]
    )
