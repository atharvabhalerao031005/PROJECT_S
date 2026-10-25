#!/usr/bin/env bash
# ==============================================================================
# Multimodal Attendance & Engagement Telemetry - Unified Unix Launcher
# Compatible with Linux (Ubuntu, Debian, Fedora, Arch) and macOS
# ==============================================================================

set -eo pipefail

# ANSI color codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}==============================================================================${NC}"
echo -e "${CYAN}    Multimodal Attendance & Engagement Telemetry - Unified Launcher          ${NC}"
echo -e "${CYAN}              Slow Morning Editorial Telemetry Platform                       ${NC}"
echo -e "${CYAN}==============================================================================${NC}\n"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Check Python installation
PYTHON_BIN=""
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
elif command -v python &>/dev/null; then
    PYTHON_BIN="python"
else
    echo -e "${RED}[ERROR] Python is not installed. Please install Python 3.11+.${NC}"
    exit 1
fi

PY_VERSION=$($PYTHON_BIN -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo -e "${GREEN}[*] Found Python $PY_VERSION ($PYTHON_BIN)${NC}"

# 2. Check Node.js and npm
if ! command -v npm &>/dev/null; then
    echo -e "${RED}[ERROR] npm is not installed. Please install Node.js (v18+) and npm.${NC}"
    exit 1
fi
echo -e "${GREEN}[*] Found Node.js $(node --version) and npm $(npm --version)${NC}"

# 3. Virtual Environment Setup
VENV_DIR="$SCRIPT_DIR/.venv"
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}[*] Creating virtual environment in $VENV_DIR...${NC}"
    $PYTHON_BIN -m venv "$VENV_DIR"
    echo -e "${GREEN}[*] Virtual environment created successfully.${NC}"
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate"

# 4. Install / Verify Python dependencies
echo -e "${YELLOW}[*] Verifying backend Python dependencies...${NC}"
if ! python -c "import fastapi, uvicorn, cv2, sqlalchemy, aiofiles" &>/dev/null; then
    echo -e "${YELLOW}[*] Installing dependencies from requirements.txt...${NC}"
    pip install --upgrade pip
    pip install -r requirements.txt
    echo -e "${GREEN}[OK] Backend dependencies installed.${NC}"
else
    echo -e "${GREEN}[OK] Backend dependencies satisfied.${NC}"
fi

# 5. Check and build frontend
cd "$SCRIPT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[*] Installing frontend npm dependencies...${NC}"
    npm install
fi

if [ ! -f "dist/index.html" ] || [ "$1" == "--build" ]; then
    echo -e "${YELLOW}[*] Building production frontend bundle with Vite...${NC}"
    npm run build
    echo -e "${GREEN}[OK] Frontend build complete.${NC}"
else
    echo -e "${GREEN}[OK] Production frontend dist found.${NC}"
fi
cd "$SCRIPT_DIR"

# 6. Launch Mode: Dev vs Unified Production
if [ "$1" == "--dev" ]; then
    echo -e "\n${CYAN}==============================================================================${NC}"
    echo -e "${CYAN}[INFO] Starting in DUAL DEVELOPMENT MODE (Hot Reload)${NC}"
    echo -e "${CYAN}       - Backend API:    http://localhost:8000${NC}"
    echo -e "${CYAN}       - Frontend Vite:  http://localhost:5173${NC}"
    echo -e "${CYAN}==============================================================================${NC}\n"

    # Trap to clean up all background jobs on CTRL+C
    trap 'kill 0' SIGINT SIGTERM EXIT

    (cd backend && uvicorn app:app --host 0.0.0.0 --port 8000 --reload) &
    (cd frontend && npm run dev) &

    wait
else
    PORT="${PORT:-8000}"
    echo -e "\n${GREEN}==============================================================================${NC}"
    echo -e "${GREEN}[INFO] Starting Unified Production Telemetry Server on http://localhost:${PORT}${NC}"
    echo -e "${GREEN}       - API Health Endpoint: http://localhost:${PORT}/api/health${NC}"
    echo -e "${GREEN}       - Interactive Docs:    http://localhost:${PORT}/docs${NC}"
    echo -e "${GREEN}       - Full Telemetry UI:   http://localhost:${PORT}/${NC}"
    echo -e "${GREEN}==============================================================================${NC}\n"

    # Try opening browser if desktop environment is detected
    if command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:${PORT}/" &>/dev/null &
    elif command -v open &>/dev/null; then
        open "http://localhost:${PORT}/" &>/dev/null &
    fi

    cd backend
    exec uvicorn app:app --host 0.0.0.0 --port "$PORT"
fi
