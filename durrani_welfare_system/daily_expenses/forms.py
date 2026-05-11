from django import forms
from .models import DailyExpense


class DailyExpenseForm(forms.ModelForm):
    class Meta:
        model = DailyExpense
        fields = [
            'date', 'category', 'description', 'amount',
            'paid_by', 'receipt_number', 'notes',
        ]
        widgets = {
            'date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'description': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Expense description'}),
            'amount': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'paid_by': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Who paid?'}),
            'receipt_number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Receipt number'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Additional notes'}),
        }
