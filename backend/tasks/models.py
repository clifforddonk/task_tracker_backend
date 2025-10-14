from django.db import models
from users.models import User

# Create your models here.

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),           # lowercase!
        ('in_progress', 'In Progress'),   # underscore, not space!
        ('completed', 'Completed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    assigned_user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='tasks' )# ✅ Use the ID of your desired default us)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    deadline = models.DateField()
    created_by = models.ForeignKey(
    'users.User',
    on_delete=models.CASCADE,
    related_name='tasks_created',
    null=True,
    blank=True
)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
  