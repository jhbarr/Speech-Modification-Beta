from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404

from .permissions import IsPayingUser



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
    pass

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
    pass






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
    pass

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
    pass

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
    pass

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
    pass





