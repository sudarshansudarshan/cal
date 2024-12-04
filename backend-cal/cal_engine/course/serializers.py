from rest_framework import serializers
from .models import Course, Module, Section, SectionItem

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Module model.
    """
    class Meta:
        model = Module
        fields = '__all__'

class SectionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Section model.
    """
    class Meta:
        model = Section
        fields = '__all__'


class SectionItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the SectionItem model.
    """
    class Meta:
        model = SectionItem
        fields = '__all__'