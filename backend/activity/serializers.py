# activities/serializers.py

from rest_framework import serializers
from .models import Activity
from users.serializers import UserSerializer # Assuming you have a simple UserSerializer

class ActivitySerializer(serializers.ModelSerializer):
    # Use the UserSerializer to represent the user who performed the action
    user = UserSerializer(read_only=True)

    # This new field will intelligently provide task details
    task_info = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            'id',
            'user',
            'action',
            'description',
            'timestamp',
            'changes',
            'task_info', # Use this field on the frontend
        ]

    def get_task_info(self, obj):
        """
        This is the key to fixing the "null" title issue.

        - If the task still exists, return its current ID and title.
        - If the task has been deleted (obj.task is None),
          fall back to the snapshot we saved in the `details` JSON field.
        """
        if obj.task:
            return {
                'id': obj.task.id,
                'title': obj.task.title
            }
        # Fallback to the saved details if the task is deleted
        elif 'task_title' in obj.details:
            return {
                'id': obj.details.get('task_id'),
                'title': obj.details.get('task_title')
            }
        # If for some reason there are no details, return null
        return None