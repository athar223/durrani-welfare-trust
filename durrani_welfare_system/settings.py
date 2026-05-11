"""
Django settings for Durrani Welfare Trust Management System.
"""
import os
import sys
from datetime import timedelta
from pathlib import Path

FROZEN = getattr(sys, 'frozen', False)

if FROZEN:
    EXE_DIR = Path(sys.executable).resolve().parent
    INTERNAL_DIR = EXE_DIR / '_internal'
    BASE_DIR = INTERNAL_DIR
    DATA_DIR = Path(os.environ.get('LOCALAPPDATA', os.path.expanduser('~'))) / 'DWT Management System'
    DATA_DIR.mkdir(parents=True, exist_ok=True)
else:
    BASE_DIR = Path(__file__).resolve().parent.parent
    EXE_DIR = BASE_DIR
    INTERNAL_DIR = BASE_DIR
    DATA_DIR = BASE_DIR

SECRET_KEY = os.environ.get('DWT_SECRET_KEY', 'django-insecure-change-this-in-production-dwt-2024-secret-key')

DEBUG = os.environ.get('DWT_DEBUG', '1') == '1'

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    # DWT apps
    'durrani_welfare_system.core',
    'durrani_welfare_system.students',
    'durrani_welfare_system.staff',
    'durrani_welfare_system.ambulance',
    'durrani_welfare_system.projects',
    'durrani_welfare_system.accounts',
    'durrani_welfare_system.reports',
    'durrani_welfare_system.volunteers',
    'durrani_welfare_system.drivers',
    'durrani_welfare_system.daily_expenses',
    'durrani_welfare_system.salaries',
    'durrani_welfare_system.cms',
    'durrani_welfare_system.api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'durrani_welfare_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [str(INTERNAL_DIR / 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'durrani_welfare_system.core.context_processors.global_context',
            ],
        },
    },
]

WSGI_APPLICATION = 'durrani_welfare_system.wsgi.application'

# Database - DATABASE_URL (Railway/Render) > DWT_DB_ENGINE > SQLite
DATABASE_URL = os.environ.get('DATABASE_URL', '')

if DATABASE_URL:
    import dj_database_url
    DATABASES = {'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)}
elif os.environ.get('DWT_DB_ENGINE', '').lower() == 'postgres':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DWT_DB_NAME', 'dwt_db'),
            'USER': os.environ.get('DWT_DB_USER', 'dwt_user'),
            'PASSWORD': os.environ.get('DWT_DB_PASSWORD', ''),
            'HOST': os.environ.get('DWT_DB_HOST', 'localhost'),
            'PORT': os.environ.get('DWT_DB_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': DATA_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Karachi'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [str(INTERNAL_DIR / 'static')]
STATIC_ROOT = str(EXE_DIR / 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = str(DATA_DIR / 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login/'

AUTH_USER_MODEL = 'core.User'

BACKUP_DIR = DATA_DIR / 'backups'

# ============================================================
# Django REST Framework
# ============================================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=12),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ============================================================
# CORS - allow Next.js frontend
# ============================================================
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_CREDENTIALS = True

# Allow all origins in DEBUG (dev convenience)
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
