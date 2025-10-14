from django.contrib import admin
from django.utils.html import format_html
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority',
                    'assigned_user', 'created_by', 'deadline', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'deadline']
    search_fields = ['title', 'description',
                     'created_by__username', 'assigned_user__username']
    readonly_fields = ['created_by', 'created_at']
    date_hierarchy = 'created_at'
    list_editable = ['status', 'priority']

    fieldsets = (
        ('Task Information', {
            'fields': ('title', 'description', 'status', 'priority')
        }),
        ('Assignment', {
            'fields': ('assigned_user',)
        }),
        ('Timeline', {
            'fields': ('deadline',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at'),
            'classes': ('collapse',)
        }),
    )

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
        return qs.select_related('created_by', 'assigned_user')
