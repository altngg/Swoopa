from rest_framework import serializers

from main.serializer import PublicationSerializer
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    publication = PublicationSerializer(read_only=True)
    chat_author = serializers.CharField(source='chat.author.username', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    class Meta:
        model = Offer
        fields = ['publication', 'status_name', 'chat_author', 'created_at']
