from django.contrib import admin

from chats.models import Chat, Message

class ChatAdmin(admin.ModelAdmin):
    list_display = ['publication', 'created_at']
    search_fields = ['publication']

class MessageAdmin(admin.ModelAdmin):
    list_display = ['chat', 'author', 'text', 'created_at']
    search_fields = ['chat', 'author']
    
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)