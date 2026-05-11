from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Donations
    path('donations/', views.DonationListView.as_view(), name='donation_list'),
    path('donations/add/', views.DonationCreateView.as_view(), name='donation_add'),
    path('donations/<int:pk>/', views.donation_detail, name='donation_detail'),
    path('donations/<int:pk>/edit/', views.DonationUpdateView.as_view(), name='donation_edit'),
    path('donations/<int:pk>/delete/', views.DonationDeleteView.as_view(), name='donation_delete'),
    path('donations/export/csv/', views.donation_export_csv, name='donation_export_csv'),

    # Expenses
    path('expenses/', views.ExpenseListView.as_view(), name='expense_list'),
    path('expenses/add/', views.ExpenseCreateView.as_view(), name='expense_add'),
    path('expenses/<int:pk>/', views.expense_detail, name='expense_detail'),
    path('expenses/<int:pk>/edit/', views.ExpenseUpdateView.as_view(), name='expense_edit'),
    path('expenses/<int:pk>/delete/', views.ExpenseDeleteView.as_view(), name='expense_delete'),
    path('expenses/export/csv/', views.expense_export_csv, name='expense_export_csv'),

    # Summary
    path('summary/', views.financial_summary, name='financial_summary'),
]
