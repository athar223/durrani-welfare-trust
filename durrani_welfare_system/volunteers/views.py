"""Views for the Volunteers app."""
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

from .models import Volunteer, VolunteerAttendance
from .forms import VolunteerForm


class VolunteerListView(LoginRequiredMixin, ListView):
    model = Volunteer
    template_name = 'volunteers/volunteer_list.html'
    context_object_name = 'volunteers'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search', '').strip()
        status_filter = self.request.GET.get('status', '').strip()
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(skills__icontains=search)
            )
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search'] = self.request.GET.get('search', '')
        context['status_filter'] = self.request.GET.get('status', '')
        return context


class VolunteerCreateView(LoginRequiredMixin, CreateView):
    model = Volunteer
    form_class = VolunteerForm
    template_name = 'volunteers/volunteer_form.html'
    success_url = reverse_lazy('volunteers:volunteer_list')

    def form_valid(self, form):
        messages.success(self.request, 'Volunteer added successfully.')
        return super().form_valid(form)


class VolunteerUpdateView(LoginRequiredMixin, UpdateView):
    model = Volunteer
    form_class = VolunteerForm
    template_name = 'volunteers/volunteer_form.html'
    success_url = reverse_lazy('volunteers:volunteer_list')

    def form_valid(self, form):
        messages.success(self.request, 'Volunteer updated successfully.')
        return super().form_valid(form)


class VolunteerDeleteView(LoginRequiredMixin, DeleteView):
    model = Volunteer
    template_name = 'volunteers/volunteer_confirm_delete.html'
    success_url = reverse_lazy('volunteers:volunteer_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cancel_url'] = reverse_lazy('volunteers:volunteer_list')
        return context

    def form_valid(self, form):
        messages.success(self.request, 'Volunteer deleted successfully.')
        return super().form_valid(form)


@login_required
def volunteer_detail(request, pk):
    """Show volunteer details and their attendance history."""
    volunteer = get_object_or_404(Volunteer, pk=pk)
    attendance_records = volunteer.attendance_records.all()[:50]
    return render(request, 'volunteers/volunteer_detail.html', {
        'volunteer': volunteer,
        'attendance_records': attendance_records,
    })


@login_required
def volunteer_attendance(request):
    """Mark attendance for all active volunteers on a given date."""
    selected_date = request.GET.get('date') or request.POST.get('date')
    if selected_date:
        try:
            selected_date = date.fromisoformat(selected_date)
        except (ValueError, TypeError):
            selected_date = date.today()
    else:
        selected_date = date.today()

    volunteers = Volunteer.objects.filter(status='active')

    if request.method == 'POST':
        VolunteerAttendance.objects.filter(date=selected_date).delete()
        count = 0
        for volunteer in volunteers:
            status = request.POST.get(f'status_{volunteer.pk}')
            remarks = request.POST.get(f'remarks_{volunteer.pk}', '')
            if status in ('present', 'absent', 'leave'):
                VolunteerAttendance.objects.create(
                    volunteer=volunteer,
                    date=selected_date,
                    status=status,
                    remarks=remarks,
                )
                count += 1
        messages.success(request, f'Attendance marked for {count} volunteers on {selected_date}.')
        return redirect(f"{request.path}?date={selected_date.isoformat()}")

    existing = {
        att.volunteer_id: att
        for att in VolunteerAttendance.objects.filter(date=selected_date)
    }
    volunteer_data = []
    for volunteer in volunteers:
        att = existing.get(volunteer.pk)
        volunteer_data.append({
            'volunteer': volunteer,
            'status': att.status if att else '',
            'remarks': att.remarks if att else '',
        })

    return render(request, 'volunteers/volunteer_attendance.html', {
        'volunteer_data': volunteer_data,
        'selected_date': selected_date,
    })


@login_required
def volunteer_export_csv(request):
    """Export all volunteers as a CSV file."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="volunteers.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'ID', 'First Name', 'Last Name', 'Role', 'Contact Number',
        'Email', 'Address', 'Skills', 'Status', 'Joining Date',
        'Availability', 'Assigned Tasks', 'Notes',
    ])
    for v in Volunteer.objects.all():
        writer.writerow([
            v.pk, v.first_name, v.last_name, v.get_role_display(),
            v.contact_number, v.email, v.address, v.skills,
            v.get_status_display(), v.joining_date,
            v.get_availability_display(), v.assigned_tasks, v.notes,
        ])
    return response
