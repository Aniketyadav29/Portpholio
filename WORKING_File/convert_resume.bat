@echo off
REM Convert Resume Image to PDF - Windows Batch Script
REM This script converts your resume image to PDF automatically

echo.
echo ================================
echo   RESUME CONVERTER
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org
    echo.
    pause
    exit /b 1
)

REM Check if PIL (Pillow) is installed
python -c "from PIL import Image" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo Installing Pillow (required library)...
    pip install pillow --quiet
    echo.
)

REM Run the conversion script
echo Running conversion...
echo.
python convert_resume.py

if %ERRORLEVEL% equ 0 (
    echo.
    echo SUCCESS! Your resume.pdf is ready.
    echo The download button on your portfolio will now work.
    echo.
) else (
    echo.
    echo FAILED! Please check the error above.
    echo.
)

pause
