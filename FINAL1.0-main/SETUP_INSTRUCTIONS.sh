#!/bin/bash

# Resume Analyzer - Complete Setup Script
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Resume Analyzer - Integrated Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}[1/4] Checking Python...${NC}"
python3 --version

echo -e "\n${BLUE}[2/4] Installing Python dependencies...${NC}"
cd /workspaces/FINAL1.0/backend
pip install -q -r requirements.txt 2>&1 | grep -v "already satisfied" || echo "Dependencies installed"

echo -e "\n${BLUE}[3/4] Installing Node.js dependencies...${NC}"
cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
npm install -q 2>&1 | tail -1 || echo "Dependencies installed"

echo -e "\n${BLUE}[4/4] Starting services...${NC}"

# Kill any existing processes
pkill -f "python3 main.py" || true
pkill -f "next dev" || true

# Start backend
cd /workspaces/FINAL1.0/backend
echo -e "${GREEN}✓ Starting FastAPI backend...${NC}"
python3 main.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Start frontend
cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
echo -e "${GREEN}✓ Starting Next.js frontend...${NC}"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Verify services
echo -e "\n${BLUE}Verifying services...${NC}"
if curl -s http://localhost:8000/ | grep -q "running"; then
    echo -e "${GREEN}✓ Backend running on http://localhost:8000${NC}"
else
    echo -e "✗ Backend failed to start"
    cat /tmp/backend.log | tail -10
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Frontend running on http://localhost:3000${NC}"
else
    echo -e "✗ Frontend failed to start"
    cat /tmp/frontend.log | tail -10
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n📍 Open in browser: ${BLUE}http://localhost:3000/analyzer${NC}"
echo -e "📊 API Health: ${BLUE}http://localhost:8000${NC}"
echo -e "📋 Admin Stats: ${BLUE}http://localhost:8000/admin/stats${NC}"
echo -e "\n📖 For more details, see: INTEGRATION_COMPLETE.md"
