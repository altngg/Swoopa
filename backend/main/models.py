from django.db import models
from django.utils.text import slugify

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
    location = models.CharField(max_length=255) # сделать так, чтобы при создании карточки локация бралась из локации автора

    publication_type = models.ForeignKey(PublicationType, on_delete=models.CASCADE, related_name='publications_type')
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='publications_status')
    
    # author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publications_author')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.location and self.author and self.author.location:
            self.location = str(self.author.location)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class PublicationImage(models.Model):
    product = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/extra/')

class Geolocation(models.Model):
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.city}, {self.district}" if self.district else self.city
    
