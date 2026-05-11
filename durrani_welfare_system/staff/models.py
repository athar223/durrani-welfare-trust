"""Staff and attendance models."""
from django.db import models


class StaffMember(models.Model):
    """Staff member of the welfare trust."""

    ROLE_CHOICES = [
        ('teacher', 'Teacher'),
        ('admin_staff', 'Admin Staff'),
        ('coordinator', 'Coordinator'),
        ('accountant', 'Accountant'),
        ('guard', 'Security Guard'),
        ('other', 'Other'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    joining_date = models.DateField()
    supervisor = models.CharField(max_length=200, blank=True, help_text='Name of supervisor')
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text='Monthly base salary')
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='staff/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return self.full_name


class StaffAttendance(models.Model):
    """Daily attendance record for a staff member."""

    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
    ]

    staff_member = models.ForeignKey(
        StaffMember, on_delete=models.CASCADE, related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['staff_member', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.staff_member.full_name} - {self.date} ({self.get_status_display()})"
