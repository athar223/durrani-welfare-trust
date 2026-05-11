from django.urls import path
from . import views

app_name = 'salaries'

urlpatterns = [
    path('', views.salary_list, name='salary_list'),
    path('add/', views.SalaryCreateView.as_view(), name='salary_add'),
    path('<int:pk>/', views.salary_detail, name='salary_detail'),
    path('<int:pk>/edit/', views.SalaryUpdateView.as_view(), name='salary_edit'),
    path('<int:pk>/delete/', views.SalaryDeleteView.as_view(), name='salary_delete'),
    path('<int:pk>/mark-paid/', views.mark_salary_paid, name='salary_mark_paid'),
    path('generate/', views.generate_salaries, name='salary_generate'),
    path('summary/', views.salary_summary, name='salary_summary'),
    path('export/csv/', views.salary_export_csv, name='salary_export_csv'),
    path('export/pdf/', views.salary_export_pdf, name='salary_export_pdf'),
]
