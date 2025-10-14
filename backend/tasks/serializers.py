from rest_framework import serializers
from .models import Task
from users.models import User

class TaskSerializer(serializers.ModelSerializer):
    assigned_user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = [
            'id', 
            'title', 
            'description', 
            'assigned_user', 
            'assigned_user_name',
            'status', 
            'priority', 
            'deadline', 
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'assigned_user_name']
    
    def get_assigned_user_name(self, obj):
        return obj.assigned_user.username if obj.assigned_user else None