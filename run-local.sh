#!/bin/bash
# This script starts a simple local web server to run the budget tracker application.

echo "Starting a local web server for the Budget Tracker..."
echo "You can access the application at: http://localhost:8080"
echo "Press Ctrl+C to stop the server."

# Use npx to run the http-server package without a global installation.
# This serves the contents of the 'budget-tracker-web' directory.
npx http-server ./budget-tracker-web
