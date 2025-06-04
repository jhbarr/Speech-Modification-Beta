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





