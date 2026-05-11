import csv
from datetime import date, timedelta
from decimal import Decimal

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator
from django.db.models import Sum, Count
from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.generic import CreateView, UpdateView, DeleteView

from .models import DailyExpense
from .forms import DailyExpenseForm


# ---------------------------------------------------------------------------
# Category badge colours
# ---------------------------------------------------------------------------
CATEGORY_COLORS = {
    'breakfast': 'blue',
    'lunch': 'azure',
    'snacks': 'cyan',
    'health_checkup': 'green',
    'medicine': 'lime',
    'cleaning': 'yellow',
    'stationery': 'orange',
    'transport': 'purple',
    'miscellaneous': 'secondary',
}


def _get_date_range(request):
    """Return (date_from, date_to) from request GET params."""
    today = date.today()
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')

    try:
        date_from = date.fromisoformat(date_from) if date_from else None
    except ValueError:
        date_from = None
    try:
        date_to = date.fromisoformat(date_to) if date_to else None
    except ValueError:
        date_to = None

    return date_from, date_to


# ---------------------------------------------------------------------------
# List View (function-based)
# ---------------------------------------------------------------------------
@login_required
def daily_expense_list(request):
    qs = DailyExpense.objects.all()

    date_from, date_to = _get_date_range(request)
    category = request.GET.get('category', '').strip()

    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)
    if category:
        qs = qs.filter(category=category)

    totals = qs.aggregate(total_amount=Sum('amount'), total_count=Count('id'))
    total_amount = totals['total_amount'] or Decimal('0.00')
    total_count = totals['total_count'] or 0

    paginator = Paginator(qs, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'total_amount': total_amount,
        'total_count': total_count,
        'date_from': date_from.isoformat() if date_from else '',
        'date_to': date_to.isoformat() if date_to else '',
        'selected_category': category,
        'category_choices': DailyExpense.CATEGORY_CHOICES,
        'category_colors': CATEGORY_COLORS,
    }
    return render(request, 'daily_expenses/daily_expense_list.html', context)


# ---------------------------------------------------------------------------
# Create / Update / Delete (class-based)
# ---------------------------------------------------------------------------
class DailyExpenseCreateView(LoginRequiredMixin, CreateView):
    model = DailyExpense
    form_class = DailyExpenseForm
    template_name = 'daily_expenses/daily_expense_form.html'
    success_url = reverse_lazy('daily_expenses:daily_expense_list')

    def get_initial(self):
        return {'date': date.today().isoformat()}

    def form_valid(self, form):
        messages.success(self.request, 'Daily expense recorded successfully.')
        return super().form_valid(form)


class DailyExpenseUpdateView(LoginRequiredMixin, UpdateView):
    model = DailyExpense
    form_class = DailyExpenseForm
    template_name = 'daily_expenses/daily_expense_form.html'
    success_url = reverse_lazy('daily_expenses:daily_expense_list')

    def form_valid(self, form):
        messages.success(self.request, 'Daily expense updated successfully.')
        return super().form_valid(form)


class DailyExpenseDeleteView(LoginRequiredMixin, DeleteView):
    model = DailyExpense
    template_name = 'daily_expenses/daily_expense_confirm_delete.html'
    success_url = reverse_lazy('daily_expenses:daily_expense_list')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['cancel_url'] = self.success_url
        return ctx

    def form_valid(self, form):
        messages.success(self.request, 'Daily expense deleted.')
        return super().form_valid(form)


# ---------------------------------------------------------------------------
# Summary View
# ---------------------------------------------------------------------------
@login_required
def daily_expense_summary(request):
    today = date.today()
    week_start = today - timedelta(days=today.weekday())  # Monday
    month_start = today.replace(day=1)

    today_total = DailyExpense.objects.filter(date=today).aggregate(
        total=Sum('amount'))['total'] or Decimal('0.00')
    week_total = DailyExpense.objects.filter(date__gte=week_start, date__lte=today).aggregate(
        total=Sum('amount'))['total'] or Decimal('0.00')
    month_total = DailyExpense.objects.filter(date__gte=month_start, date__lte=today).aggregate(
        total=Sum('amount'))['total'] or Decimal('0.00')

    # Category breakdown for the current month
    category_breakdown = (
        DailyExpense.objects.filter(date__gte=month_start, date__lte=today)
        .values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )
    # Add display name, colour, percentage
    category_data = []
    for item in category_breakdown:
        display = dict(DailyExpense.CATEGORY_CHOICES).get(item['category'], item['category'])
        pct = (item['total'] / month_total * 100) if month_total else Decimal('0')
        category_data.append({
            'category': item['category'],
            'display': display,
            'color': CATEGORY_COLORS.get(item['category'], 'secondary'),
            'total': item['total'],
            'count': item['count'],
            'percentage': round(pct, 1),
        })

    # Daily breakdown for current month
    daily_breakdown = (
        DailyExpense.objects.filter(date__gte=month_start, date__lte=today)
        .values('date')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-date')
    )

    context = {
        'today_total': today_total,
        'week_total': week_total,
        'month_total': month_total,
        'category_data': category_data,
        'daily_breakdown': daily_breakdown,
        'today': today,
        'month_start': month_start,
    }
    return render(request, 'daily_expenses/daily_expense_summary.html', context)


# ---------------------------------------------------------------------------
# CSV Export
# ---------------------------------------------------------------------------
@login_required
def daily_expense_export_csv(request):
    date_from, date_to = _get_date_range(request)
    qs = DailyExpense.objects.all()
    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)

    response = HttpResponse(content_type='text/csv')
    filename = 'daily_expenses'
    if date_from:
        filename += f'_from_{date_from}'
    if date_to:
        filename += f'_to_{date_to}'
    response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Date', 'Category', 'Description', 'Amount', 'Paid By', 'Receipt #', 'Notes'])

    for exp in qs:
        writer.writerow([
            exp.date,
            exp.get_category_display(),
            exp.description,
            exp.amount,
            exp.paid_by,
            exp.receipt_number,
            exp.notes,
        ])

    # Total row
    total = qs.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    writer.writerow([])
    writer.writerow(['', '', 'TOTAL', total, '', '', ''])

    return response


# ---------------------------------------------------------------------------
# PDF Export
# ---------------------------------------------------------------------------
@login_required
def daily_expense_export_pdf(request):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import inch
    import io

    date_from, date_to = _get_date_range(request)
    qs = DailyExpense.objects.all()
    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5 * inch, bottomMargin=0.5 * inch)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph('Durrani Welfare Trust', styles['Title']))
    subtitle = 'Daily Expenses Report'
    if date_from or date_to:
        subtitle += f' ({date_from or "start"} to {date_to or "present"})'
    elements.append(Paragraph(subtitle, styles['Heading2']))
    elements.append(Spacer(1, 0.25 * inch))

    # Summary
    total = qs.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    count = qs.count()
    elements.append(Paragraph(f'Total Expenses: Rs. {total:,.2f} &nbsp; | &nbsp; Total Records: {count}', styles['Normal']))
    elements.append(Spacer(1, 0.25 * inch))

    # Category breakdown
    cat_data = (
        qs.values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )
    if cat_data:
        elements.append(Paragraph('Category Breakdown', styles['Heading3']))
        cat_table_data = [['Category', 'Count', 'Amount']]
        cat_labels = dict(DailyExpense.CATEGORY_CHOICES)
        for c in cat_data:
            cat_table_data.append([
                cat_labels.get(c['category'], c['category']),
                str(c['count']),
                f"Rs. {c['total']:,.2f}",
            ])
        t = Table(cat_table_data, colWidths=[2.5 * inch, 1.2 * inch, 2 * inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a6b3c')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 0.25 * inch))

    # Detail table
    elements.append(Paragraph('Expense Details', styles['Heading3']))
    table_data = [['Date', 'Category', 'Description', 'Amount', 'Paid By']]

    for exp in qs[:500]:  # Limit to 500 for PDF sanity
        table_data.append([
            str(exp.date),
            exp.get_category_display(),
            exp.description[:40],
            f'Rs. {exp.amount:,.2f}',
            exp.paid_by or '-',
        ])

    # Total row
    table_data.append(['', '', 'TOTAL', f'Rs. {total:,.2f}', ''])

    t = Table(table_data, colWidths=[1 * inch, 1.2 * inch, 2.2 * inch, 1.1 * inch, 1.2 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a6b3c')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (3, 0), (3, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.whitesmoke, colors.white]),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e8f5e9')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
    ]))
    elements.append(t)

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    filename = 'daily_expenses_report'
    if date_from:
        filename += f'_from_{date_from}'
    if date_to:
        filename += f'_to_{date_to}'
    response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
    return response
