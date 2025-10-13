from .models import Activity

def log_activity(action, user, related_task=None, description=""):
  Activity.objects.create(
      action=action,
      user=user,
      related_task=related_task,
      description=description
  )
