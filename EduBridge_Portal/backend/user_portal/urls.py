from django.urls import path
from user_portal.views import (UserRegistrationView, ProfileView, 
                            LogoutView, LoginView, 
                            ForgotPasswordView, ChangePasswordView,
                            ParentStudentsView)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile-view'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('assign-student-parent/', ParentStudentsView.as_view(), name='assign-student-parent'),
    path('parent-student/', ParentStudentsView.as_view(), name='parent-student'),

]
