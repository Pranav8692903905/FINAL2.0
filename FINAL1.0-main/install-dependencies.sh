#!/bin/bash

# Resume Analyzer - First Time Setup
# Installs all required dependencies

echo "╔════════════════════════════════════════════════════╗"
echo "║     📦 Installing All Dependencies 📦             ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js
echo -e "${YELLOW}[1/3] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found! Please install Node.js first.${NC}"
    exit 1
fi

# Check Python
echo -e "${YELLOW}[2/3] Checking Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python installed: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}✗ Python not found! Please install Python 3.8+ first.${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Install Backend Dependencies
echo -e "${YELLOW}[3/3] Installing Backend Dependencies (Python)...${NC}"
cd /workspaces/FINAL1.0/backend
if [ -f requirements.txt ]; then
    pip install -q -r requirements.txt
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ requirements.txt not found${NC}"
    exit 1
fi

echo ""

# Install Frontend Dependencies
echo -e "${YELLOW}[3/3] Installing Frontend Dependencies (Node.js)...${NC}"
cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
if [ -f package.json ]; then
    npm install --silent
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ package.json not found${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ ALL DEPENDENCIES INSTALLED!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Next Step: Start the application"
echo ""
echo "   cd /workspaces/FINAL1.0"
echo "   ./start-all.sh"
echo ""
