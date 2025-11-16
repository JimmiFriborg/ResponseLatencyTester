#!/usr/bin/env python3
"""
Hardware Latency Tester - Portable Edition
Cross-platform launcher script
"""

import os
import sys
import webbrowser
from pathlib import Path

def main():
    print("=" * 44)
    print(" Hardware Latency Tester - Portable Edition")
    print("=" * 44)
    print()
    
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()

    preferred_files = [
        "latency-tester-v3.8.1.html",
        "latency-tester-v3.8.html",
        "latency-tester-portable.html"
    ]

    html_file = None
    for filename in preferred_files:
        candidate = script_dir / filename
        if candidate.exists():
            html_file = candidate
            break

    if html_file is None:
        print("Error: No latency tester HTML file found!")
        print("Please ensure one of the following files exists in this directory:")
        for filename in preferred_files:
            print(f"  - {filename}")
        input("\nPress Enter to exit...")
        sys.exit(1)

    print("Starting latency tester in your default browser...")
    print()
    
    # Convert to file:// URL
    file_url = html_file.as_uri()
    
    try:
        # Open in default browser
        webbrowser.open(file_url)
        print("✓ Latency tester launched successfully!")
        print()
        print(f"If the browser didn't open, manually navigate to:")
        print(f"  {file_url}")
    except Exception as e:
        print(f"Failed to open browser: {e}")
        print()
        print("Please open the following file manually in your browser:")
        print(f"  {html_file}")
    
    print()
    input("Press Enter to close...")

if __name__ == "__main__":
    main()