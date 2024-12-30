from rest_framework import serializers

from ..models import Course
from ...utils.helpers import truncate_text


class CourseListSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'visibility', 'created_at']

    def get_description(self, obj):
        return truncate_text(obj.description)


class CourseDetailSerializer(serializers.ModelSerializer):
    module_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_module_count(self, obj):
        return obj.modules.count()