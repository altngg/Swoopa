from django.db import models

from chats.models import Chat
from main.models import Publication

class OfferStatus(models.Model):
    name = models.CharField(max_length=10)

    def __str__(self):
        return self.name
    
class Offer(models.Model):
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    status = models.ForeignKey(OfferStatus, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.publication.name}, {self.chat.author.username}, {self.publication.author.username}, {self.status.name}"
    