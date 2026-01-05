from django.contrib import admin

from users.models import Chat, Geolocation, Message, User

class GeolocationAdmin(admin.ModelAdmin):
    list_display = ['city', 'district']

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'location']
    list_filter = ['location']
    search_fields = ['username', 'email', 'location']

class ChatAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'created_at']
    search_fields = ['user1', 'user2']

class MessageAdmin(admin.ModelAdmin):
    list_display = ['chat', 'author', 'text', 'created_at']
    search_fields = ['chat', 'author']

admin.site.register(Geolocation, GeolocationAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)