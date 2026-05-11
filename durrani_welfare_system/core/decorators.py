"""Role-based access control decorators."""
from functools import wraps
from django.shortcuts import redirect
from django.contrib import messages


def admin_required(view_func):
    """Only allow admin users (main or limited)."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_admin_user:
            return view_func(request, *args, **kwargs)
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('dashboard')
    return wrapper


def main_admin_required(view_func):
    """Only allow main admin users (not limited admins)."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_main_admin:
            return view_func(request, *args, **kwargs)
        messages.error(request, 'Only main administrators can perform this action.')
        return redirect('dashboard')
    return wrapper


def module_access_required(module_name):
    """Check if user has access to a specific module."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if request.user.is_authenticated and request.user.has_module_access(module_name):
                return view_func(request, *args, **kwargs)
            messages.error(request, f'You do not have access to the {module_name} module.')
            return redirect('dashboard')
        return wrapper
    return decorator
