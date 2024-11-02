from django.contrib import admin
from django.contrib.auth.models import Group

# Unregister the built in Group model in favour of custom User models
admin.site.unregister(Group)