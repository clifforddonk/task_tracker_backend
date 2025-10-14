from django.urls import path
from . import views

urlpatterns = [
    path('', views.activity_list, name='activity-list'),
    path('<int:pk>/', views.activity_detail, name='activity-detail'),
    path('task/<int:task_id>/', views.task_activity_list,
         name='task-activity-list'),
    path('user/<int:user_id>/', views.user_activity_list,
         name='user-activity-list'),
    path('stats/', views.activity_stats, name='activity-stats'),
]
