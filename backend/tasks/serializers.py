from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'assigned_to', 'created_by', 'status', 'priority', 'deadline', 'created_at']