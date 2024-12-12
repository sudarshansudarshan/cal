from django.db import models

class CourseInstance(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='instances')
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['course', 'start_date', 'end_date'], name='unique_course_instance')
        ]

    def __str__(self):
        return f'{self.course} - {self.start_date} to {self.end_date}'