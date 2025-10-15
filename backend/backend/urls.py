from django.contrib import admin
from django.urls import path, include

admin.site.site_header = "Internal Task Tracker Admin"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("tasks/", include("tasks.urls")),
    path("auth/", include("users.urls")),
    path('api/', include('activity.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/users/', include('users.urls')),
]
