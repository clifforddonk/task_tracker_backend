from django.db import models
from users.models import User

# Create your models here.

class Task(models.Model):
  STATUS_PENDING = 'Pending'
  STATUS_IN_PROGRESS = 'In Progress'
  STATUS_COMPLETED = 'Completed'
  STATUS_CHOICES = [
      (STATUS_PENDING, 'Pending'),
      (STATUS_IN_PROGRESS, 'In Progress'),
      (STATUS_COMPLETED, 'Completed'),
  ]
  
  PRIORITY_LOW = 'Low'
  PRIORITY_MEDIUM = 'Medium'
  PRIORITY_HIGH = 'High'
  PRIORITY_CHOICES = [
      (PRIORITY_LOW, 'Low'),
      (PRIORITY_MEDIUM, 'Medium'),
      (PRIORITY_HIGH, 'High'),
  ]

  title = models.CharField(max_length=255)
  description = models.TextField()
  
  
  assigned_to = models.ManyToManyField(User, related_name='tasks_assigned')
  created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks_created')
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
  priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
  deadline = models.DateField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  