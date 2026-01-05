from django.db import models
from django.utils.text import slugify

from users.models import User

class PublicationType(models.Model):
    name = models.CharField(max_length=10)
    slug = models.CharField(max_length=10, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class Status(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class Publication(models.Model):
    name = models.CharField()
    slug = models.CharField(unique=True)
    price = models.CharField(blank=True)
    description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to='publications/main/') 
    created_at = models.DateTimeField(auto_now_add=True)

    publication_type = models.ForeignKey(PublicationType, on_delete=models.CASCADE, related_name='publications_type')
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='publications_status')
    
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='publications_author')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class PublicationImage(models.Model):
    product = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/extra/')


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='favorites')
    def __str__(self):
        return f"{self.user.username} → {self.publication.name}"