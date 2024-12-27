from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.test import APIClient
from rest_framework import status
from django.core import mail
from django.urls import reverse

class ProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')

    def test_profile_creation(self):
        self.assertTrue(Profile.objects.filter(user=self.user).exists())

class UserRegistrationViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_registration_and_email(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'role': 'student',
            'class_token': 'token123',
            'student_id': 'student123'
        }
        response = self.client.post(reverse('register'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Test email sending
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Welcome to Our Platform', mail.outbox[0].subject)

class ProfileViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='password123')
        self.profile = Profile.objects.create(user=self.user, role='student', student_id='student123')
        self.client.force_authenticate(user=self.user)

    def test_profile_update_and_email(self):
        updated_data = {'role': 'teacher'}
        response = self.client.put(reverse('profile'), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test email sending on profile update
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Profile Updated', mail.outbox[0].subject)

