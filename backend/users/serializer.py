from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'city']

class UserSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        source='location',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'location', 'location_id', 'profile_picture', 'profile_picture_url',
            'date_joined', 'last_login', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'location'
        ]
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'location': {'required': False},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError(
                {"username": "A user with that username already exists."}
            )
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "A user with that email already exists."}
            )
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            location=validated_data.get('location')
        )
        
        return user

class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')
        
        if not username_or_email or not password:
            raise serializers.ValidationError(
                "Must include 'username_or_email' and 'password'."
            )
        
        if '@' in username_or_email:
            try:
                user = User.objects.get(email=username_or_email)
                username = user.username
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    "Unable to log in with provided credentials."
                )
        else:
            username = username_or_email
        
        user = authenticate(username=username, password=password)
        
        if not user:
            raise serializers.ValidationError(
                "Unable to log in with provided credentials."
            )
        
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")
        
        attrs['user'] = user
        return attrs

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    new_password2 = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."}
            )
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct.")
        return value

class UpdateProfileSerializer(serializers.ModelSerializer):
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        source='location',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email',
            'location_id', 'profile_picture'
        ]
        extra_kwargs = {
            'email': {'required': False},
        }
    
    def validate_email(self, value):
        user = self.context['request'].user
        
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError(
                "A user with that email already exists."
            )
        return value