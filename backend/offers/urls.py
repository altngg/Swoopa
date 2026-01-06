from django.urls import path

from .views import change_offer_status, get_chat_by_offer_id, get_my_offers

urlpatterns = [
    path('my', get_my_offers, name='get_my_offers'),
    path('<int:offer_id>/change-status', change_offer_status, name='change_offer_status'),
    path('<int:offer_id>/chat', get_chat_by_offer_id, name='get_chat_by_offer_id'),
]