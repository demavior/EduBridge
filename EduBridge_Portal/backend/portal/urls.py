from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from django.conf import settings
from user_portal import views as user_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('django-admin/', admin.site.urls),
    re_path(r'^$', user_views.HomePage, name='HomePage'),
    re_path(r'^user/',include('user_portal.urls')),
    re_path(r'^api/', include('edubridge_portal.urls')),
    path('reset-password/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

