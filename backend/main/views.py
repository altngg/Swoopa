from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Publication
from .serializer import PublicationSerializer


@api_view(['GET'])
def get_publications(request):
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

@api_view(['POST'])
def create_publication(request):
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
        