"""URL configuration for the Staff app."""
from django.urls import path
from . import views

app_name = 'staff'

urlpatterns = [
    path('', views.StaffListView.as_view(), name='staff_list'),
    path('add/', views.StaffCreateView.as_view(), name='staff_add'),
    path('<int:pk>/', views.staff_detail, name='staff_detail'),
    path('<int:pk>/edit/', views.StaffUpdateView.as_view(), name='staff_edit'),
    path('<int:pk>/delete/', views.StaffDeleteView.as_view(), name='staff_delete'),
    path('attendance/', views.staff_attendance, name='staff_attendance'),
    path('export/csv/', views.staff_export_csv, name='staff_export_csv'),
]
