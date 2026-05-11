"""Admin configuration for the Ambulance Service app."""
from django.contrib import admin
from .models import Vehicle, Driver, TripLog, FuelLog, MaintenanceLog


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['vehicle_number', 'vehicle_type', 'make_model', 'year', 'is_active']
    list_filter = ['vehicle_type', 'is_active']
    search_fields = ['vehicle_number', 'make_model']


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_number', 'license_number', 'vehicle', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'license_number']


@admin.register(TripLog)
class TripLogAdmin(admin.ModelAdmin):
    list_display = ['date', 'vehicle', 'driver', 'patient_name', 'pickup_location', 'drop_location']
    list_filter = ['date', 'vehicle']
    search_fields = ['patient_name', 'pickup_location', 'drop_location']


@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = ['date', 'vehicle', 'fuel_liters', 'cost', 'station_name']
    list_filter = ['date', 'vehicle']


@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ['date', 'vehicle', 'description', 'cost', 'mechanic_name']
    list_filter = ['date', 'vehicle']
    search_fields = ['description', 'mechanic_name']
