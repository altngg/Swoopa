from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.parsers import MultiPartParser, FormParser
import os

from .serializer import LocationSerializer, UserSerializer
from .models import Location, User

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_locations(request):
    locations = Location.objects.all()
    serializedData = LocationSerializer(locations, many=True).data
    return Response(serializedData)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_location(request):
    serialisedData = LocationSerializer(request.user.location).data
    return Response(serialisedData)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializedData = UserSerializer(user).data
    return Response(serializedData)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data.copy()
        
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'error': f'Field {field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'error': 'User with this email already exists. Try again.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'error': 'This username already exists. Too bad.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        location_id = data.get('location')
        if location_id:
            try:
                location = Location.objects.get(id=location_id)
                data['location'] = location
            except Location.DoesNotExist:
                return Response(
                    {'error': 'This location does not exist yet.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            location=data['location']
        )
        
        serializer = UserSerializer(user)
        return Response({
            'message': 'Registration successful. Congrats!',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        data = request.data
        username_or_email = data.get('username')
        password = data.get('password')
        
        if not username_or_email or not password:
            return Response(
                {'error': 'Username or email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if '@' in username_or_email:
                user = User.objects.get(email=username_or_email)
            else:
                user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        user = authenticate(request, username=user.username, password=password)
        
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'message': 'Login successful.',
                'user': serializer.data
            })
        else:
            return Response(
                {'error': 'Wrong password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        logout(request)
        return Response({'message': 'Logout successful. Well done!'})
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        user = request.user
        data = request.data.copy()
        
        if 'password' in data:
            user.set_password(data['password'])
            user.save()
            data.pop('password')
        
        if 'email' in data and data['email'] != user.email:
            if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
                return Response(
                    {'error': 'User with this email already exists. Try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if 'username' in data and data['username'] != user.username:
            if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
                return Response(
                    {'error': 'This username already exists. Too bad.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if 'location_id' in data:
            location_id = data.get('location_id')
            if location_id:
                try:
                    location = Location.objects.get(id=location_id)
                    user.location = location
                except Location.DoesNotExist:
                    return Response(
                        {'error': 'This locations does not exist.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                user.location = None
        
        for field in ['username', 'email']:
            if field in data:
                setattr(user, field, data[field])
        
        user.save()
        serializer = UserSerializer(user)
        
        return Response({
            'message': 'Data changed successfully. Good job.',
            'user': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile_picture(request):
    try:
        user = request.user
        
        if 'profile_picture' not in request.FILES:
            return Response(
                {'error': 'Файл изображения не найден'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user.profile_picture:
            if default_storage.exists(user.profile_picture.name):
                default_storage.delete(user.profile_picture.name)
        
        profile_picture = request.FILES['profile_picture']
        
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        file_extension = os.path.splitext(profile_picture.name)[1].lower()
        if file_extension not in allowed_extensions:
            return Response(
                {'error': 'Use files of these formats please: JPG, PNG, GIF, WebP'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.profile_picture = profile_picture
        user.save()
        
        serializer = UserSerializer(user)
        return Response({
            'message': 'Profile picture updated successfully.',
            'user': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    try:
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({
            'count': users.count(),
            'users': serializer.data
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )