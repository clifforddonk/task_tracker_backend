from django.contrib import admin
from . import models

# Register your models here.

@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
  list_display = ['title', 'assigned_to', 'created_by', 'status', 'priority', 'description' ,'deadline', 'created_at']
  list_filter = ['status', 'priority', 'created_at', 'deadline', 'assigned_to', 'created_by']
  list_editable = ['description', 'assigned_to', 'status', 'priority', 'deadline', ]
  search_fields = ['title', 'description', 'assigned_to', 'created_by', 'status', 'prority', 'deadline', 'created_at', 'updated_by']
  # autocomplete_fields =  ['title', 'description', 'assigned_to', 'created_by', 'status', 'deadline', 'created_at', 'updated_by']
  