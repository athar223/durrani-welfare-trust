import csv
from decimal import Decimal
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db.models import Sum, Q
from django.db.models.functions import TruncMonth
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from .models import Donation, Expense
from .forms import DonationForm, ExpenseForm


# ---------------------------------------------------------------------------
# Donation Views
# ---------------------------------------------------------------------------

class DonationListView(LoginRequiredMixin, ListView):
    model = Donation
    template_name = 'accounts/donation_list.html'
    context_object_name = 'donations'
    paginate_by = 20

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.GET.get('search', '').strip()
        category = self.request.GET.get('category', '').strip()
        if search:
            qs = qs.filter(donor_name__icontains=search)
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['search'] = self.request.GET.get('search', '')
        ctx['selected_category'] = self.request.GET.get('category', '')
        ctx['category_choices'] = Donation.CATEGORY_CHOICES
        return ctx


class DonationCreateView(LoginRequiredMixin, CreateView):
    model = Donation
    form_class = DonationForm
    template_name = 'accounts/donation_form.html'
    success_url = reverse_lazy('accounts:donation_list')

    def form_valid(self, form):
        messages.success(self.request, 'Donation recorded successfully.')
        return super().form_valid(form)


class DonationUpdateView(LoginRequiredMixin, UpdateView):
    model = Donation
    form_class = DonationForm
    template_name = 'accounts/donation_form.html'
    success_url = reverse_lazy('accounts:donation_list')

    def form_valid(self, form):
        messages.success(self.request, 'Donation updated successfully.')
        return super().form_valid(form)


class DonationDeleteView(LoginRequiredMixin, DeleteView):
    model = Donation
    template_name = 'accounts/donation_confirm_delete.html'
    success_url = reverse_lazy('accounts:donation_list')

    def form_valid(self, form):
        messages.success(self.request, 'Donation deleted successfully.')
        return super().form_valid(form)


@login_required
def donation_detail(request, pk):
    donation = get_object_or_404(Donation, pk=pk)
    return render(request, 'accounts/donation_detail.html', {'donation': donation})


@login_required
def donation_export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="donations.csv"'
    writer = csv.writer(response)
    writer.writerow([
        'ID', 'Donor Name', 'Contact', 'Email', 'Amount', 'Date',
        'Category', 'Payment Method', 'Reference Number', 'Notes',
    ])
    for d in Donation.objects.all():
        writer.writerow([
            d.pk, d.donor_name, d.donor_contact, d.donor_email,
            d.amount, d.date, d.get_category_display(),
            d.get_payment_method_display(), d.reference_number, d.notes,
        ])
    return response


# ---------------------------------------------------------------------------
# Expense Views
# ---------------------------------------------------------------------------

class ExpenseListView(LoginRequiredMixin, ListView):
    model = Expense
    template_name = 'accounts/expense_list.html'
    context_object_name = 'expenses'
    paginate_by = 20

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.GET.get('search', '').strip()
        category = self.request.GET.get('category', '').strip()
        if search:
            qs = qs.filter(description__icontains=search)
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['search'] = self.request.GET.get('search', '')
        ctx['selected_category'] = self.request.GET.get('category', '')
        ctx['category_choices'] = Expense.CATEGORY_CHOICES
        return ctx


class ExpenseCreateView(LoginRequiredMixin, CreateView):
    model = Expense
    form_class = ExpenseForm
    template_name = 'accounts/expense_form.html'
    success_url = reverse_lazy('accounts:expense_list')

    def form_valid(self, form):
        messages.success(self.request, 'Expense recorded successfully.')
        return super().form_valid(form)


class ExpenseUpdateView(LoginRequiredMixin, UpdateView):
    model = Expense
    form_class = ExpenseForm
    template_name = 'accounts/expense_form.html'
    success_url = reverse_lazy('accounts:expense_list')

    def form_valid(self, form):
        messages.success(self.request, 'Expense updated successfully.')
        return super().form_valid(form)


class ExpenseDeleteView(LoginRequiredMixin, DeleteView):
    model = Expense
    template_name = 'accounts/expense_confirm_delete.html'
    success_url = reverse_lazy('accounts:expense_list')

    def form_valid(self, form):
        messages.success(self.request, 'Expense deleted successfully.')
        return super().form_valid(form)


@login_required
def expense_detail(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    return render(request, 'accounts/expense_detail.html', {'expense': expense})


@login_required
def expense_export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="expenses.csv"'
    writer = csv.writer(response)
    writer.writerow([
        'ID', 'Description', 'Amount', 'Date', 'Category',
        'Paid To', 'Payment Method', 'Reference Number', 'Approved By', 'Notes',
    ])
    for e in Expense.objects.all():
        writer.writerow([
            e.pk, e.description, e.amount, e.date,
            e.get_category_display(), e.paid_to,
            e.get_payment_method_display(), e.reference_number,
            e.approved_by, e.notes,
        ])
    return response


# ---------------------------------------------------------------------------
# Financial Summary
# ---------------------------------------------------------------------------

@login_required
def financial_summary(request):
    total_donations = Donation.objects.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    balance = total_donations - total_expenses

    # Monthly breakdown
    donation_months = (
        Donation.objects.annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('-month')
    )
    expense_months = (
        Expense.objects.annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('-month')
    )

    # Merge monthly data
    monthly_data = {}
    for item in donation_months:
        key = item['month']
        monthly_data.setdefault(key, {'month': key, 'donations': Decimal('0.00'), 'expenses': Decimal('0.00')})
        monthly_data[key]['donations'] = item['total']
    for item in expense_months:
        key = item['month']
        monthly_data.setdefault(key, {'month': key, 'donations': Decimal('0.00'), 'expenses': Decimal('0.00')})
        monthly_data[key]['expenses'] = item['total']

    monthly_breakdown = sorted(monthly_data.values(), key=lambda x: x['month'], reverse=True)
    for row in monthly_breakdown:
        row['net'] = row['donations'] - row['expenses']

    # Category-wise breakdown for donations
    donation_by_category = (
        Donation.objects.values('category')
        .annotate(total=Sum('amount'))
        .order_by('-total')
    )
    for item in donation_by_category:
        item['label'] = dict(Donation.CATEGORY_CHOICES).get(item['category'], item['category'])
        item['percentage'] = (item['total'] / total_donations * 100) if total_donations else 0

    # Category-wise breakdown for expenses
    expense_by_category = (
        Expense.objects.values('category')
        .annotate(total=Sum('amount'))
        .order_by('-total')
    )
    for item in expense_by_category:
        item['label'] = dict(Expense.CATEGORY_CHOICES).get(item['category'], item['category'])
        item['percentage'] = (item['total'] / total_expenses * 100) if total_expenses else 0

    context = {
        'total_donations': total_donations,
        'total_expenses': total_expenses,
        'balance': balance,
        'monthly_breakdown': monthly_breakdown,
        'donation_by_category': donation_by_category,
        'expense_by_category': expense_by_category,
    }
    return render(request, 'accounts/financial_summary.html', context)
