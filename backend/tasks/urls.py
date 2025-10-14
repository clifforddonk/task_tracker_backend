from django.urls import path
from . import views

urlpatterns = [
    # List all tasks
    path('', views.task_list, name='task_list'),
    
    # Create task
    path('create/', views.create_task, name='create_task'),
    
    # Single task operations
    path('<int:pk>/', views.task_detail, name='task_detail'),
    path('<int:pk>/edit/', views.edit_task, name='edit_task'),
    path('<int:pk>/delete/', views.delete_task, name='delete_task'),
    path('<int:pk>/status/', views.update_task_status, name='update_task_status'),
]