from django.urls import path
from . import views

urlpatterns = [
    path('students/', views.student_list),
    path('students/<int:pk>/', views.student_detail),
    path('students/studentNo/<str:studentNo>/', views.student_detail),  # 학번으로 학생 정보 접근
    path('attendances/week/<int:week>/', views.attendance_by_week), 
    path('attendances/', views.create_attendance),
    path('attendances/<int:pk>/', views.update_attendance),
]
