from django.db import models
from django.core.exceptions import ValidationError

from cal_backend.students.data_handlers.chapter_progress_handler import deserialize_chapter_progress, validate_chapter_progress

class CourseEnrollmentBind(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    progress = models.JSONField()

    def clean(self):
        if not isinstance(self.progress, list):
            raise ValueError('Progress must be a list of progress objects')

        # Fetch all chapters related to the course in bulk
        chapters = self.course.chapters.values('id', 'assessments')
        chapter_map = {chapter['id']: chapter['assessments'] for chapter in chapters}

        original_progress = [deserialize_chapter_progress(progress_json) for progress_json in CourseEnrollmentBind.objects.get(pk=self.pk).progress]
    
        validate_chapters(self.progress, chapter_map, original_progress)

            # TODO: Ensure 
            # 1. the assessment, when created has is_completed = False, score = None, submission_date = None, assessment_data = None, last_accessed = init_access_date, init_access_date = some value
            # 2. the assessment_data, score, submission_date are only modified one time when is_completed = True
            # 3. the last_accessed is updated every time the assessment is accessed

    class Meta:
        verbose_name = 'Enrolled Course'
        verbose_name_plural = 'Enrolled Courses'

def validate_chapters(chapter_progress, chapter_map, original_progress):
    for progress_json in chapter_progress:
        try:
            progress = deserialize_chapter_progress(progress_json)
        except BaseException as e:
            raise ValueError(f'Invalid progress data: {e}')

        validate_chapter_progress(progress)

        # Check if chapter_id is valid
        if progress.chapter_id not in chapter_map:
            raise ValidationError(f'Invalid chapter_id: {progress.chapter_id}')

        # Check if all assessment_ids are valid
        valid_assessment_ids = {assessment['id'] for assessment in chapter_map[progress.chapter_id]}
        for assessment_progress in progress.assessment_progress:
            if assessment_progress.assessment_id not in valid_assessment_ids:
                raise ValidationError(f'Invalid assessment_id: {assessment_progress.assessment_id} for chapter: {progress.chapter_id}')

            if assessment_progress.is_completed:
                assessment_time_spent = assessment_progress.submission_date - assessment_progress.init_access_date # type: ignore

                if assessment_time_spent > chapter_map[progress.chapter_id]['time_limit']:
                    raise ValidationError(f'Assessment time spent exceeds time limit for assessment_id: {assessment_progress.assessment_id}')
