@echo off
title Durrani Welfare Trust - Build Installer
cd /d "%~dp0"
color 0A

echo.
echo  ================================================
echo    Durrani Welfare Trust Management System
echo    Installer Builder
echo  ================================================
echo.
echo  This will build the Windows installer (.exe).
echo.
echo  Requirements:
echo    - Python 3.10+ with pip
echo    - Inno Setup 6 (https://jrsoftware.org/isdl.php)
echo.
pause

echo.
echo  Installing build dependencies...
pip install pyinstaller pillow reportlab pywebview 2>nul
echo.

python build_installer.py

echo.
pause
