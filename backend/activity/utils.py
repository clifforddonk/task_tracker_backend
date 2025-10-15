from .models import Activity

def log_activity(action, user, task=None, description="", changes=None):
    Activity.objects.create(
        action=action,
        user=user,
        task=task,  # This expects 'task', not 'related_task'
        description=description,
        changes=changes
    )
