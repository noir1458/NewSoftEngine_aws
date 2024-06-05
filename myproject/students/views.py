from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Student, Attendance
from .serializers import StudentSerializer, AttendanceSerializer

@api_view(['GET', 'POST'])
def student_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = StudentSerializer(data=data)
        if serializer.is_valid():
            student = serializer.save()
            # 학생이 생성된 후, 1주차부터 16주차까지의 출결 상태를 생성합니다.
            for week in range(1, 17):
                Attendance.objects.create(
                    studentNo=student,
                    week=week,
                    attendance_status=0  # 기본 출석 상태 설정 (출석)
                )
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, pk=None, studentNo=None):
    if pk:
        student = get_object_or_404(Student, pk=pk)
    else:
        student = get_object_or_404(Student, studentNo=studentNo)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return JsonResponse(serializer.data)
    
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = StudentSerializer(student, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        student.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def attendance_by_week(request, week):
    attendances = Attendance.objects.filter(week=week).select_related('studentNo')
    serializer = AttendanceSerializer(attendances, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def create_attendance(request):
    data = JSONParser().parse(request)
    serializer = AttendanceSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_attendance(request, pk):
    attendance = get_object_or_404(Attendance, pk=pk)
    data = JSONParser().parse(request)
    serializer = AttendanceSerializer(attendance, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
