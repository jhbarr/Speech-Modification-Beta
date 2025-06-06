from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.encoding import smart_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .models import CustomUser, PasswordResetVerificationCode

"""
*** NOTES ***
The Meta class defines aspects like which fields to include or exclude in the serialized output, the model to base the serializer on, 
and other metadata relevant to the serialization process
"""


# ***** AUTH USER SERIALIZERS *****
"""
* CustomUserSerializer -> This serializer will be used to serialize / deserialize and save a single CustomUser instance
* 
* MODEL
*   CustomUser -> The CustomUser model that will be user to serialize
* 
* FIELDS
*   email (Email Field) -> The email of the user to be serialized
*   password (Char Field) -> The password of the user to be serialized
*   is_paying_user (Boolean field) -> This indicates whether the user should have access to the paid content on the app
* 
* ADDITIONAL
* This serializer will validate whether all of the fields necessary to create a new user. Then it will create an instance of that 
* User in the database
"""
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'is_paying_user']
        extra_kwargs = {'password': {'write_only' : True}} # This makes it so that the password is not accessible 
    
    # The create() function specifies that a new CustomUser instance should be created and saved to the database 
    # using the provided parameters
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user




# ***** TOKEN SERIALIZERS *****
"""
* CustomTokenObtainPairSerializer -> This is a serializer used to include information about the paying status of the user in the JWT to the frontend
*   This serializer extends the base TokenObtainPairSerializer
* 
* FIELDS
*   @class_method get_token(cls, user) -> This function will get the token for the user and insert their payment status within the JWT itself
*   validate(self, attrs) -> This function validates whether the user is a registered user in the database
"""
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_paying_user'] = user.is_paying_user
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom fields to the response
        data['is_paying_user'] = self.user.is_paying_user
        return data
    




# ***** PASSWORD RESET SERIALIZERS -- USING URLS *****
"""
* ResetPasswordRequestSerializer -> This is a serializer that checks the validity of the email that was sent to the password reset request
*   If the email exists in the database, then the serializer will return true
* 
* FIELDS 
*   validate_email() -> This validates the email by comparing it to the emails in the database
* 
* ADDITIONAL
* DRF looks for validate_<fieldname> methods within a serializer when a .is_valid() function is called. This is when you can look at specific 
* fields and really check their validity
"""
class ResetPasswordRequestSerializer(serializers.Serializer):
    # These are the fields of the serializer, typically under the meta class
    email = serializers.EmailField()

    def validate_email(self, value):
        # This checks if a user with the specified email exists within the database
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user with this email.")
        return value

"""
* SetNewPasswordSerializer -> This is a serializer used to check whether the user has submitted a new password in the requisite amount of time
*   it then resets the user's password in the actual database. 
* 
* FIELDS
*   validate() -> This validates all of the attributes
* 
* ADDITIONAL
* This is a global validation function that runs after all of the individual field validations have passed. If everything passes, 
* validated_data is populated.  
"""
class SetNewPasswordSerializer(serializers.Serializer):
    # These are the fields of the serializer, typically under the meta class
    # They are validated automatically and put into the attrs dictionary which is passed to validate()
    password = serializers.CharField(write_only=True)
    token = serializers.CharField()
    uid64 = serializers.CharField()

    def validate(self, attrs):
        try:
            # This decodes the user id of the user from the request
            uid = smart_str(urlsafe_base64_decode(attrs['uid64']))
            user = CustomUser.objects.get(id=uid)

            # This checks if the token passed to the serializer is valid
            if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
                raise serializers.ValidationError("Token is invalid or expired.")
            
            # If everything passes, then the user's new password is set in the database
            user.set_password(attrs['password'])
            user.save()
            return user

        except:
            raise serializers.ValidationError("Invalid token or user")






# ***** PASSWORD RESET VIEWS -- USING VERIFICATION CODE *****
"""
* SetNewPasswordWithCodeSerializer -> This serializer will check whether the verification code provided is valid and can be attributed
*   to the specified user
* 
* FIELDS
*   validate() -> This validates all of the attributes
"""
class SetNewPasswordWithCodeSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        try:
            # Retrieve the user object with theh specified email
            user = CustomUser.objects.get(email=attrs['email'])

            # Retrieve the most recent verification code object with the specified code
            code_entry = PasswordResetVerificationCode.objects.filter(
                user=user,
                code=attrs['code'],
                is_used=False
            ).latest('created_at')

            # Check to see if the code has expired yet
            if code_entry.is_expired():
                raise serializers.ValidationError("Verification code has expired")

            code_entry.is_used = True
            code_entry.save()

            # Set the new user's password and save that change to the database
            user.set_password(attrs['password'])
            user.save()

            return user

        except PasswordResetVerificationCode.DoesNotExist:
            raise serializers.ValidationError("Invalid code")
