#!/bin/bash

# Resume Analyzer - Stop All Services

echo "🛑 Stopping all Resume Analyzer services..."
echo ""

# Kill backend
pkill -f "python3 main.py" && echo "✓ Backend stopped" || echo "⚠ Backend not running"

# Kill frontend
pkill -f "next dev" && echo "✓ Frontend stopped" || echo "⚠ Frontend not running"

echo ""
echo "✅ All services stopped!"
