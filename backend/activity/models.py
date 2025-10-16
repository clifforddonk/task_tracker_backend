# activities/models.py

from django.db import models
from django.conf import settings
from tasks.models import Task


class Activity(models.Model):
    ACTION_CHOICES = [
        ('CREATED', 'Created'),
        ('UPDATED', 'Updated'),
        ('DELETED', 'Deleted'),
        ('STATUS_CHANGED', 'Status Changed'),
        ('ASSIGNED', 'Assigned'),
        ('UNASSIGNED', 'Unassigned'),
        ('COMMENT_ADDED', 'Comment Added'),
    ]

    task = models.ForeignKey(
        Task,
        on_delete=models.SET_NULL,
        related_name='activities',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='activities'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField(null=True, blank=True)
    
    # ADD THIS FIELD to store a snapshot of task details
    details = models.JSONField(
        default=dict,
        blank=True,
        help_text="Stores a snapshot of task details like title at the time of the action."
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'Activities'

    def __str__(self):
        # You can enhance this later to use the details snapshot if the task is deleted
        task_title = self.details.get('task_title', '[Task Deleted]')
        return f"{self.user} - {self.action} on '{task_title}' - {self.timestamp}"