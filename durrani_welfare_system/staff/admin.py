"""Admin configuration for the Staff & Volunteers app."""
from django.contrib import admin
from .models import StaffMember, StaffAttendance


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'role', 'contact_number', 'joining_date', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['first_name', 'last_name', 'contact_number', 'email']


@admin.register(StaffAttendance)
class StaffAttendanceAdmin(admin.ModelAdmin):
    list_display = ['staff_member', 'date', 'status']
    list_filter = ['status', 'date']
    search_fields = ['staff_member__first_name', 'staff_member__last_name']
