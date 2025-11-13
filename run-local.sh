#!/bin/bash
# This script starts a simple local web server to run the budget tracker application using Python.

echo "Starting a local web server for the Budget Tracker..."
echo "You can access the application at: http://localhost:8080"
echo "Press Ctrl+C to stop the server."

# Use Python's built-in HTTP server to avoid dependency on Node.js/npx.
# The --directory flag serves files from the specified directory.
# This is a more reliable method for a Python-focused environment like PyCharm.
python3 -m http.server 8080 --directory ./budget-tracker-web
