@echo off
title Durrani Welfare Trust - First Time Setup
cd /d "%~dp0"
color 0A

echo.
echo  ================================================
echo    Durrani Welfare Trust Management System
echo    First Time Setup
echo  ================================================
echo.
echo  This will install all required dependencies and
echo  set up the database for first use.
echo.
echo  Make sure Python 3.10+ is installed on your PC.
echo.
pause

echo.
echo  [1/4] Installing Python dependencies...
echo  ----------------------------------------
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: Failed to install dependencies.
    echo  Make sure Python and pip are installed correctly.
    pause
    exit /b 1
)

echo.
echo  [2/4] Setting up database...
echo  ----------------------------------------
python manage.py makemigrations core students staff ambulance projects accounts reports volunteers drivers daily_expenses salaries
python manage.py migrate

echo.
echo  [3/4] Creating admin account...
echo  ----------------------------------------
python manage.py shell -c "from durrani_welfare_system.core.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser(username='admin', password='admin123', email='admin@dwtrust.org', first_name='Admin', last_name='User', role='admin', phone='0300-1234567')"

echo.
echo  [4/4] Setup complete!
echo  ================================================
echo.
echo  Default Login:
echo    Username: admin
echo    Password: admin123
echo.
echo  To start the application, double-click:
echo    "DWT Management System.bat"
echo.
echo  ================================================
echo.
pause
