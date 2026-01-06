from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from chats.serializer import ChatSerializer
from .models import Offer, OfferStatus
from .serializer import OfferSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_offers(request):
    offers = Offer.objects.filter(publication__author=request.user)
    serializedData = OfferSerializer(offers, many=True).data
    return Response(serializedData)

@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def change_offer_status(request, offer_id):
    try:
        offer = Offer.objects.get(id=offer_id, publication__author=request.user)
        
        new_status_id = request.data.get('status_id')
        if not new_status_id:
            return Response(
                {'error': 'status_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_status = OfferStatus.objects.get(id=new_status_id)
        except OfferStatus.DoesNotExist:
            return Response(
                {'error': 'Invalid status_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        offer.status = new_status
        offer.save()
        
        serializer = OfferSerializer(offer)
        return Response(serializer.data)
    
    except Offer.DoesNotExist:
        return Response(
            {'error': 'Offer not found or you do not have permission to modify it'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_by_offer_id(request, offer_id):
    try:
        offer = Offer.objects.get(id=offer_id)
        current_user = request.user

        if (current_user != offer.publication.author and 
            current_user != offer.chat.author):
            return Response(
                {'error': 'You do not have permission to access this chat'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        chat = offer.chat
        serializedData = ChatSerializer(chat).data
        
        return Response(serializedData)
    
    except Offer.DoesNotExist:
        return Response(
            {'error': 'Offer not found'},
            status=status.HTTP_404_NOT_FOUND
        )