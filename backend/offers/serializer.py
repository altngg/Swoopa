from rest_framework import serializers
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['publication', 'status', 'chat', 'created_at']
