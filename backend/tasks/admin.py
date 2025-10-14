from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Task


admin.site.register(Task)