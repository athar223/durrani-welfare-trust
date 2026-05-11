"""Admin configuration for the Volunteers app."""
from django.contrib import admin
from .models import Volunteer, VolunteerAttendance


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'role', 'contact_number', 'status', 'joining_date', 'availability']
    list_filter = ['role', 'status', 'availability']
    search_fields = ['first_name', 'last_name', 'contact_number', 'email', 'skills']


@admin.register(VolunteerAttendance)
class VolunteerAttendanceAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'date', 'status']
    list_filter = ['status', 'date']
    search_fields = ['volunteer__first_name', 'volunteer__last_name']
