#!/bin/bash

# Quick Health Check Script for Resume Analyzer
# Tests all major endpoints and features

echo "╔════════════════════════════════════════════════════╗"
echo "║        🔍 Resume Analyzer Health Check 🔍         ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected="$3"
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" 2>&1)
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

# Test 1: Backend Health
test_endpoint "Backend API" "http://localhost:8000/" "running"

# Test 2: Backend Health Endpoint
test_endpoint "Health Endpoint" "http://localhost:8000/api/health" "ok"

# Test 3: Frontend Home
test_endpoint "Frontend Home" "http://localhost:3000/" "<!DOCTYPE html>"

# Test 4: Analyzer Page
test_endpoint "Analyzer Page" "http://localhost:3000/analyzer" "Resume Analyzer"

# Test 5: Builder Page
test_endpoint "Builder Page" "http://localhost:3000/builder" "Resume Builder"

# Test 6: Dashboard Page
test_endpoint "Dashboard" "http://localhost:3000/dashboard" "<!DOCTYPE html>"

# Test 7: API Analyzer Endpoint
echo -n "Testing API Upload Route... "
if [ -f "/workspaces/FINAL2.0/FINAL1.0-main/frontend/Converted_pranav vishwakarma resume.pdf" ]; then
    response=$(curl -s -X POST http://localhost:8000/upload-resume -F "file=@/workspaces/FINAL2.0/FINAL1.0-main/frontend/Converted_pranav vishwakarma resume.pdf" 2>&1)
    if echo "$response" | grep -q "score"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAIL=$((FAIL + 1))
    fi
else
    echo -e "${YELLOW}⊘ SKIP (No test file)${NC}"
fi

# Test 8: Check processes
echo -n "Testing Backend Process... "
if ps aux | grep -q "[p]ython3 main.py"; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "Testing Frontend Process... "
if ps aux | grep -q "[n]ext dev"; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Test 9: Check directories
echo -n "Testing Upload Directory... "
if [ -d "/workspaces/FINAL2.0/FINAL1.0-main/backend/uploaded_resumes" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

echo -n "Testing Photo Upload Directory... "
if [ -d "/workspaces/FINAL2.0/FINAL1.0-main/RESUME-BUILDER2-main/public/uploads" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    FAIL=$((FAIL + 1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "                  TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total:  $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED! System is healthy.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the logs.${NC}"
    exit 1
fi
