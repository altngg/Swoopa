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

@api_view(['POST'])
def create_publication(request):
    data = request.data
    serializer = PublicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
