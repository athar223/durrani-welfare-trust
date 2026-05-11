"""Models for the Drivers app."""
from django.db import models


class DriverProfile(models.Model):
    """Profile for a driver working with the trust."""

    SHIFT_CHOICES = [
        ('morning', 'Morning'),
        ('evening', 'Evening'),
        ('night', 'Night'),
        ('rotating', 'Rotating'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    license_number = models.CharField(max_length=50, unique=True)
    license_expiry = models.DateField(null=True, blank=True)
    vehicle_assigned = models.CharField(max_length=100, blank=True, help_text='Vehicle number or name')
    shift = models.CharField(max_length=10, choices=SHIFT_CHOICES, default='morning')
    joining_date = models.DateField()
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    profile_image = models.ImageField(upload_to='drivers/', blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['first_name', 'last_name']

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    def __str__(self):
        return self.full_name


class DriverAttendance(models.Model):
    """Daily attendance record for a driver."""

    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('leave', 'Leave'),
    ]

    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['driver', 'date']
        ordering = ['-date']

    def __str__(self):
        return f'{self.driver} - {self.date} - {self.get_status_display()}'


class DriverTripLog(models.Model):
    """Log of trips made by a driver."""

    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='trip_logs')
    date = models.DateField()
    vehicle_used = models.CharField(max_length=100)
    patient_name = models.CharField(max_length=200, blank=True)
    pickup_location = models.CharField(max_length=300)
    drop_location = models.CharField(max_length=300)
    purpose = models.CharField(max_length=300, blank=True)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.driver} - {self.date} - {self.pickup_location} to {self.drop_location}'


class DriverFuelLog(models.Model):
    """Log of fuel purchases by a driver."""

    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='fuel_logs')
    date = models.DateField()
    vehicle_used = models.CharField(max_length=100)
    fuel_liters = models.DecimalField(max_digits=8, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    odometer_reading = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.driver} - {self.date} - {self.fuel_liters}L'


class DriverMaintenanceLog(models.Model):
    """Log of vehicle maintenance performed by or for a driver."""

    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='maintenance_logs')
    date = models.DateField()
    vehicle_used = models.CharField(max_length=100)
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    mechanic_name = models.CharField(max_length=200, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.driver} - {self.date} - {self.description[:50]}'
