from django.contrib import admin

from .models.course_enrollment_bind import CourseEnrollmentBind
from cal_backend.cal_users.forms import CalUserAdmin, CalUserForm
from .models.student import Student

class StudentForm(CalUserForm):
    class Meta:
        model = Student
        fields = CalUserForm.Meta.fields + ['enrolled_courses']

    def save(self, commit=True):
        student_profile = super().save(commit=False)
        if commit:
            student_profile.save()
            student_profile.enrolled_courses.set(self.cleaned_data['enrolled_courses'])
        return student_profile

class StudentProgressInline(admin.TabularInline):
    model = CourseEnrollmentBind
    extra = 1
    fields = ['course', 'progress', 'enrollment_date']
    readonly_fields = ['enrollment_date']

class StudentAdmin(CalUserAdmin):
    form = StudentForm
    list_display = CalUserAdmin.list_display + ['get_enrolled_courses']
    inlines = [StudentProgressInline]

    def get_enrolled_courses(self, obj):
        return ', '.join([course.title for course in obj.enrolled_courses.all()])
    get_enrolled_courses.short_description = 'Enrolled Courses'

admin.site.register(Student, StudentAdmin)
