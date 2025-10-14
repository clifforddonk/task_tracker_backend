from django.contrib import admin
from django.utils.html import format_html
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority',
                    'get_assigned_users', 'created_by', 'deadline', 'created_at']
    list_filter = ['status', 'priority',
                   'created_at', 'deadline', 'assigned_to']
    search_fields = ['title', 'description',
                     'created_by__username', 'assigned_to__username']
    filter_horizontal = ['assigned_to']
    readonly_fields = ['created_by', 'created_at']
    date_hierarchy = 'created_at'
    list_editable = ['status', 'priority']

    fieldsets = (
        ('Task Information', {
            'fields': ('title', 'description', 'status', 'priority')
        }),
        ('Assignment', {
            'fields': ('assigned_to',)
        }),
        ('Timeline', {
            'fields': ('deadline',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at'),
            'classes': ('collapse',)
        }),
    )

    def get_assigned_users(self, obj):
        """Display assigned users as a comma-separated list with badges"""
        users = obj.assigned_to.all()
        if not users:
            return format_html('<em style="color: #999;">Not assigned</em>')

        badges = []
        for user in users:
            badges.append(
                f'<span style="background-color: #007BFF; color: white; padding: 2px 8px; '
                f'border-radius: 3px; margin-right: 4px; display: inline-block; font-size: 11px;">'
                f'{user.username}</span>'
            )
        return format_html(' '.join(badges))

    get_assigned_users.short_description = "Assigned To"

    def save_model(self, request, obj, form, change):
        """Automatically set created_by to current admin user on creation"""
        if not change:  # Only on creation, not on update
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        """Only allow deletion if user is admin role"""
        if request.user.is_superuser:
            return True
        return hasattr(request.user, 'role') and request.user.role == 'admin'

    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('created_by').prefetch_related('assigned_to')
