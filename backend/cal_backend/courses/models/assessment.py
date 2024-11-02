from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, MinValueValidator, MaxValueValidator

from cal_backend.courses.constants import *

class Assessment(models.Model):
    id = models.BigAutoField(primary_key=True)
    type = models.CharField(validators=[MinLengthValidator(ASSESSMENT_TYPE_LEN), MaxLengthValidator(ASSESSMENT_TYPE_LEN)])
    format = models.CharField(validators=[MinLengthValidator(ASSESSMENT_FORMAT_LEN), MaxLengthValidator(ASSESSMENT_FORMAT_LEN)])
    data = models.JSONField()
    rating = models.FloatField(validators=[MinValueValidator(ASSESSMENT_MIN_RATING), MaxValueValidator(ASSESSMENT_MAX_RATING)])
    max_score = models.FloatField(validators=[MinValueValidator(0.0)])
    time_limit = models.DurationField(null=True)

    # TODO: Add data, format, type validators
