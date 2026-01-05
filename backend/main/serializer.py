from rest_framework import serializers
from .models import Publication

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['id', 'name', 'slug', 'price', 'description', 'main_image', 
                 'publication_type', 'status', 'author', 'created_at']
        extra_kwargs = {
            'slug': {'required': False, 'read_only': True},
            'created_at': {'read_only': True},
            'author': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        if 'name' in validated_data:
            from django.utils.text import slugify
            validated_data['slug'] = slugify(validated_data['name'])
        return super().update(instance, validated_data)