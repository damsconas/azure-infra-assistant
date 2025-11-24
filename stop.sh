#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping Azure Infrastructure Query System...${NC}"
echo ""

# Check if .pids file exists
if [ ! -f ".pids" ]; then
    echo -e "${RED}❌ No running processes found (.pids file not found)${NC}"
    echo -e "${YELLOW}💡 If processes are still running, you can manually kill them:${NC}"
    echo -e "   - Find processes: lsof -i :3000 -i :5173"
    echo -e "   - Kill process: kill <PID>"
    exit 1
fi

# Read PIDs from file
BACKEND_PID=$(sed -n '1p' .pids)
FRONTEND_PID=$(sed -n '2p' .pids)

# Stop backend
if [ ! -z "$BACKEND_PID" ]; then
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✓${NC} Backend stopped (PID: $BACKEND_PID)"
    else
        echo -e "${YELLOW}⚠️${NC}  Backend process not found (PID: $BACKEND_PID)"
    fi
fi

# Stop frontend
if [ ! -z "$FRONTEND_PID" ]; then
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓${NC} Frontend stopped (PID: $FRONTEND_PID)"
    else
        echo -e "${YELLOW}⚠️${NC}  Frontend process not found (PID: $FRONTEND_PID)"
    fi
fi

# Clean up PID file
rm -f .pids

echo ""
echo -e "${GREEN}✅ Application stopped successfully!${NC}"
echo ""