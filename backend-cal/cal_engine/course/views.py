from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Course, Module, Section, SectionItem
from .serializers import CourseSerializer, ModuleSerializer, SectionSerializer, SectionItemSerializer
from .permissions import IsStudentReadOnly
from rest_framework.permissions import IsAuthenticated

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsStudentReadOnly, IsAuthenticated]


class ModuleViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing modules within a course.
    Allows listing, creating, updating, retrieving, and deleting modules.
    """
    serializer_class = ModuleSerializer
    permission_classes = [IsStudentReadOnly, IsAuthenticated]

    def get_queryset(self):
        queryset = Module.objects.prefetch_related('sections')
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        sequence = self.request.query_params.get('sequence', None)
        if sequence:
            queryset = queryset.filter(sequence=sequence)

        if queryset.exists():
            return queryset
        return Module.objects.all()



    def list(self, request, *args, **kwargs):
        """
        List all modules for the course specified in the URL.
        """
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
