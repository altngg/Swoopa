from rest_framework import serializers

from main.serializer import PublicationSerializer
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    publication = PublicationSerializer()
    author_username = serializers.CharField(source='author.username')
    author_profile_picture = serializers.ImageField(source='author.profile_picture')
    class Meta:
        model = Chat
        fields = ['id', 'publication', 'created_at', 'author_username', 'author_profile_picture']

class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'author_username', 'text', 'created_at']