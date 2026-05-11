"""Forms for the Drivers app."""
from django import forms
from .models import DriverProfile, DriverTripLog, DriverFuelLog, DriverMaintenanceLog


class DriverProfileForm(forms.ModelForm):
    class Meta:
        model = DriverProfile
        fields = [
            'first_name', 'last_name', 'contact_number', 'email', 'address',
            'license_number', 'license_expiry', 'vehicle_assigned', 'shift',
            'joining_date', 'base_salary', 'is_active', 'profile_image', 'notes',
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'contact_number': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'license_number': forms.TextInput(attrs={'class': 'form-control'}),
            'license_expiry': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'vehicle_assigned': forms.TextInput(attrs={'class': 'form-control'}),
            'shift': forms.Select(attrs={'class': 'form-select'}),
            'joining_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'base_salary': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'profile_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }


class DriverTripLogForm(forms.ModelForm):
    class Meta:
        model = DriverTripLog
        fields = [
            'driver', 'date', 'vehicle_used', 'patient_name',
            'pickup_location', 'drop_location', 'purpose', 'distance_km', 'notes',
        ]
        widgets = {
            'driver': forms.Select(attrs={'class': 'form-select'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'vehicle_used': forms.TextInput(attrs={'class': 'form-control'}),
            'patient_name': forms.TextInput(attrs={'class': 'form-control'}),
            'pickup_location': forms.TextInput(attrs={'class': 'form-control'}),
            'drop_location': forms.TextInput(attrs={'class': 'form-control'}),
            'purpose': forms.TextInput(attrs={'class': 'form-control'}),
            'distance_km': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }


class DriverFuelLogForm(forms.ModelForm):
    class Meta:
        model = DriverFuelLog
        fields = [
            'driver', 'date', 'vehicle_used', 'fuel_liters', 'cost', 'odometer_reading',
        ]
        widgets = {
            'driver': forms.Select(attrs={'class': 'form-select'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'vehicle_used': forms.TextInput(attrs={'class': 'form-control'}),
            'fuel_liters': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'cost': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'odometer_reading': forms.NumberInput(attrs={'class': 'form-control'}),
        }


class DriverMaintenanceLogForm(forms.ModelForm):
    class Meta:
        model = DriverMaintenanceLog
        fields = [
            'driver', 'date', 'vehicle_used', 'description', 'cost',
            'mechanic_name', 'next_maintenance_date',
        ]
        widgets = {
            'driver': forms.Select(attrs={'class': 'form-select'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'vehicle_used': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'cost': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'mechanic_name': forms.TextInput(attrs={'class': 'form-control'}),
            'next_maintenance_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
        }
