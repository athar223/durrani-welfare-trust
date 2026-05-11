from django.contrib import admin
from .models import Donation, Expense


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['donor_name', 'amount', 'date', 'category', 'payment_method']
    list_filter = ['category', 'payment_method', 'date']
    search_fields = ['donor_name', 'donor_contact', 'donor_email', 'reference_number']
    date_hierarchy = 'date'


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'amount', 'date', 'category', 'payment_method']
    list_filter = ['category', 'payment_method', 'date']
    search_fields = ['description', 'paid_to', 'reference_number']
    date_hierarchy = 'date'
