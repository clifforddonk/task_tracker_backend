# activity/utils.py

from .models import Activity

def log_activity(user, action, task=None, description="", changes=None):
    """
    A centralized function to create activity logs.
    It captures a snapshot of the task's details.
    """
    details = {}
    if task:
        # Create a snapshot of the task's current state
        details['task_id'] = task.id
        details['task_title'] = task.title

    Activity.objects.create(
        user=user,
        action=action.upper(), # Ensure action is uppercase to match choices
        task=task,
        description=description,
        changes=changes or {},
        details=details # Save the snapshot
    )