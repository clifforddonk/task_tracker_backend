from rest_framework import serializers
from .models import Activity
from django.contrib.auth import get_user_model

User = get_user_model()


class ActivityUserSerializer(serializers.ModelSerializer):
    """Nested serializer for user information in activities"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = fields


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model - Read-only"""
    user = ActivityUserSerializer(read_only=True)
    task_title = serializers.CharField(
        source='task.title', read_only=True, allow_null=True)
    task_id = serializers.IntegerField(
        source='task.id', read_only=True, allow_null=True)
    action_display = serializers.CharField(
        source='get_action_display', read_only=True)
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            'id',
            'task',
            'task_id',
            'task_title',
            'user',
            'action',
            'action_display',
            'description',
            'changes',
            'timestamp',
            'formatted_timestamp'
        ]
        read_only_fields = fields  # All fields are read-only

    def get_formatted_timestamp(self, obj):
        """Return formatted timestamp"""
        return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')

    def create(self, validated_data):
        """Prevent creation via API"""
        raise serializers.ValidationError(
            "Activities cannot be created manually. They are automatically generated.")

    def update(self, instance, validated_data):
        """Prevent updates via API"""
        raise serializers.ValidationError(
            "Activities cannot be modified. They are read-only records.")
