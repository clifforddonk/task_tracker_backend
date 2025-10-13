from django.db.models.signals import post_save, pre_save, post_delete, m2m_changed
from django.dispatch import receiver
from tasks.models import Task
from .models import Activity
from django.contrib.auth import get_user_model
from threading import local

User = get_user_model()

# Store original task data before update
_task_pre_save_data = {}


@receiver(pre_save, sender=Task)
def track_task_changes(sender, instance, **kwargs):
    """Store original task data before save for comparison"""
    if instance.pk:  # Only for updates, not new tasks
        try:
            original = Task.objects.get(pk=instance.pk)
            _task_pre_save_data[instance.pk] = {
                'status': original.status,
                'priority': original.priority,
                'title': original.title,
                'description': original.description,
                'deadline': original.deadline,
            }
        except Task.DoesNotExist:
            pass


@receiver(post_save, sender=Task)
def log_task_activity(sender, instance, created, **kwargs):
    """Log activity when task is created or updated"""
    user = None

    # Try to get user from thread local storage (set in views)
    _thread_locals = local()
    user = getattr(_thread_locals, 'user', None)

    if not user and instance.created_by:
        user = instance.created_by

    if created:
        # Task created
        Activity.objects.create(
            task=instance,
            user=user,
            action='created',
            description=f'Task "{instance.title}" was created',
            changes={
                'status': instance.status,
                'priority': instance.priority,
            }
        )
    else:
        # Task updated - check what changed
        original_data = _task_pre_save_data.get(instance.pk, {})
        if original_data:
            changes = {}
            description_parts = []

            # Check status change
            if original_data.get('status') != instance.status:
                changes['status'] = {
                    'old': original_data.get('status'),
                    'new': instance.status
                }
                description_parts.append(
                    f"Status changed from '{original_data.get('status')}' to '{instance.status}'")

            # Check priority change
            if original_data.get('priority') != instance.priority:
                changes['priority'] = {
                    'old': original_data.get('priority'),
                    'new': instance.priority
                }
                description_parts.append(
                    f"Priority changed from '{original_data.get('priority')}' to '{instance.priority}'")

            # Check title change
            if original_data.get('title') != instance.title:
                changes['title'] = {
                    'old': original_data.get('title'),
                    'new': instance.title
                }
                description_parts.append(f"Title changed")

            # Check description change
            if original_data.get('description') != instance.description:
                changes['description'] = {
                    'old': original_data.get('description'),
                    'new': instance.description
                }
                description_parts.append(f"Description updated")

            # Check deadline change
            if original_data.get('deadline') != instance.deadline:
                changes['deadline'] = {
                    'old': str(original_data.get('deadline')),
                    'new': str(instance.deadline)
                }
                description_parts.append(f"Deadline changed")

            if changes:
                action = 'status_changed' if 'status' in changes else 'updated'
                Activity.objects.create(
                    task=instance,
                    user=user,
                    action=action,
                    description=f'Task "{instance.title}": {", ".join(description_parts)}',
                    changes=changes
                )

            # Clean up stored data
            if instance.pk in _task_pre_save_data:
                del _task_pre_save_data[instance.pk]


@receiver(post_delete, sender=Task)
def log_task_deletion(sender, instance, **kwargs):
    """Log activity when task is deleted"""
    from threading import local
    _thread_locals = local()
    user = getattr(_thread_locals, 'user', None)

    Activity.objects.create(
        task=None,
        user=user,
        action='deleted',
        description=f'Task "{instance.title}" was deleted',
        changes={'task_id': instance.pk}
    )


@receiver(m2m_changed, sender=Task.assigned_to.through)
def log_task_assignment(sender, instance, action, pk_set, **kwargs):
    """Log activity when users are assigned/unassigned to task"""
    if action in ['post_add', 'post_remove']:
        from threading import local
        _thread_locals = local()
        user = getattr(_thread_locals, 'user', None)

        if pk_set:
            users = User.objects.filter(pk__in=pk_set)
            user_names = ', '.join([u.username for u in users])

            if action == 'post_add':
                Activity.objects.create(
                    task=instance,
                    user=user,
                    action='assigned',
                    description=f'{user_names} assigned to task "{instance.title}"',
                    changes={'assigned_users': list(pk_set)}
                )
            elif action == 'post_remove':
                Activity.objects.create(
                    task=instance,
                    user=user,
                    action='unassigned',
                    description=f'{user_names} unassigned from task "{instance.title}"',
                    changes={'unassigned_users': list(pk_set)}
                )
