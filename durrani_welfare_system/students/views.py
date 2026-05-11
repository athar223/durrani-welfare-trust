"""Views for the Students app."""
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

from .models import Student, StudentAttendance
from .forms import StudentForm


class StudentListView(LoginRequiredMixin, ListView):
    model = Student
    template_name = 'students/student_list.html'
    context_object_name = 'students'
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


class StudentCreateView(LoginRequiredMixin, CreateView):
    model = Student
    form_class = StudentForm
    template_name = 'students/student_form.html'
    success_url = reverse_lazy('students:student_list')

    def form_valid(self, form):
        messages.success(self.request, 'Student added successfully.')
        return super().form_valid(form)


class StudentUpdateView(LoginRequiredMixin, UpdateView):
    model = Student
    form_class = StudentForm
    template_name = 'students/student_form.html'
    success_url = reverse_lazy('students:student_list')

    def form_valid(self, form):
        messages.success(self.request, 'Student updated successfully.')
        return super().form_valid(form)


class StudentDeleteView(LoginRequiredMixin, DeleteView):
    model = Student
    template_name = 'students/student_confirm_delete.html'
    success_url = reverse_lazy('students:student_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cancel_url'] = reverse_lazy('students:student_list')
        return context

    def form_valid(self, form):
        messages.success(self.request, 'Student deleted successfully.')
        return super().form_valid(form)


@login_required
def student_detail(request, pk):
    """Show student details and their attendance history."""
    student = get_object_or_404(Student, pk=pk)
    attendance_records = student.attendance_records.all()[:50]
    return render(request, 'students/student_detail.html', {
        'student': student,
        'attendance_records': attendance_records,
    })


@login_required
def student_attendance(request, attendance_date=None):
    """Mark attendance for all students on a given date."""
    selected_date = request.GET.get('date') or request.POST.get('date')
    if selected_date:
        try:
            selected_date = date.fromisoformat(selected_date)
        except (ValueError, TypeError):
            selected_date = date.today()
    else:
        selected_date = date.today()

    students = Student.objects.filter(is_active=True)

    if request.method == 'POST':
        # Clear existing attendance for this date, then recreate
        StudentAttendance.objects.filter(date=selected_date).delete()
        count = 0
        for student in students:
            status = request.POST.get(f'status_{student.pk}')
            remarks = request.POST.get(f'remarks_{student.pk}', '')
            if status in ('present', 'absent', 'leave'):
                StudentAttendance.objects.create(
                    student=student,
                    date=selected_date,
                    status=status,
                    remarks=remarks,
                )
                count += 1
        messages.success(request, f'Attendance marked for {count} students on {selected_date}.')
        return redirect(f"{request.path}?date={selected_date.isoformat()}")

    # Pre-fill existing attendance records
    existing = {
        att.student_id: att
        for att in StudentAttendance.objects.filter(date=selected_date)
    }
    student_data = []
    for student in students:
        att = existing.get(student.pk)
        student_data.append({
            'student': student,
            'status': att.status if att else '',
            'remarks': att.remarks if att else '',
        })

    return render(request, 'students/student_attendance.html', {
        'student_data': student_data,
        'selected_date': selected_date,
    })


@login_required
def student_export_csv(request):
    """Export all students as a CSV file."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="students.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'ID', 'First Name', 'Last Name', 'Age', 'Guardian Name',
        'Guardian Relation', 'Contact Number', 'Address',
        'Admission Date', 'Education Level', 'Active', 'Notes',
    ])
    for s in Student.objects.all():
        writer.writerow([
            s.pk, s.first_name, s.last_name, s.age, s.guardian_name,
            s.guardian_relation, s.contact_number, s.address,
            s.admission_date, s.get_education_level_display(),
            'Yes' if s.is_active else 'No', s.notes,
        ])
    return response
