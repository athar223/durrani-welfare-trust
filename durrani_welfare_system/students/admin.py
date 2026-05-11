"""Admin configuration for the Students app."""
from django.contrib import admin
from .models import Student, StudentAttendance


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'age', 'education_level', 'guardian_name', 'is_active']
    list_filter = ['education_level', 'is_active']
    search_fields = ['first_name', 'last_name', 'guardian_name']


@admin.register(StudentAttendance)
class StudentAttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'date', 'status']
    list_filter = ['status', 'date']
    search_fields = ['student__first_name', 'student__last_name']
