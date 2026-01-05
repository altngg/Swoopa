from django.contrib import admin

from chats.models import Chat, Message

class ChatAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'created_at']
    search_fields = ['user1', 'user2']

class MessageAdmin(admin.ModelAdmin):
    list_display = ['chat', 'author', 'text', 'created_at']
    search_fields = ['chat', 'author']
    
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)