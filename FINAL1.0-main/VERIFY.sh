#!/bin/bash

echo "🔍 Verifying Integration..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counter
PASSED=0
FAILED=0

# Test 1: Backend health
echo -n "Backend Health: "
if curl -s http://localhost:8000/ | grep -q "running"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 2: Frontend health
echo -n "Frontend Running: "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 3: Files modified
echo -n "resume-analyzer.tsx cleaned up: "
if [ -f /workspaces/FINAL1.0/RESUME-BUILDER2-main/components/analyzer/resume-analyzer.tsx ]; then
    LINES=$(wc -l < /workspaces/FINAL1.0/RESUME-BUILDER2-main/components/analyzer/resume-analyzer.tsx)
    if [ "$LINES" -lt "320" ]; then
        echo -e "${GREEN}✓ PASS (${LINES} lines, reduced from 584)${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL (${LINES} lines)${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ FAIL (file not found)${NC}"
    ((FAILED++))
fi

# Test 4: API route exists
echo -n "API proxy endpoint created: "
if [ -f /workspaces/FINAL1.0/RESUME-BUILDER2-main/app/api/analyzer/route.ts ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 5: Database
echo -n "SQLite database ready: "
if [ -f /workspaces/FINAL1.0/backend/resume_analyzer.db ]; then
    SIZE=$(du -h /workspaces/FINAL1.0/backend/resume_analyzer.db | cut -f1)
    echo -e "${GREEN}✓ PASS (${SIZE})${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Will be created on first use${NC}"
fi

# Test 6: Documentation
echo -n "Documentation files: "
DOC_COUNT=$(ls -1 /workspaces/FINAL1.0/{SUMMARY,INTEGRATION_COMPLETE,README_UPDATED,QUICK_START}.md 2>/dev/null | wc -l)
if [ "$DOC_COUNT" -eq 4 ]; then
    echo -e "${GREEN}✓ PASS (4 files)${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL (${DOC_COUNT}/4 found)${NC}"
    ((FAILED++))
fi

# Test 7: Mock data removed
echo -n "Mock data removed: "
if ! grep -q "mockAnalysis\|Mock analysis" /workspaces/FINAL1.0/RESUME-BUILDER2-main/components/analyzer/resume-analyzer.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ PASS (no mock data found)${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL (mock data still present)${NC}"
    ((FAILED++))
fi

# Test 8: Real API call enabled
echo -n "Real API integration: "
if grep -q "/api/analyzer" /workspaces/FINAL1.0/RESUME-BUILDER2-main/components/analyzer/resume-analyzer.tsx; then
    echo -e "${GREEN}✓ PASS (API call enabled)${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL (API call not found)${NC}"
    ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}${PASSED} PASSED${NC} | ${RED}${FAILED} FAILED${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FAILED" -eq 0 ]; then
    echo -e "\n${GREEN}✅ All checks passed! Integration complete.${NC}"
    echo -e "\n🌐 Access Points:"
    echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
    echo -e "   Analyzer: ${GREEN}http://localhost:3000/analyzer${NC}"
    echo -e "   Backend:  ${GREEN}http://localhost:8000${NC}\n"
    exit 0
else
    echo -e "\n${RED}⚠️  Some checks failed. Please review above.${NC}\n"
    exit 1
fi
