"""URL configuration for the Drivers app."""
from django.urls import path
from . import views

app_name = 'drivers'

urlpatterns = [
    path('', views.DriverListView.as_view(), name='driver_list'),
    path('add/', views.DriverCreateView.as_view(), name='driver_add'),
    path('<int:pk>/', views.driver_detail, name='driver_detail'),
    path('<int:pk>/edit/', views.DriverUpdateView.as_view(), name='driver_edit'),
    path('<int:pk>/delete/', views.DriverDeleteView.as_view(), name='driver_delete'),
    path('attendance/', views.driver_attendance, name='driver_attendance'),
    path('trips/', views.driver_trip_list, name='driver_trip_list'),
    path('trips/add/', views.DriverTripLogCreateView.as_view(), name='driver_trip_add'),
    path('fuel/add/', views.DriverFuelLogCreateView.as_view(), name='driver_fuel_add'),
    path('maintenance/add/', views.DriverMaintenanceLogCreateView.as_view(), name='driver_maintenance_add'),
    path('export/csv/', views.driver_export_csv, name='driver_export_csv'),
]
