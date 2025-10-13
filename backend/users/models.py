from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email,password,**extra_fields):
        email=self.normalize_email(email)
        user=self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save()

        return user



    def create_superuser(self, email,password,**extra_fields): 
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff being True")
        
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_staff=True")
        
        return self.create_user(email=email,password=password,**extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]
    
    email = models.CharField(max_length=80, unique=True)
    username = models.CharField(max_length=45)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='staff')  # NEW
    
    objects = CustomUserManager()  # Fixed typo
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username