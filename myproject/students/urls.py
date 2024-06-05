from django.urls import path
from . import views

urlpatterns = [
    path("students/", views.student_list),
    path("students/<int:studentNo>/", views.student_detail), 
    path("attendances/week/<int:week>/", views.attendance_by_week),
    path("attendances/", views.create_attendance),
    path("attendances/<int:pk>/", views.update_attendance),
]
