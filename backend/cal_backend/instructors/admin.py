from django.contrib import admin

from cal_backend.cal_users.forms import CalUserAdmin, CalUserForm
from .models import Instructor

class InstructorForm(CalUserForm):
    class Meta:
        model = Instructor
        fields = CalUserForm.Meta.fields

class InstructorAdmin(CalUserAdmin):
    form = InstructorForm

admin.site.register(Instructor, InstructorAdmin)