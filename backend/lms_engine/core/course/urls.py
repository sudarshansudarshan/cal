from django.urls import path
from .views import CourseListView, CourseDetailView, ModuleListView, ModuleDetailView

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/<int:id>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/modules/', ModuleListView.as_view(), name='module_list'),
    path('courses/<int:course_id>/modules/<int:id>/', ModuleDetailView.as_view(), name='module_detail'),
]
