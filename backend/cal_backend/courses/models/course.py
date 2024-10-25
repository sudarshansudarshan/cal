from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

from cal_backend.courses.constants import *

class Course(models.Model):
    title = models.CharField(max_length=COURSE_TITLE_MAX_LEN)
    code = models.CharField(validators=[MinValueValidator(COURSE_CODE_LEN), MaxValueValidator(COURSE_CODE_LEN)])
    description = models.TextField(max_length=COURSE_DESCRIPTION_MAX_LEN)
    instructor = models.ForeignKey('instructors.Instructor', on_delete=models.CASCADE)
    metadata = models.JSONField(default=dict, blank=True)
    statistics = models.JSONField(default=dict, blank=True)
    chapters = models.ManyToManyField('Chapter', through='CourseChapterBind', related_name='courses')

# Validators

def validate_metadata(metadata):
    if not isinstance(metadata, dict):
        raise ValidationError('Metadata must be a dictionary')
    
    if 'description' not in metadata:
        raise ValidationError('Metadata must contain a description field')
    
    if not isinstance(metadata['description'], str):
        raise ValidationError('Description must be a string')
    
    if 'tags' not in metadata:
        raise ValidationError('Metadata must contain a tags field')
    
    if not isinstance(metadata['tags'], list):
        raise ValidationError('Tags must be a list')
    
    for tag in metadata['tags']:
        if not isinstance(tag, str):
            raise ValidationError('Tags must be strings')

def validate_statistics(statistics):
    if not isinstance(statistics, dict):
        raise ValidationError('Statistics must be a dictionary')

    if 'num_enrollments' not in statistics:
        raise ValidationError('Statistics must contain a num_enrollments field')
    
    if not isinstance(statistics['num_enrollments'], int):
        raise ValidationError('Number of enrollments must be an integer')

    if 'num_students_completed' not in statistics:
        raise ValidationError('Statistics must contain a num_students_completed field')
    
    if not isinstance(statistics['num_students_completed'], int):
        raise ValidationError('Number of students completed must be an integer')
    
    if 'num_students_in_progress' not in statistics:
        raise ValidationError('Statistics must contain a num_students_in_progress field')
    
    if not isinstance(statistics['num_students_in_progress'], int):
        raise ValidationError('Number of students in progress must be an integer')

    if 'num_students_not_started' not in statistics:
        raise ValidationError('Statistics must contain a num_students_not_started field')
    
    if not isinstance(statistics['num_students_not_started'], int):
        raise ValidationError('Number of students not started must be an integer')
