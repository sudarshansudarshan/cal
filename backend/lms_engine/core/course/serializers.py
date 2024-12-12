from rest_framework import serializers

from ..utils.helpers import truncate_text
from .models import Course, Module, Section, SectionItem


class SectionItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the SectionItem model.
    """
    class Meta:
        model = SectionItem
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Section model.
    """
    class Meta:
        model = Section
        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Module model.
    """

    sections = SectionSerializer(many=True)

    class Meta:
        model = Module
        fields = '__all__'


class CourseListSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'visibility', 'created_at']

    def get_description(self, obj):
        return truncate_text(obj.description)


class CourseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
