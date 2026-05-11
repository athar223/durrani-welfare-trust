"""URL configuration for the Volunteers app."""
from django.urls import path
from . import views

app_name = 'volunteers'

urlpatterns = [
    path('', views.VolunteerListView.as_view(), name='volunteer_list'),
    path('add/', views.VolunteerCreateView.as_view(), name='volunteer_add'),
    path('<int:pk>/', views.volunteer_detail, name='volunteer_detail'),
    path('<int:pk>/edit/', views.VolunteerUpdateView.as_view(), name='volunteer_edit'),
    path('<int:pk>/delete/', views.VolunteerDeleteView.as_view(), name='volunteer_delete'),
    path('attendance/', views.volunteer_attendance, name='volunteer_attendance'),
    path('export/csv/', views.volunteer_export_csv, name='volunteer_export_csv'),
]
