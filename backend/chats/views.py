from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

from users.models import User
from main.models import Publication
from offers.models import Offer, OfferStatus
from .serializer import ChatSerializer, MessageSerializer
from .models import Chat, Message

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_chats(request):
    current_user = request.user

    chats = Chat.objects.filter(
        Q(author=current_user) |
        Q(publication__author=current_user)
    ).distinct()
    
    response_data = []
    
    for chat in chats:
        latest_message = Message.objects.filter(
            chat=chat
        ).order_by('-created_at').first()
        
        chat_serializer = ChatSerializer(chat, context={'request': request})
        
        if latest_message:
            message_serializer = MessageSerializer(
                latest_message, 
                context={'request': request}
            )
            messages_data = message_serializer.data
        else:
            messages_data = None
        
        response_data.append({
            "chat": chat_serializer.data,
            "messages": [messages_data]
        })
    
    return Response(response_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_by_publication_id(request, author_username, publication_id):
    current_user = request.user
    
    try:
        publication = Publication.objects.get(id=publication_id)
    except Publication.DoesNotExist:
        return Response(
            {'error': 'Publication not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        chat_author = User.objects.get(username=author_username)
    except Publication.DoesNotExist:
        return Response(
            {'error': 'Publication not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    existing_chat = Chat.objects.filter(
        publication=publication
    ).filter(
        (Q(author=current_user) | Q(publication__author=current_user)) & Q(author=chat_author)
    ).first()

    if existing_chat:
        messages = Message.objects.filter(chat=existing_chat).order_by('created_at')

        chat_serializer = ChatSerializer(existing_chat, context={'request': request})
        messages_serializer = MessageSerializer(messages, many=True, context={'request': request})
        
        response_data = {
            "chat": chat_serializer.data,
            "messages": messages_serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)

    if current_user == publication.author:
        return Response(
            {'error': 'You cannot create a chat with yourself for your own publication'},
            status=status.HTTP_400_BAD_REQUEST
        )
    chat = Chat.objects.create(
        publication=publication,
        author=current_user
    )

    chat_serializer = ChatSerializer(chat, context={'request': request})

    response_data = {
        'chat': chat_serializer.data,
        'messages': []
    }
    
    return Response(response_data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_message(request):
    data = request.data.copy()
    current_user = request.user

    chat_id = data.get('chat_id')
    text = data.get('text')

    if not chat_id:
        return Response(
            {'error': 'chat_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not text or text.strip() == '':
        return Response(
            {'error': 'Text message is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        chat = Chat.objects.get(id=chat_id)
    except Chat.DoesNotExist:
        return Response(
            {'error': 'Chat not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    if current_user not in [chat.author, chat.publication.author]:
        return Response(
            {'error': 'You are not a participant in this chat'}, 
            status=status.HTTP_403_FORBIDDEN
        )


    # is_first_message = not chat.message_set.exists()

    # if (is_first_message):
    #     offer_status = OfferStatus.objects.get(id=1)
    #     Offer.objects.create(
    #         publication = chat.publication,
    #         chat = chat,
    #         status = offer_status
    #     )

    message = Message.objects.create(
        chat=chat,
        author=current_user,
        text=text.strip()
    )

    serializer = MessageSerializer(message, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)
