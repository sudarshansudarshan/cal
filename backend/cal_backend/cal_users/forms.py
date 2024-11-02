from django import forms
from django.contrib import admin

from .constants import *
from .models import CalUser

FORM_DISPLAY_FIELDS = ['first_name', 'last_name', 'email']

class CalUserForm(forms.ModelForm):
    first_name = forms.CharField(max_length=USER_FNAME_MAX_LENGTH)
    last_name = forms.CharField(max_length=USER_LNAME_MAX_LENGTH)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput, required=False)

    class Meta:
        model = CalUser
        fields = FORM_DISPLAY_FIELDS + ['password']

    def __init__(self, *args, **kwargs):
        super(CalUserForm, self).__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            for field in FORM_DISPLAY_FIELDS:
                self.fields[field].initial = getattr(self.instance.user, field)
        else:
            self.fields['password'].required = True

    def save(self, commit=True):
        if self.instance.pk:  # Checking if it's an existing user
            user = self.instance.user
            for field in FORM_DISPLAY_FIELDS:
                setattr(user, field, self.cleaned_data[field])
            if self.cleaned_data['password']:
                user.set_password(self.cleaned_data['password'])
            user.save()
        else:
            user = CalUser.objects.create_user(
                **{field: self.cleaned_data[field] for field in FORM_DISPLAY_FIELDS},
                password=self.cleaned_data['password']
            )

        profile = super().save(commit=False)
        profile.user = user
        if commit:
            profile.save()
        return profile

class CalUserAdmin(admin.ModelAdmin):
    list_display: list[str] = [ 'user__id' ,'user__first_name', 'user__last_name', 'user__email']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
