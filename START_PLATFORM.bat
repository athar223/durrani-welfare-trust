@echo off
title DWT Platform - Backend + Frontend
color 0A

echo.
echo  ================================================
echo    Durrani Welfare Trust - Web Platform
echo  ================================================
echo.
echo  Starting backend (Django) and frontend (Next.js)
echo  - Backend  : http://localhost:8000
echo  - Frontend : http://localhost:3000
echo  - Admin    : http://localhost:3000/admin/login
echo.
echo  Default login: admin / admin123
echo.
echo  Press Ctrl+C in each window to stop.
echo.

cd /d "%~dp0"

start "DWT Backend" cmd /k "python manage.py runserver"
start "DWT Frontend" cmd /k "cd frontend && npm run dev"

echo  Both servers launching in separate windows...
timeout /t 3 /nobreak >nul
start http://localhost:3000
exit
