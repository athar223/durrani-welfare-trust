"""Core models - Custom User with role-based access."""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with role support."""
    ROLE_CHOICES = [
        ('admin', 'Main Administrator'),
        ('limited_admin', 'Limited Administrator'),
        ('staff', 'Staff Member'),
        ('volunteer', 'Volunteer'),
    ]

    # Modules that limited admins can access
    MODULE_CHOICES = [
        ('students', 'Students'),
        ('volunteers', 'Volunteers'),
        ('daily_expenses', 'Daily Expenses'),
        ('staff', 'Staff'),
        ('drivers', 'Drivers'),
        ('ambulance', 'Ambulance'),
        ('projects', 'Projects'),
        ('accounts', 'Accounts'),
        ('salaries', 'Salaries'),
        ('reports', 'Reports'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')
    phone = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    # For limited admin: comma-separated list of allowed modules
    allowed_modules = models.CharField(
        max_length=500, blank=True,
        help_text='Comma-separated module names for limited admin (e.g. students,volunteers,daily_expenses)'
    )

    @property
    def is_admin_user(self):
        return self.role in ('admin', 'limited_admin') or self.is_superuser

    @property
    def is_main_admin(self):
        return self.role == 'admin' or self.is_superuser

    @property
    def is_limited_admin(self):
        return self.role == 'limited_admin'

    def has_module_access(self, module_name):
        """Check if user has access to a specific module."""
        if self.is_main_admin:
            return True
        if self.is_limited_admin:
            allowed = [m.strip() for m in self.allowed_modules.split(',') if m.strip()]
            return module_name in allowed
        # Staff and volunteers get read access to their relevant modules
        return True

    def can_delete(self):
        """Only main admins can delete records."""
        return self.is_main_admin

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
