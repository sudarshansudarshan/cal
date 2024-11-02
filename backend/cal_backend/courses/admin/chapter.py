from django.contrib import admin
from django import forms

from cal_backend.courses.models import Chapter, ChapterAssessmentBind
from cal_backend.courses.constants import *

class ChapterForm(forms.ModelForm):
    class Meta:
        model = Chapter
        fields = '__all__'

class ChapterAssessmentBindInline(admin.TabularInline):
    model = ChapterAssessmentBind
    extra = 1
    ordering = ['order']
    autocomplete_fields = ['assessment']

class ChapterAdmin(admin.ModelAdmin):
    form = ChapterForm
    inlines = [ChapterAssessmentBindInline]
    list_display = ['title']
    search_fields = ['title']

admin.site.register(Chapter, ChapterAdmin)
