"""Student and attendance models."""
from django.db import models


class Student(models.Model):
    """Student enrolled in the welfare trust programs."""

    EDUCATION_LEVEL_CHOICES = [
        ('nursery', 'Nursery'),
        ('primary', 'Primary'),
        ('middle', 'Middle'),
        ('secondary', 'Secondary'),
        ('higher_secondary', 'Higher Secondary'),
        ('graduation', 'Graduation'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    guardian_name = models.CharField(max_length=200)
    guardian_relation = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    admission_date = models.DateField()
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES)
    profile_image = models.ImageField(upload_to='students/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return self.full_name


class StudentAttendance(models.Model):
    """Daily attendance record for a student."""

    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
    ]

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['student', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.full_name} - {self.date} ({self.get_status_display()})"
