from django.urls import path
from . import views

app_name = 'daily_expenses'

urlpatterns = [
    path('', views.daily_expense_list, name='daily_expense_list'),
    path('add/', views.DailyExpenseCreateView.as_view(), name='daily_expense_add'),
    path('<int:pk>/edit/', views.DailyExpenseUpdateView.as_view(), name='daily_expense_edit'),
    path('<int:pk>/delete/', views.DailyExpenseDeleteView.as_view(), name='daily_expense_delete'),
    path('summary/', views.daily_expense_summary, name='daily_expense_summary'),
    path('export/csv/', views.daily_expense_export_csv, name='daily_expense_export_csv'),
    path('export/pdf/', views.daily_expense_export_pdf, name='daily_expense_export_pdf'),
]
