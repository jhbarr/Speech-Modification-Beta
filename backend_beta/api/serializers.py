from rest_framework import serializers

from .models import FreeLesson, PaidLesson, FreeTask, PaidTask, UserCompletedFreeLessons, UserCompletedFreeTasks
from authentication.models import CustomUser

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
    class Meta:
        model = FreeLesson
        fields = ['id', 'lesson_title']

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
    class Meta:
        model = PaidLesson
        fields = ['id', 'lesson_title']




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
    class Meta:
        model = FreeTask
        fields = ['id', 'task_title', 'content', 'lesson']

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
    class Meta:
        model = PaidTask
        fields = ['id', 'task_title', 'content', 'lesson']




# ***** COMPLETED TASK AND LESSON SERIALIZERS *****
"""
* CompletedTaskSerializer -> This is a serializer used to serialize and deserialize the UserCompletedFreeTasks models
* 
* FIELDS
*   id (integer) -> The primary key for the task
*   user (Foreign Key Reference) -> A reference to a unique user model instance. This is the user that is completing the lesson
*   task (Foreign Key Reference) -> a reference to a unique free task model instance. 
* 
* METHODS
*   validate() -> This takes in an email and task_title fields and checks if they both belong to existent user and task respectively
*   create() -> This is called on serializer.save(). It saves a new UserCompletedFreeTask instance to the database
*       but it also saves a new UserCompletedFreeLesson if the user has finished all of the tasks in a given lesson
* 
* ADDITIONAL
* This function should specify that a new UserCompletedFreeLessons model instance should be created if all of the tasks within that lesson 
* are now complete after this task
"""
class CompletedFreeTaskSerializer(serializers.Serializer):
    # These are the fields of the serializer, typically under the meta class
    # They are validated automatically and put into the attrs dictionary which is passed to validate()
    email = serializers.CharField()
    task_title = serializers.CharField()

    def validate(self, attrs):
        try:
            # Validate that the user and task exist based on the email and task_title respectively
            user = CustomUser.objects.get(email=attrs['email'])
            task = FreeTask.objects.get(task_title=attrs['task_title'])

            attrs['user'] = user
            attrs['task'] = task
            return attrs

        except (CustomUser.DoesNotExist, FreeTask.DoesNotExist):
            raise serializers.ValidationError("Invalid email or task title")
        
    def create(self, validated_data):
        user = validated_data['user']
        task = validated_data['task']

        # Create a new table entry with the specific user and task
        UserCompletedFreeTasks.objects.create(user=user, task=task)

        # Get the lesson associated with the task
        lesson = task.lesson

        # We can do this becuase the related name to the lesson foreign key reference in the FreeTask model is 'task'
        # Therefore, from a FreeLesson instance, you can access all of the related FreeTask instances with .task
        all_task_ids = lesson.task.values_list('id', flat=True)

        # Go through the task ForeignKey on UserCompletedFreeTasks, then through the lesson ForeignKey on FreeTask
        # Give me the UserCompletedFreeTasks for this user where the task is from this specific lesson.
        # that is what the double underscore is saying
        user_completed_task_ids = UserCompletedFreeTasks.objects.filter(
            user=user, 
            task__lesson=lesson
        ).values_list('task_id', flat=True) # This gives the list of task id's without returning the full objects

        # This just sees if all of the task ids belonging to the specific lesson are in the Completed Task table
        # and if so, that means that the lesson itself should be marked as completed
        if set(all_task_ids).issubset(set(user_completed_task_ids)):
            # Mark the lesson as complete if not already
            UserCompletedFreeLessons.objects.get_or_create(user=user, lesson=lesson)

        return {
            'email': user.email,
            'task_title': task.task_title
        }
    

"""
* CompletedFreeLessonSerializer -> This is used to serialize and deserialize the UserCompletedFreeLesson object
* 
* FIELDS 
*   user -> The CustomUser who has completed the lesson
*   lesson -> The FreeLesson that has been completed
"""
class CompletedFreeLessonSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    lesson_title = serializers.CharField(source='lesson.lesson_title', read_only=True)

    class Meta:
        model = UserCompletedFreeLessons
        fields = ['id', 'user_email', 'lesson_title']
