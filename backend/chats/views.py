from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

from main.models import Publication
from .serializer import ChatSerializer, MessageSerializer
from .models import Chat, Message

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_chats(request):
    current_user = request.user

    chats = Chat.objects.filter(
        Q(author=current_user) |
        Q(publication__author=current_user)
    )
    serializedData = ChatSerializer(chats, many=True).data
    return Response(serializedData)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_by_publication_id(request, publication_id):
    data = request.data.copy()
    current_user = request.user
    
    try:
        publication = Publication.objects.get(id=publication_id)
    except Publication.DoesNotExist:
        return Response(
            {'error': 'Publication not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    existing_chat = Chat.objects.filter(
        publication=publication,
        author=current_user
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
    
    data['publication'] = publication.id

    serializer = ChatSerializer(data=data, context={'request': request})

    response_data = {
            'chat': serializer.data,
            'messages': []
    }
    
    if serializer.is_valid():
        serializer.save(author=current_user)
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    message = Message.objects.create(
        chat=chat,
        author=current_user,
        text=text.strip()
    )
    
    serializer = MessageSerializer(message, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)
