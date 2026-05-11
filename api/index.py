"""Vercel Python entry point that hands all requests to Django's WSGI."""
import os
import sys

# Make sure the project root is on the path so 'durrani_welfare_system' is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'durrani_welfare_system.settings')

from durrani_welfare_system.wsgi import application as app
