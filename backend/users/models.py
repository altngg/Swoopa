from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.html import strip_tags

# class CustomUserManager(BaseUserManager):

class Location(models.Model):
    city = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.city}"
   

class User(AbstractUser):
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True, max_length=254)
    password = models.CharField(max_length=128)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)

    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.username 
