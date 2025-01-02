from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..serializers.course_hierarchy import CourseHierarchySerializer
from ..models import Course
from ...user.models import User

class CourseHierarchyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseHierarchySerializer
    permission_classes = [IsAuthenticated]
   
    def get_queryset(self):
        user = self.request.user

        if not isinstance(user, User):
            return Course.objects.none()

        # Use the custom manager's accessible_by method
        return Course.objects.accessible_by(user).prefetch_related(
            'modules',
            'modules__sections'
        )
