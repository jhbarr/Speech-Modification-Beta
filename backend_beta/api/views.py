from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .permissions import IsPayingUser
from .models import FreeLesson, PaidLesson, FreeTask, PaidTask, UserCompletedFreeTasks, UserCompletedFreeLessons
from .serializers import FreeLessonSerializer, PaidLessonSerializer, FreeTaskSerializer, PaidTaskSerializer, MarkCompletedFreeTaskSerializer, GetCompletedTaskSerializer, CompletedFreeLessonSerializer

from authentication.models import CustomUser


# ***** LESSON VIEWS *****
"""
* QueryAllFreeLessonsView -> This is a view that is used to query all of the free lessons in the database
* 
* FIELDS
*   queryset -> This gets all of the user instances from the FreeLesson table in the database
*   serializer_class -> This specifies that the FreeLessonSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
* 
* ADDITIONAL
* Since this is a ListAPIView, that means that the route allows GET requests in order to retrieve objects from the database
"""
class QueryAllFreeLessonsView(generics.ListAPIView):
    queryset = FreeLesson.objects.all()
    serializer_class = FreeLessonSerializer
    permission_classes = [IsAuthenticated]

"""
* QueryAllPaidLessonsView -> This is a view that is used to query all of the paid lessons in the database
* 
* FIELDS
*   queryset -> This gets all of the user instances from the PaidLesson table in the database
*   serializer_class -> This specifies that the PaidLessonSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
* 
* ADDITIONAL
* Since this is a ListAPIView, that means that the route allows GET requests in order to retrieve objects from the database
"""
class QueryAllPaidLessonsView(generics.ListAPIView):
    queryset = PaidLesson.objects.all()
    serializer_class = PaidLessonSerializer
    permission_classes = [IsAuthenticated, IsPayingUser]



# ***** TASK VIEWS *****
"""
* QueryAllFreeTasksView -> This is a aview that is used to query all of the free tasks from the database
* 
* FIELDS
*   queryset -> This gets all of the user instances from the FreeTask table in the database
*   serializer_class -> This specifies that the FreeTaskSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
* 
* ADDITIONAL
* Since this is a ListAPIView, that means that the route allows GET requests in order to retrieve objects from the database 
"""
class QueryAllFreeTasksView(generics.ListAPIView):
    queryset = FreeTask.objects.all()
    serializer_class = FreeTaskSerializer
    permission_classes = [IsAuthenticated]

"""
* QueryAllPaidTasksView -> This is a aview that is used to query all of the paid tasks from the database
* 
* FIELDS
*   queryset -> This gets all of the user instances from the PaidTask table in the database
*   serializer_class -> This specifies that the PaidTaskSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
* 
* ADDITIONAL
* Since this is a ListAPIView, that means that the route allows GET requests in order to retrieve objects from the database 
"""
class QueryAllPaidTasksView(generics.ListAPIView):
    queryset = PaidTask.objects.all()
    serializer_class = PaidTaskSerializer
    permission_classes = [IsAuthenticated, IsPayingUser]

"""
* QueryFreeTaskByLesson -> This view is used to query free tasks that belong to a specific lesson
* 
* FIELDS 
*   queryset -> This gets all of the user instances from the FreeTask table in the database
*   serializer_class -> This specifies that the FreeTaskSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
*   get_queryset -> Since we don't want to retrieve all elements from the table, we need to specify the how to filter out the objects we do want
* 
* ADDITIONAL
* Since this is a ListAPIView, that means that the route allows GET requests in order to retrieve objects from the database 
"""
class QueryFreeTaskByLesson(generics.ListAPIView):
    serializer_class = FreeTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        lesson_title = self.kwargs.get('lesson_title')
        lesson = get_object_or_404(FreeLesson, lesson_title__iexact=lesson_title)
        return FreeTask.objects.filter(lesson=lesson)

"""
* QueryPaidTaskByLesson -> This view is used to query paid tasks that belong to a specific lesson
* 
* FIELDS 
*   serializer_class -> This specifies that the PaidTaskSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be AllowAny since any user should be able to register
*   get_queryset -> Since we don't want to retrieve all elements from the table, we need to specify the how to filter out the objects we do want
*       We want to filter based on which tasks belong to the lesson with the specified name
* 
* ADDITIONAL
* Since this is a ListAPIView, that means that the route allows GET requests in order to retrieve objects from the database 
"""
class QueryPaidTaskByLesson(generics.ListAPIView):
    serializer_class = PaidTaskSerializer
    permission_classes = [IsAuthenticated, IsPayingUser]

    def get_queryset(self):
        lesson_title = self.kwargs.get('lesson_title')
        lesson = get_object_or_404(PaidLesson, lesson_title__iexact=lesson_title)
        return PaidTask.objects.filter(lesson=lesson)



# ***** COMPLETE TASK AND LESSON VIEWS *****
"""
* PostUserCompletedTaskView -> This view will be responsible for marking a specific task as completed by a specific user.
*   Additionally, the serializer will handle creating a completed lesson entry based on if all tasks in a lesson are completed
* 
* FIELDS 
*   serializer_class -> This specifies that the CompletedFreeTaskSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be IsAuthenticated since any user should be able to register
"""
class MarkUserCompletedTaskView(generics.GenericAPIView):
    serializer_class = MarkCompletedFreeTaskSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        return Response(result, status=status.HTTP_200_OK)


"""
* GetUserFreeTaskCompleteView -> This view is used to to mark a specific task as completed by a specific user. If the user has completed all of the other tasks
*   that are part of a particular lesson, then the serializer will automatically mark that lesson as completed
* 
* FIELDS
*   serializer_class -> This specifies that the CompletedFreeTaskSerializer should be used to serialize and deserialize database object instances
*   permissions_classes -> This should be IsAuthenticated since any user should be able to register
*   get_queryset -> This will retrieve all of the tasks completed by the user with the specified email
* 
* ADDITIONAL 
* This has specific and unique post and get behavior. A user will request all of the tasks completed by a user with a specified email
* While when a user completes a task, they need to provide both the email and the name of the task that they are completing
"""
class GetUserFreeTaskCompleteView(generics.ListAPIView):
    serializer_class = GetCompletedTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        email = self.kwargs.get('email')

        user = get_object_or_404(CustomUser, email__iexact=email)
        return UserCompletedFreeTasks.objects.filter(user=user)

"""
* GetUserFreeLessonCompleteView -> This view is used to query all of the lessons that a specific user has completed. But it does not mark any lessons as completed
*   that is done by the CompletedFreeTaskSerializer
* 
* FIELDS 
*   queryset -> All of the UserCompletedFreeLessons object instances
*   serializer_class -> This will be used to serialize and deserialize a UserCompletedFreeLessons object instance
*   permission_classes -> This should be IsAuthenticated so that it can only be retrieved by a user that has logged in
"""
class GetUserFreeLessonCompleteView(generics.ListAPIView):
    serializer_class = CompletedFreeLessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        email = self.kwargs.get('email')
        user = get_object_or_404(CustomUser, email__iexact=email)
        return UserCompletedFreeLessons.objects.filter(user=user)
