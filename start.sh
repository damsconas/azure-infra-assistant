#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Cleaning up processes...${NC}"
    if [ -f ".pids" ]; then
        ./stop.sh
    fi
    exit 0
}

# Set trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Azure Infrastructure Query System - Quick Start   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js found: $(node --version)"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Killing existing process on port $port (PID: $pid)${NC}"
        kill $pid 2>/dev/null
        sleep 2
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            kill -9 $pid 2>/dev/null
        fi
    fi
}

# Install root dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
    npm install
fi

# Install all dependencies using the script from package.json
echo -e "${YELLOW}📦 Installing backend and frontend dependencies...${NC}"
npm run install:all

# Check and handle backend port conflict
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use, attempting to free it...${NC}"
    kill_port 3000
fi

# Double check backend port is free
if check_port 3000; then
    echo -e "${RED}❌ Port 3000 is still in use after cleanup attempt.${NC}"
    echo -e "${YELLOW}💡 Please manually stop the process using: lsof -i :3000${NC}"
    exit 1
fi

# Start backend
echo -e "${YELLOW}🔧 Starting Backend Server...${NC}"
cd backend

# Start backend in background
npm start &
BACKEND_PID=$!
echo -e "${GREEN}✓${NC} Backend started (PID: $BACKEND_PID) on http://localhost:3000"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 5

# Verify backend is running
if ! check_port 3000; then
    echo -e "${RED}❌ Backend failed to start on port 3000${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Start frontend
cd ../frontend
echo ""
echo -e "${YELLOW}🎨 Starting Frontend...${NC}"

# Start frontend in background - let Vite choose available port automatically
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓${NC} Frontend started (PID: $FRONTEND_PID)"

# Wait for frontend to be ready
sleep 5

# Frontend URL will be shown in the terminal output
FRONTEND_URL="http://localhost:5173"
echo -e "${GREEN}✓${NC} Frontend should be available shortly (Vite will show the actual URL)"

# Save PIDs to file for cleanup
cd ..
echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              🎉 Application is Running! 🎉           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Open your browser:${NC} $FRONTEND_URL"
echo -e "${GREEN}📊 Backend API:${NC}       http://localhost:3000/health"
echo ""
echo -e "${YELLOW}💡 To stop the application:${NC} ./stop.sh"
echo -e "${YELLOW}📝 View logs in the terminal output above${NC}"
echo ""
echo -e "${GREEN}✨ Happy querying!${NC}"
echo ""

# Keep script running and wait for processes
echo -e "${YELLOW}🔄 Application running. Press Ctrl+C to stop...${NC}"
wait