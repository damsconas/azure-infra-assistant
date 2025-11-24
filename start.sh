#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Start backend
echo -e "${YELLOW}🔧 Starting Backend Server...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

if check_port 3000; then
    echo -e "${RED}⚠️  Port 3000 is already in use. Please stop the existing process.${NC}"
    exit 1
fi

# Start backend in background
npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓${NC} Backend started (PID: $BACKEND_PID) on http://localhost:3000"
echo -e "  Logs: backend/backend.log"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 3

# Start frontend
cd ../frontend
echo ""
echo -e "${YELLOW}🎨 Starting Frontend...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

if check_port 5173; then
    echo -e "${RED}⚠️  Port 5173 is already in use. Please stop the existing process.${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Start frontend in background
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓${NC} Frontend started (PID: $FRONTEND_PID) on http://localhost:5173"
echo -e "  Logs: frontend/frontend.log"

# Save PIDs to file for cleanup
cd ..
echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              🎉 Application is Running! 🎉           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Open your browser:${NC} http://localhost:5173"
echo -e "${GREEN}📊 Backend API:${NC}       http://localhost:3000/health"
echo ""
echo -e "${YELLOW}💡 To stop the application:${NC} ./stop.sh"
echo -e "${YELLOW}📝 View logs:${NC}"
echo -e "   - Backend:  tail -f backend/backend.log"
echo -e "   - Frontend: tail -f frontend/frontend.log"
echo ""
echo -e "${GREEN}✨ Happy querying!${NC}"
echo ""

# Keep script running
wait