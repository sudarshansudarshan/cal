from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from cal_backend.courses.constants import *

class Assessment(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(validators=[MinValueValidator(ASSESSMENT_TYPE_LEN), MaxValueValidator(ASSESSMENT_TYPE_LEN)])
    format = models.CharField(validators=[MinValueValidator(ASSESSMENT_FORMAT_LEN), MaxValueValidator(ASSESSMENT_FORMAT_LEN)])
    data = models.JSONField()
    rating = models.FloatField(validators=[MinValueValidator(ASSESSMENT_MIN_RATING), MaxValueValidator(ASSESSMENT_MAX_RATING)])
    max_score = models.FloatField(validators=[MinValueValidator(0.0)])
    time_limit = models.DurationField(null=True)

    # TODO: Add data validators
