"""Admin configuration for the Drivers app."""
from django.contrib import admin
from .models import DriverProfile, DriverAttendance, DriverTripLog, DriverFuelLog, DriverMaintenanceLog


@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'license_number', 'vehicle_assigned', 'shift', 'is_active']
    list_filter = ['shift', 'is_active']
    search_fields = ['first_name', 'last_name', 'license_number', 'contact_number']


@admin.register(DriverAttendance)
class DriverAttendanceAdmin(admin.ModelAdmin):
    list_display = ['driver', 'date', 'status']
    list_filter = ['status', 'date']
    search_fields = ['driver__first_name', 'driver__last_name']


@admin.register(DriverTripLog)
class DriverTripLogAdmin(admin.ModelAdmin):
    list_display = ['driver', 'date', 'vehicle_used', 'pickup_location', 'drop_location']
    list_filter = ['date']
    search_fields = ['driver__first_name', 'driver__last_name', 'patient_name']


@admin.register(DriverFuelLog)
class DriverFuelLogAdmin(admin.ModelAdmin):
    list_display = ['driver', 'date', 'vehicle_used', 'fuel_liters', 'cost']
    list_filter = ['date']
    search_fields = ['driver__first_name', 'driver__last_name']


@admin.register(DriverMaintenanceLog)
class DriverMaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ['driver', 'date', 'vehicle_used', 'cost', 'mechanic_name']
    list_filter = ['date']
    search_fields = ['driver__first_name', 'driver__last_name', 'description']
