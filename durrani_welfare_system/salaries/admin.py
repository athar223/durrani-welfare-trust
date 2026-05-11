from django.contrib import admin
from .models import SalaryRecord


@admin.register(SalaryRecord)
class SalaryRecordAdmin(admin.ModelAdmin):
    list_display = ['employee_name', 'employee_type', 'month', 'base_salary', 'net_salary', 'status']
    list_filter = ['employee_type', 'status', 'month', 'payment_method']
    search_fields = ['employee_name']
    ordering = ['-month', 'employee_name']
