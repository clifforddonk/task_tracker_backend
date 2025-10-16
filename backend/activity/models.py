from django.db import models
from django.conf import settings
from tasks.models import Task


class Activity(models.Model):
    ACTION_CHOICES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
        ('status_changed', 'Status Changed'),
        ('assigned', 'Assigned'),
        ('unassigned', 'Unassigned'),
        ('comment_added', 'Comment Added'),
    ]

    task = models.ForeignKey(Task, on_delete=models.SET_NULL,
                             related_name='activities', null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField(null=True, blank=True)  # Store what changed

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"
