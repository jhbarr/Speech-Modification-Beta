from rest_framework import serializers

from .models import CustomUser

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
* get_token
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
