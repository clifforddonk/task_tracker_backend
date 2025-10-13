from django.db import models
from tasks.models import Task
# Create your models here.
class Activity(models.Model):
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.CharField(max_length=255)  # Change to ForeignKey to Account model after @clifforddonk pushes app
    related_task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"