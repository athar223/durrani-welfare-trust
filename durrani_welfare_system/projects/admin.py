"""Admin configuration for the Community Projects app."""
from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'location', 'status', 'budget', 'expenses', 'start_date']
    list_filter = ['status', 'category']
    search_fields = ['name', 'location', 'description']
