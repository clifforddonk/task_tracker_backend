from tasks.models import Task
from .utils import log_activity
from django.db.models.signals import post_save,post_delete,user_logged_in,user_logged_out
from django.dispatch import receiver

@receiver(post_save, sender=Task)
def log_task_creation_update(sender, instance, created, **kwargs):
    if created:
        action = "Task Created"
        description = f"Task '{instance.title}' was created."
    else:
        action = "Task Updated"
        description = f" '{instance.title}' was updated. by {instance.created_by}"

    if instance.created_by:
        log_activity(action, user=instance.created_by, related_task=instance, description=description)
        
    
@receiver(post_delete, sender=Task)
def log_task_deletion(sender, instance, **kwargs):
    action = "Task Deleted"
    description = f"Task '{instance.title}' was deleted."
    if instance.created_by:
        log_activity(action, user=instance.created_by, related_task=instance, description=description)


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    action = "User Logged In"
    description = f"User '{user.username}' logged in."
    log_activity(action, user=user.username, description=description)
    
    if user.username:
        log_activity(action, user=user.username, description=description)
        
@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    action = "User Logged Out"
    description = f"User '{user.username}' logged out."
    if user.username:
        log_activity(action, user=user.username, description=description)