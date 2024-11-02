from django.contrib import admin

from .models import Staff
from cal_backend.cal_users.forms import CalUserAdmin, CalUserForm

class StaffForm(CalUserForm):
    class Meta:
        model = Staff
        fields = CalUserForm.Meta.fields

class StaffAdmin(CalUserAdmin):
    form = StaffForm

admin.site.register(Staff, StaffAdmin)
