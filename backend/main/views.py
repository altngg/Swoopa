from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from users.models import User
from .models import Publication, Favorite
from .serializer import PublicationSerializer


@api_view(['GET'])
def get_all_publications(request):
    publications = Publication.objects.all()
    serializedData = PublicationSerializer(publications, many=True).data
    return Response(serializedData)

@api_view(['GET'])
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
def get_my_publication(request, user_id):
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

@api_view(['POST'])
def create_publication(request):
    try:
        user = User.objects.get(request.data.get('author_id'))
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    data = request.data
    serializer = PublicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'PUT', 'DELETE'])
def edit_publication(request, slug):
    try:
        publication = Publication.objects.get(slug=slug)
    except Publication.DoesNotExist:
        return Response(
            {"error": "Publication not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'DELETE':
        publication.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        
        serializer = PublicationSerializer(
            publication, 
            data=request.data, 
            partial=partial,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_favorite(request):
    # Получаем данные из запроса
    user_id = request.data.get('user_id')
    slug = request.data.get('slug')
    
    # Проверяем наличие обязательных полей
    if not user_id or not slug:
        return Response(
            {"error": "user_id and slug are required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Проверяем существование пользователя
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Проверяем существование публикации
        publication = Publication.objects.get(slug=slug)
    except Publication.DoesNotExist:
        return Response(
            {"error": "Publication not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Проверяем, не добавлена ли уже публикация в избранное у пользователя
    if Favorite.objects.filter(user=user, publication=publication).exists():
        return Response(
            {"error": "This publication is already in favorites."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Создаем запись в избранном
    favorite = Favorite.objects.create(user=user, publication=publication)
    
    return Response(
        {
            "message": "Publication added to favorites successfully.",
            "favorite_id": favorite.id
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['DELETE'])
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
def get_user_favorites(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    favorites = Favorite.objects.filter(user=user)
    # Получаем список публикаций из избранного
    publications = [favorite.publication for favorite in favorites]
    
    serializer = PublicationSerializer(publications, many=True)
    return Response(serializer.data)