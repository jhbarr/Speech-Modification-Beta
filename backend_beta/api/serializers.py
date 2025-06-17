from rest_framework import serializers
from django.db.utils import IntegrityError

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
        fields = ['id', 'lesson_title', 'num_tasks']

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
        fields = ['id', 'lesson_title', 'num_tasks']




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
* MarkCompletedTaskSerializer -> This is a serializer used to serialize and deserialize the UserCompletedFreeTasks models
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
class MarkCompletedFreeTaskSerializer(serializers.Serializer):
    # These are the fields of the serializer, typically under the meta class
    # They are validated automatically and put into the attrs dictionary which is passed to validate()
    email = serializers.CharField()
    task_ids = serializers.ListField(child=serializers.IntegerField())

    def validate(self, attrs):
        try:
            # Validate that the user and task exist based on the email and task_title respectively
            user = CustomUser.objects.get(email=attrs['email'])
            tasks = FreeTask.objects.filter(id__in=attrs['task_ids'])

            attrs['user'] = user
            attrs['tasks'] = tasks
            return attrs

        except (CustomUser.DoesNotExist, FreeTask.DoesNotExist):
            raise serializers.ValidationError("Invalid email or task title")
        

    def create(self, validated_data):
        user = validated_data['user']
        tasks = validated_data['tasks']

        newly_completed_tasks = []
        completed_lessons = set()
        newly_completed_lessons = []

        for task in tasks:
            # Create a new table entry with the specific user and task
            try:
                UserCompletedFreeTasks.objects.create(user=user, task=task)
                newly_completed_tasks.append(task.id)
            # User has already completed the task
            except IntegrityError:
                continue
            
            # MIGHT CAUSE ERROR
            # We have already marked this lesson as complete
            lesson = task.lesson
            if lesson.id in completed_lessons:
                continue

            # Get the number of tasks belonging to a specific lesson
            # Get all of the completed tasks beloning to the lesson and the user
            lesson_num_tasks = lesson.num_tasks
            completed_tasks = UserCompletedFreeTasks.objects.filter(user=user, task__lesson=lesson)

            # If the number of completed tasks (from the lesson) matches the number of tasks belonging to the lesson
            # That means that all of the tasks in that lesson have been completed
            if len(completed_tasks) == lesson_num_tasks:
                try:
                    UserCompletedFreeLessons.objects.create(user=user, lesson=lesson)
                    newly_completed_lessons.append(lesson.id)

                    # Add this as a completed lesson so that we know if for future tasks
                    completed_lessons.add(lesson.id)
                except IntegrityError:
                    pass

        return {
            'newly_completed_tasks': newly_completed_tasks,
            'newly_completed_lessons': newly_completed_lessons
        }
    

"""
* GetCompletedTaskSerializer -> This is used to serialize data coming in from a query regarding which tasks a user has completed
* 
* FIELDS 
*   user -> The CustomUser who has completed the task
*   lesson -> The FreeTask that has been completed
"""
class GetCompletedTaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCompletedFreeTasks
        fields = ['task_id']

"""
* CompletedFreeLessonSerializer -> This is used to serialize and deserialize the UserCompletedFreeLesson object
* 
* FIELDS 
*   user -> The CustomUser who has completed the lesson
*   lesson -> The FreeLesson that has been completed
"""
class CompletedFreeLessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCompletedFreeLessons
        fields = ['lesson_id']
