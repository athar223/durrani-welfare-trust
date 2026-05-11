from django import forms
from .models import SalaryRecord


class SalaryRecordForm(forms.ModelForm):
    class Meta:
        model = SalaryRecord
        fields = [
            'employee_type', 'employee_name', 'employee_id', 'month',
            'base_salary', 'allowances', 'deductions', 'bonus',
            'overtime_hours', 'overtime_rate',
            'status', 'payment_date', 'payment_method', 'notes',
        ]
        widgets = {
            'employee_type': forms.Select(attrs={'class': 'form-select'}),
            'employee_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Employee name'}),
            'employee_id': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Employee ID'}),
            'month': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'base_salary': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'allowances': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'deductions': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'bonus': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'overtime_hours': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'overtime_rate': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'placeholder': '0.00'}),
            'status': forms.Select(attrs={'class': 'form-select'}),
            'payment_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'payment_method': forms.Select(attrs={'class': 'form-select'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Additional notes'}),
        }


class GenerateSalariesForm(forms.Form):
    EMPLOYEE_TYPE_CHOICES = [
        ('all', 'All Employees'),
        ('staff', 'Staff Only'),
        ('driver', 'Drivers Only'),
    ]

    month = forms.DateField(
        widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'month'}),
        help_text='Select the month to generate salaries for',
    )
    employee_type = forms.ChoiceField(
        choices=EMPLOYEE_TYPE_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'}),
    )
