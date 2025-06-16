from django.db import models

from authentication.models import CustomUser

# ***** LESSON MODELS *****
"""
* FreeLesson -> A model to describe the table representing the free lessons that have been scraped from the
*    Speech Modification Website
* 
* FIELDS
*   lessonTitle (Char Field, unique not null) -> The title of the lesson
"""
class FreeLesson(models.Model):
    lesson_title = models.CharField(max_length=255, unique=True)
    num_tasks = models.IntegerField(default=0)

    def __str__(self):
        return self.lesson_title

"""
* PaidLesson -> A model to describe the table representing the paid lessons that have been scraped from the 
*    Speech Modification website
*
* FIELDS 
*   lessonTitle (Char Field, unique not null) -> The title of the lesson
"""
class PaidLesson(models.Model):
    lesson_title = models.CharField(max_length=255, unique=True)
    num_tasks = models.IntegerField(default=0)

    def __str__(self):
        return self.lesson_title


# ***** TASK MODELS *****
"""
* FreeTask -> A model representing the free tasks that have been scraped from the website
*
* FIELDS 
*   taskTitle (Char Field, unique not null) -> The title of the task
*   lesson (Foreign Key Reference) -> a reference to an existing free lesson object. This will represent what lesson the task is a part of 
*   content (JSON) -> The content of the task itself
"""
class FreeTask(models.Model):
    task_title = models.CharField(unique=True)
    content = models.JSONField()
    lesson = models.ForeignKey(FreeLesson, on_delete=models.CASCADE, related_name='task')

    def __str__(self):
        return self.task_title

"""
* PaidTask -> A model representing all of the paid tasks from the website
* 
* FIELDS
*   taskTitle (Char Field, unique not null) -> The title of the task
*   lesson (Foreign Key Reference) -> a reference to an existing paid lesson object. This will represent what lesson the task is a part of 
*   content (JSON) -> The content of the task itself
"""
class PaidTask(models.Model):
    task_title = models.CharField(unique=True)
    content = models.JSONField()
    lesson = models.ForeignKey(PaidLesson, on_delete=models.CASCADE, related_name='task')

    def __str__(self):
        return self.task_title


# ***** PROGRESS TRACKING MODELS *****
"""
* UserCompletedFreeTasks -> This model will be used to keep track of what users have completed what tasks. To be reflected on the frontend
* 
* FIELDS
*   user (Foreign Key Reference) -> This will reference a specific user 
*   task (Foreign Key Reference) -> This will reference a specific task object
*
* ADDITIONAL
* The user and task fields much be unique pairings for each entry in this table. This is because a user cannot complete a task twice
"""
class UserCompletedFreeTasks(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    task = models.ForeignKey(FreeTask, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'task'], name='unique_task'),
        ]

    def __str__(self):
        return self.user, self.task

"""
* UserCompletedFreeLessons -> This table will keep track of the different lessons that a user has completed
*   A completed lesson is when a user has completed all of the tasks within a lesson
* 
* FIELDS
*   user (Foreign Key Reference) -> This will reference a specific user 
*   lesson (Foreign Key Reference) -> This will reference a specific lesson object
*
* ADDITIONAL
* The user and lesson fields much be unique pairings for each entry in this table. This is because a user cannot complete a lesson twice
"""
class UserCompletedFreeLessons(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    lesson = models.ForeignKey(FreeLesson, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'lesson'], name='unique_lesson'),
        ]

    def __str__(self):
        return self.user, self.lesson


