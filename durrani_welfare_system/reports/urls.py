from django.urls import path
from . import views

app_name = 'reports'

urlpatterns = [
    path('', views.report_index, name='report_index'),
    path('students/', views.student_report, name='student_report'),
    path('students/pdf/', views.student_report_pdf, name='student_report_pdf'),
    path('financial/', views.financial_report, name='financial_report'),
    path('financial/pdf/', views.financial_report_pdf, name='financial_report_pdf'),
    path('projects/', views.project_report, name='project_report'),
    path('projects/pdf/', views.project_report_pdf, name='project_report_pdf'),
]
