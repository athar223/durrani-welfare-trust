"""Vercel Python entry point - serves Django WSGI app.
Runs migrations on cold start so the DB schema is always current.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'durrani_welfare_system.settings')

import django
django.setup()

# Run migrations on cold-start so schema matches code.
# Safe & idempotent. Vercel's lambda cold-starts are infrequent.
_migrated = False
def _ensure_migrated():
    global _migrated
    if _migrated:
        return
    try:
        from django.core.management import call_command
        from django.db import connections
        # Test database connection first
        connections['default'].cursor()
        call_command('migrate', '--noinput', verbosity=0)
        # Seed admin user if missing
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin', password='admin123',
                email='admin@dwtrust.org', first_name='Admin',
                last_name='User', role='admin', phone='0300-1234567'
            )
        _migrated = True
    except Exception as e:
        print(f'Migration skipped: {e}')

_ensure_migrated()

from durrani_welfare_system.wsgi import application as base_app

def app(environ, start_response):
    _ensure_migrated()
    return base_app(environ, start_response)
