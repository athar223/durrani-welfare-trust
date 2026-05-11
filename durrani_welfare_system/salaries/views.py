"""Views for the Salaries app."""
import csv
from datetime import date
from decimal import Decimal

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator
from django.db.models import Sum, Count, Q, F, DecimalField, ExpressionWrapper
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView

from .models import SalaryRecord
from .forms import SalaryRecordForm, GenerateSalariesForm


# ---------------------------------------------------------------------------
# List View
# ---------------------------------------------------------------------------
@login_required
def salary_list(request):
    qs = SalaryRecord.objects.all()

    # Filters
    month_filter = request.GET.get('month', '')
    employee_type_filter = request.GET.get('employee_type', '')
    status_filter = request.GET.get('status', '')

    if month_filter:
        try:
            parts = month_filter.split('-')
            qs = qs.filter(month__year=int(parts[0]), month__month=int(parts[1]))
        except (ValueError, IndexError):
            pass

    if employee_type_filter:
        qs = qs.filter(employee_type=employee_type_filter)

    if status_filter:
        qs = qs.filter(status=status_filter)

    # Totals
    total_count = qs.count()
    agg = qs.aggregate(
        total_base=Sum('base_salary'),
        total_allowances=Sum('allowances'),
        total_deductions=Sum('deductions'),
        total_bonus=Sum('bonus'),
    )
    total_base = agg['total_base'] or Decimal('0')
    total_allowances = agg['total_allowances'] or Decimal('0')
    total_deductions = agg['total_deductions'] or Decimal('0')
    total_bonus = agg['total_bonus'] or Decimal('0')

    # Calculate total overtime from Python (since it's two fields multiplied)
    all_records = list(qs)
    total_overtime = sum(r.overtime_amount for r in all_records)
    total_net = sum(r.net_salary for r in all_records)
    total_paid = sum(r.net_salary for r in all_records if r.status == 'paid')
    total_pending = sum(r.net_salary for r in all_records if r.status == 'pending')

    # Pagination
    paginator = Paginator(qs, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'total_count': total_count,
        'total_net': total_net,
        'total_paid': total_paid,
        'total_pending': total_pending,
        'month_filter': month_filter,
        'employee_type_filter': employee_type_filter,
        'status_filter': status_filter,
        'employee_type_choices': SalaryRecord.EMPLOYEE_TYPE_CHOICES,
        'status_choices': SalaryRecord.STATUS_CHOICES,
    }
    return render(request, 'salaries/salary_list.html', context)


# ---------------------------------------------------------------------------
# CRUD Views
# ---------------------------------------------------------------------------
class SalaryCreateView(LoginRequiredMixin, CreateView):
    model = SalaryRecord
    form_class = SalaryRecordForm
    template_name = 'salaries/salary_form.html'
    success_url = reverse_lazy('salaries:salary_list')

    def form_valid(self, form):
        messages.success(self.request, 'Salary record created successfully.')
        return super().form_valid(form)


class SalaryUpdateView(LoginRequiredMixin, UpdateView):
    model = SalaryRecord
    form_class = SalaryRecordForm
    template_name = 'salaries/salary_form.html'
    success_url = reverse_lazy('salaries:salary_list')

    def form_valid(self, form):
        messages.success(self.request, 'Salary record updated successfully.')
        return super().form_valid(form)


class SalaryDeleteView(LoginRequiredMixin, DeleteView):
    model = SalaryRecord
    template_name = 'salaries/salary_confirm_delete.html'
    success_url = reverse_lazy('salaries:salary_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cancel_url'] = reverse_lazy('salaries:salary_list')
        return context

    def form_valid(self, form):
        messages.success(self.request, 'Salary record deleted.')
        return super().form_valid(form)


# ---------------------------------------------------------------------------
# Detail View
# ---------------------------------------------------------------------------
@login_required
def salary_detail(request, pk):
    salary = get_object_or_404(SalaryRecord, pk=pk)
    return render(request, 'salaries/salary_detail.html', {'salary': salary})


# ---------------------------------------------------------------------------
# Generate Salaries
# ---------------------------------------------------------------------------
@login_required
def generate_salaries(request):
    from durrani_welfare_system.staff.models import StaffMember
    from durrani_welfare_system.drivers.models import DriverProfile

    staff_members = StaffMember.objects.filter(is_active=True)
    drivers = DriverProfile.objects.filter(is_active=True)

    if request.method == 'POST':
        form = GenerateSalariesForm(request.POST)
        if form.is_valid():
            month_str = request.POST.get('month', '')
            employee_type = form.cleaned_data['employee_type']

            # Parse month input (format: YYYY-MM)
            try:
                parts = month_str.split('-')
                salary_month = date(int(parts[0]), int(parts[1]), 1)
            except (ValueError, IndexError):
                messages.error(request, 'Invalid month format.')
                return redirect('salaries:salary_generate')

            created_count = 0
            skipped_count = 0

            # Generate for staff
            if employee_type in ('all', 'staff'):
                for member in staff_members:
                    if not SalaryRecord.objects.filter(
                        employee_type='staff',
                        employee_id=member.pk,
                        month=salary_month,
                    ).exists():
                        SalaryRecord.objects.create(
                            employee_type='staff',
                            employee_name=member.full_name,
                            employee_id=member.pk,
                            month=salary_month,
                            base_salary=member.base_salary,
                        )
                        created_count += 1
                    else:
                        skipped_count += 1

            # Generate for drivers
            if employee_type in ('all', 'driver'):
                for driver in drivers:
                    if not SalaryRecord.objects.filter(
                        employee_type='driver',
                        employee_id=driver.pk,
                        month=salary_month,
                    ).exists():
                        SalaryRecord.objects.create(
                            employee_type='driver',
                            employee_name=driver.full_name,
                            employee_id=driver.pk,
                            month=salary_month,
                            base_salary=driver.base_salary,
                        )
                        created_count += 1
                    else:
                        skipped_count += 1

            messages.success(
                request,
                f'Generated {created_count} salary record(s). {skipped_count} already existed and were skipped.',
            )
            return redirect('salaries:salary_list')
    else:
        form = GenerateSalariesForm()

    context = {
        'form': form,
        'staff_members': staff_members,
        'drivers': drivers,
    }
    return render(request, 'salaries/salary_generate.html', context)


# ---------------------------------------------------------------------------
# Summary View
# ---------------------------------------------------------------------------
@login_required
def salary_summary(request):
    month_filter = request.GET.get('month', '')
    qs = SalaryRecord.objects.all()

    if month_filter:
        try:
            parts = month_filter.split('-')
            qs = qs.filter(month__year=int(parts[0]), month__month=int(parts[1]))
        except (ValueError, IndexError):
            pass

    records = list(qs)
    total_net = sum(r.net_salary for r in records)
    total_deductions = sum(r.deductions for r in records)
    total_bonus = sum(r.bonus for r in records)
    total_overtime = sum(r.overtime_amount for r in records)
    total_base = sum(r.base_salary for r in records)
    total_allowances = sum(r.allowances for r in records)
    total_paid = sum(r.net_salary for r in records if r.status == 'paid')
    total_pending = sum(r.net_salary for r in records if r.status == 'pending')

    # Breakdown by employee type
    staff_records = [r for r in records if r.employee_type == 'staff']
    driver_records = [r for r in records if r.employee_type == 'driver']

    staff_total = sum(r.net_salary for r in staff_records)
    driver_total = sum(r.net_salary for r in driver_records)

    # Monthly breakdown for chart
    monthly_data = {}
    for r in SalaryRecord.objects.all():
        key = r.month.strftime('%Y-%m')
        if key not in monthly_data:
            monthly_data[key] = Decimal('0')
        monthly_data[key] += r.net_salary

    sorted_months = sorted(monthly_data.keys())
    chart_labels = sorted_months
    chart_values = [str(monthly_data[m]) for m in sorted_months]

    context = {
        'month_filter': month_filter,
        'total_count': len(records),
        'total_net': total_net,
        'total_deductions': total_deductions,
        'total_bonus': total_bonus,
        'total_overtime': total_overtime,
        'total_base': total_base,
        'total_allowances': total_allowances,
        'total_paid': total_paid,
        'total_pending': total_pending,
        'staff_count': len(staff_records),
        'staff_total': staff_total,
        'driver_count': len(driver_records),
        'driver_total': driver_total,
        'chart_labels': chart_labels,
        'chart_values': chart_values,
    }
    return render(request, 'salaries/salary_summary.html', context)


# ---------------------------------------------------------------------------
# Export CSV
# ---------------------------------------------------------------------------
@login_required
def salary_export_csv(request):
    qs = SalaryRecord.objects.all()

    month_filter = request.GET.get('month', '')
    if month_filter:
        try:
            parts = month_filter.split('-')
            qs = qs.filter(month__year=int(parts[0]), month__month=int(parts[1]))
        except (ValueError, IndexError):
            pass

    employee_type_filter = request.GET.get('employee_type', '')
    if employee_type_filter:
        qs = qs.filter(employee_type=employee_type_filter)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="salary_records.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Employee', 'Type', 'Month', 'Base Salary', 'Allowances',
        'Deductions', 'Bonus', 'Overtime Hours', 'Overtime Rate',
        'Overtime Amount', 'Net Salary', 'Status', 'Payment Date',
        'Payment Method', 'Notes',
    ])

    for r in qs:
        writer.writerow([
            r.employee_name,
            r.get_employee_type_display(),
            r.month.strftime('%b %Y'),
            r.base_salary,
            r.allowances,
            r.deductions,
            r.bonus,
            r.overtime_hours,
            r.overtime_rate,
            r.overtime_amount,
            r.net_salary,
            r.get_status_display(),
            r.payment_date.strftime('%Y-%m-%d') if r.payment_date else '',
            r.get_payment_method_display(),
            r.notes,
        ])

    return response


# ---------------------------------------------------------------------------
# Export PDF
# ---------------------------------------------------------------------------
@login_required
def salary_export_pdf(request):
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib.units import cm
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

    qs = SalaryRecord.objects.all()

    month_filter = request.GET.get('month', '')
    if month_filter:
        try:
            parts = month_filter.split('-')
            qs = qs.filter(month__year=int(parts[0]), month__month=int(parts[1]))
        except (ValueError, IndexError):
            pass

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="salary_records.pdf"'

    doc = SimpleDocTemplate(response, pagesize=landscape(A4), topMargin=1 * cm, bottomMargin=1 * cm)
    elements = []
    styles = getSampleStyleSheet()

    # DWT Green
    dwt_green = colors.HexColor('#1a6b3c')

    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        textColor=dwt_green,
        fontSize=18,
        spaceAfter=6,
    )
    elements.append(Paragraph('Durrani Welfare Trust', title_style))
    elements.append(Paragraph('Salary Records Report', styles['Heading2']))

    if month_filter:
        elements.append(Paragraph(f'Month: {month_filter}', styles['Normal']))

    elements.append(Spacer(1, 0.5 * cm))

    # Table data
    header = ['Employee', 'Type', 'Month', 'Base', 'Allowances', 'Deductions', 'Bonus', 'Overtime', 'Net Salary', 'Status']
    data = [header]

    total_net = Decimal('0')
    for r in qs:
        net = r.net_salary
        total_net += net
        data.append([
            r.employee_name,
            r.get_employee_type_display(),
            r.month.strftime('%b %Y'),
            f'Rs. {r.base_salary:,.2f}',
            f'Rs. {r.allowances:,.2f}',
            f'Rs. {r.deductions:,.2f}',
            f'Rs. {r.bonus:,.2f}',
            f'Rs. {r.overtime_amount:,.2f}',
            f'Rs. {net:,.2f}',
            r.get_status_display(),
        ])

    # Total row
    data.append(['', '', '', '', '', '', '', 'TOTAL:', f'Rs. {total_net:,.2f}', ''])

    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), dwt_green),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.HexColor('#f0f7f3')]),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e8f5e9')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(table)

    doc.build(elements)
    return response


# ---------------------------------------------------------------------------
# Mark Salary as Paid
# ---------------------------------------------------------------------------
@login_required
def mark_salary_paid(request, pk):
    if request.method == 'POST':
        salary = get_object_or_404(SalaryRecord, pk=pk)
        salary.status = 'paid'
        salary.payment_date = date.today()
        salary.save()
        messages.success(request, f'Salary for {salary.employee_name} marked as paid.')
    return redirect('salaries:salary_list')
