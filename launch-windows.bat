@echo off
setlocal enabledelayedexpansion
title Hardware Latency Tester - Portable Edition
echo ============================================
echo  Hardware Latency Tester - Portable Edition
echo ============================================
echo.
echo Starting latency tester in your default browser...
echo.

set "SCRIPT_DIR=%~dp0"
set "HTML_FILE="
set "HTML_NAME="

for %%F in (latency-tester-v3.8.html latency-tester-portable.html) do (
    if exist "%SCRIPT_DIR%%%F" (
        set "HTML_FILE=%SCRIPT_DIR%%%F"
        set "HTML_NAME=%%F"
        goto :launch
    )
)

echo Error: Could not find a latency tester HTML file.
echo Please ensure latency-tester-v3.8.html or latency-tester-portable.html is in this directory.
goto :end

:launch
start "" "%HTML_FILE%"

echo Latency tester launched!
echo.
echo If the browser didn't open automatically:
echo 1. Open any web browser
echo 2. Drag and drop "!HTML_NAME!" into the browser

:end
echo.
echo Press any key to close this window...
pause >nul