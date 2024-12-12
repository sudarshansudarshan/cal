from rest_framework import generics
from .models import Course, Module
from .serializers import CourseListSerializer, CourseDetailSerializer, ModuleSerializer

class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseListSerializer

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    lookup_field = 'id'

class ModuleListView(generics.ListCreateAPIView):
    serializer_class = ModuleSerializer

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_id'])

class ModuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ModuleSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_id'])
