from django.forms import ValidationError

from ..data import Statistics

def deserialize_course_statistics(statistics_json):
    return Statistics(
        num_enrollments=statistics_json['num_enrollments'],
        num_students_completed=statistics_json['num_students_completed'],
        num_students_in_progress=statistics_json['num_students_in_progress'],
        num_students_not_started=statistics_json['num_students_not_started']
    )

def validate_course_statistics(course_statistics):
    if not course_statistics.num_enrollments >= 0:
        raise ValidationError('Number of enrollments must be non-negative')

    if not course_statistics.num_students_completed >= 0:
        raise ValidationError('Number of students completed must be non-negative')

    if not course_statistics.num_students_in_progress >= 0:
        raise ValidationError('Number of students in progress must be non-negative')

    if not course_statistics.num_students_not_started >= 0:
        raise ValidationError('Number of students not started must be non-negative')