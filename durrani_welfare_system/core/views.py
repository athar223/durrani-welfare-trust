"""Core views - Dashboard, authentication, backup."""
import json
import os
import shutil
from datetime import datetime, timedelta

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count, Q as models_Q
from django.db.models.functions import TruncMonth
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone

from .forms import LoginForm, UserForm, UserUpdateForm
from .models import User
from .decorators import admin_required, main_admin_required


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
            return redirect('dashboard')
    else:
        form = LoginForm()
    return render(request, 'core/login.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('login')


@login_required
def dashboard(request):
    """Main dashboard with analytics."""
    from durrani_welfare_system.students.models import Student
    from durrani_welfare_system.staff.models import StaffMember
    from durrani_welfare_system.volunteers.models import Volunteer
    from durrani_welfare_system.drivers.models import DriverProfile
    from durrani_welfare_system.ambulance.models import TripLog
    from durrani_welfare_system.projects.models import Project
    from durrani_welfare_system.accounts.models import Donation, Expense
    from durrani_welfare_system.daily_expenses.models import DailyExpense
    from durrani_welfare_system.salaries.models import SalaryRecord

    now = timezone.now()
    current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    today = now.date()

    # Summary stats
    total_students = Student.objects.filter(is_active=True).count()
    total_staff = StaffMember.objects.filter(is_active=True).count()
    total_volunteers = Volunteer.objects.filter(status='active').count()
    total_drivers = DriverProfile.objects.filter(is_active=True).count()
    total_donations = Donation.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
    balance = total_donations - total_expenses

    # Monthly stats
    monthly_donations = Donation.objects.filter(
        date__gte=current_month_start
    ).aggregate(total=Sum('amount'))['total'] or 0
    monthly_expenses = Expense.objects.filter(
        date__gte=current_month_start
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Active projects
    active_projects = Project.objects.filter(status='ongoing').count()

    # Ambulance trips this month
    monthly_trips = TripLog.objects.filter(date__gte=current_month_start).count()

    # Daily expenses today
    today_daily_expenses = DailyExpense.objects.filter(
        date=today
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Monthly daily expenses
    monthly_daily_expenses = DailyExpense.objects.filter(
        date__gte=current_month_start
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Salary stats this month
    monthly_salaries = SalaryRecord.objects.filter(
        month__gte=current_month_start
    ).aggregate(
        total=Sum('base_salary'),
        paid_count=Count('id', filter=models_Q(status='paid')),
        pending_count=Count('id', filter=models_Q(status='pending')),
    )

    # Recent donations (last 5)
    recent_donations = Donation.objects.order_by('-date')[:5]
    recent_expenses = Expense.objects.order_by('-date')[:5]

    # Monthly donation trend (last 6 months)
    six_months_ago = (now - timedelta(days=180)).date()
    donation_trend = (
        Donation.objects
        .filter(date__gte=six_months_ago)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )
    expense_trend = (
        Expense.objects
        .filter(date__gte=six_months_ago)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )

    # Chart data
    chart_labels = [d['month'].strftime('%b %Y') for d in donation_trend]
    chart_donations = [float(d['total']) for d in donation_trend]
    chart_expenses = [float(e['total']) for e in expense_trend]

    # Recent students
    recent_students = Student.objects.order_by('-admission_date')[:5]

    context = {
        'total_students': total_students,
        'total_staff': total_staff,
        'total_volunteers': total_volunteers,
        'total_drivers': total_drivers,
        'total_donations': total_donations,
        'total_expenses': total_expenses,
        'balance': balance,
        'monthly_donations': monthly_donations,
        'monthly_expenses': monthly_expenses,
        'active_projects': active_projects,
        'monthly_trips': monthly_trips,
        'today_daily_expenses': today_daily_expenses,
        'monthly_daily_expenses': monthly_daily_expenses,
        'recent_donations': recent_donations,
        'recent_expenses': recent_expenses,
        'recent_students': recent_students,
        'chart_labels': json.dumps(chart_labels),
        'chart_donations': json.dumps(chart_donations),
        'chart_expenses': json.dumps(chart_expenses),
    }
    return render(request, 'core/dashboard.html', context)


@login_required
@admin_required
def backup_database(request):
    """Export database backup."""
    db_path = settings.DATABASES['default']['NAME']
    if os.path.exists(db_path):
        with open(db_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='application/x-sqlite3')
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        response['Content-Disposition'] = f'attachment; filename="dwt_backup_{timestamp}.sqlite3"'
        return response
    messages.error(request, 'Database file not found.')
    return redirect('dashboard')


@login_required
@admin_required
def import_database(request):
    """Import database from uploaded file."""
    if request.method == 'POST' and request.FILES.get('db_file'):
        db_file = request.FILES['db_file']
        db_path = settings.DATABASES['default']['NAME']
        backup_dir = settings.BACKUP_DIR
        os.makedirs(backup_dir, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        shutil.copy2(db_path, backup_dir / f'pre_import_{timestamp}.sqlite3')
        with open(db_path, 'wb') as f:
            for chunk in db_file.chunks():
                f.write(chunk)
        messages.success(request, 'Database imported successfully. Please restart the server.')
        return redirect('dashboard')
    messages.error(request, 'No file provided.')
    return redirect('dashboard')


# ── User Management (Main Admin Only) ──

@login_required
@main_admin_required
def user_list(request):
    """List all users."""
    users = User.objects.all().order_by('role', 'username')
    search = request.GET.get('q', '')
    if search:
        users = users.filter(
            models_Q(username__icontains=search) |
            models_Q(first_name__icontains=search) |
            models_Q(last_name__icontains=search) |
            models_Q(email__icontains=search)
        )
    return render(request, 'core/user_list.html', {'users': users, 'search': search})


@login_required
@main_admin_required
def user_create(request):
    """Create a new user."""
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'User "{user.username}" created successfully.')
            return redirect('user_list')
    else:
        form = UserForm()
    return render(request, 'core/user_form.html', {'form': form, 'title': 'Add New User'})


@login_required
@main_admin_required
def user_edit(request, pk):
    """Edit an existing user."""
    user = User.objects.get(pk=pk)
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, f'User "{user.username}" updated successfully.')
            return redirect('user_list')
    else:
        form = UserUpdateForm(instance=user)
    return render(request, 'core/user_form.html', {'form': form, 'title': f'Edit User: {user.username}', 'edit_user': user})


@login_required
@main_admin_required
def user_delete(request, pk):
    """Delete a user."""
    user = User.objects.get(pk=pk)
    if user == request.user:
        messages.error(request, 'You cannot delete your own account.')
        return redirect('user_list')
    if request.method == 'POST':
        username = user.username
        user.delete()
        messages.success(request, f'User "{username}" deleted successfully.')
        return redirect('user_list')
    return render(request, 'core/user_confirm_delete.html', {'object': user, 'cancel_url': 'user_list'})


@login_required
@main_admin_required
def user_toggle_active(request, pk):
    """Activate/deactivate a user."""
    if request.method == 'POST':
        user = User.objects.get(pk=pk)
        if user == request.user:
            messages.error(request, 'You cannot deactivate your own account.')
        else:
            user.is_active = not user.is_active
            user.save()
            status = 'activated' if user.is_active else 'deactivated'
            messages.success(request, f'User "{user.username}" {status}.')
    return redirect('user_list')
