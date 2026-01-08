from rest_framework import serializers
from .models import Publication

class PublicationSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    publication_type_name = serializers.CharField(source='publication_type.name', read_only=True)

    class Meta:
        model = Publication
        fields = ['id', 'name', 'slug', 'price', 'description', 'main_image', 'publication_type_name', 'status_name', 'author_username', 'author_id', 'created_at']
        extra_kwargs = {
            'slug': {'required': False, 'read_only': True},
            'created_at': {'read_only': True},
            'author_username': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        if 'name' in validated_data:
            from django.utils.text import slugify
            validated_data['slug'] = slugify(validated_data['name'])
        return super().update(instance, validated_data)