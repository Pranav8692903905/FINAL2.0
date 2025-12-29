#!/bin/bash

# Resume Analyzer - Complete Startup Script
# Single command to start all services

echo "╔════════════════════════════════════════════════════╗"
echo "║     🚀 Starting Resume Analyzer Services 🚀       ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if dependencies are installed
echo -e "${YELLOW}Checking dependencies...${NC}"

# Check backend dependencies
if [ ! -d "/workspaces/FINAL1.0/backend/__pycache__" ] && [ ! -f "/workspaces/FINAL1.0/backend/.dependencies_installed" ]; then
    echo -e "${YELLOW}⚠ Backend dependencies not found!${NC}"
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd /workspaces/FINAL1.0/backend
    pip install -q -r requirements.txt && touch .dependencies_installed
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

# Check frontend dependencies
if [ ! -d "/workspaces/FINAL1.0/RESUME-BUILDER2-main/node_modules" ]; then
    echo -e "${YELLOW}⚠ Frontend dependencies not found!${NC}"
    echo -e "${BLUE}Installing frontend dependencies (this may take a minute)...${NC}"
    cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
    npm install --silent
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi

echo -e "${GREEN}✓ Dependencies check complete${NC}"
echo ""

# Kill any existing processes
echo -e "${YELLOW}[1/5] Stopping existing services...${NC}"
pkill -f "python3 main.py" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

# Start Backend
echo -e "${YELLOW}[2/5] Starting FastAPI Backend...${NC}"
cd /workspaces/FINAL1.0/backend
python3 main.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "   Port: ${BLUE}8000${NC}"
echo ""

# Wait for backend to start
echo -e "${YELLOW}[3/5] Waiting for backend to initialize...${NC}"
sleep 3
if curl -s http://localhost:8000/ | grep -q "running"; then
    echo -e "${GREEN}✓ Backend is ready!${NC}"
else
    echo -e "${RED}⚠ Backend may need more time...${NC}"
fi
echo ""

# Start Frontend
echo -e "${YELLOW}[4/5] Starting Next.js Frontend...${NC}"
cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "   Port: ${BLUE}3000${NC}"
echo ""

# Wait for frontend to start
echo -e "${YELLOW}[5/5] Waiting for frontend to initialize...${NC}"
sleep 5

# Check if frontend is ready
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is ready!${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is starting (takes ~10 seconds)...${NC}"
fi
echo ""

# Show status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ ALL SERVICES STARTED!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Access Points:"
echo -e "   Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "   Analyzer:  ${BLUE}http://localhost:3000/analyzer${NC} 👈 START HERE"
echo -e "   Backend:   ${BLUE}http://localhost:8000${NC}"
echo -e "   Admin:     ${BLUE}http://localhost:8000/admin/stats${NC}"
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📖 View Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Stop All Services:"
echo "   pkill -f 'python3 main.py'; pkill -f 'next dev'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Keep monitoring
echo -e "${YELLOW}Monitoring services... (Press Ctrl+C to stop)${NC}"
echo ""

# Monitor and show status every 10 seconds
while true; do
    sleep 10
    
    # Check backend
    if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${RED}⚠ Backend process stopped!${NC}"
        break
    fi
    
    # Check frontend
    if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${RED}⚠ Frontend process stopped!${NC}"
        break
    fi
    
    # Show status every minute (6 cycles of 10 seconds)
    COUNTER=$((COUNTER + 1))
    if [ $((COUNTER % 6)) -eq 0 ]; then
        echo -e "${GREEN}✓ All services running...${NC} ($(date '+%H:%M:%S'))"
    fi
done
