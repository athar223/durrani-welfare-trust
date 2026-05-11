"""Forms for the Volunteers app."""
from django import forms
from .models import Volunteer, VolunteerAttendance


class VolunteerForm(forms.ModelForm):
    class Meta:
        model = Volunteer
        fields = [
            'first_name', 'last_name', 'contact_number', 'email',
            'address', 'skills', 'role', 'status', 'joining_date',
            'assigned_tasks', 'availability', 'profile_image', 'notes',
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'contact_number': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'skills': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'e.g. First Aid, Teaching, Driving'}),
            'role': forms.Select(attrs={'class': 'form-select'}),
            'status': forms.Select(attrs={'class': 'form-select'}),
            'joining_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'assigned_tasks': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'availability': forms.Select(attrs={'class': 'form-select'}),
            'profile_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }


class VolunteerAttendanceForm(forms.ModelForm):
    class Meta:
        model = VolunteerAttendance
        fields = ['volunteer', 'date', 'status', 'remarks']
        widgets = {
            'volunteer': forms.Select(attrs={'class': 'form-select'}),
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'status': forms.Select(attrs={'class': 'form-select'}),
            'remarks': forms.TextInput(attrs={'class': 'form-control'}),
        }
