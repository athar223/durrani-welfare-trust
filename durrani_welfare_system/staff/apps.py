"""App configuration for the Staff & Volunteers app."""
from django.apps import AppConfig


class StaffConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'durrani_welfare_system.staff'
    verbose_name = 'Staff & Volunteers'
