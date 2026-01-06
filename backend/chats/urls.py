from django.urls import path

from .views import get_my_chats, get_chat_by_id, create_chat, add_message

urlpatterns = [
    path('my', get_my_chats, name='get_my_chats'),
    path('<int:publication_id>', get_chat_by_id, name='get_chat_by_id'),
    path('create', create_chat, name='create_chat'),
    path('add-message', add_message, name='add_message'),
]