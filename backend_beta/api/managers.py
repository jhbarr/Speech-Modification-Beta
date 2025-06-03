from django.contrib.auth.base_user import BaseUserManager

"""
** NOTES **
A manager is the interface through which database query operations are provided to Django models. 
One thing to note is that in Model.obejcts.(function) the objects field specifies the manager. So the objects is just the default manager
"""

"""
* CustomUserManager -> This gives specific instructions on how to create a user and a super user. 
*   Therefore, it overrides these basic functions. 
* 
* FIELDS
*   create_user() -> This function gives a model instruction on creating a custom user model instance
*   create_super_user() -> Sets the necessary flag for a super user and creates a super user instance
"""
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a custom user instance with the provided email and password fields
        """
        # If the email does not exist, throw an error alerting that the email is necessary
        if not email:
            ValueError("The email must be set")
        
        email = self.normalize_email(email) # This method assures the consistency of the email format (casing)
        user = self.model(email=email, **extra_fields) 
        user.set_password(password) # This function hashes the email before saving the user instance 

        # Save the user to the database and return the instance. 
        user.save()
        return user
    
    def create_super_user(self, email, password, **extra_fields):
        """
        Create and save a superuser with the given email and password
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, password, **extra_fields)