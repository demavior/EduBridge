from rest_framework import serializers
from django.contrib.auth.models import User
from user_portal.models import Profile
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from user_portal.signals import password_reset_request

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    def validate(self, attrs):
        user = authenticate(username=attrs['username'], 
        password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Incorrect username or password.')
        if not user.is_active:
            raise serializers.ValidationError('User is disabled.')
        return {'user': user}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)
    
    class Meta:
        model = Profile
        fields = ['user', 'role', 'is_approved','parent']  

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        is_teacher = validated_data.get('role') == 'teacher'
        validated_data['is_approved'] = not is_teacher
        
        profile, created = Profile.objects.update_or_create(user=user, **validated_data)
        return profile

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        if not User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Email does not exist.")
        return attrs
    
    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_password_link = f"http://127.0.0.1:8000/reset-password/{uid}/{token}"
        password_reset_request.send(sender=self.__class__, email=email, reset_password_link=reset_password_link, user=user)