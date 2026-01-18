import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache
from .models import Chat, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = int(self.scope['url_route']['kwargs']['chat_id'])
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        if not await self.is_participant(self.chat_id, self.user.id):
            await self.close()
            return

        await self.accept()

        cache_key = f"chat_{self.chat_id}_user_{self.user.id}"
        cache.set(cache_key, self.channel_name, timeout=600)

    async def disconnect(self, close_code):
        cache_key = f"chat_{self.chat_id}_user_{self.user.id}"
        cache.delete(cache_key)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get("message", "").strip()

        if not message_text:
            return

        message = await self.save_message(self.chat_id, self.user.id, message_text)

        other_user_id = await self.get_other_participant(self.chat_id, self.user.id)
        if not other_user_id:
            return

        other_channel_key = f"chat_{self.chat_id}_user_{other_user_id}"
        other_channel_name = cache.get(other_channel_key)

        if other_channel_name:
            await self.channel_layer.send(
                other_channel_name,
                {
                    "type": "chat.message",
                    "message": message_text,
                    "sender_id": self.user.id,
                    "sender_username": self.user.username,
                    "timestamp": message.created_at.isoformat(),
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
            "sender_username": event["sender_username"],
            "timestamp": event["timestamp"],
        }))


    @database_sync_to_async
    def is_participant(self, chat_id, user_id):
        try:
            chat = Chat.objects.select_related('publication__author').get(id=chat_id)
            return chat.author_id == user_id or chat.publication.author_id == user_id
        except Chat.DoesNotExist:
            return False

    @database_sync_to_async
    def get_other_participant(self, chat_id, current_user_id):
        try:
            chat = Chat.objects.select_related('publication__author').get(id=chat_id)
            if chat.author_id == current_user_id:
                return chat.publication.author_id
            elif chat.publication.author_id == current_user_id:
                return chat.author_id
            return None
        except Chat.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, chat_id, author_id, text):
        return Message.objects.create(
            chat_id=chat_id,
            author_id=author_id,
            text=text
        )