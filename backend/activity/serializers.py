from rest_framework import serializers
from .models import Activity
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True, allow_null=True)
    task_id = serializers.IntegerField(source='task.id', read_only=True, allow_null=True)

    class Meta:
        model = Activity
        fields = ['id', 'task', 'task_id', 'task_title', 'user', 'action', 
                  'description', 'timestamp', 'changes']
        read_only_fields = ['id', 'timestamp']


