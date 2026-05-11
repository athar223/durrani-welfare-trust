from django.db import models


class DailyExpense(models.Model):
    CATEGORY_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('snacks', 'Snacks'),
        ('health_checkup', 'Health Checkup'),
        ('medicine', 'Medicine'),
        ('cleaning', 'Cleaning'),
        ('stationery', 'Stationery'),
        ('transport', 'Transport'),
        ('miscellaneous', 'Miscellaneous'),
    ]

    date = models.DateField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=300)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_by = models.CharField(max_length=200, blank=True)
    receipt_number = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Daily Expense'
        verbose_name_plural = 'Daily Expenses'

    def __str__(self):
        return f"{self.date} - {self.get_category_display()} - Rs. {self.amount}"
