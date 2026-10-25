# ATELIER // PRESENCE
## Multimodal Attendance & Engagement Agent ("Slow Morning" Editorial Telemetry Edition)

> *An analog study journal from an architectural studio crossed with a warm 35mm film still.*

An architectural multimodal attendance and classroom cognitive telemetry platform engineered with **FastAPI**, **OpenCV Haar Cascades**, **Euclidean Centroid Tracking**, **MediaPipe / OpenCV Head Pose Estimation**, **Librosa Audio Signal Processing**, **SQLite WAL persistence**, and **context-aware pedagogical pacing insights**—orchestrated within an Awwwards-caliber editorial interface.

[![Python 3.11](https://img.shields.io/badge/python-3.11-3A2619.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-B8772F.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-6B4630.svg)](https://react.dev/)
[![GSAP 3](https://img.shields.io/badge/GSAP-3-D2AE82.svg)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1C1310.svg)](LICENSE)

---

## 1. System Architecture

```text
multimodal-attendance-agent/
├── backend/
│   ├── app.py                      # FastAPI entry, REST endpoints, WebSocket /ws/stream
│   ├── requirements.txt            # Python dependencies (OpenCV, Librosa, SQLAlchemy, etc.)
│   ├── .env.example                # GROQ_API_KEY, GEMINI_API_KEY (optional)
│   ├── core/
│   │   ├── camera_service.py       # Camera manager + synthetic studio classroom simulation
│   │   ├── face_detection.py       # OpenCV Haar Cascade + Euclidean Centroid Tracker + Sustained Presence
│   │   ├── audio_analysis.py       # Librosa + NumPy RMS energy, dBFS & spectral centroid
│   │   ├── engagement_fusion.py    # MediaPipe Head Pose + Optical Frame Diff + EMA Multimodal Fusion
│   │   └── ai_agent.py             # Groq / Gemini 3.5 Flash + Deterministic 6-State Offline Matrix
│   └── database/
│       └── models.py               # SQLAlchemy SQLite models with WAL mode (AttendanceLog, EngagementSession)
├── frontend/
│   ├── index.html                  # Editorial typography (Fraunces, Instrument Sans, JetBrains Mono)
│   ├── package.json                # React 18, Vite, Tailwind CSS, GSAP 3, Lenis
│   ├── vite.config.js              # Proxy /api and /ws to http://localhost:8000
│   ├── tailwind.config.js          # Strict "Slow Morning" color tokens
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Lenis + GSAP ScrollTrigger master orchestration
│       ├── index.css               # Film grain filter, custom cursor, fluid type scale
│       ├── hooks/
│       │   ├── useTelemetrySocket.js # WebSocket client + WebRTC webcam + WebAudio microphone PCM
│       │   └── useMagnetic.js        # GSAP quickTo magnetic button physics
│       ├── components/
│       │   ├── CustomCursor.jsx    # 0ms instant pointer tracking + precision CAD coordinates + spring reticle
│       │   ├── GrainOverlay.jsx    # Inline SVG feTurbulence 5.5% opacity overlay
│       │   ├── Navbar.jsx          # Dual-theme sticky nav with instant top-hover drop, pin toggle & mobile drawer
│       │   ├── AtelierDialogueGuide.jsx # 5-step floating interactive concierge & walkthrough guide (Keyboard '?')
│       │   ├── AtelierSelect.jsx   # Custom editorial dropdown with rotating brass chevrons & tactile option cards
│       │   ├── AnalogSpectrumVisualizer.jsx # 16-band vintage studio equalizer
│       │   ├── AnalogDialGauge.jsx # Second-order galvanometer needle meters
│       │   └── svgs/
│       │       ├── HeroParallaxScene.jsx  # 6-layer hand-crafted SVG studio desk scene
│       │       ├── PipelineStepSVGs.jsx   # 4 morphing SVGs for "The Signal Pour"
│       │       ├── TelemetryGlyphs.jsx    # Custom 1.5px stroke vector glyphs
│       │       └── CampusMapSVG.jsx       # Architectural studio floorplan with pulsing sensor pin
│       └── sections/
│           ├── HeroSection.jsx            # Section 1: 6-Layer Parallax + Fluid Headline
│           ├── StoryPhilosophy.jsx        # Section 2: Pinned Italic Manifesto + Rotating Stamp
│           ├── TheSignalPour.jsx          # Section 3: 300vh Pinned 4-Stage Multimodal Pipeline
│           ├── LiveTelemetryDesk.jsx      # Section 4: Live Webcam/Audio Canvas + Field Manual + Ledger
│           ├── EngagementGallery.jsx      # Section 5: Horizontal Pinned Session Trends (0px dead space)
│           ├── InlineConfigAndLogs.jsx    # Section 6: Typographic Schedule + Inline Form + SQLite Sync
│           └── EditorialFooter.jsx        # Section 7: Uncropped Grounded Wordmark + Rising Steam SVG
├── test_system_full.py             # Complete End-to-End Automated Verification Suite
├── test_cv_and_motion_deep.py      # Deep CV Centroid & Motion Differencing Verification
├── run_app.bat                     # One-click Windows Production & Dev Launcher
├── run_app.sh                      # One-click Unix/macOS Launcher
├── Dockerfile                      # Multi-stage production container build
├── docker-compose.yml              # Single-command container deployment
├── ARCHITECTURE.md                 # Deep Mathematical & Architectural Specification
└── README.md
```

---

## 2. Design System: "Slow Morning" Editorial Palette

Strictly rejects cyberpunk dashboards, blue gradients, glassmorphism, or generic cards:

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--espresso` | `#1C1310` | Primary deep background & shadow |
| `--roast` | `#3A2619` | Secondary dark surface / dividers |
| `--mocha` | `#6B4630` | Structural borders, dotted leaders & micro labels |
| `--caramel` | `#B8772F` | Single active telemetry accent & live pulses |
| `--latte` | `#D2AE82` | Warm mid-tone illustrations & chart strokes |
| `--crema` | `#EBDCC2` | Secondary light surface & ledger rows |
| `--foam` | `#F7F0E3` | Primary editorial paper background |

### Typography Scale
* **Display Serif (`font-display`):** `Fraunces, serif` (optical size 72–144, italic accents, zero swash cropping).
* **Body Sans (`font-sans`):** `Instrument Sans, sans-serif` (16–18px, 1.6 line height).
* **Telemetry Mono (`font-mono`):** `JetBrains Mono, monospace` (coordinates, dB, and leader metrics).

---

## 3. Mathematical Telemetry & Multimodal Fusion

### 3.1 Multi-Face Euclidean Centroid Tracking
Incoming bounding boxes are converted to centroids $(cX, cY)$. Bipartite matching with distance gating ($D_{\max} = 140\text{px}$) assigns persistent participant IDs (`Participant_01`, `Participant_02`, etc.) with a **3.0-second occlusion grace period**.

### 3.2 Sustained Temporal Presence Verification
Single-frame detections (e.g. hallway walk-bys) are rejected until tracking duration satisfies:
$$\text{Duration}(T_i) \ge \Theta_{\text{sustained}} \quad (\text{Default } \Theta = 10.0\text{ s})$$
Verified participants are automatically committed to the local SQLite database.

### 3.3 Head Pose Attention Angle & Cosine Decay
Calculates yaw $\theta_y$ and pitch $\theta_p$ via MediaPipe FaceMesh / OpenCV geometric fallback. Attention decays via cosine interpolation:
* $100\%$ when looking forward ($|\theta| \le 15^\circ$)
* Smooth decay between $15^\circ$ and $45^\circ$
* $25\%$ when turned sideways ($> 45^\circ$) or looking away

### 3.4 Optical Motion Differencing & Inactivity Engine
Computes frame differencing on standardized $64 \times 64$ face ROIs:
$$\Delta I = |I_t - I_{t-1}|$$
If optical motion remains below threshold for continuous duration $> 8.0\text{s}$, a progressive inactivity penalty (up to 25.0 points) is applied.

### 3.5 Librosa Audio Signal Processing
Extracts real RMS energy, dBFS, and spectral centroid from incoming WebAudio microphone float arrays:
$$\text{is\_speech} = (300\text{ Hz} \le \text{Centroid} \le 3400\text{ Hz}) \land (\text{dBFS} > -42.0\text{ dBFS})$$
FFT magnitude buckets power a 16-band analog spectrum equalizer.

### 3.6 Multimodal Cognitive Equilibrium Formula & EMA Smoothing
$$\text{Fused Score} = 0.45(\text{Visual Attention}) + 0.35(\text{Movement Dynamics}) + 0.20(\text{Acoustic Interaction}) - \text{Inactivity Penalty}$$
Smoothed with an Exponential Moving Average ($\alpha = 0.25$) and classified into rolling trends (*Interactive Peak*, *Steady Classroom Rhythm*, *Attention Drop Detected*, *Reflective Silence*).

---

## 4. Quick Start (Running Locally)

### Option A: One-Click Launcher (Windows)
Double-click `run_app.bat` or run:
```powershell
.\run_app.bat
```
*Automatically creates/activates Python `.venv`, builds the Vite frontend bundle, and launches Uvicorn on `http://localhost:8000` with the browser opened automatically.*

### Option B: Docker Container Deployment
Run via Docker Compose:
```bash
docker compose up --build
```
*Access the unified application at `http://localhost:8000`.*

### Option C: Manual Development Mode
```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend (Hot-Reload)
cd frontend
npm run dev
```

---

## 5. Practical Testing & Operation Walkthrough

1. **Orientation Field Manual**:
   - In Section 4 (*Live Telemetry Desk*), click `[?] Open Field Manual` to review the interactive 3-step guide on optical telemetry, multimodal fusion, and practical testing.
2. **Testing Live Hardware (Webcam + Microphone)**:
   - Click **"Initialize Local Camera & Mic"**.
   - Allow browser camera and microphone permissions.
   - Watch your face lock into `Participant_01 (Verifying...)`.
   - Maintain focus for 10 seconds: the badge turns caramel and marks you `Verified Present (>=10s)`.
   - Turn your head sideways: watch the left Galvanometer gauge dip from 95% to 35%.
   - Speak into your mic: watch the 16-band analog equalizer respond in real-time.
3. **Testing Without Hardware (Synthetic Simulation)**:
   - Click **"Simulate Classroom Feed"**.
   - Generates a synthetic studio classroom scene with 3 animated students displaying organic note-taking posture shifts, peer debate, and walk-by rejection.
4. **Attendance Ledger & CSV Export**:
   - Switch to tab `[B] Attendance Ledger` to inspect verified attendees.
   - Click **"Export Attendance Ledger (.CSV)"** in Section 6 to download live SQLite records via streaming Pandas export.

---

## 6. End-to-End Verification Test Suites

Run the full automated test suite:
```bash
python test_system_full.py
```
Run the deep computer vision and motion test suite:
```bash
python test_cv_and_motion_deep.py
```

All 6 core modules pass with 100% verification:
* `[PASS]` SQLite WAL Mode & Relational Schema
* `[PASS]` Librosa Audio Signal Processing & 16-Band Spectral Analysis
* `[PASS]` Computer Vision Centroid Tracker & Sustained Presence
* `[PASS]` Multimodal Cognitive Equilibrium Formula
* `[PASS]` Dynamic AI Agent with 10s Throttling Cache & Rate Protection
* `[PASS]` FastAPI REST Endpoints, Pandas CSV Export & WebSockets
