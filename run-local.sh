#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000
WEB_DIR = 'budget-tracker-web'

os.chdir(WEB_DIR)

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving on port {PORT}")
httpd.serve_forever()
