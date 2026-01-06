from rest_framework import serializers

from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['publication', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    chat = ChatSerializer(read_only = True)

    class Meta:
        model = Message
        fields = ['chat', 'author', 'text', 'created_at']