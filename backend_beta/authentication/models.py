from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import CustomUserManager

# ***** AUTH USER MODELS ***** 
"""
* CustomUser -> A model to represent the authenticated user. This will overwrite the typical auth user to use email as the primary identifier
* 
* FIELDS
*   email (Email Field) -> The email of the user
*   is_paying_user (Boolean Field) -> Denotes whether the user is a paying customer and has access to the paid content
* 
* ADDITIONAL
* The AbstractUser is a full user model that comes with all of the default fields and methods of Django's built in user model
* It's suitable for when you want to customize the user model while retaining a lot of the default functionality
"""
class CustomUser(AbstractUser):
    # Specify the fields of the authentication user
    # This sets the username to be none, so that it is not used as the primary identifier for a user
    username = None 
    email = models.EmailField(unique=True)
    is_paying_user = models.BooleanField(default=False)

    # This specifies that the email field should be the primary identifier (it should replace username which is default)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    # This field specifies that the CustomUserManager should be used as this model's default manager
    # This must be an instance of the manager class, NOT the class itself
    objects = CustomUserManager()

    # Print out an email 
    def __str__(self):
        return self.email