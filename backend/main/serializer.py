from rest_framework import serializers
from .models import Publication, PublicationImage, PublicationType
from django.utils.text import slugify

class PublicationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicationImage
        fields = ['id', 'image']
        read_only_fields = ['id']
        
class PublicationSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    publication_type_name = serializers.CharField(source='publication_type.name', read_only=True)
    publication_type_slug = serializers.CharField(write_only=True)

    main_image = serializers.ImageField(required=False, allow_null=True)
    additional_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    images = PublicationImageSerializer(many=True, read_only=True)

    class Meta:
        model = Publication
        fields = [
            'id', 'name', 'slug', 'price', 'description', 
            'main_image', 'publication_type_name', 'status_name',
            'author_username', 'author_id', 'created_at',
            'images', 'additional_images', 'status', 'publication_type_slug'
        ]
        extra_kwargs = {
            'slug': {'read_only': True},
            'created_at': {'read_only': True},
            'status': {'write_only': True},
        }
    
    def create(self, validated_data):
        publication_type_slug = validated_data.pop('publication_type_slug', None)
        additional_images = validated_data.pop('additional_images', [])
        
        if 'name' in validated_data:
            validated_data['slug'] = slugify(validated_data['name'])
        
        if publication_type_slug:
            try:
                publication_type = PublicationType.objects.get(slug=publication_type_slug)
                validated_data['publication_type'] = publication_type
            except PublicationType.DoesNotExist:
                raise serializers.ValidationError(
                    {'publication_type_slug': f'PublicationType with slug "{publication_type_slug}" does not exist.'}
                )
        
        publication = Publication.objects.create(**validated_data)
        
        for image in additional_images:
            PublicationImage.objects.create(publication=publication, image=image)
        
        return publication
    
    def update(self, instance, validated_data):
        publication_type_slug = validated_data.pop('publication_type_slug', None)
        additional_images = validated_data.pop('additional_images', None)
        
        if 'name' in validated_data:
            validated_data['slug'] = slugify(validated_data['name'])
        
        if publication_type_slug:
            try:
                publication_type = PublicationType.objects.get(slug=publication_type_slug)
                validated_data['publication_type'] = publication_type
            except PublicationType.DoesNotExist:
                raise serializers.ValidationError(
                    {'publication_type_slug': f'PublicationType with slug "{publication_type_slug}" does not exist.'}
                )
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if additional_images is not None:
            for image in additional_images:
                PublicationImage.objects.create(publication=instance, image=image)
        
        return instance