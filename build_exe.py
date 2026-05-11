"""Build script to create the standalone .exe using PyInstaller."""
import PyInstaller.__main__
import os
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ICO_PATH = os.path.join(BASE_DIR, 'static', 'img', 'logo', 'app_icon.ico')

print("Building Durrani Welfare Trust Desktop Application...")
print("This may take a few minutes...\n")

args = [
    'desktop_app.py',
    '--name=DWT Management System',
    '--onedir',
    '--windowed',
    '--noconfirm',
    '--clean',
    # Add all project data
    f'--add-data={os.path.join(BASE_DIR, "durrani_welfare_system")};durrani_welfare_system',
    f'--add-data={os.path.join(BASE_DIR, "templates")};templates',
    f'--add-data={os.path.join(BASE_DIR, "static")};static',
    f'--add-data={os.path.join(BASE_DIR, "media")};media',
    f'--add-data={os.path.join(BASE_DIR, "manage.py")};.',
    # Hidden imports for Django
    '--hidden-import=django',
    '--hidden-import=django.contrib.admin',
    '--hidden-import=django.contrib.auth',
    '--hidden-import=django.contrib.contenttypes',
    '--hidden-import=django.contrib.sessions',
    '--hidden-import=django.contrib.messages',
    '--hidden-import=django.contrib.staticfiles',
    '--hidden-import=django.contrib.humanize',
    '--hidden-import=django.core.management',
    '--hidden-import=django.core.wsgi',
    '--hidden-import=django.template.backends.django',
    '--hidden-import=django.db.backends.sqlite3',
    '--hidden-import=durrani_welfare_system',
    '--hidden-import=durrani_welfare_system.core',
    '--hidden-import=durrani_welfare_system.core.apps',
    '--hidden-import=durrani_welfare_system.core.models',
    '--hidden-import=durrani_welfare_system.core.views',
    '--hidden-import=durrani_welfare_system.core.urls',
    '--hidden-import=durrani_welfare_system.core.forms',
    '--hidden-import=durrani_welfare_system.core.decorators',
    '--hidden-import=durrani_welfare_system.core.context_processors',
    '--hidden-import=durrani_welfare_system.students',
    '--hidden-import=durrani_welfare_system.students.apps',
    '--hidden-import=durrani_welfare_system.students.models',
    '--hidden-import=durrani_welfare_system.students.views',
    '--hidden-import=durrani_welfare_system.students.urls',
    '--hidden-import=durrani_welfare_system.students.forms',
    '--hidden-import=durrani_welfare_system.staff',
    '--hidden-import=durrani_welfare_system.staff.apps',
    '--hidden-import=durrani_welfare_system.staff.models',
    '--hidden-import=durrani_welfare_system.staff.views',
    '--hidden-import=durrani_welfare_system.staff.urls',
    '--hidden-import=durrani_welfare_system.staff.forms',
    '--hidden-import=durrani_welfare_system.volunteers',
    '--hidden-import=durrani_welfare_system.volunteers.apps',
    '--hidden-import=durrani_welfare_system.volunteers.models',
    '--hidden-import=durrani_welfare_system.volunteers.views',
    '--hidden-import=durrani_welfare_system.volunteers.urls',
    '--hidden-import=durrani_welfare_system.volunteers.forms',
    '--hidden-import=durrani_welfare_system.drivers',
    '--hidden-import=durrani_welfare_system.drivers.apps',
    '--hidden-import=durrani_welfare_system.drivers.models',
    '--hidden-import=durrani_welfare_system.drivers.views',
    '--hidden-import=durrani_welfare_system.drivers.urls',
    '--hidden-import=durrani_welfare_system.drivers.forms',
    '--hidden-import=durrani_welfare_system.ambulance',
    '--hidden-import=durrani_welfare_system.ambulance.apps',
    '--hidden-import=durrani_welfare_system.ambulance.models',
    '--hidden-import=durrani_welfare_system.ambulance.views',
    '--hidden-import=durrani_welfare_system.ambulance.urls',
    '--hidden-import=durrani_welfare_system.ambulance.forms',
    '--hidden-import=durrani_welfare_system.projects',
    '--hidden-import=durrani_welfare_system.projects.apps',
    '--hidden-import=durrani_welfare_system.projects.models',
    '--hidden-import=durrani_welfare_system.projects.views',
    '--hidden-import=durrani_welfare_system.projects.urls',
    '--hidden-import=durrani_welfare_system.projects.forms',
    '--hidden-import=durrani_welfare_system.accounts',
    '--hidden-import=durrani_welfare_system.accounts.apps',
    '--hidden-import=durrani_welfare_system.accounts.models',
    '--hidden-import=durrani_welfare_system.accounts.views',
    '--hidden-import=durrani_welfare_system.accounts.urls',
    '--hidden-import=durrani_welfare_system.accounts.forms',
    '--hidden-import=durrani_welfare_system.daily_expenses',
    '--hidden-import=durrani_welfare_system.daily_expenses.apps',
    '--hidden-import=durrani_welfare_system.daily_expenses.models',
    '--hidden-import=durrani_welfare_system.daily_expenses.views',
    '--hidden-import=durrani_welfare_system.daily_expenses.urls',
    '--hidden-import=durrani_welfare_system.daily_expenses.forms',
    '--hidden-import=durrani_welfare_system.salaries',
    '--hidden-import=durrani_welfare_system.salaries.apps',
    '--hidden-import=durrani_welfare_system.salaries.models',
    '--hidden-import=durrani_welfare_system.salaries.views',
    '--hidden-import=durrani_welfare_system.salaries.urls',
    '--hidden-import=durrani_welfare_system.salaries.forms',
    '--hidden-import=durrani_welfare_system.reports',
    '--hidden-import=durrani_welfare_system.reports.apps',
    '--hidden-import=durrani_welfare_system.reports.views',
    '--hidden-import=durrani_welfare_system.reports.urls',
    '--hidden-import=durrani_welfare_system.settings',
    '--hidden-import=durrani_welfare_system.urls',
    '--hidden-import=durrani_welfare_system.wsgi',
    '--hidden-import=reportlab',
    '--hidden-import=reportlab.lib',
    '--hidden-import=reportlab.platypus',
    '--hidden-import=PIL',
    # PyQt6 - native desktop window
    '--hidden-import=PyQt6',
    '--hidden-import=PyQt6.QtCore',
    '--hidden-import=PyQt6.QtGui',
    '--hidden-import=PyQt6.QtWidgets',
    '--hidden-import=PyQt6.QtWebEngineWidgets',
    '--hidden-import=PyQt6.QtWebEngineCore',
    '--hidden-import=PyQt6.QtNetwork',
    '--hidden-import=PyQt6.QtWebChannel',
    '--hidden-import=PyQt6.QtPositioning',
    '--collect-submodules=PyQt6',
    '--collect-data=PyQt6',
    '--collect-submodules=django',
    '--collect-submodules=reportlab',
    '--collect-data=django',
    '--collect-data=reportlab',
]

# Add icon if available
if os.path.exists(ICO_PATH):
    args.append(f'--icon={ICO_PATH}')

PyInstaller.__main__.run(args)

# Copy migrations to output
dist_dir = os.path.join(BASE_DIR, 'dist', 'DWT Management System')
if os.path.exists(dist_dir):
    print("\nBuild complete!")
    print(f"Output: {dist_dir}")
    print(f"\nRun: {os.path.join(dist_dir, 'DWT Management System.exe')}")
