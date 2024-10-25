from django.contrib import admin

from cal_backend.courses import models

admin.site.register(models.Course)
admin.site.register(models.Chapter)
admin.site.register(models.Assessment)