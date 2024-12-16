from django.contrib import admin
from django.contrib import admin

from .models import Course, Module, Section, CourseInstructor, CoursePersonnel, Video, Article, Source


class SectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'sequence', 'created_at', 'updated_at')


class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'sequence', 'created_at', 'updated_at')


class CourseInstructorInline(admin.TabularInline):
    model = CourseInstructor
    extra = 1  # Number of empty rows to show for new entries
    autocomplete_fields = ['instructor']  # Use if the field is large


class CoursePersonnelInline(admin.TabularInline):
    model = CoursePersonnel
    extra = 1
    autocomplete_fields = ['personnel']  # Use if the field is large


class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'visibility', 'get_institutions', 'get_instructors', 'created_at', 'updated_at')

    inlines = [CourseInstructorInline, CoursePersonnelInline]

    def get_institutions(self, obj):
        return ", ".join([institution.name for institution in obj.institutions.all()])
    get_institutions.short_description = 'Institutions'

    def get_instructors(self, obj):
        return ", ".join([instructor.name for instructor in obj.instructors.all()])
    get_instructors.short_description = 'Instructors'


admin.site.register(Course, CourseAdmin)
admin.site.register(Module, ModuleAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Video)
admin.site.register(Source)
admin.site.register(Article)
