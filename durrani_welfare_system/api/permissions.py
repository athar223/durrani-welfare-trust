"""Custom DRF permission classes."""
from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Only admin and limited_admin users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_user)


class IsMainAdmin(permissions.BasePermission):
    """Only main admin (not limited admin)."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_main_admin)


class ReadOnlyOrAdmin(permissions.BasePermission):
    """Anyone can read, only admins can write."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_user)
