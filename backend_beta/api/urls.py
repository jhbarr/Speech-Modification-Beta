from django.urls import path
from api import views

urlpatterns = [
    # Routes to fetch all of the free and paid lessons in the database
    path('free-lessons/', views.QueryAllFreeLessonsView.as_view(), name='free lessons'),
    path('paid-lessons/', views.QueryAllPaidLessonsView.as_view(), name='paid lessons'),

    # Routes to fetch all of the free and paid tasks in the database
    path('all-free-tasks/', views.QueryAllFreeTasksView.as_view(), name='all free tasks'),
    path('all-paid-tasks/', views.QueryAllPaidTasksView.as_view(), name='all paid tasks'),

    # Routes to fetch all of the free and paid tasks associated with a specific lesson in the database
    path('free-tasks-by-lesson/<str:lesson_title>/', views.QueryFreeTaskByLesson.as_view(), name='free tasks by lesson'),
    path('paid-tasks-by-lesson/<str:lesson_title>/', views.QueryPaidTaskByLesson.as_view(), name='paid tasks by lesson'),

    # Routes to fetch all of the tasks and lessons completed by a specific user
    path('free-completed-tasks/<str:email>/', views.UserFreeTaskCompleteView.as_view(), name='get completed free tasks'),
    path('free-completed-lessons/<str:email>/', views.UserFreeLessonCompleteView.as_view(), name='get completed free lessons'),
]