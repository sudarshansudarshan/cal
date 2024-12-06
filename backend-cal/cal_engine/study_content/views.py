from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Video, Article
from .serializers import VideoSerializer, ArticleSerializer
from .QuestionGen import transcriptAndQueGen

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    # Get request
    def get_queryset(self):
        queryset = Video.objects.all()
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset
    
    # POST request
    def create(self, request):
        video = Video.objects.create(
            title=request.data['title'],
            url=request.data['url'],
            course_id=request.data['course_id']
        )
        transcriptAndQueGen(video)
        serializer = VideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
