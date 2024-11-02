from django.contrib import admin
from django import forms
from django.core.validators import MinValueValidator

from ..models import *
from ..constants import *

STATISTICS_FIELDS = ['num_enrollments', 'num_students_completed', 'num_students_in_progress', 'num_students_not_started']
METADATA_FIELDS = ['description', 'tags']

class CourseForm(forms.ModelForm):
    description = forms.CharField(label="Description", widget=forms.Textarea, required=True)
    tags = forms.CharField(label="Tags", widget=forms.Textarea, required=True)
    num_enrollments = forms.IntegerField(label="Enrollments", required=True, validators=[MinValueValidator(0)])
    num_students_completed = forms.IntegerField(label="Students Completed", required=True, validators=[MinValueValidator(0)])
    num_students_in_progress = forms.IntegerField(label="Students In Progress", required=True, validators=[MinValueValidator(0)])
    num_students_not_started = forms.IntegerField(label="Students Not Started", required=True, validators=[MinValueValidator(0)])

    class Meta:
        model = Course
        fields = '__all__'
        exclude = ['metadata', 'statistics']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance.pk:
            for field in STATISTICS_FIELDS:
                self.fields[field].initial = 0
                self.fields[field].widget.attrs['readonly'] = True
        else:
            for field in STATISTICS_FIELDS:
                self.fields[field].widget.attrs.pop('readonly', None)
                self.fields[field].initial = self.instance.statistics[field]

            for field in METADATA_FIELDS:
                self.fields[field].initial = self.instance.metadata[field]

    def clean(self):
        cleaned_data = super().clean()
        metadata = {field: self.cleaned_data[field] for field in METADATA_FIELDS}
        statistics = {field: self.cleaned_data[field] for field in STATISTICS_FIELDS}

        cleaned_data['metadata'] = metadata
        cleaned_data['statistics'] = statistics

        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)

        instance.metadata = self.cleaned_data['metadata']
        instance.statistics = self.cleaned_data['statistics']

        if commit:
            instance.commit()
        
        return instance

class CourseChapterBindInline(admin.TabularInline):
    model = CourseChapterBind
    extra = 1
    ordering = ['order']
    autocomplete_fields = ['chapter']

class CourseAdmin(admin.ModelAdmin):
    form = CourseForm
    inlines = [CourseChapterBindInline]
    list_display = ['code', 'title', 'instructor']
    search_fields = ['code', 'title', 'instructor']
    list_filter = ['instructor']
    sortable_by = STATISTICS_FIELDS

admin.site.register(Course, CourseAdmin)
