# activity/utils.py

from .models import Activity

def log_activity(user, action, task=None, description="", changes=None):
    """
    A centralized function to create activity logs.
    It captures a snapshot of the task's details, including the assigned user.
    """
    details = {}
    if task:
        # Create a snapshot of the task's current state
        details['task_id'] = task.id
        details['task_title'] = task.title
        # ✅ ADD THIS: Save the assigned user's ID in the snapshot
        if task.assigned_user:
            details['assigned_user_id'] = task.assigned_user.id

    Activity.objects.create(
        user=user,
        action=action.upper(),
        task=task,
        description=description,
        changes=changes or {},
        details=details # Save the enhanced snapshot
    )