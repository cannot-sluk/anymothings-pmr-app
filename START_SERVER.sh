#!/bin/bash

# AnyMoThings PMR App - Local Server Starter
# This script starts a local web server to test your app

echo "🐾 Starting AnyMoThings PMR App..."
echo ""
echo "📂 Current directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "Please run this script from the raw-cat-diet-app folder"
    echo ""
    echo "Try: cd raw-cat-diet-app && bash START_SERVER.sh"
    exit 1
fi

# Check for Python 3
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo ""
    echo "🚀 Starting server on http://localhost:8000"
    echo ""
    echo "📱 Open your browser and go to:"
    echo "   http://localhost:8000"
    echo ""
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Try to open browser automatically
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sleep 2 && open http://localhost:8000 &
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sleep 2 && xdg-open http://localhost:8000 &
    fi
    
    # Start server
    python3 -m http.server 8000
    
# Check for Python 2
elif command -v python &> /dev/null; then
    echo "✅ Python 2 found"
    echo ""
    echo "🚀 Starting server on http://localhost:8000"
    echo ""
    echo "📱 Open your browser and go to:"
    echo "   http://localhost:8000"
    echo ""
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Try to open browser automatically
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sleep 2 && open http://localhost:8000 &
    fi
    
    # Start server
    python -m SimpleHTTPServer 8000
    
else
    echo "❌ Python not found!"
    echo ""
    echo "Please install Python or use one of these alternatives:"
    echo ""
    echo "Option 1: Double-click index.html (limited features)"
    echo "Option 2: Use VS Code with Live Server extension"
    echo "Option 3: Install Node.js and use: npx http-server"
    echo ""
    exit 1
fi
