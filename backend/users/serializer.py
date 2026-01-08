from rest_framework import serializers
from .models import User, Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'city']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'city']

class UserSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'location', 'profile_picture', 'date_joined']
        read_only_fields = ['id', 'date_joined']
        