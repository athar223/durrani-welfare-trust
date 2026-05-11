"""Views for the Reports app."""
import io
from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.http import HttpResponse
from django.shortcuts import render

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch

from durrani_welfare_system.students.models import Student
from durrani_welfare_system.accounts.models import Donation, Expense
from durrani_welfare_system.projects.models import Project

DWT_GREEN = colors.HexColor('#1a6b3c')


@login_required
def report_index(request):
    """Shows a page with links to different report types."""
    return render(request, 'reports/report_index.html')


@login_required
def student_report(request):
    """Shows student statistics."""
    total_students = Student.objects.count()
    active_students = Student.objects.filter(is_active=True).count()
    inactive_students = total_students - active_students

    by_education_level = (
        Student.objects.values('education_level')
        .annotate(count=Count('id'))
        .order_by('education_level')
    )
    # Map display names
    level_map = dict(Student.EDUCATION_LEVEL_CHOICES)
    for item in by_education_level:
        item['level_display'] = level_map.get(item['education_level'], item['education_level'])

    monthly_admissions = (
        Student.objects.annotate(month=TruncMonth('admission_date'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('-month')[:12]
    )

    students = Student.objects.all()

    context = {
        'total_students': total_students,
        'active_students': active_students,
        'inactive_students': inactive_students,
        'by_education_level': by_education_level,
        'monthly_admissions': monthly_admissions,
        'students': students,
    }
    return render(request, 'reports/student_report.html', context)


@login_required
def financial_report(request):
    """Shows financial statistics."""
    total_donations = Donation.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
    balance = total_donations - total_expenses

    donations_by_category = (
        Donation.objects.values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )
    category_map_donation = dict(Donation.CATEGORY_CHOICES)
    for item in donations_by_category:
        item['category_display'] = category_map_donation.get(item['category'], item['category'])

    expenses_by_category = (
        Expense.objects.values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )
    category_map_expense = dict(Expense.CATEGORY_CHOICES)
    for item in expenses_by_category:
        item['category_display'] = category_map_expense.get(item['category'], item['category'])

    monthly_summary = (
        Donation.objects.annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(donations=Sum('amount'))
        .order_by('-month')[:12]
    )
    # Add expenses for each month
    expense_months = dict(
        Expense.objects.annotate(month=TruncMonth('date'))
        .values_list('month')
        .annotate(total=Sum('amount'))
        .order_by('-month')[:12]
    )
    for item in monthly_summary:
        item['expenses'] = expense_months.get(item['month'], 0)
        item['net'] = item['donations'] - item['expenses']

    context = {
        'total_donations': total_donations,
        'total_expenses': total_expenses,
        'balance': balance,
        'donations_by_category': donations_by_category,
        'expenses_by_category': expenses_by_category,
        'monthly_summary': monthly_summary,
    }
    return render(request, 'reports/financial_report.html', context)


@login_required
def project_report(request):
    """Shows project statistics."""
    total_projects = Project.objects.count()
    total_budget = Project.objects.aggregate(total=Sum('budget'))['total'] or 0
    total_expenses = Project.objects.aggregate(total=Sum('expenses'))['total'] or 0
    total_beneficiaries = Project.objects.aggregate(total=Sum('beneficiaries_count'))['total'] or 0

    by_status = (
        Project.objects.values('status')
        .annotate(count=Count('id'), budget=Sum('budget'))
        .order_by('status')
    )
    status_map = dict(Project.STATUS_CHOICES)
    for item in by_status:
        item['status_display'] = status_map.get(item['status'], item['status'])

    by_category = (
        Project.objects.values('category')
        .annotate(count=Count('id'), budget=Sum('budget'), beneficiaries=Sum('beneficiaries_count'))
        .order_by('-budget')
    )
    category_map = dict(Project.CATEGORY_CHOICES)
    for item in by_category:
        item['category_display'] = category_map.get(item['category'], item['category'])

    projects = Project.objects.all()

    context = {
        'total_projects': total_projects,
        'total_budget': total_budget,
        'total_expenses': total_expenses,
        'total_beneficiaries': total_beneficiaries,
        'by_status': by_status,
        'by_category': by_category,
        'projects': projects,
    }
    return render(request, 'reports/project_report.html', context)


def _build_pdf(buffer, title, pagesize=A4):
    """Create a SimpleDocTemplate with standard margins."""
    doc = SimpleDocTemplate(
        buffer,
        pagesize=pagesize,
        rightMargin=0.5 * inch,
        leftMargin=0.5 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
    )
    return doc


def _header_elements(title, styles):
    """Return common header elements for PDF reports."""
    elements = []
    title_style = styles['Title']
    title_style.textColor = DWT_GREEN
    elements.append(Paragraph(f"Durrani Welfare Trust - {title}", title_style))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(
        f"Generated on: {datetime.now().strftime('%d %B %Y, %I:%M %p')}",
        styles['Normal'],
    ))
    elements.append(Spacer(1, 20))
    return elements


def _styled_table(data, col_widths=None):
    """Return a Table with professional DWT styling."""
    table = Table(data, colWidths=col_widths, repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0f7f3')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
    ]))
    return table


@login_required
def student_report_pdf(request):
    """Generate PDF report of all students."""
    buffer = io.BytesIO()
    doc = _build_pdf(buffer, "Student Report", pagesize=landscape(A4))
    styles = getSampleStyleSheet()
    elements = _header_elements("Student Report", styles)

    students = Student.objects.all()
    data = [['#', 'Name', 'Age', 'Guardian', 'Contact', 'Education Level', 'Admission Date', 'Status']]
    for i, s in enumerate(students, 1):
        data.append([
            str(i),
            s.full_name,
            str(s.age),
            s.guardian_name,
            s.contact_number,
            s.get_education_level_display(),
            s.admission_date.strftime('%d/%m/%Y'),
            'Active' if s.is_active else 'Inactive',
        ])

    if len(data) == 1:
        data.append(['', 'No students found', '', '', '', '', '', ''])

    col_widths = [0.4 * inch, 1.5 * inch, 0.5 * inch, 1.5 * inch, 1.2 * inch, 1.3 * inch, 1.1 * inch, 0.8 * inch]
    elements.append(_styled_table(data, col_widths))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph(f"Total Students: {students.count()}", styles['Normal']))

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="student_report.pdf"'
    return response


@login_required
def financial_report_pdf(request):
    """Generate PDF with financial summary."""
    buffer = io.BytesIO()
    doc = _build_pdf(buffer, "Financial Report", pagesize=A4)
    styles = getSampleStyleSheet()
    elements = _header_elements("Financial Report", styles)

    total_donations = Donation.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
    balance = total_donations - total_expenses

    # Summary table
    summary_data = [
        ['Metric', 'Amount (Rs.)'],
        ['Total Donations', f'{total_donations:,.2f}'],
        ['Total Expenses', f'{total_expenses:,.2f}'],
        ['Balance', f'{balance:,.2f}'],
    ]
    elements.append(Paragraph("Financial Summary", styles['Heading2']))
    elements.append(Spacer(1, 10))
    elements.append(_styled_table(summary_data, [3 * inch, 3 * inch]))
    elements.append(Spacer(1, 20))

    # Donations by category
    donations_by_cat = (
        Donation.objects.values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )
    cat_map = dict(Donation.CATEGORY_CHOICES)
    don_data = [['Category', 'Count', 'Amount (Rs.)']]
    for item in donations_by_cat:
        don_data.append([
            cat_map.get(item['category'], item['category']),
            str(item['count']),
            f"{item['total']:,.2f}",
        ])
    if len(don_data) > 1:
        elements.append(Paragraph("Donations by Category", styles['Heading2']))
        elements.append(Spacer(1, 10))
        elements.append(_styled_table(don_data, [2.5 * inch, 1.5 * inch, 2.5 * inch]))
        elements.append(Spacer(1, 20))

    # Expenses by category
    expenses_by_cat = (
        Expense.objects.values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )
    exp_map = dict(Expense.CATEGORY_CHOICES)
    exp_data = [['Category', 'Count', 'Amount (Rs.)']]
    for item in expenses_by_cat:
        exp_data.append([
            exp_map.get(item['category'], item['category']),
            str(item['count']),
            f"{item['total']:,.2f}",
        ])
    if len(exp_data) > 1:
        elements.append(Paragraph("Expenses by Category", styles['Heading2']))
        elements.append(Spacer(1, 10))
        elements.append(_styled_table(exp_data, [2.5 * inch, 1.5 * inch, 2.5 * inch]))

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="financial_report.pdf"'
    return response


@login_required
def project_report_pdf(request):
    """Generate PDF with project summary."""
    buffer = io.BytesIO()
    doc = _build_pdf(buffer, "Project Report", pagesize=landscape(A4))
    styles = getSampleStyleSheet()
    elements = _header_elements("Project Report", styles)

    projects = Project.objects.all()
    total_budget = Project.objects.aggregate(total=Sum('budget'))['total'] or 0
    total_beneficiaries = Project.objects.aggregate(total=Sum('beneficiaries_count'))['total'] or 0

    # Summary
    elements.append(Paragraph(
        f"Total Projects: {projects.count()} | Total Budget: Rs. {total_budget:,.2f} | Total Beneficiaries: {total_beneficiaries:,}",
        styles['Normal'],
    ))
    elements.append(Spacer(1, 15))

    # Projects table
    data = [['#', 'Project', 'Category', 'Status', 'Budget (Rs.)', 'Expenses (Rs.)', 'Beneficiaries', 'Start Date']]
    status_map = dict(Project.STATUS_CHOICES)
    cat_map = dict(Project.CATEGORY_CHOICES)
    for i, p in enumerate(projects, 1):
        data.append([
            str(i),
            p.name[:30],
            cat_map.get(p.category, p.category),
            status_map.get(p.status, p.status),
            f'{p.budget:,.2f}',
            f'{p.expenses:,.2f}',
            str(p.beneficiaries_count),
            p.start_date.strftime('%d/%m/%Y'),
        ])

    if len(data) == 1:
        data.append(['', 'No projects found', '', '', '', '', '', ''])

    col_widths = [0.4 * inch, 2 * inch, 1.1 * inch, 0.9 * inch, 1.2 * inch, 1.2 * inch, 1 * inch, 1 * inch]
    elements.append(_styled_table(data, col_widths))

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="project_report.pdf"'
    return response
