from django.contrib import admin

from cal_backend.staff.models import Staff
from cal_backend.cal_users.forms import CalUserAdmin, CalUserForm

class StaffForm(CalUserForm):
    class Meta:
        model = Staff
        fields = CalUserForm.Meta.fields

    def save(self, commit=True):
        staff_profile = super().save(commit=False)
        if commit:
            staff_profile.save()
        return staff_profile

class StaffAdmin(CalUserAdmin):
    form = StaffForm

admin.site.register(Staff, StaffAdmin)
