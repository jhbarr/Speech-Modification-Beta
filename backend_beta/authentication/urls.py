from django.urls import path
from authentication import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # User Login and Registration routes
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),

    # Password reset routes with verification code
    path('request-password-reset/', views.RequestPasswordResetWithCodeView.as_view(), name='reset password request'),
    path('password-reset-confirm/<str:email>/<str:code>/', views.PasswordTokenWithCodeCheckView.as_view(), name='password-reset-confirm'),
    path('set-new-password/', views.SetNewPasswordWithCodeView.as_view(), name='set new password'), 
]
