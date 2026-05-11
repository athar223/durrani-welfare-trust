"""Models for the Ambulance Service app."""
from django.db import models


class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('ambulance', 'Ambulance'),
        ('van', 'Van'),
        ('car', 'Car'),
    ]

    vehicle_number = models.CharField(max_length=50, unique=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES, default='ambulance')
    make_model = models.CharField(max_length=100, verbose_name='Make / Model')
    year = models.IntegerField()
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['vehicle_number']

    def __str__(self):
        return self.vehicle_number


class Driver(models.Model):
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    license_number = models.CharField(max_length=50)
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='drivers'
    )
    is_active = models.BooleanField(default=True)
    joined_date = models.DateField()

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class TripLog(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='trips')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='trips')
    date = models.DateField()
    patient_name = models.CharField(max_length=100)
    patient_contact = models.CharField(max_length=20, blank=True)
    pickup_location = models.CharField(max_length=200)
    drop_location = models.CharField(max_length=200)
    purpose = models.CharField(max_length=200, blank=True)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.patient_name} - {self.date}"


class FuelLog(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_logs')
    date = models.DateField()
    fuel_liters = models.DecimalField(max_digits=8, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    odometer_reading = models.IntegerField(null=True, blank=True)
    station_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.vehicle} - {self.date} - {self.fuel_liters}L"


class MaintenanceLog(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_logs')
    date = models.DateField()
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    mechanic_name = models.CharField(max_length=100, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.vehicle} - {self.date} - {self.description[:40]}"
