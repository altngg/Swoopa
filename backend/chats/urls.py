from django.urls import path

from .views import get_my_chats, get_chat_by_publication_id, add_message

urlpatterns = [
    path('my/', get_my_chats, name='get_my_chats'),
    path('<int:publication_id>/', get_chat_by_publication_id, name='get_chat_by_publication_id'),
    path('add-message/', add_message, name='add_message'),
]