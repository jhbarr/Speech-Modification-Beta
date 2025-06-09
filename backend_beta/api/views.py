from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404

from .permissions import IsPayingUser
from .models import FreeLesson, PaidLesson, FreeTask, PaidTask
from .serializers import FreeLessonSerializer, PaidLessonSerializer, FreeTaskSerializer, PaidTaskSerializer



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
    permission_classes = [AllowAny] # Change later

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
    permission_classes = [AllowAny]






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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def get_queryset(self):
        lesson_title = self.kwargs.get('lesson_title')
        lesson = get_object_or_404(FreeLesson, lesson_title__iexact=lesson_title)
        return FreeTask.objects.filter(lesson=lesson)

"""
* QueryPaidTaskByLesson -> This view is used to query paid tasks that belong to a specific lesson
* 
* FIELDS 
*   queryset -> This gets all of the user instances from the PaidTask table in the database
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
    permission_classes = [AllowAny]

    def get_queryset(self):
        lesson_title = self.kwargs.get('lesson_title')
        lesson = get_object_or_404(PaidLesson, lesson_title__iexact=lesson_title)
        return PaidTask.objects.filter(lesson=lesson)





