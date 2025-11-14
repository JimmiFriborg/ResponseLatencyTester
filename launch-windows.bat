@echo off
title Hardware Latency Tester - Portable Edition
echo ============================================
echo  Hardware Latency Tester - Portable Edition
echo ============================================
echo.
echo Starting latency tester in your default browser...
echo.

REM Try to open the HTML file in the default browser
start "" "%~dp0latency-tester-portable.html"

echo Latency tester launched!
echo.
echo If the browser didn't open automatically:
echo 1. Open any web browser
echo 2. Drag and drop 'latency-tester-portable.html' into the browser
echo.
echo Press any key to close this window...
pause >nul