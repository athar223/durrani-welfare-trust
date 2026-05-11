"""Views for the Drivers app."""
import csv
from datetime import date

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from .models import DriverProfile, DriverAttendance, DriverTripLog, DriverFuelLog, DriverMaintenanceLog
from .forms import DriverProfileForm, DriverTripLogForm, DriverFuelLogForm, DriverMaintenanceLogForm


class DriverListView(LoginRequiredMixin, ListView):
    model = DriverProfile
    template_name = 'drivers/driver_list.html'
    context_object_name = 'drivers'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(license_number__icontains=search)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search'] = self.request.GET.get('search', '')
        return context


class DriverCreateView(LoginRequiredMixin, CreateView):
    model = DriverProfile
    form_class = DriverProfileForm
    template_name = 'drivers/driver_form.html'
    success_url = reverse_lazy('drivers:driver_list')

    def form_valid(self, form):
        messages.success(self.request, 'Driver added successfully.')
        return super().form_valid(form)


class DriverUpdateView(LoginRequiredMixin, UpdateView):
    model = DriverProfile
    form_class = DriverProfileForm
    template_name = 'drivers/driver_form.html'
    success_url = reverse_lazy('drivers:driver_list')

    def form_valid(self, form):
        messages.success(self.request, 'Driver updated successfully.')
        return super().form_valid(form)


class DriverDeleteView(LoginRequiredMixin, DeleteView):
    model = DriverProfile
    template_name = 'drivers/driver_confirm_delete.html'
    success_url = reverse_lazy('drivers:driver_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cancel_url'] = reverse_lazy('drivers:driver_list')
        return context

    def form_valid(self, form):
        messages.success(self.request, 'Driver deleted successfully.')
        return super().form_valid(form)


@login_required
def driver_detail(request, pk):
    """Show driver details with recent trips, fuel logs, and maintenance logs."""
    driver = get_object_or_404(DriverProfile, pk=pk)
    recent_trips = driver.trip_logs.all()[:10]
    recent_fuel = driver.fuel_logs.all()[:10]
    recent_maintenance = driver.maintenance_logs.all()[:10]
    return render(request, 'drivers/driver_detail.html', {
        'driver': driver,
        'recent_trips': recent_trips,
        'recent_fuel': recent_fuel,
        'recent_maintenance': recent_maintenance,
    })


@login_required
def driver_attendance(request):
    """Mark attendance for all drivers on a given date."""
    selected_date = request.GET.get('date') or request.POST.get('date')
    if selected_date:
        try:
            selected_date = date.fromisoformat(selected_date)
        except (ValueError, TypeError):
            selected_date = date.today()
    else:
        selected_date = date.today()

    drivers = DriverProfile.objects.filter(is_active=True)

    if request.method == 'POST':
        DriverAttendance.objects.filter(date=selected_date).delete()
        count = 0
        for driver in drivers:
            status = request.POST.get(f'status_{driver.pk}')
            remarks = request.POST.get(f'remarks_{driver.pk}', '')
            if status in ('present', 'absent', 'leave'):
                DriverAttendance.objects.create(
                    driver=driver,
                    date=selected_date,
                    status=status,
                    remarks=remarks,
                )
                count += 1
        messages.success(request, f'Attendance marked for {count} drivers on {selected_date}.')
        return redirect(f"{request.path}?date={selected_date.isoformat()}")

    existing = {
        att.driver_id: att
        for att in DriverAttendance.objects.filter(date=selected_date)
    }
    driver_data = []
    for driver in drivers:
        att = existing.get(driver.pk)
        driver_data.append({
            'driver': driver,
            'status': att.status if att else '',
            'remarks': att.remarks if att else '',
        })

    return render(request, 'drivers/driver_attendance.html', {
        'driver_data': driver_data,
        'selected_date': selected_date,
    })


class DriverTripLogCreateView(LoginRequiredMixin, CreateView):
    model = DriverTripLog
    form_class = DriverTripLogForm
    template_name = 'drivers/trip_form.html'
    success_url = reverse_lazy('drivers:driver_trip_list')

    def form_valid(self, form):
        messages.success(self.request, 'Trip log added successfully.')
        return super().form_valid(form)


class DriverFuelLogCreateView(LoginRequiredMixin, CreateView):
    model = DriverFuelLog
    form_class = DriverFuelLogForm
    template_name = 'drivers/fuel_form.html'
    success_url = reverse_lazy('drivers:driver_list')

    def form_valid(self, form):
        messages.success(self.request, 'Fuel log added successfully.')
        return super().form_valid(form)


class DriverMaintenanceLogCreateView(LoginRequiredMixin, CreateView):
    model = DriverMaintenanceLog
    form_class = DriverMaintenanceLogForm
    template_name = 'drivers/maintenance_form.html'
    success_url = reverse_lazy('drivers:driver_list')

    def form_valid(self, form):
        messages.success(self.request, 'Maintenance log added successfully.')
        return super().form_valid(form)


@login_required
def driver_trip_list(request):
    """List all trips with optional date filtering."""
    trips = DriverTripLog.objects.select_related('driver').all()
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')

    if date_from:
        try:
            trips = trips.filter(date__gte=date.fromisoformat(date_from))
        except (ValueError, TypeError):
            pass
    if date_to:
        try:
            trips = trips.filter(date__lte=date.fromisoformat(date_to))
        except (ValueError, TypeError):
            pass

    return render(request, 'drivers/driver_trip_list.html', {
        'trips': trips,
        'date_from': date_from,
        'date_to': date_to,
    })


@login_required
def driver_export_csv(request):
    """Export all drivers as a CSV file."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="drivers.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'ID', 'First Name', 'Last Name', 'Contact Number', 'Email',
        'License Number', 'License Expiry', 'Vehicle Assigned', 'Shift',
        'Joining Date', 'Base Salary', 'Active', 'Notes',
    ])
    for d in DriverProfile.objects.all():
        writer.writerow([
            d.pk, d.first_name, d.last_name, d.contact_number, d.email,
            d.license_number, d.license_expiry, d.vehicle_assigned,
            d.get_shift_display(), d.joining_date, d.base_salary,
            'Yes' if d.is_active else 'No', d.notes,
        ])
    return response
