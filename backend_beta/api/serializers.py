from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.encoding import force_bytes, smart_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from .models import CustomUser

"""
*** NOTES ***
The Meta class defines aspects like which fields to include or exclude in the serialized output, the model to base the serializer on, 
and other metadata relevant to the serialization process
"""


# ***** LESSON SERIALIZERS *****
"""
* FreeLessonSerializer -> This is a serializer used to serialize and deserialize FreeLesson models
*
* MODEL
*   FreeLesson -> The FreeLesson model that will be used to serialize
* 
* FIELDS
*   id (integer) -> The primary key for the lesson
*   lessonTitle (Email Field) -> The title of the lesson that has been passed as input
"""
class FreeLessonSerializer(serializers.ModelSerializer):
    pass

"""
* PaidLessonSerializer -> This serializer is used to serialize and deserialize a PaidLesson model
* MODEL
*   PaidLesson -> The PaidLesson model that will be used to serialize
* 
* FIELDS
*   id (integer) -> The primary key for the lesson
*   lessonTitle (Char Field) -> The title of the lesson that has been passed as input
"""
class PaidLessonSerializer(serializers.ModelSerializer):
    pass





# ***** TASK SERIALIZERS *****
"""
* FreeTaskSerializer -> The serializer used to serialize and deserialize the FreeTask model
* MODEL
*   FreeTask -> The FreeTask model that will be used to serialize
* 
* FIELDS
*   id (integer) -> The primary key for the task
*   taskTitle (Char field) -> The name of the task that is being serialized
*   content (JSON) -> The content of the task in JSON format
*   lesson (Foreign Key Reference) -> The reference to the lesson to which the task instance belongs
"""
class FreeTaskSerializer(serializers.ModelSerializer):
    pass

"""
* PaidTaskSerializer -> The serializer used to serialize and deserialize the PaidTask model
* MODEL
*   PaidTask -> The PaidTask model that will be used to serialize
* 
* FIELDS
*   id (integer) -> The primary key for the task
*   taskTitle (Char field) -> The name of the task that is being serialized
*   content (JSON) -> The content of the task in JSON format
*   lesson (Foreign Key Reference) -> The reference to the lesson to which the task instance belongs
"""
class PaidTaskSerializer(serializers.ModelSerializer):
    pass
