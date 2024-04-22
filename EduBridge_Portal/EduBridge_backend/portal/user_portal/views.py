from django.db import transaction
from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from user_portal.models import Profile
from user_portal.serializers import ProfileSerializer, LoginSerializer, ForgotPasswordSerializer
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login
from django.shortcuts import render
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

def HomePage(request):
    return render(request, 'user/HomePage.html')

class LogoutView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({"access_token": str(refresh.access_token), "refresh_token": str(refresh), "role": user.profile.role}, status=status.HTTP_200_OK)

class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        profile_serializer = ProfileSerializer(data=request.data)
        
        if profile_serializer.is_valid():
            profile = profile_serializer.save()
            return Response(profile_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        if not self.request.user.is_authenticated:
            raise Http404("User is not authenticated")
        try:
            return self.request.user.profile
        except Profile.DoesNotExist:
            raise Http404("Profile does not exist")

    def get(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = ProfileSerializer(profile, data=request.data, partial=True) 
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not user.check_password(old_password):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  
            return Response({"message": "If an account exists with the email provided, a password reset link has been sent."}, status=200)
        else:
            return Response(serializer.errors, status=400)

class ParentStudentsView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = [JWTAuthentication]
    
    def post(self, request, *args, **kwargs):
        student_username = request.data.get("student_username")
        parent_profile = Profile.objects.get(user=request.user)

        try:
            student_profile = Profile.objects.get(user__username=student_username, role='student')
        except Profile.DoesNotExist:
            return Response({"error": "Student profile not found with Username "+str(student_username)+"."}, status=status.HTTP_404_NOT_FOUND)

        if student_profile.parent == parent_profile:
            return Response({"error": "Student already associated with this parent account."}, status=status.HTTP_400_BAD_REQUEST)
        if student_profile.parent:
            return Response({"error": "Student already has another parent account associated."}, status=status.HTTP_400_BAD_REQUEST)
        
        student_profile.parent = parent_profile
        student_profile.save()
        
        serializer = ProfileSerializer(student_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        parent_profile = Profile.objects.get(user=request.user)
        associated_students = parent_profile.children.all()
        serializer = ProfileSerializer(associated_students, many=True)
        
        return Response(serializer.data)