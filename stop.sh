#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 Stopping Azure Infrastructure Query System...${NC}"
echo ""

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Killing process on port $port (PID: $pid)${NC}"
        kill $pid 2>/dev/null
        sleep 2
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            kill -9 $pid 2>/dev/null
            echo -e "${GREEN}✓${NC} Force killed process on port $port"
        fi
    fi
}

# Check if .pids file exists
if [ ! -f ".pids" ]; then
    echo -e "${YELLOW}⚠️  No .pids file found, checking for running processes on ports...${NC}"
    
    # Kill processes on standard ports
    kill_port 3000
    # Frontend port is dynamic, so we don't hardcode it
    
    echo -e "${GREEN}✅ Cleaned up processes on port 3000${NC}"
    echo ""
    exit 0
fi

# Read PIDs from file
BACKEND_PID=$(sed -n '1p' .pids 2>/dev/null)
FRONTEND_PID=$(sed -n '2p' .pids 2>/dev/null)

# Stop backend
if [ ! -z "$BACKEND_PID" ]; then
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}🛑 Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null
        sleep 2
        # Force kill if still running
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            kill -9 $BACKEND_PID 2>/dev/null
            echo -e "${GREEN}✓${NC} Backend force stopped (PID: $BACKEND_PID)"
        else
            echo -e "${GREEN}✓${NC} Backend stopped (PID: $BACKEND_PID)"
        fi
    else
        echo -e "${YELLOW}⚠️  Backend process not found (PID: $BACKEND_PID)${NC}"
    fi
fi

# Stop frontend
if [ ! -z "$FRONTEND_PID" ]; then
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}🛑 Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
        sleep 2
        # Force kill if still running
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill -9 $FRONTEND_PID 2>/dev/null
            echo -e "${GREEN}✓${NC} Frontend force stopped (PID: $FRONTEND_PID)"
        else
            echo -e "${GREEN}✓${NC} Frontend stopped (PID: $FRONTEND_PID)"
        fi
    else
        echo -e "${YELLOW}⚠️  Frontend process not found (PID: $FRONTEND_PID)${NC}"
    fi
fi

# Additional cleanup - kill any remaining processes on backend port
kill_port 3000
# Frontend port is dynamic, so we don't hardcode it

# Clean up PID file
rm -f .pids 2>/dev/null

echo ""
echo -e "${GREEN}✅ Application stopped successfully!${NC}"
echo ""