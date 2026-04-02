#!/bin/bash

# ══════════════════════════════════════════════════════════════
#  Faculty Research Intelligence Platform — One-Click Launcher
# ══════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend/backend-pro"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║   Faculty Research Intelligence Dashboard Launcher  ║${RESET}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""

# Check MongoDB
echo -e "${YELLOW}▶  Checking MongoDB...${RESET}"
if ! pgrep -x mongod > /dev/null; then
  echo -e "${YELLOW}   MongoDB not running. Starting it...${RESET}"
  sudo systemctl start mongod 2>/dev/null || mongod --fork --logpath /tmp/mongod.log 2>/dev/null
  sleep 2
fi
echo -e "${GREEN}   ✓ MongoDB ready${RESET}"

# Check if backend deps installed
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo -e "${YELLOW}▶  Installing backend dependencies...${RESET}"
  cd "$BACKEND_DIR" && npm install
fi

# Check if frontend deps installed
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo -e "${YELLOW}▶  Installing frontend dependencies...${RESET}"
  cd "$FRONTEND_DIR" && npm install
fi

# Kill any existing processes on our ports
echo -e "${YELLOW}▶  Clearing ports 8001 and 5173...${RESET}"
fuser -k 8001/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
sleep 1

# Start Backend
echo -e "${YELLOW}▶  Starting Backend API (port 8001)...${RESET}"
cd "$BACKEND_DIR"
node server.js > /tmp/backend_faculty.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Check backend started
if curl -s http://localhost:8001/api/stats > /dev/null 2>&1; then
  echo -e "${GREEN}   ✓ Backend running (PID: $BACKEND_PID) → http://localhost:8001${RESET}"
else
  echo -e "${RED}   ✗ Backend failed to start. Check /tmp/backend_faculty.log${RESET}"
fi

# Start Frontend
echo -e "${YELLOW}▶  Starting Frontend Dev Server (port 5173)...${RESET}"
cd "$FRONTEND_DIR"
npm run dev > /tmp/frontend_faculty.log 2>&1 &
FRONTEND_PID=$!
sleep 3

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║              ✅  ALL SYSTEMS ONLINE                  ║${RESET}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${RESET}"
echo -e "${GREEN}║  🌐  Frontend  →  http://localhost:5173              ║${RESET}"
echo -e "${GREEN}║  🔌  Backend   →  http://localhost:8001              ║${RESET}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "${YELLOW}  Press Ctrl+C to stop all services${RESET}"
echo ""

# Trap Ctrl+C to kill both processes
trap "echo ''; echo -e '${RED}  Stopping all services...${RESET}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo -e '${GREEN}  ✓ Done${RESET}'; exit 0" INT

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
