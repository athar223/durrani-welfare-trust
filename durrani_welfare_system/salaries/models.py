"""Models for the Salaries app."""
from django.db import models


class SalaryRecord(models.Model):
    """Monthly salary record for a staff member or driver."""

    EMPLOYEE_TYPE_CHOICES = [
        ('staff', 'Staff'),
        ('driver', 'Driver'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
    ]

    employee_type = models.CharField(max_length=10, choices=EMPLOYEE_TYPE_CHOICES)
    employee_name = models.CharField(max_length=200)
    employee_id = models.IntegerField(help_text='ID of StaffMember or DriverProfile')
    month = models.DateField(help_text='First day of the month for this salary')
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    overtime_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    overtime_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=15, choices=PAYMENT_METHOD_CHOICES, default='cash')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def overtime_amount(self):
        return self.overtime_hours * self.overtime_rate

    @property
    def net_salary(self):
        return self.base_salary + self.allowances + self.bonus + (self.overtime_hours * self.overtime_rate) - self.deductions

    class Meta:
        ordering = ['-month', 'employee_name']
        unique_together = ['employee_type', 'employee_id', 'month']

    def __str__(self):
        return f"{self.employee_name} - {self.month.strftime('%b %Y')} - Rs. {self.net_salary}"
