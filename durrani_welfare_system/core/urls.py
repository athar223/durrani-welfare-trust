"""Core URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('backup/export/', views.backup_database, name='backup_export'),
    path('backup/import/', views.import_database, name='backup_import'),
    # User Management (Main Admin only)
    path('users/', views.user_list, name='user_list'),
    path('users/add/', views.user_create, name='user_add'),
    path('users/<int:pk>/edit/', views.user_edit, name='user_edit'),
    path('users/<int:pk>/delete/', views.user_delete, name='user_delete'),
    path('users/<int:pk>/toggle-active/', views.user_toggle_active, name='user_toggle_active'),
]
