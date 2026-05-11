from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'durrani_welfare_system.api'
    label = 'api'
    verbose_name = 'REST API'
