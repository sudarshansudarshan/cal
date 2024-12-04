from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Course, Module, Section, SectionItem
from .serializers import CourseSerializer, ModuleSerializer, SectionSerializer, SectionItemSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class ModuleViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing modules within a course.
    Allows listing, creating, updating, retrieving, and deleting modules.
    """
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

    # def list(self, request, *args, **kwargs):
    #     """
    #     Retrieve a list of all modules, optionally filtering by course.

    #     Args:
    #         request (Request): The HTTP request object containing query parameters (optional).
    #         *args (tuple): Additional positional arguments passed to the method.
    #         **kwargs (dict): Additional keyword arguments passed to the method.

    #     Returns:
    #         Response: A DRF Response object containing the list of modules.
    #     """
    #     course_id = request.query_params.get('course', None)
    #     if course_id:
    #         self.queryset = self.queryset.filter(course_id=course_id)  # Filter modules by course if `course` param is provided
    #     serializer = self.get_serializer(self.queryset, many=True)
    #     return Response(serializer.data)

    # def create(self, request, *args, **kwargs):
    #     """
    #     Create a new module within a specific course.

    #     Args:
    #         request (Request): The HTTP request object containing data for the new module.
    #         *args (tuple): Additional positional arguments passed to the method.
    #         **kwargs (dict): Additional keyword arguments passed to the method.

    #     Returns:
    #         Response: A DRF Response object containing the created module's data.
    #     """
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)  # Ensure data is valid
    #     self.perform_create(serializer)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def retrieve(self, request, *args, **kwargs):
    #     """
    #     Retrieve a specific module by its ID.

    #     Args:
    #         request (Request): The HTTP request object containing metadata.
    #         *args (tuple): Additional positional arguments passed to the method.
    #         **kwargs (dict): Contains the `pk` (primary key) of the module to retrieve.

    #     Returns:
    #         Response: A DRF Response object containing the module data.
    #     """
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)

    # def update(self, request, *args, **kwargs):
    #     """
    #     Update an existing module.

    #     Args:
    #         request (Request): The HTTP request object containing updated data for the module.
    #         *args (tuple): Additional positional arguments passed to the method.
    #         **kwargs (dict): Contains the `pk` (primary key) of the module to update.

    #     Returns:
    #         Response: A DRF Response object containing the updated module data.
    #     """
    #     partial = kwargs.pop('partial', False)  # Whether the update is partial (not all fields are required)
    #     instance = self.get_object()  # Fetch the module instance
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)  # Serialize and validate the data
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     return Response(serializer.data)

    # def destroy(self, request, *args, **kwargs):
    #     """
    #     Delete (soft delete by marking inactive) a module.

    #     Args:
    #         request (Request): The HTTP request object containing metadata.
    #         *args (tuple): Additional positional arguments passed to the method.
    #         **kwargs (dict): Contains the `pk` (primary key) of the module to delete.

    #     Returns:
    #         Response: A DRF Response object containing a success message.
    #     """
    #     instance = self.get_object()  # Fetch the module to delete
    #     instance.delete()  # Delete the module instance
    #     return Response(
    #         {"message": f"Module '{instance.title}' has been deleted."},
    #         status=status.HTTP_204_NO_CONTENT
    #     )


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
