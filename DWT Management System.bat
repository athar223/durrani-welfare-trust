@echo off
title Durrani Welfare Trust - Management System
cd /d "%~dp0"

:: Check if database exists
if not exist "db.sqlite3" (
    echo  Database not found. Running first-time setup...
    call INSTALL.bat
)

echo.
echo  Starting Durrani Welfare Trust Management System...
echo  Close this window to stop the application.
echo.
python desktop_app.py
pause
