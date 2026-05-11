"""Views for the Staff app."""
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

from .models import StaffMember, StaffAttendance
from .forms import StaffMemberForm


class StaffListView(LoginRequiredMixin, ListView):
    model = StaffMember
    template_name = 'staff/staff_list.html'
    context_object_name = 'staff_members'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) | Q(last_name__icontains=search)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search'] = self.request.GET.get('search', '')
        return context


class StaffCreateView(LoginRequiredMixin, CreateView):
    model = StaffMember
    form_class = StaffMemberForm
    template_name = 'staff/staff_form.html'
    success_url = reverse_lazy('staff:staff_list')

    def form_valid(self, form):
        messages.success(self.request, 'Staff member added successfully.')
        return super().form_valid(form)


class StaffUpdateView(LoginRequiredMixin, UpdateView):
    model = StaffMember
    form_class = StaffMemberForm
    template_name = 'staff/staff_form.html'
    success_url = reverse_lazy('staff:staff_list')

    def form_valid(self, form):
        messages.success(self.request, 'Staff member updated successfully.')
        return super().form_valid(form)


class StaffDeleteView(LoginRequiredMixin, DeleteView):
    model = StaffMember
    template_name = 'staff/staff_confirm_delete.html'
    success_url = reverse_lazy('staff:staff_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cancel_url'] = reverse_lazy('staff:staff_list')
        return context

    def form_valid(self, form):
        messages.success(self.request, 'Staff member deleted successfully.')
        return super().form_valid(form)


@login_required
def staff_detail(request, pk):
    """Show staff member details and their attendance history."""
    staff_member = get_object_or_404(StaffMember, pk=pk)
    attendance_records = staff_member.attendance_records.all()[:50]
    return render(request, 'staff/staff_detail.html', {
        'staff_member': staff_member,
        'attendance_records': attendance_records,
    })


@login_required
def staff_attendance(request):
    """Mark attendance for all staff members on a given date."""
    selected_date = request.GET.get('date') or request.POST.get('date')
    if selected_date:
        try:
            selected_date = date.fromisoformat(selected_date)
        except (ValueError, TypeError):
            selected_date = date.today()
    else:
        selected_date = date.today()

    staff_members = StaffMember.objects.filter(is_active=True)

    if request.method == 'POST':
        # Clear existing attendance for this date, then recreate
        StaffAttendance.objects.filter(date=selected_date).delete()
        count = 0
        for member in staff_members:
            status = request.POST.get(f'status_{member.pk}')
            remarks = request.POST.get(f'remarks_{member.pk}', '')
            if status in ('present', 'absent', 'leave'):
                StaffAttendance.objects.create(
                    staff_member=member,
                    date=selected_date,
                    status=status,
                    remarks=remarks,
                )
                count += 1
        messages.success(request, f'Attendance marked for {count} staff members on {selected_date}.')
        return redirect(f"{request.path}?date={selected_date.isoformat()}")

    # Pre-fill existing attendance records
    existing = {
        att.staff_member_id: att
        for att in StaffAttendance.objects.filter(date=selected_date)
    }
    staff_data = []
    for member in staff_members:
        att = existing.get(member.pk)
        staff_data.append({
            'member': member,
            'status': att.status if att else '',
            'remarks': att.remarks if att else '',
        })

    return render(request, 'staff/staff_attendance.html', {
        'staff_data': staff_data,
        'selected_date': selected_date,
    })


@login_required
def staff_export_csv(request):
    """Export all staff members as a CSV file."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="staff_members.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'ID', 'First Name', 'Last Name', 'Role', 'Contact Number',
        'Email', 'Address', 'Joining Date', 'Supervisor', 'Base Salary',
        'Active', 'Notes',
    ])
    for s in StaffMember.objects.all():
        writer.writerow([
            s.pk, s.first_name, s.last_name, s.get_role_display(),
            s.contact_number, s.email, s.address, s.joining_date,
            s.supervisor, s.base_salary,
            'Yes' if s.is_active else 'No', s.notes,
        ])
    return response
