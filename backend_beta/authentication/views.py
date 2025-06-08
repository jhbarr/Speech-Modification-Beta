from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import  AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import PasswordResetTokenGenerator # Not necessary
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode # Not necessary
from django.utils.encoding import force_bytes, smart_str # Not necessary
from django.core.mail import send_mail
from django.conf import settings
import random


from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer, ResetPasswordRequestSerializer, SetNewPasswordSerializer, SetNewPasswordWithCodeSerializer
from .models import CustomUser, PasswordResetVerificationCode


# ***** USER AUTHENTICATION VIEWS *****
"""
* UserRegisterView -> This is a view to create a new user in the database based on a specified email and password
* 
* FIELDS
*   queryset -> This gets all of the user instances from the CustomUser table in the database
*   serializer_class -> This specifies that the CustomUserSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
* 
* ADDITIONAL
* Since this is a CreateAPIView, that means that the route allows POST requests in order to put data in the database
"""
class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]





# ***** TOKEN OBTAIN VIEWS *****
"""
* CustomTokenObtainPairView -> This will provide custom access and refresh tokens that include the payment status of the user in them
* 
* FIELDS
*   serializer_class -> this is where the code specifies to use the CustomTokenObtainPairSerializer
"""
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# NOTE - A custom token refresh view is not necessary because upon first login, the frontend can store the information about the user's payment
# Status, so it's not necessary to ping the database every time the access token runs out.





# ***** PASSWORD RESET VIEWS -- USING URLS *****
"""
* RequestPasswordResetView -> This sends an email to the user with a password reset link and a password reset token
* 
* FIELDS
*   post() -> This sends the email to the user along with a special password reset token 
* 
* ADDITIONAL
* The post request handles sending an email to the user with the one the database has on file. The url is sent with the user's unique
* id and a special token that (should) have an expiration time. These two will be sent along with the newly requested password back to django
"""
class RequestPasswordResetView(generics.GenericAPIView):
    serializer_class = ResetPasswordRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # These get the user based on the email provided
        # And it encodes the user's id and supplies theh payload with a special token
        user = CustomUser.objects.get(email=serializer.validated_data['email'])
        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)

        reset_url = f'http://127.0.0.1:8000/reset-password?uidb64={uidb64}&token={token}'
        print(reset_url)

        # Send an email to the user
        # send_mail(
        #     subject="Password Reset Request",
        #     message=f"Use the link below to reset your password:\n{reset_url}",
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        # )

        return Response({"message": "Password reset link sent."}, status=status.HTTP_200_OK)
    
"""
* PasswordTokenCheckView -> This view checks the validity of the provided token and user id. This can be used by the frontend
*   to check whether the password reset link has become stale and should resend the password reset link
* 
* FIELDS
* 
"""   
class PasswordTokenCheckView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(id=uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Token is invalid or expired'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'success': True, 'message': 'Token is valid'}, status=status.HTTP_200_OK)

        except Exception:
            return Response({'error': 'Token is invalid'}, status=status.HTTP_400_BAD_REQUEST)
    
"""
* SetNewPasswordView -> This view allows the user to reset their password so long as they provide a valid token and the uid matches their user account
* 
* FIELDS 
*   patch() -> This is an HTTP request to update a resource. Therefore, in this case it is used to update the database with the provided password 
*       from the user's end
* 
* ADDITIONAL
* The SetNewPasswordSerializer handles checking whether the provided token and user id are valid and will also handle saving the new password
* to the database. This view is the interaface by which the serializer can interact with the provided information
"""
class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    





# ***** PASSWORD RESET VIEWS -- USING VERIFICATION CODE *****
"""
* RequestPasswordResetWithCodeView -> This sends an email to the user with a password reset verification code
* 
* FIELDS
*   post() -> This sends the email to the user along with a special password reset token 
* 
* ADDITIONAL
* The post request handles sending an email to the user with the one the database has on file. The url is sent with the a verification code that
* the user can use to reset their password in the app
"""
class RequestPasswordResetWithCodeView(generics.GenericAPIView):
    serializer_class = ResetPasswordRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = CustomUser.objects.get(email=serializer.validated_data['email'])
        code = f'{random.randint(100000, 999999)}'

        PasswordResetVerificationCode.objects.create(user=user, code=code)

        print(code)

        # Send an email to the user
        # send_mail(
        #     subject="Password Reset Request",
        #     message=f"Use the code below to reset your password:\n{code}",
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        # )

        return Response({"success": True, "message": "Password reset link sent."}, status=status.HTTP_200_OK)

"""
* PasswordTokenWithCodeCheckView -> This view checks the validity of the provided code and user email. This can be used by the frontend
*   to check whether the password reset link has become stale and should resend the password reset link
* 
* FIELDS
*   get() -> This method retrieves the user's email and verification code from the http request and checks whether the code 
*       is stil valid
"""   
class PasswordTokenWithCodeCheckView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, email, code):
        try:
            # Retrieve the user object with theh specified email
            user = CustomUser.objects.get(email=email)

            # Retrieve the most recent verification code object with the specified code
            code_entry = PasswordResetVerificationCode.objects.filter(
                user=user,
                code=code,
                is_used=False
            ).latest('created_at')

            # Check to see if the code has expired yet
            if code_entry.is_expired():
                return Response({'success': False, 'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({'success': True, 'message': 'Code is valid'}, status=status.HTTP_200_OK)

        except Exception:
            return Response({'success': False, 'error': 'Error handling verification code'}, status=status.HTTP_400_BAD_REQUEST)


"""
* SetNewPasswordWithCodeView -> This view allows the user to reset their password so long as they provide a valid token and the uid matches their user account
* 
* FIELDS 
*   patch() -> This is an HTTP request to update a resource. Therefore, in this case it is used to update the database with the provided password 
*       from the user's end
* 
* ADDITIONAL
* The SetNewPasswordSerializer handles checking whether the provided token and user id are valid and will also handle saving the new password
* to the database. This view is the interaface by which the serializer can interact with the provided information
"""
class SetNewPasswordWithCodeView(generics.GenericAPIView):
    serializer_class = SetNewPasswordWithCodeSerializer
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({"success" : True, "message": "Password reset successful"}, status=status.HTTP_200_OK)