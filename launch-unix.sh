#!/bin/bash

# Hardware Latency Tester - Portable Edition Launcher
# Works on Mac and Linux

echo "============================================"
echo " Hardware Latency Tester - Portable Edition"
echo "============================================"
echo ""
echo "Starting latency tester in your default browser..."
echo ""

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PREFERRED_FILES=(
    "latency-tester-v3.8.html"
    "latency-tester-portable.html"
)

HTML_FILE=""
for file in "${PREFERRED_FILES[@]}"; do
    if [ -f "$DIR/$file" ]; then
        HTML_FILE="$DIR/$file"
        break
    fi
done

if [ -z "$HTML_FILE" ]; then
    echo "Error: Could not find a latency tester HTML file."
    echo "Please ensure one of the following files is in this directory:"
    for file in "${PREFERRED_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

# Detect the operating system and open the file accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open > /dev/null; then
        xdg-open "$HTML_FILE"
    elif command -v gnome-open > /dev/null; then
        gnome-open "$HTML_FILE"
    else
        echo "Please open $HTML_FILE manually in your browser"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    open "$HTML_FILE"
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
    # Windows via Cygwin/MSYS
    start "$HTML_FILE"
else
    echo "Unknown OS type: $OSTYPE"
    echo "Please open $HTML_FILE manually in your browser"
fi

echo ""
echo "Latency tester launched!"
echo ""
echo "If the browser didn't open automatically:"
echo "1. Open any web browser"
echo "2. Navigate to: file://$HTML_FILE"
echo ""
echo "Press Enter to close..."
read