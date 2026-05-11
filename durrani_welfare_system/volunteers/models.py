"""Models for the Volunteers app."""
from django.db import models


class Volunteer(models.Model):
    ROLE_CHOICES = [
        ('field_worker', 'Field Worker'),
        ('medical_volunteer', 'Medical Volunteer'),
        ('teaching_volunteer', 'Teaching Volunteer'),
        ('coordinator', 'Coordinator'),
        ('fundraiser', 'Fundraiser'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
    ]

    AVAILABILITY_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('weekends', 'Weekends'),
        ('on_call', 'On Call'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text='Comma-separated skills')
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    joining_date = models.DateField()
    assigned_tasks = models.TextField(blank=True, help_text='Current assigned tasks')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='part_time')
    profile_image = models.ImageField(upload_to='volunteers/', blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'


class VolunteerAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
    ]

    volunteer = models.ForeignKey(
        Volunteer, on_delete=models.CASCADE, related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['volunteer', 'date']
        ordering = ['-date']

    def __str__(self):
        return f'{self.volunteer.full_name} - {self.date} ({self.get_status_display()})'
