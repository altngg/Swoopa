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
    name = models.CharField(max_length=10)
    slug = models.CharField(max_length=10, unique=True)
    price = models.CharField()
    description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to='publications/main/')
    created_at = models.DateTimeField(auto_now_add=True)

    publication_type = models.ForeignKey(PublicationType, on_delete=models.CASCADE, related_name='publications_type')
    status = models.ForeignKey(PublicationType, on_delete=models.CASCADE, related_name='publications_status')
    # author

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class PublicationImage(models.Model):
    product = models.ForeignKey(Publication, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/extra/')