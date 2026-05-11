from django.contrib import admin
from .models import DailyExpense


@admin.register(DailyExpense)
class DailyExpenseAdmin(admin.ModelAdmin):
    list_display = ['date', 'category', 'description', 'amount', 'paid_by']
    list_filter = ['category', 'date']
    search_fields = ['description', 'paid_by', 'receipt_number']
    date_hierarchy = 'date'
