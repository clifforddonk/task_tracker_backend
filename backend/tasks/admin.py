from django.contrib import admin
from . import models

@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'get_assigned_users', 'created_by', 'status', 'priority', 'deadline', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'deadline', 'assigned_to', 'created_by']
    list_editable = ['status', 'priority', 'deadline']
    search_fields = ['title', 'description', 'status', 'priority', 'created_by__username', 'assigned_to__username']

    def get_assigned_users(self, obj):
        return ", ".join([user.username for user in obj.assigned_to.all()])
    get_assigned_users.short_description = "Assigned To"
