from rest_framework import viewsets
from .models import User, UserInstitution, UserCourse
from .serializers import UserSerializer, UserInstitutionSerializer, UserCoursesSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserInstitutionViewSet(viewsets.ModelViewSet):
    queryset = UserInstitution.objects.all()
    serializer_class = UserInstitutionSerializer

class UserCoursesViewSet(viewsets.ModelViewSet):
    queryset = UserCourse.objects.all()
    serializer_class = UserCoursesSerializer