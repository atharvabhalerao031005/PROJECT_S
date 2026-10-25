# Production Deployment & Operations Guide
## Multimodal Attendance & Engagement Telemetry Platform

This document provides a comprehensive operational guide and production checklist for deploying the Multimodal Attendance & Engagement Telemetry platform across local workstations, Docker containers, and cloud environments (Render, Railway, Fly.io, AWS EC2, and Google Cloud Run).

---

## 1. System Architecture

```
                       +---------------------------------------+
                       |             Client Browser            |
                       | (WebRTC Hardware / Simulated Cameras) |
                       +-------------------+-------------------+
                                           |
                    HTTP / Static Files    |   WebSocket (Frames + Audio)
                    & REST Telemetry       |   /ws/stream
                                           |
                                           v
+---------------------------------------------------------------------------------+
|                       Docker Container / Host (Port 8000)                       |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  |                     FastAPI & Uvicorn Application                         |  |
|  |                                                                           |  |
|  |  +------------------------+  +-----------------------------------------+  |  |
|  |  | StaticFiles SPA Handler|  | REST Endpoints                          |  |  |
|  |  | - / (index.html)       |  | - /api/health                           |  |  |
|  |  | - /assets/*.js, *.css  |  | - /api/attendance                       |  |  |
|  |  | - Single Page Routing  |  | - /api/analytics/trends                 |  |  |
|  |  +------------------------+  | - /api/calibration                      |  |  |
|  |                              | - /api/export/csv                       |  |  |
|  |  +------------------------+  +-----------------------------------------+  |  |
|  |  | WebSocket Engine       |                                               |  |
|  |  | - /ws/stream           |  +-----------------------------------------+  |  |
|  |  | - OpenCV Haar/Centroid |  | Pedagogical AI Agent                    |  |  |
|  |  | - Librosa Audio RMS    |  | - Groq / Gemini Flash / Heuristic Engine|  |  |
|  |  | - Multimodal Fusion    |  +-----------------------------------------+  |  |
|  |  +------------------------+                                               |  |
|  +---------------------------------------------------------------------------+  |
|                                          |                                      |
|                                          v                                      |
|                         +---------------------------------+                     |
|                         |    SQLite / PostgreSQL Store    |                     |
|                         | (attendance_telemetry.db / URL) |                     |
|                         +---------------------------------+                     |
+---------------------------------------------------------------------------------+
```

The unified deployment serves both the compiled React frontend Single Page Application (SPA) and the high-throughput FastAPI/WebSocket backend from a single port (default: `8000`), eliminating CORS issues and simplifying cloud ingress.

---

## 2. Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | Port for Uvicorn HTTP/WebSocket server (injected automatically by Render, Railway, Fly.io). |
| `HOST` | `0.0.0.0` | Bind address for server sockets. |
| `FRONTEND_DIST_DIR` | Auto-detected | Path to the built Vite frontend assets directory (`/app/frontend/dist`). |
| `DATABASE_URL` | `sqlite:///...` | Database connection URL. Defaults to local SQLite file; supports PostgreSQL. |
| `GROQ_API_KEY` | *(Optional)* | API key for high-speed Groq LLaMA-3 pedagogical suggestions. |
| `GEMINI_API_KEY` | *(Optional)* | API key for Google Gemini 2.0 Flash pedagogical recommendations. |
| `PYTHONUNBUFFERED` | `1` | Forces real-time Python stdout/stderr flushing inside Docker containers. |

> **Note:** If neither `GROQ_API_KEY` nor `GEMINI_API_KEY` is set, the system automatically falls back to the deterministic **Offline Heuristic Engine**, remaining 100% operational offline without internet connectivity.

---

## 3. Local One-Click Execution

### Windows Workstation
Double-click `run_app.bat` or run in Command Prompt / PowerShell:
```cmd
# Unified Production Mode (Builds frontend and serves on http://localhost:8000)
run_app.bat

# Dual Development Mode (Backend hot-reload on 8000 + Vite hot-reload on 5173)
run_app.bat --dev
```

### Linux / macOS Workstation
Make executable and launch `run_app.sh`:
```bash
chmod +x run_app.sh

# Unified Production Mode
./run_app.sh

# Dual Development Mode
./run_app.sh --dev
```

---

## 4. Docker Deployment

### Using Docker Compose (Zero Configuration)
The easiest way to build and run the entire stack:
```bash
# Build images and start container in foreground
docker compose up --build

# Run in detached background daemon mode
docker compose up -d --build

# View real-time logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

### Direct Docker CLI Commands
```bash
# 1. Build the multi-stage image
docker build -t attendance-telemetry:latest .

# 2. Run container with dynamic port mapping and environment variables
docker run -d \
  --name attendance-telemetry \
  -p 8000:8000 \
  -e GROQ_API_KEY="" \
  -e GEMINI_API_KEY="" \
  -v telemetry_data:/app/backend \
  attendance-telemetry:latest

# 3. Check health status
curl http://localhost:8000/api/health
```

---

## 5. Cloud Platform Deployment Guides

### A. Deploy to Render (Render.com)

1. **Create Web Service**:
   - Link your GitHub repository.
   - Choose **Docker** as the Environment.
   - Select your branch (e.g., `main`).
2. **Build & Run Settings**:
   - Dockerfile path: `./Dockerfile` (in root).
   - Docker context: `.`
3. **Environment Variables**:
   - `PYTHONUNBUFFERED`: `1`
   - `GROQ_API_KEY`: *(Optional)*
   - `GEMINI_API_KEY`: *(Optional)*
4. **Health Check Path**:
   - Set to `/api/health`.
5. Render automatically injects `PORT` (e.g. `10000`), which `Dockerfile` and `app.py` read dynamically.

---

### B. Deploy to Railway (Railway.app)

1. Click **New Project** -> **Deploy from GitHub repo**.
2. Railway detects the root `Dockerfile` automatically.
3. In **Variables**, add:
   - `PORT`: `8000` (or Railway default)
   - `GROQ_API_KEY`: *(optional)*
   - `GEMINI_API_KEY`: *(optional)*
4. Under **Settings**:
   - Healthcheck Path: `/api/health`
5. Railway provides an automatic HTTPS/WSS public domain.

---

### C. Deploy to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly launch` in the repository root.
3. Configure `fly.toml`:
```toml
app = "multimodal-attendance-telemetry"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[http_service.checks]]
  grace_period = "15s"
  interval = "30s"
  method = "GET"
  path = "/api/health"
  timeout = "5s"
```
4. Deploy with `fly deploy`.

---

### D. Deploy to AWS EC2 (Ubuntu 22.04 / 24.04 LTS)

1. **Launch EC2 Instance**:
   - AMI: Ubuntu Server 24.04 LTS (t3.medium or larger recommended for real-time OpenCV compute).
   - Security Group: Allow Inbound Ports `22` (SSH), `80` (HTTP), `443` (HTTPS), and `8000` (Direct test).
2. **Install Docker on Instance**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
   sudo usermod -aG docker ubuntu
   ```
3. **Clone Repo & Run**:
   ```bash
   git clone <repo-url> telemetry-app
   cd telemetry-app
   docker compose up -d --build
   ```
4. **Nginx Reverse Proxy with Let's Encrypt SSL (Recommended for WebRTC & Camera Access)**:
   > **Important:** Modern web browsers require **HTTPS / WSS** (or `localhost`) to access webcam and microphone hardware devices.
   ```nginx
   server {
       server_name telemetry.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_read_timeout 86400;
           proxy_send_timeout 86400;
       }
   }
   ```
   Obtain free certificate:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d telemetry.yourdomain.com
   ```

---

## 6. Pre-Flight Verification & Production Checklist

Execute this checklist before cutting over production traffic:

- [ ] **Dependencies**: `requirements.txt` contains `fastapi`, `uvicorn[standard]`, `gunicorn`, `aiofiles`, `httpx`, `opencv-python-headless`, and `sqlalchemy`.
- [ ] **Frontend Build**: `npm run build` succeeds cleanly without bundle warnings or broken imports.
- [ ] **Docker Multi-Stage Build**: `docker build -t test-build .` finishes cleanly without root user security warnings.
- [ ] **Health Check Route**: `GET /api/health` returns status `200` with JSON `{"status": "operational", ...}`.
- [ ] **SPA Route Serving**: Navigating to `GET /` serves `index.html` with Content-Type `text/html; charset=utf-8`.
- [ ] **Asset Route Serving**: Static assets `/assets/*.js` and `/assets/*.css` resolve with 200 OK.
- [ ] **WebSocket Connectivity**: WebSocket client connects to `/ws/stream` and exchanges frame payloads.
- [ ] **Audio Fallback**: WebAudio RMS telemetry processes even if raw PCM stream is truncated.
- [ ] **Offline Resilience**: Server starts and functions normally without any external API keys configured.
- [ ] **Data Persistence**: Attendance logs in SQLite DB remain intact when container restarts.
- [ ] **HTTPS / WSS Ingress**: Browser camera/mic permissions require HTTPS when accessed over the public internet.

---

## 7. Troubleshooting & FAQ

### 1. Browser shows "Permission Denied" or camera will not start
- **Cause:** WebRTC `navigator.mediaDevices.getUserMedia` is restricted to secure contexts (`https://` or `http://localhost`).
- **Fix:** If accessing remotely across a LAN or cloud domain, configure SSL/TLS (HTTPS) using Let's Encrypt or Cloudflare.

### 2. OpenCV throws missing library errors on Linux
- **Cause:** Missing native X11 or GL libraries.
- **Fix:** Ensure `opencv-python-headless` (not `opencv-python`) is used in `requirements.txt`, and verify `libgl1`, `libglib2.0-0` are installed via `apt-get` in the Dockerfile.

### 3. WebSocket disconnects after 60 seconds
- **Cause:** Cloud proxy or load balancer idle timeout.
- **Fix:** In Nginx, set `proxy_read_timeout 86400; proxy_send_timeout 86400;`. The client sends frame telemetry every 100ms, maintaining active keepalive.
