from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Video, Article, VideoSegment
from .serializers import VideoSerializer, ArticleSerializer, VideoSegmentSerializer
from .QuestionGen import transcriptAndQueGen

from rest_framework.permissions import BasePermission, IsAuthenticated
from ..permissions import IsStudentReadOnly


# ViewSets
class VideoViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing video instances.
    """
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    permission_classes = [IsAuthenticated, IsStudentReadOnly]


class VideoSegmentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing video segment instances.
    """
    serializer_class = VideoSegmentSerializer
    queryset = VideoSegment.objects.all()


class ArticleViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing article instances.
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()
    permission_classes = [IsAuthenticated, IsStudentReadOnly]