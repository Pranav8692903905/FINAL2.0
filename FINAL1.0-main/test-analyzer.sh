#!/bin/bash

# Resume Analyzer - Complete Setup & Test Script
# This script verifies the entire analyzer system is working

echo "======================================"
echo "Resume Analyzer - System Status Check"
echo "======================================"
echo ""

# Check Backend
echo "🔍 Checking Backend (FastAPI)..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend: RUNNING on http://localhost:8000"
    curl -s http://localhost:8000/api/health | python3 -m json.tool
else
    echo "❌ Backend: NOT RUNNING"
    echo "   Start with: cd /workspaces/FINAL2.0/FINAL1.0-main/backend && python3 main.py"
fi

echo ""
echo "---"
echo ""

# Check Frontend
echo "🔍 Checking Frontend (Next.js)..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: RUNNING on http://localhost:3000"
    echo "   Analyzer: http://localhost:3000/analyzer"
else
    echo "❌ Frontend: NOT RUNNING"
    echo "   Start with: cd /workspaces/FINAL2.0/FINAL1.0-main/RESUME-BUILDER2-main && npm run dev"
fi

echo ""
echo "---"
echo ""

# Check API Connectivity
echo "🔍 Checking API Proxy..."
if curl -s -X OPTIONS http://localhost:3000/api/analyzer > /dev/null 2>&1; then
    echo "✅ API Proxy: READY"
else
    echo "⚠️  API Proxy: Checking..."
fi

echo ""
echo "======================================"
echo "💡 Next Steps"
echo "======================================"
echo ""
echo "1️⃣  Open Analyzer:"
echo "   http://localhost:3000/analyzer"
echo ""
echo "2️⃣  Upload a PDF resume (< 10MB)"
echo ""
echo "3️⃣  Click 'Analyze Resume Now'"
echo ""
echo "4️⃣  View results and download report"
echo ""
echo "======================================"

