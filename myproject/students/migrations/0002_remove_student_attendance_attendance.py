# students/migrations/0003_auto_<timestamp>.py

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('students', '0002_auto_<previous_timestamp>'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='attendance',
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('week', models.IntegerField(choices=[(1, '1주차'), (2, '2주차'), (3, '3주차'), (4, '4주차'), (5, '5주차'), (6, '6주차'), (7, '7주차'), (8, '8주차'), (9, '9주차'), (10, '10주차'), (11, '11주차'), (12, '12주차'), (13, '13주차'), (14, '14주차'), (15, '15주차'), (16, '16주차')])),
                ('attendance_status', models.IntegerField(choices=[(0, '출석'), (1, '결석'), (2, '지각')])),
                # 'studentNo' 필드를 'ForeignKey'로 설정, 'to_field'에 'studentNo'를 사용
                ('studentNo', models.ForeignKey(on_delete=models.CASCADE, related_name='attendances', to='students.student', to_field='studentNo')),
            ],
            options={
                'unique_together': {('studentNo', 'week')},  # 'studentNo'와 'week' 조합의 유일성 제약 조건 설정
            },
        ),
    ]
