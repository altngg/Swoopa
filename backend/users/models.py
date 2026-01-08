from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.html import strip_tags

class Location(models.Model):
    city = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.city}"

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email or not username:
            raise ValueError("Email or username is not set.")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        
        return self.create_user(email=email, username=username, password=password, **extra_fields)
class User(AbstractUser):
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True, max_length=254)
    password = models.CharField(max_length=128)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True) # FIX ADDING PICTURES THROUGH FORM DATA

    objects = CustomUserManager()

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    
    def clean(self):
        for field in ['username', 'email', 'password', 'location', 'profile_picture']:
            value = getattr(self, field)
            if value:
                setattr(self, field, strip_tags(value))
