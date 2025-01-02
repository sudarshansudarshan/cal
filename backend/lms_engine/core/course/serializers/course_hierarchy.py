from rest_framework import serializers
from ..models import Course, Module, Section

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'title', 'sequence']


class ModuleSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
   
    class Meta:
        model = Module
        fields = ['id', 'title', 'sequence', 'sections']


class CourseHierarchySerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
   
    class Meta:
        model = Course
        fields = ['id', 'name', 'modules']
