from django.contrib import admin
from django.apps import apps
from django.contrib import admin
from .models import Course, Module, Section, SectionItem


class SectionItemInline(admin.TabularInline):
    model = SectionItem
    fields = ('content_type', 'object_id', 'sequence')
    extra = 0


class SectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'sequence', 'created_at', 'updated_at')
    inlines = [SectionItemInline]


class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'sequence', 'created_at', 'updated_at')


class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'visibility', 'institution', 'created_at', 'updated_at')


admin.site.register(Course, CourseAdmin)
admin.site.register(Module, ModuleAdmin)
admin.site.register(Section, SectionAdmin)

