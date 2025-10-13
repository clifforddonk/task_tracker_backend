from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from datetime import datetime, timedelta
from . import models


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'status',
        'priority',
        'status_badge',
        'priority_badge',
        'get_assigned_users',
        'created_by',
        'deadline_status',
        'created_at'
    ]
    list_filter = [
        'status',
        'priority',
        'created_at',
        'deadline',
        'assigned_to',
        'created_by'
    ]
    list_editable = ['status', 'priority']
    search_fields = [
        'title',
        'description',
        'created_by__username',
        'assigned_to__username'
    ]
    readonly_fields = ['created_at']
    filter_horizontal = ['assigned_to']
    date_hierarchy = 'created_at'
    list_per_page = 25

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'status', 'priority')
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'created_by')
        }),
        ('Timeline', {
            'fields': ('deadline', 'created_at')
        }),
    )

    actions = ['mark_as_completed', 'mark_as_in_progress', 'delete_selected']

    def get_assigned_users(self, obj):
        """Display assigned users as comma-separated list"""
        users = obj.assigned_to.all()
        if users:
            return ", ".join([user.username for user in users])
        return "-"
    get_assigned_users.short_description = "Assigned To"

    def status_badge(self, obj):
        """Display status with colored badge"""
        colors = {
            'pending': '#FFA500',
            'in_progress': '#007BFF',
            'completed': '#28A745',
            'on_hold': '#DC3545'
        }
        status_key = obj.status.lower().replace(' ', '_')
        color = colors.get(status_key, '#6C757D')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = "Status Badge"

    def priority_badge(self, obj):
        """Display priority with colored badge"""
        colors = {
            'low': '#28A745',
            'medium': '#FFC107',
            'high': '#FF6B6B',
            'critical': '#DC3545'
        }
        priority_value = (obj.priority or '').lower()
        color = colors.get(priority_value, '#6C757D')
        priority_display = (
            obj.get_priority_display().upper()
            if obj.priority
            else 'UNASSIGNED'
        )
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            priority_display
        )
    priority_badge.short_description = "Priority Badge"

    def deadline_status(self, obj):
        """Show deadline with color coding based on urgency"""
        if not obj.deadline:
            return "-"

        # Convert deadline to datetime if it's a date object
        if isinstance(obj.deadline, datetime):
            deadline_dt = obj.deadline
        else:
            # If it's a date, convert to datetime at start of day
            deadline_dt = datetime.combine(obj.deadline, datetime.min.time())
            # Make it timezone aware if USE_TZ is True
            if timezone.is_aware(timezone.now()):
                deadline_dt = timezone.make_aware(deadline_dt)

        now = timezone.now()

        if deadline_dt < now:
            color = '#DC3545'  # Red for overdue
            status_text = "OVERDUE"
        elif deadline_dt < now + timedelta(days=3):
            color = '#FFA500'  # Orange for due soon
            status_text = "DUE SOON"
        else:
            color = '#28A745'  # Green for on track
            status_text = "ON TRACK"

        # Format display based on whether it's date or datetime
        if isinstance(obj.deadline, datetime):
            deadline_display = obj.deadline.strftime('%Y-%m-%d %H:%M')
        else:
            deadline_display = obj.deadline.strftime('%Y-%m-%d')

        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span><br/><small>{}</small>',
            color,
            status_text,
            deadline_display
        )
    deadline_status.short_description = "Deadline"

    def mark_as_completed(self, request, queryset):
        """Bulk action to mark tasks as completed"""
        updated = queryset.update(status='Completed')
        self.message_user(request, f'{updated} task(s) marked as completed.')
    mark_as_completed.short_description = "Mark selected as Completed"

    def mark_as_in_progress(self, request, queryset):
        """Bulk action to mark tasks as in progress"""
        updated = queryset.update(status='In Progress')
        self.message_user(request, f'{updated} task(s) marked as In Progress.')
    mark_as_in_progress.short_description = "Mark selected as In Progress"

    def delete_selected(self, request, queryset):
        """Custom delete action with confirmation"""
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} task(s) deleted successfully.')
    delete_selected.short_description = "Delete selected tasks"

    def get_queryset(self, request):
        """Optimize query with select_related and prefetch_related"""
        qs = super().get_queryset(request)
        return qs.select_related('created_by').prefetch_related('assigned_to')
