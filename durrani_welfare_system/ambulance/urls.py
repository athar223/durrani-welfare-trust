"""URL configuration for the Ambulance Service app."""
from django.urls import path
from . import views

app_name = 'ambulance'

urlpatterns = [
    path('', views.ambulance_dashboard, name='ambulance_dashboard'),
    path('vehicles/', views.VehicleListView.as_view(), name='vehicle_list'),
    path('vehicles/add/', views.VehicleCreateView.as_view(), name='vehicle_add'),
    path('vehicles/<int:pk>/', views.vehicle_detail, name='vehicle_detail'),
    path('vehicles/<int:pk>/edit/', views.VehicleUpdateView.as_view(), name='vehicle_edit'),
    path('vehicles/<int:pk>/delete/', views.VehicleDeleteView.as_view(), name='vehicle_delete'),
    path('trips/', views.trip_list, name='trip_list'),
    path('trips/add/', views.TripLogCreateView.as_view(), name='trip_add'),
    path('fuel/add/', views.FuelLogCreateView.as_view(), name='fuel_add'),
    path('maintenance/add/', views.MaintenanceLogCreateView.as_view(), name='maintenance_add'),
]
