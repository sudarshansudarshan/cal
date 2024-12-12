from django.urls import include, path


urlpatterns = [
    path('auth/', include('core.authentication.urls')),
    path('user/', include('core.user.urls')),
    path('institution/', include('core.institution.urls')),
    path('course/', include('core.course.urls')),
    path('assessment/', include('core.assessment.urls')),
    path('log/', include('core.log.urls')),
]
