"""Vercel Python entry point - serves Django WSGI app."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'durrani_welfare_system.settings')

import django
django.setup()

_initialized = False


def _initialize():
    """Run migrations and seed admin + sample CMS content on first request."""
    global _initialized
    if _initialized:
        return
    try:
        from django.core.management import call_command
        from django.db import connections
        connections['default'].cursor()
        call_command('migrate', '--noinput', verbosity=0)

        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin', password='admin123',
                email='admin@dwtrust.org', first_name='Admin',
                last_name='User', role='admin', phone='0300-1234567',
            )

        # Seed minimal CMS content so the public site is not empty
        from durrani_welfare_system.cms.models import (
            SiteSettings, Service, AboutSection,
        )

        SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                'organization_name': 'Durrani Welfare Trust',
                'tagline': 'Serving Humanity with Compassion',
                'email': 'info@duraniwelfaretrust.org',
                'phone_primary': '+92 300 1234567',
                'address': 'Durrani Welfare Trust, Pakistan',
            },
        )

        if not Service.objects.exists():
            services = [
                ('Education Support', 'education-support', 'Free education and books for underprivileged children.'),
                ('Healthcare', 'healthcare', 'Medical camps and treatment assistance.'),
                ('Ambulance Service', 'ambulance-service', 'Free 24/7 emergency transport.'),
                ('Community Welfare', 'community-welfare', 'Food drives and welfare programs for families in need.'),
            ]
            for i, (title, slug, desc) in enumerate(services):
                Service.objects.create(
                    title=title, slug=slug, short_description=desc,
                    full_description=desc, order=i, is_active=True, is_featured=True,
                )

        if not AboutSection.objects.exists():
            AboutSection.objects.create(
                section='mission', title='Our Mission',
                content='To deliver compassionate welfare services in education, healthcare, '
                        'and community development that uplift the underprivileged.',
                is_active=True,
            )
            AboutSection.objects.create(
                section='vision', title='Our Vision',
                content='A society where every individual has equal access to education, '
                        'healthcare, and opportunities to thrive with dignity.',
                is_active=True,
            )

        _initialized = True
    except Exception as e:
        print(f'Initialization warning: {e}')


_initialize()

from durrani_welfare_system.wsgi import application as base_app


def app(environ, start_response):
    _initialize()
    return base_app(environ, start_response)
