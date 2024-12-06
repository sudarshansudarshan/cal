from rest_framework import serializers
from .models import Video, Article, VideoSegment

# Serializers
class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class VideoSegmentSerializer(serializers.ModelSerializer):
    video_title = serializers.ReadOnlyField(source='video.title')  # Include video title in response

    class Meta:
        model = VideoSegment
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'