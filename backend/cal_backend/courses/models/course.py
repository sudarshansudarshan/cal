from unittest.mock import Base
from django.db import models
from django.forms import ValidationError
from django.core.validators import MinLengthValidator, MaxLengthValidator

from ..data_handlers import *

from ..constants import *

class Course(models.Model):
    title = models.CharField(max_length=COURSE_TITLE_MAX_LEN)
    code = models.CharField(validators=[MinLengthValidator(COURSE_CODE_LEN), MaxLengthValidator(COURSE_CODE_LEN)])
    instructor = models.ForeignKey('instructors.Instructor', on_delete=models.CASCADE)
    metadata = models.JSONField()
    statistics = models.JSONField()
    chapters = models.ManyToManyField('Chapter', through='CourseChapterBind', related_name='courses')

    def clean(self):
        validate_metadata(self.metadata)
        validate_statistics(self.statistics)

# Validators

def validate_metadata(metadata):
    if not isinstance(metadata, dict):
        raise ValidationError('Metadata must be a dictionary')

    try:
        course_metadata = deserialize_course_metadata(metadata)
    except BaseException as e:
        raise ValidationError(f'Invalid metadata: {e}')

    validate_course_metadata(course_metadata)

def validate_statistics(statistics):
    if not isinstance(statistics, dict):
        raise ValidationError('Statistics must be a dictionary')
    
    try:
        course_statistics = deserialize_course_statistics(statistics)
    except BaseException as e:
        raise ValidationError(f'Invalid statistics: {e}')
    
    validate_course_statistics(course_statistics)
