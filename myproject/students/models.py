from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)  # 학생 이름
    studentNo = models.CharField(max_length=20, unique=True)  # 학번

    def __str__(self):
        return f"{self.name} ({self.studentNo})"

class Attendance(models.Model):
    WEEK_CHOICES = [(i, f"{i}주차") for i in range(1, 17)]  # 1주차부터 16주차까지 선택 가능

    studentNo = models.ForeignKey(Student, to_field='studentNo', on_delete=models.CASCADE, related_name='attendances')  # 학번
    week = models.IntegerField(choices=WEEK_CHOICES)  # 주차
    attendance_status = models.IntegerField(choices=[
        (0, "출석"),
        (1, "결석"),
        (2, "지각"),
    ])  # 출석 상태

    class Meta:
        unique_together = ('studentNo', 'week')  # 같은 학생의 같은 주차 출석 상태 중복 방지

    def __str__(self):
        return f"{self.studentNo.studentNo} - {self.week}주차: {self.get_attendance_status_display()}"
