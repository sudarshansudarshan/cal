from django.contrib import admin
from django import forms

from ..models import Assessment
from ..constants import *

class AssessmentForm(forms.ModelForm):
    class Meta:
        model = Assessment
        fields = '__all__'

class AssessmentAdmin(admin.ModelAdmin):
    form = AssessmentForm
    search_fields = ['type', 'format']

admin.site.register(Assessment, AssessmentAdmin)

# TODO: Implement 
# 1. type as a multiple choice field or normal text field
# 2. format as a multiple choice field or normal text field
# 3. data