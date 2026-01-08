from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from users.models import User
from .models import Publication, Favorite, Status
from .serializer import PublicationSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_publications(request):
    publications = Publication.objects.all()
    serializedData = PublicationSerializer(publications, many=True).data
    return Response(serializedData)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_publication_by_slug(request, slug):
    try:
        publication = Publication.objects.get(slug=slug)
    except Publication.DoesNotExist:
        return Response(
            {"error": "Publication not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = PublicationSerializer(publication)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_publications(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    publications = Publication.objects.filter(author=user)
    serializedData = PublicationSerializer(publications, many=True).data
    return Response(serializedData)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_publications(request):
    publications = Publication.objects.filter(author=request.user)
    serializer = PublicationSerializer(publications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def create_publication(request):
    data = request.data.copy()
    
    if 'author' in data:
        data.pop('author')

    additional_images = request.FILES.getlist('additional_images')
    if additional_images:
        data.setlist('additional_images', additional_images)
    
    serializer = PublicationSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def edit_publication(request, slug):
    try:
        publication = Publication.objects.get(slug=slug)
    except Publication.DoesNotExist:
        return Response(
            {"error": "Publication not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if (publication.author_id != request.user.id):
        return Response(
            {"error": "You can not edit this publication. Loser."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'DELETE':
        publication.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        
        data = request.data.copy()
        additional_images = request.FILES.getlist('additional_images')
        if additional_images:
            data.setlist('additional_images', additional_images)
        
        serializer = PublicationSerializer(
            publication, 
            data=data, 
            partial=partial,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    user_id = request.user.id
    slug = request.data.get('slug')
    
    if not slug:
        return Response(
            {"error": "slug is required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        publication = Publication.objects.get(slug=slug)
    except Publication.DoesNotExist:
        return Response(
            {"error": "Publication not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if Favorite.objects.filter(user=user, publication=publication).exists():
        return Response(
            {"error": "This publication is already in favorites."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    favorite = Favorite.objects.create(user=user, publication=publication)
    
    return Response(
        {
            "message": "Publication added to favorites successfully.",
            "favorite_id": favorite.id
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorite(request, favorite_id):
    try:
        favorite = Favorite.objects.get(id=favorite_id)
    except Favorite.DoesNotExist:
        return Response(
            {"error": "Favorite not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    favorite.delete()
    return Response(
        {"message": "Publication removed from favorites successfully."},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_favorites(request):    
    favorites = Favorite.objects.filter(user=request.user)
    publications = [favorite.publication for favorite in favorites]
    
    serializer = PublicationSerializer(publications, many=True)
    return Response(serializer.data)

@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def change_publication_status(request, publication_slug):
    try:
        publication = Publication.objects.get(slug=publication_slug, author=request.user)
        
        new_status_id = request.data.get('status_id')
        if not new_status_id:
            return Response(
                {'error': 'status_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_status = Status.objects.get(id=new_status_id)
        except Publication.DoesNotExist:
            return Response(
                {'error': 'Invalid status_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        publication.status = new_status
        publication.save()
        
        serializer = PublicationSerializer(publication)
        return Response(serializer.data)
    
    except Publication.DoesNotExist:
        return Response(
            {'error': 'Publication not found or you do not have permission to modify it'},
            status=status.HTTP_404_NOT_FOUND
        )