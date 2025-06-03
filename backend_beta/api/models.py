from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import CustomUserManager

# ***** LESSON MODELS *****
"""
* FreeLesson -> A model to describe the table representing the free lessons that have been scraped from the
*    Speech Modification Website
* 
* FIELDS
*   lessonTitle (Char Field, unique not null) -> The title of the lesson
"""
# class FreeLesson(models.Model):
#     pass

"""
* PaidLesson -> A model to describe the table representing the paid lessons that have been scraped from the 
*    Speech Modification website
*
* FIELDS 
*   lessonTitle (Char Field, unique not null) -> The title of the lesson
"""
# class PaidLesson(models.Model):
#     pass


# ***** TASK MODELS *****
"""
* FreeTask -> A model representing the free tasks that have been scraped from the website
*
* FIELDS 
*   taskTitle (Char Field, unique not null) -> The title of the task
*   lesson (Foreign Key Reference) -> a reference to an existing free lesson object. This will represent what lesson the task is a part of 
*   content (JSON) -> The content of the task itself
"""
# class FreeTask(models.Model):
#     pass

"""
* PaidTask -> A model representing all of the paid tasks from the website
* 
* FIELDS
*   taskTitle (Char Field, unique not null) -> The title of the task
*   lesson (Foreign Key Reference) -> a reference to an existing paid lesson object. This will represent what lesson the task is a part of 
*   content (JSON) -> The content of the task itself
"""
# class PaidTask(models.Model):
#     pass


# ***** PROGRESS TRACKING MODELS *****
"""
* UserCompletedTasks -> This model will be used to keep track of what users have completed what tasks. To be reflected on the frontend
* 
* FIELDS
*   user (Foreign Key Reference) -> This will reference a specific user 
*   task (Foreign Key Reference) -> This will reference a specific task object
*
* ADDITIONAL
* The user and task fields much be unique pairings for each entry in this table. This is because a user cannot complete a task twice
"""
# class UserCompletedTasks(models.Model):
#     pass

"""
* UserCompletedLessons -> This table will keep track of the different lessons that a user has completed
*   A completed lesson is when a user has completed all of the tasks within a lesson
* 
* FIELDS
*   user (Foreign Key Reference) -> This will reference a specific user 
*   lesson (Foreign Key Reference) -> This will reference a specific lesson object
*
* ADDITIONAL
* The user and lesson fields much be unique pairings for each entry in this table. This is because a user cannot complete a lesson twice
"""
# class UserCompletedLessons(models.Model):
#     pass


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






