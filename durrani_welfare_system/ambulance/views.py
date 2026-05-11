"""Views for the Ambulance Service app."""
from datetime import date

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum, Count
from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from .models import Vehicle, Driver, TripLog, FuelLog, MaintenanceLog
from .forms import VehicleForm, TripLogForm, FuelLogForm, MaintenanceLogForm


@login_required
def ambulance_dashboard(request):
    """Dashboard showing ambulance service overview."""
    today = date.today()
    first_of_month = today.replace(day=1)

    vehicle_count = Vehicle.objects.filter(is_active=True).count()
    trips_this_month = TripLog.objects.filter(date__gte=first_of_month).count()
    fuel_cost_this_month = (
        FuelLog.objects.filter(date__gte=first_of_month)
        .aggregate(total=Sum('cost'))['total'] or 0
    )
    recent_trips = TripLog.objects.select_related('vehicle', 'driver')[:10]

    return render(request, 'ambulance/ambulance_dashboard.html', {
        'vehicle_count': vehicle_count,
        'trips_this_month': trips_this_month,
        'fuel_cost_this_month': fuel_cost_this_month,
        'recent_trips': recent_trips,
    })


class VehicleListView(LoginRequiredMixin, ListView):
    model = Vehicle
    template_name = 'ambulance/vehicle_list.html'
    context_object_name = 'vehicles'
    paginate_by = 20


class VehicleCreateView(LoginRequiredMixin, CreateView):
    model = Vehicle
    form_class = VehicleForm
    template_name = 'ambulance/vehicle_form.html'
    success_url = reverse_lazy('ambulance:vehicle_list')

    def form_valid(self, form):
        messages.success(self.request, 'Vehicle added successfully.')
        return super().form_valid(form)


class VehicleUpdateView(LoginRequiredMixin, UpdateView):
    model = Vehicle
    form_class = VehicleForm
    template_name = 'ambulance/vehicle_form.html'
    success_url = reverse_lazy('ambulance:vehicle_list')

    def form_valid(self, form):
        messages.success(self.request, 'Vehicle updated successfully.')
        return super().form_valid(form)


class VehicleDeleteView(LoginRequiredMixin, DeleteView):
    model = Vehicle
    template_name = 'ambulance/vehicle_confirm_delete.html'
    success_url = reverse_lazy('ambulance:vehicle_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cancel_url'] = reverse_lazy('ambulance:vehicle_list')
        return context

    def form_valid(self, form):
        messages.success(self.request, 'Vehicle deleted successfully.')
        return super().form_valid(form)


@login_required
def vehicle_detail(request, pk):
    """Show vehicle details with trips, fuel logs, and maintenance logs."""
    vehicle = get_object_or_404(Vehicle, pk=pk)
    trips = vehicle.trips.select_related('driver')[:20]
    fuel_logs = vehicle.fuel_logs.all()[:20]
    maintenance_logs = vehicle.maintenance_logs.all()[:20]

    return render(request, 'ambulance/vehicle_detail.html', {
        'vehicle': vehicle,
        'trips': trips,
        'fuel_logs': fuel_logs,
        'maintenance_logs': maintenance_logs,
    })


class TripLogCreateView(LoginRequiredMixin, CreateView):
    model = TripLog
    form_class = TripLogForm
    template_name = 'ambulance/trip_form.html'
    success_url = reverse_lazy('ambulance:trip_list')

    def form_valid(self, form):
        messages.success(self.request, 'Trip log added successfully.')
        return super().form_valid(form)


class FuelLogCreateView(LoginRequiredMixin, CreateView):
    model = FuelLog
    form_class = FuelLogForm
    template_name = 'ambulance/fuel_form.html'
    success_url = reverse_lazy('ambulance:ambulance_dashboard')

    def form_valid(self, form):
        messages.success(self.request, 'Fuel log added successfully.')
        return super().form_valid(form)


class MaintenanceLogCreateView(LoginRequiredMixin, CreateView):
    model = MaintenanceLog
    form_class = MaintenanceLogForm
    template_name = 'ambulance/maintenance_form.html'
    success_url = reverse_lazy('ambulance:ambulance_dashboard')

    def form_valid(self, form):
        messages.success(self.request, 'Maintenance log added successfully.')
        return super().form_valid(form)


@login_required
def trip_list(request):
    """List all trips with optional date filter."""
    trips = TripLog.objects.select_related('vehicle', 'driver')
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')

    if date_from:
        trips = trips.filter(date__gte=date_from)
    if date_to:
        trips = trips.filter(date__lte=date_to)

    return render(request, 'ambulance/trip_list.html', {
        'trips': trips,
        'date_from': date_from,
        'date_to': date_to,
    })
