from django.contrib import admin
from django.utils.html import format_html
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['action_badge', 'task',
                    'user', 'short_description', 'timestamp']
    list_filter = ['action', 'timestamp', 'user']
    search_fields = ['description', 'task__title', 'user__username']
    readonly_fields = ['task', 'user', 'action', 'description',
                       'timestamp', 'changes', 'formatted_changes']
    date_hierarchy = 'timestamp'
    list_per_page = 50

    def has_add_permission(self, request):
        """Disable manual creation"""
        return False

    def has_change_permission(self, request, obj=None):
        """Disable editing"""
        return False

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
        if len(obj.description) > 80:
            return obj.description[:80] + '...'
        return obj.description
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

    fieldsets = (
        ('Activity Information', {
            'fields': ('action', 'description', 'timestamp')
        }),
        ('Related Objects', {
            'fields': ('task', 'user')
        }),
        ('Changes', {
            'fields': ('formatted_changes', 'changes'),
            'classes': ('collapse',)
        }),
    )
