from django.db import models
from django.forms import ValidationError
from django.core.validators import MinLengthValidator, MaxLengthValidator

from ..constants import *

class Course(models.Model):
    title = models.CharField(max_length=COURSE_TITLE_MAX_LEN)
    code = models.CharField(validators=[MinLengthValidator(COURSE_CODE_LEN), MaxLengthValidator(COURSE_CODE_LEN)])
    instructor = models.ForeignKey('instructors.Instructor', on_delete=models.CASCADE)
    metadata = models.JSONField(default=dict, blank=True)
    statistics = models.JSONField(default=dict, blank=True)
    chapters = models.ManyToManyField('Chapter', through='CourseChapterBind', related_name='courses')

    def clean(self):
        validate_metadata(self.metadata)
        validate_statistics(self.statistics)

# Validators

def validate_metadata(metadata):
    if not isinstance(metadata, dict):
        raise ValidationError('Metadata must be a dictionary')

    if not isinstance(metadata['description'], str):
        raise ValidationError('Description must be a string')
    
    if len(metadata['description']) > COURSE_DESCRIPTION_MAX_LEN:
        raise ValidationError(f'Description must be at most {COURSE_DESCRIPTION_MAX_LEN} characters long')
    
    if 'tags' not in metadata:
        raise ValidationError('Metadata must contain a tags field')
    
    if not isinstance(metadata['tags'], list):
        raise ValidationError('Tags must be a list')

    for tag in metadata['tags']:
        if not isinstance(tag, str):
            raise ValidationError('Tags must be strings')

        if len(tag) > COURSE_TAG_MAX_LEN:
            raise ValidationError(f'Tags must be at most {COURSE_TAG_MAX_LEN} characters long')

def validate_statistics(statistics):
    if not isinstance(statistics, dict):
        raise ValidationError('Statistics must be a dictionary')

    if 'num_enrollments' not in statistics:
        raise ValidationError('Statistics must contain a num_enrollments field')

    if not isinstance(statistics['num_enrollments'], int):
        raise ValidationError('Number of enrollments must be an integer')
    
    if not statistics['num_enrollments'] >= 0:
        raise ValidationError('Number of enrollments must be non-negative')

    if 'num_students_completed' not in statistics:
        raise ValidationError('Statistics must contain a num_students_completed field')

    if not isinstance(statistics['num_students_completed'], int):
        raise ValidationError('Number of students completed must be an integer')
    
    if not statistics['num_students_completed'] >= 0:
        raise ValidationError('Number of students completed must be non-negative')
    
    if 'num_students_in_progress' not in statistics:
        raise ValidationError('Statistics must contain a num_students_in_progress field')
    
    if not isinstance(statistics['num_students_in_progress'], int):
        raise ValidationError('Number of students in progress must be an integer')
    
    if not statistics['num_students_in_progress'] >= 0:
        raise ValidationError('Number of students in progress must be non-negative')

    if 'num_students_not_started' not in statistics:
        raise ValidationError('Statistics must contain a num_students_not_started field')
    
    if not isinstance(statistics['num_students_not_started'], int):
        raise ValidationError('Number of students not started must be an integer')
    
    if not statistics['num_students_not_started'] >= 0:
        raise ValidationError('Number of students not started must be non-negative')
