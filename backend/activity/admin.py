from django.contrib import admin
from django.utils.html import format_html
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['action_badge', 'get_task_title', 'user',
                    'get_assigned_to',
                    'short_description', 'timestamp']
    list_filter = ['action', 'timestamp', 'user']
    search_fields = ['description', 'task__title', 'user__username',
                     'task__assigned_user__username']
    readonly_fields = ['task', 'user', 'action', 'description',
                       'timestamp', 'changes', 'formatted_changes',
                       'get_assigned_to']
    date_hierarchy = 'timestamp'
    list_per_page = 50

    def has_add_permission(self, request):
        """Disable manual creation"""
        return False

    def has_change_permission(self, request, obj=None):
        """Disable editing"""
        return False

    def get_task_title(self, obj):
        """Display task title or 'Deleted Task' if task is None"""
        if obj.task:
            return obj.task.title
        elif obj.changes and 'title' in obj.changes:
            return f"{obj.changes['title']} (Deleted)"
        elif obj.changes and 'task_id' in obj.changes:
            return f"Task #{obj.changes['task_id']} (Deleted)"
        return "N/A"
    get_task_title.short_description = "Task"

    def get_assigned_to(self, obj):
        """Display assigned user with icon"""
        if obj.task and obj.task.assigned_user:
            return format_html(
                '<span title="Assigned To">🎯 {}</span>',
                obj.task.assigned_user.username
            )
        elif obj.changes and 'assigned_user' in obj.changes:
            assigned = obj.changes['assigned_user']
            if isinstance(assigned, dict):
                # Handle old -> new assignment changes
                if assigned.get('new'):
                    return format_html(
                        '<span title="Assigned To">🎯 {}</span>',
                        assigned['new']
                    )
            elif assigned:
                return format_html(
                    '<span title="Assigned To">🎯 {}</span>',
                    assigned
                )
        return format_html('<span style="color: #999;">Unassigned</span>')
    get_assigned_to.short_description = "Assigned To"

    def action_badge(self, obj):
        """Display action with colored badge"""
        colors = {
            'created': '#28A745',
            'updated': '#007BFF',
            'deleted': '#DC3545',
            'status_changed': '#FFC107',
            'assigned': '#17A2B8',
            'unassigned': '#6C757D',
            'comment_added': '#6F42C1',
        }
        color = colors.get(obj.action, '#6C757D')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_action_display()
        )
    action_badge.short_description = "Action"

    def short_description(self, obj):
        """Display truncated description"""
        description = obj.description

        if len(description) > 100:
            return description[:100] + '...'
        return description
    short_description.short_description = "Description"

    def formatted_changes(self, obj):
        """Display changes in a readable format"""
        if not obj.changes:
            return "-"

        html = "<ul style='margin: 0; padding-left: 20px;'>"
        for key, value in obj.changes.items():
            if isinstance(value, dict) and 'old' in value and 'new' in value:
                html += f"<li><strong>{key}:</strong> {value['old']} → {value['new']}</li>"
            else:
                html += f"<li><strong>{key}:</strong> {value}</li>"
        html += "</ul>"
        return format_html(html)
    formatted_changes.short_description = "Changes"

    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'task', 'task__assigned_user')

    fieldsets = (
        ('Activity Information', {
            'fields': ('action', 'description', 'timestamp')
        }),
        ('User Information', {
            'fields': ('user', 'get_assigned_to')
        }),
        ('Related Objects', {
            'fields': ('task',)
        }),
        ('Changes', {
            'fields': ('formatted_changes', 'changes'),
            'classes': ('collapse',)
        }),
    )
