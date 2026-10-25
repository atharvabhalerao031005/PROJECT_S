# ATELIER // PRESENCE
### Multimodal Attendance & Cognitive Engagement Telemetry
*An analog study journal engineered for architectural drafting halls, design studios, and lecture environments.*

[![Python 3.11](https://img.shields.io/badge/Python-3.11-3A2619.svg?style=flat-square&logo=python&logoColor=D2AE82)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-B8772F.svg?style=flat-square&logo=fastapi&logoColor=F7F0E3)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.3-6B4630.svg?style=flat-square&logo=react&logoColor=D2AE82)](https://react.dev/)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.10-3A2619.svg?style=flat-square&logo=opencv&logoColor=EBDCC2)](https://opencv.org/)
[![Librosa](https://img.shields.io/badge/Librosa-0.10.2-B8772F.svg?style=flat-square&logo=soundcharts&logoColor=1C1310)](https://librosa.org/)
[![SQLite WAL](https://img.shields.io/badge/SQLite-WAL_Mode-6B4630.svg?style=flat-square&logo=sqlite&logoColor=F7F0E3)](https://www.sqlite.org/wal.html)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-3A2619.svg?style=flat-square&logo=tailwindcss&logoColor=D2AE82)](https://tailwindcss.com/)
[![GSAP 3](https://img.shields.io/badge/GSAP-3.12-D2AE82.svg?style=flat-square&logo=greensock&logoColor=1C1310)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1C1310.svg?style=flat-square)](LICENSE)

---

## 1. Architectural Philosophy & The "Slow Morning" System

Traditional classroom monitoring tools treat education like a panopticon: biometric facial embeddings cataloged into remote clouds, rigid gaze trackers punishing students for looking down at notebooks, and harsh neon SaaS dashboards buzzing with aggressive alert banners.

**ATELIER // PRESENCE** rejects the panopticon entirely. Engineered from the ground up as a tactile, quiet study journal, it approaches classroom observation with the restraint, warmth, and deliberate craft of an architectural atelier.

```
       ┌──────────────────────────────────────────────────────────┐
       │   ATELIER // PRESENCE — MULTIMODAL TELEMETRY TOPOLOGY     │
       └──────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                ▼                                       ▼
     ┌──────────────────────┐                ┌──────────────────────┐
     │  CLIENT VIEWPORT     │                │  FASTAPI CORE        │
     │  (React 18 + Vite)   │                │  (Python 3.11)       │
     │                      │                │                      │
     │  WebRTC Camera       │──WebSocket───▶│  OpenCV Haar Frontal │
     │  WebAudio PCM Stream │  /ws/stream    │  Euclidean Centroid  │
     │  Lenis Smooth Scroll │                │  MediaPipe Head Pose │
     │  GSAP ScrollTrigger  │◀──Annotated───│  Librosa Centroid    │
     │  Bespoke SVG Glyphs  │   Frame + dB   │  Multimodal Fusion   │
     └──────────────────────┘                └──────────┬───────────┘
                                                        │
                                    ┌───────────────────┴───────────────────┐
                                    ▼                                       ▼
                         ┌──────────────────────┐                ┌──────────────────────┐
                         │  SQLITE WAL ENGINE   │                │  PEDAGOGICAL AGENT   │
                         │  (Local Air-Gapped)  │                │  (Decision Support)  │
                         │                      │                │                      │
                         │  attendance_logs     │                │  Gemini 2.5 Flash    │
                         │  engagement_sessions │                │  Groq Llama 3.1 8B   │
                         │  ai_insights         │                │  Deterministic Mtx   │
                         │  Pandas CSV Stream   │                │  10s Rate Cache      │
                         └──────────────────────┘                └──────────────────────┘
```

### 1.1 Zero Biometric Disk Footprint & Privacy by Design
* **Ephemeral In-Memory Processing**: Video frames arriving over the WebSocket stream exist strictly in volatile RAM. They are converted to mathematical centroid coordinates $(cX, cY)$ and optical motion scalars, then discarded immediately upon frame processing.
* **Zero Face Embeddings**: The system stores **no biometric feature vectors, no face crops, and no identity-linked image artifacts** on disk.
* **Local Data Sovereignty**: All telemetry, rolling metrics, and attendance journals reside within an air-gapped local SQLite database running with Write-Ahead Logging (`WAL`). No sensory data is ever piped to third-party tracking services.

### 1.2 "Slow Morning" Espresso Design Tokens
The visual architecture intentionally excludes sterile pure blacks (`#000000`), stark white canvases (`#FFFFFF`), standard Tailwind corporate blues, and generic glassmorphic blur cards. Instead, the interface adopts a 7-tone tactile palette inspired by raw linen drafting paper, dark roast espresso, aged brass indicators, and warm studio morning light:

| Token | Hex | Role | Physical & Cognitive Metaphor |
| :--- | :--- | :--- | :--- |
| `--espresso` | `#1C1310` | Primary Dark Canvas | Deep walnut studio desk, carbon drawing ink |
| `--roast` | `#3A2619` | Secondary Dark Surface | Dark roasted coffee bean, structural card headers |
| `--mocha` | `#6B4630` | Structural Dividers | Aged leather book spine, hairline leader lines |
| `--caramel` | `#B8772F` | Active Telemetry Accent | Honeyed brass caliper, live verified presence indicator |
| `--latte` | `#D2AE82` | Warm Mid-Tones | Raw drafting vellum, galvanometer meter arcs |
| `--crema` | `#EBDCC2` | Secondary Light Surface | Unbleached watercolor paper, ledger table rows |
| `--foam` | `#F7F0E3` | Primary Editorial Paper | Heavy cotton press paper, background field |

### 1.3 Editorial Typographic Hierarchy
* **Display Serif (`font-display`):** `Fraunces, serif` (optical size variable 72–144, italicized accents, deliberate ink traps).
* **Body Sans (`font-sans`):** `Instrument Sans, sans-serif` (16–18px, 1.6 line height, warm humanist grotesk).
* **Telemetry Mono (`font-mono`):** `JetBrains Mono, monospace` (precision coordinates, decibels, frequency bins, and tabular ledger metrics).

---

## 2. Complete Multimodal Mathematical Pipeline

The system synthesizes spatial computer vision, optical motion differencing, and acoustic signal processing into a unified mathematical equilibrium model.

```
+---------------------------------------------------------------------------------------+
|                               MULTIMODAL SENSORY INGESTION                            |
+---------------------------------------------------------------------------------------+
|  [Video Stream]  ──▶  Haar Centroid  ──▶  3.0s Grace   ──▶  10.0s Sustained Threshold |
|  [Head Pose]     ──▶  Yaw & Pitch    ──▶  Cosine Decay ──▶  Gaze Attentiveness Score  |
|  [Frame Diff]    ──▶  Delta I Energy ──▶  Motion Score ──▶  8.0s Inactivity Penalty   |
|  [WebAudio PCM]  ──▶  RMS & dBFS     ──▶  Formant Band ──▶  16-Band Spectral Energy   |
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
                 +---------------------------------------------------+
                 |           FUSED COGNITIVE EQUILIBRIUM             |
                 |   Fused = 0.45 A_vis + 0.35 M_mot + 0.20 S_aud   |
                 |                 - P_inactivity                    |
                 +---------------------------------------------------+
                                           │
                                           ▼
                 +---------------------------------------------------+
                 |         EXPONENTIAL MOVING AVERAGE (EMA)          |
                 |      EMA_t = 0.25 * Fused_t + 0.75 * EMA_{t-1}    |
                 |       30-Sample Rolling Trend Classification      |
                 +---------------------------------------------------+
```

### 2.1 Multi-Face Euclidean Centroid Tracking
Face regions $B_k = (x_k, y_k, w_k, h_k)$ detected via OpenCV Haar Cascade classifiers are reduced to spatial centroid coordinates:

$$cX_k = x_k + \frac{w_k}{2}, \quad cY_k = y_k + \frac{h_k}{2}$$

For all active tracks $i \in \{1, \dots, M\}$ and incoming frame detections $j \in \{1, \dots, N\}$, the engine constructs a pairwise Euclidean distance matrix:

$$D_{i,j} = \sqrt{(cX_{\text{track}, i} - cX_{\text{det}, j})^2 + (cY_{\text{track}, i} - cY_{\text{det}, j})^2}$$

* **Bipartite Gating**: Tracks are assigned to detections using a greedy minimum-distance assignment constrained by spatial gating threshold $D_{\max} = 140\text{ px}$.
* **3.0-Second Occlusion Grace Period**: If an active participant turns their head completely away or drops their chin to write in a sketchbook, their track is not severed. The system accumulates an unobserved duration:
  $$\Delta t_{\text{disappeared}} = t_{\text{curr}} - t_{\text{last\_seen}}$$
  The participant identity remains live in memory while $\Delta t_{\text{disappeared}} \le 3.0\text{ s}$. Only when $\Delta t_{\text{disappeared}} > 3.0\text{ s}$ is the track gracefully deregistered.

### 2.2 Sustained Temporal Presence Verification
To prevent transient corridor walkers, hallway visitors, or momentary doorway pauses from polluting the official attendance ledger, the system implements a time-integral verification state machine:

$$\text{Duration}(T_i) = t_{\text{curr}} - t_{\text{first\_seen}}$$

$$\text{Status}(T_i) = \begin{cases}
\text{"Transient (<3s)"} & \text{if } \text{Duration}(T_i) < 3.0\text{ s} \\
\text{"Verifying..."} & \text{if } 3.0\text{ s} \le \text{Duration}(T_i) < 10.0\text{ s} \\
\text{"Verified Present (>=10s)"} & \text{if } \text{Duration}(T_i) \ge 10.0\text{ s}
\end{cases}$$

Upon satisfying $\text{Duration}(T_i) \ge 10.0\text{ s}$, the participant's verified status is committed to the SQLite `attendance_logs` ledger.

### 2.3 Head-Pose Attention & Cosine Angular Decay
Head orientation angles (yaw $\theta_y$ and pitch $\theta_p$) are evaluated geometrically across facial landmarks and bounding-box proportions. Attentiveness decays according to a cosine transfer function rather than a binary threshold:

$$\theta = \max(|\theta_y|, |\theta_p|)$$

$$\text{Attention}(\theta) = \begin{cases}
100.0 & \text{if } \theta \le 15^\circ \\
25.0 + 37.5 \times \left(1 + \cos\left(\pi \cdot \frac{\theta - 15}{30}\right)\right) & \text{if } 15^\circ < \theta \le 45^\circ \\
25.0 & \text{if } \theta > 45^\circ
\end{cases}$$

* **Direct Focus**: $\theta \le 15^\circ \implies 100\%$ visual attention.
* **Peripheral Focus**: Smooth decay transitioning between $15^\circ$ and $45^\circ$.
* **Side Profile / Turned Away**: Floor of $25\%$ when $\theta > 45^\circ$.
* **Notebook Note-Taking Exemption**: When pitch $\theta_p \in [-35^\circ, -15^\circ]$ with low yaw ($|\theta_y| < 20^\circ$), the state maps to `Note-Taking / Downward Focus` with an elevated baseline ($75\% - 85\%$), honoring analog student work.

### 2.4 Optical Motion Differencing & Progressive Inactivity Engine
Physical classroom engagement is captured by computing absolute frame differencing across consecutive normalized $64 \times 64$ grayscale face ROIs:

$$\Delta I(x, y) = |I_t(x, y) - I_{t-1}(x, y)|$$

$$\text{Motion Energy} = \frac{1}{W \cdot H} \sum_{x=1}^{W} \sum_{y=1}^{H} \mathbb{I}(\Delta I(x, y) > 14)$$

When $\text{Motion Energy} < 0.03$ for continuous stillness duration $t_{\text{still}} > 8.0\text{ s}$, the engine imposes a progressive inactivity penalty:

$$P_{\text{inactivity}} = \begin{cases}
0.0 & \text{if } t_{\text{still}} \le 8.0\text{ s} \\
\min\left(25.0, \; 3.5 \times (t_{\text{still}} - 8.0)\right) & \text{if } t_{\text{still}} > 8.0\text{ s}
\end{cases}$$

This prevents passive, static mannequins or unoccupied chairs from achieving high engagement scores.

### 2.5 Acoustic Signal Analysis (Librosa + WebAudio PCM)
The browser's `AudioContext` and `AnalyserNode` stream uncompressed PCM float arrays ($x_1, \dots, x_N$) directly over the WebSocket. The backend extracts acoustic features in real time:

* **Root Mean Square (RMS) Energy**:
  $$\text{RMS} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} x_i^2}$$

* **Decibels Full Scale (dBFS)**:
  $$\text{dBFS} = 20 \times \log_{10}(\max(\text{RMS}, 10^{-6}))$$

* **Spectral Centroid (Librosa / NumPy FFT)**:
  $$f_c = \frac{\sum_{k} f_k |X(k)|}{\sum_{k} |X(k)|}$$

* **Human Speech Formant Qualification**:
  $$\text{is\_speech} = (300\text{ Hz} \le f_c \le 3400\text{ Hz}) \land (\text{dBFS} > -42.0\text{ dBFS})$$

* **16-Band Logarithmic Studio Equalizer**: FFT frequency bins are mapped into 16 discrete musical bands from $60\text{ Hz}$ to $9500\text{ Hz}$, powering the vintage analog spectrum visualizer:
  * *Sub-Bass & Bass (60–250 Hz)*: Ambient room rumble and resonance.
  * *Speech Fundamental Band (300–3400 Hz)*: Active student questions, critique, and dialogue (Concert A $440\text{ Hz}$ resonates in Bin 4).
  * *Presence & Air (3500–9500 Hz)*: Acoustic sibilance, page turns, drafting pencils.

### 2.6 Fused Cognitive Equilibrium Index & EMA Smoothing
The holistic engagement state fuses visual, physical, and acoustic modalities:

$$\text{Fused}_{\text{raw}} = 0.45 \cdot A_{\text{visual}} + 0.35 \cdot M_{\text{motion}} + 0.20 \cdot S_{\text{audio}} - P_{\text{inactivity}}$$

To eliminate visual meter flicker and high-frequency noise, the score is smoothed with an Exponential Moving Average ($\alpha = 0.25$):

$$\text{EMA}_t = 0.25 \cdot \text{Fused}_{\text{raw}} + 0.75 \cdot \text{EMA}_{t-1}$$

A 30-sample rolling telemetry buffer tracks trend slope ($m$) and variance ($\sigma^2$) to classify organic studio rhythms:

* **Interactive Peak**: $\text{Fused} > 85.0$, active human speech verified within formant band, vibrant acoustics.
* **Steady Classroom Rhythm**: $65.0 \le \text{Fused} \le 85.0$, stable equilibrium during lectures or presentations.
* **Attention Drop Detected**: Slope $m < -0.3$ or $\text{Fused} < 60.0$, indicating cohort fatigue or disengagement.
* **Reflective Silence**: High visual attention ($A_{\text{visual}} \ge 75\%$), low movement, quiet acoustics ($< 40\%$) corresponding to active individual sketching, drafting, or exam focus.

---

## 3. Dynamic Pedagogical AI Agent

Rather than issuing prescriptive commands, the pedagogical agent operates as an experienced studio master offering tactile pacing suggestions to the instructor.

```
[Telemetry Stream] ──▶ [Trend Shift Classifier]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Trend Shift Detected]            [Elapsed >= 10.0s]
            │                                 │
            └────────────────┬────────────────┘
                             ▼
                     [LLM Dispatcher]
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
     Gemini 2.5 Flash   Groq Llama 3.1    Deterministic
     (max_tokens=120)  (max_tokens=120)   6-State Offline Mtx
            │                │                │
            └────────────────┼────────────────┘
                             ▼
                 [Persist to SQLite & Cache]
```

### 3.1 Multi-Tier Model Architecture
1. **Tier 1 — Gemini 2.5 Flash / 3.5 Flash** (`google-genai` SDK): Low-latency contextual pedagogical reasoning.
2. **Tier 2 — Groq Llama 3.1 8B Instant** (`groq` SDK): Sub-300ms ultra-fast inference backup.
3. **Tier 3 — Deterministic 6-State Local Heuristic Engine**: Zero-network, air-gapped rule matrix guaranteeing uninterrupted operation when offline or when API rate limits are encountered.

### 3.2 10-Second Rate Protection Throttling Cache
* **Cadence Gating**: Pedagogical queries are throttled by a calibrated window (default: $10.0\text{ s}$, configurable to $5\text{ s}$ or $30\text{ s}$). Subsequent cycles within this window instantly return the cached insight without issuing external API requests.
* **Trend Change Invalidation**: If the cohort's engagement shifts state (e.g. from *Steady Classroom Rhythm* to *Attention Drop Detected*), the cache is immediately invalidated to provide real-time intervention advice.
* **Token Guardrails**: Strictly bounded at `max_tokens = 120` with structured JSON schema (`{"suggestion": "...", "pacing_action": "..."}`), protecting API quota and eliminating verbose LLM filler.

---

## 4. SQLite WAL Mode Schema & Data Persistence

All persistence is handled locally via SQLite configured with Write-Ahead Logging (`PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;`), providing high-concurrency non-blocking reads during rapid telemetry writes.

### 4.1 Relational Schema Definitions

```sql
-- 1. Verified Participant Attendance Ledger
CREATE TABLE attendance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(64) DEFAULT 'studio-morning-session',
    participant_id VARCHAR(64) INDEX,
    first_seen DATETIME,
    last_seen DATETIME,
    timestamp DATETIME INDEX,
    sustained_seconds FLOAT DEFAULT 0.0,
    status VARCHAR(32) DEFAULT 'Tracking...'
);

-- 2. Granular Multimodal Time-Series Telemetry
CREATE TABLE engagement_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(64) INDEX,
    timestamp DATETIME INDEX,
    active_faces INTEGER DEFAULT 0,
    head_pose_score FLOAT DEFAULT 0.0,
    movement_score FLOAT DEFAULT 0.0,
    inactivity_penalty FLOAT DEFAULT 0.0,
    audio_rms_score FLOAT DEFAULT 0.0,
    fused_score FLOAT DEFAULT 0.0,
    trend VARCHAR(64) DEFAULT 'Steady Plateau'
);

-- 3. Pedagogical Agent Advisory Journal
CREATE TABLE ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(64) INDEX,
    timestamp DATETIME INDEX,
    engagement_context VARCHAR(255),
    suggestion_text VARCHAR(1024),
    pacing_action VARCHAR(128),
    provider VARCHAR(64) DEFAULT 'Offline Heuristic Engine (Local)'
);
```

### 4.2 Streaming RFC 4180 CSV Export
The `/api/export/csv` endpoint queries `attendance_logs` into a `pandas.DataFrame` and returns a formatted RFC 4180 CSV stream with ISO 8601 timestamps and verified sustained duration columns.

---

## 5. Quickstart & Deployment Runbook

### Prerequisites
* **Python 3.11+** installed and available in PATH.
* **Node.js 18+** and **npm** installed.
* Standard webcam and microphone (optional; the application includes a full synthetic studio classroom simulation).

### Option A: Windows One-Click Native (Recommended)
Double-click `run_app.bat` or run in PowerShell:
```powershell
.\run_app.bat
```
*What this automated script executes:*
1. Validates Python 3.11+ and Node.js/NPM environments.
2. Initializes an isolated Python virtual environment (`.venv`).
3. Installs backend dependencies (`fastapi`, `uvicorn`, `opencv-python`, `librosa`, `pandas`, `sqlalchemy`).
4. Installs frontend packages and compiles the optimized Vite production bundle into `frontend/dist/`.
5. Launches FastAPI on `http://localhost:8000` and automatically opens the user's default browser.

### Option B: Unix / macOS Shell Native
Make executable and execute the unified shell script:
```bash
chmod +x run_app.sh
./run_app.sh
```

### Option C: Containerized Production Deployment (Docker Compose)
Launch the multi-stage containerized environment:
```bash
docker compose up --build
```
Access the application at `http://localhost:8000`.

### Option D: Manual Development Mode (Split Terminal)
```bash
# Terminal 1: Backend Server (Port 8000)
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Terminal 2: Frontend Hot-Reload Server (Port 5173)
cd frontend
npm install
npm run dev
```

---

## 6. REST API & WebSocket Protocol Contract

| Endpoint | Method | Protocol | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | HTTP | Verifies operational status, WAL mode, and active AI engine. |
| `/api/attendance` | `GET` | HTTP | Returns all verified participants sorted by `timestamp desc`. |
| `/api/analytics/trends` | `GET` | HTTP | Returns 40-record rolling session metrics and calculated averages. |
| `/api/calibration` | `GET` | HTTP | Reads current sensory rig parameters and active tracks. |
| `/api/calibration` | `POST` | HTTP | Dynamically updates sustained threshold, VAD sensitivity, and cadence. |
| `/api/export/csv` | `GET` | HTTP | Downloads live attendance ledger as an RFC 4180 CSV file. |
| `/ws/stream` | `GET` | WebSocket | High-frequency bidirectional telemetry stream (6–10 FPS). |

### 6.1 Calibration Contract
* **POST `/api/calibration` Request Body**:
  ```json
  {
    "sustained_threshold": 12.0,
    "vad_sensitivity": -36.0,
    "ai_cadence": "10 Seconds (Responsive)",
    "session_title": "Architectural Studio A",
    "notes": "Recalibrated for mid-morning review"
  }
  ```
* **Response**:
  ```json
  {
    "status": "success",
    "sustained_threshold": 12.0,
    "vad_sensitivity": -36.0,
    "ai_cadence_seconds": 10.0,
    "session_title": "Architectural Studio A",
    "latest_suggestion": {
      "suggestion": "Cohort attention is balanced and receptive.",
      "pacing_action": "Sustain Current Narrative Cadence"
    }
  }
  ```

### 6.2 WebSocket Streaming Protocol (`/ws/stream`)

#### Client Ingestion Frame
```json
{
  "frame": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "audio_samples": [-0.0124, 0.0418, 0.0891, 0.0215, -0.0541],
  "audio_rms": 0.038,
  "simulate": false,
  "client_timestamp": 1729864200.125
}
```

#### Server Telemetry Response
```json
{
  "annotated_frame": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "participants": [
    {
      "track_id": "Participant_01",
      "sustained_seconds": 14.2,
      "status": "Verified Present (>=10s)",
      "gaze_state": "Direct Focus",
      "attention_score": 96.5,
      "centroid": [320, 240]
    }
  ],
  "metrics": {
    "active_count": 1,
    "visual_attention": 96.5,
    "acoustic_interaction": 74.2,
    "audio_db": -22.4,
    "is_speech_active": true,
    "movement_dynamics": 68.0,
    "inactivity_penalty": 0.0,
    "fused_score": 83.1,
    "trend": "Steady Classroom Rhythm",
    "fused_history": [80.5, 81.2, 82.0, 83.1],
    "spectral_bins": [0.08, 0.12, 0.28, 0.65, 0.82, 0.44, 0.21, 0.15, 0.09, 0.07, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01]
  },
  "spectral_bins": [0.08, 0.12, 0.28, 0.65, 0.82, 0.44, 0.21, 0.15, 0.09, 0.07, 0.05, 0.04, 0.03, 0.02, 0.02, 0.01],
  "ai_suggestion": {
    "suggestion": "Cohort displays sustained focus during the technical drawing demonstration.",
    "pacing_action": "Introduce Structural Critique Question",
    "provider": "Gemini (gemini-2.5-flash) (Online)"
  },
  "timestamp": "2026-10-25T12:00:00.000Z"
}
```

---

## 7. Project Directory Anatomy

```text
PROJECT_S/
├── backend/
│   ├── app.py                      # FastAPI server, REST routes, WebSocket /ws/stream orchestrator
│   ├── requirements.txt            # Python dependencies (OpenCV, Librosa, SQLAlchemy, etc.)
│   ├── .env.example                # Configuration template (GEMINI_API_KEY, GROQ_API_KEY)
│   ├── core/
│   │   ├── camera_service.py       # Hardware camera capture & synthetic studio simulation generator
│   │   ├── face_detection.py       # OpenCV Haar detection + Euclidean centroid tracker + presence gate
│   │   ├── audio_analysis.py       # Librosa + WebAudio PCM RMS, dBFS & spectral centroid analysis
│   │   ├── engagement_fusion.py    # MediaPipe Head Pose + optical motion differencing + EMA fusion
│   │   ├── ai_agent.py             # Gemini 2.5 Flash / Groq Llama 3.1 + deterministic 6-state matrix
│   │   └── haarcascade_frontalface_default.xml # Standard Haar Cascade model
│   └── database/
│       ├── __init__.py
│       └── models.py               # SQLAlchemy SQLite models with WAL mode (AttendanceLog, EngagementSession, AIInsight)
├── frontend/
│   ├── index.html                  # Editorial layout & typography imports (Fraunces, Instrument Sans, JetBrains Mono)
│   ├── package.json                # React 18, Vite, Tailwind CSS, GSAP 3, Lenis Scroll
│   ├── vite.config.js              # Reverse proxy rules (/api and /ws mapped to localhost:8000)
│   ├── tailwind.config.js          # "Slow Morning" design system color tokens and typography scale
│   └── src/
│       ├── main.jsx                # Application root with ErrorBoundary wrapper
│       ├── App.jsx                 # Lenis smooth scrolling & GSAP ScrollTrigger orchestration
│       ├── index.css               # Editorial styles, analog film grain, fluid typography
│       ├── hooks/
│       │   ├── useTelemetrySocket.js # WebSocket client + WebRTC camera + WebAudio AnalyserNode PCM
│       │   └── useMagnetic.js        # GSAP quickTo magnetic button spring physics
│       ├── components/
│       │   ├── CustomCursor.jsx      # Zero-latency pointer reticle with live CAD coordinate display
│       │   ├── GrainOverlay.jsx      # SVG feTurbulence 5.5% film grain overlay
│       │   ├── Navbar.jsx            # Dual-theme sticky navigation with hover reveal and drawer
│       │   ├── AtelierDialogueGuide.jsx # 5-step floating interactive concierge (Shortcut: '?')
│       │   ├── AtelierSelect.jsx     # Tactile dropdown component with rotating brass chevrons
│       │   ├── AnalogSpectrumVisualizer.jsx # 16-band vintage studio equalizer
│       │   ├── AnalogDialGauge.jsx   # Galvanometer needle gauges for visual and acoustic metrics
│       │   ├── StudioSparkline.jsx   # Micro-trend telemetry SVG sparklines
│       │   └── svgs/
│       │       ├── HeroParallaxScene.jsx  # 6-layer hand-crafted architectural studio scene
│       │       ├── PipelineStepSVGs.jsx   # 4 morphing SVGs for "The Signal Pour"
│       │       ├── TelemetryGlyphs.jsx    # Custom 1.5px stroke vector glyphs
│       │       └── CampusMapSVG.jsx       # Studio floorplan with sensor pin coordinates
│       └── sections/
│           ├── HeroSection.jsx       # Section 1: 6-layer parallax desk scene with fluid headline
│           ├── StoryPhilosophy.jsx   # Section 2: Pinned italic manifesto and rotating stamp
│           ├── TheSignalPour.jsx     # Section 3: 300vh pinned 4-stage multimodal pipeline
│           ├── LiveTelemetryDesk.jsx # Section 4: Live hardware video/audio desk & attendance ledger
│           ├── EngagementGallery.jsx # Section 5: Pinned horizontal session trend visualizer
│           ├── InlineConfigAndLogs.jsx # Section 6: Studio schedule, calibration form, and CSV export
│           └── EditorialFooter.jsx   # Section 7: Grounded architectural wordmark and steam SVG
├── test_system_full.py             # Complete End-to-End automated test suite (6 subsystems)
├── test_cv_and_motion_deep.py      # Deep computer vision, centroid, and motion differencing test suite
├── run_app.bat                     # Windows production launcher and environment bootstrapper
├── run_app.sh                      # Unix/macOS launcher script
├── Dockerfile                      # Multi-stage production container build
├── docker-compose.yml              # Container orchestration specification
├── ARCHITECTURE.md                 # Mathematical and architectural specification document
├── DEPLOYMENT.md                   # Production deployment and security hardening guide
└── README.md
```

---

## 8. Automated Verification & Quality Assurance Suite

The repository contains two independent, deterministic test suites verifying all core mathematical and operational subsystems.

### 8.1 Complete System Verification Suite
Run the full automated test suite:
```bash
python test_system_full.py
```
**Verification Matrix (100% Passed):**
* `[PASS]` **SQLite WAL Mode & Relational Schema**: Confirms WAL pragma activation, table creation, and seed durability.
* `[PASS]` **Librosa Audio Processing & 16-Band Spectral Analysis**: Tests silent baseline, human speech formant qualification ($300\text{--}3400\text{ Hz}$), and FFT magnitude binning.
* `[PASS]` **Computer Vision Centroid Tracker & Sustained Presence**: Confirms 10-second verification trigger and transient walk-by rejection.
* `[PASS]` **Multimodal Cognitive Equilibrium Formula**: Validates fused weight calculation and EMA low-pass filtering.
* `[PASS]` **Dynamic Pedagogical Agent & Throttling Cache**: Verifies 10-second rate-limiting cache hit, trend-change invalidation, and 6-state offline heuristic fallback.
* `[PASS]` **FastAPI REST Endpoints, Pandas CSV Export & WebSockets**: Tests all HTTP endpoints, pandas streaming RFC 4180 CSV export, and WebSocket PCM ingestion.

### 8.2 Deep Vision & Motion Differencing Verification
Run the dedicated computer vision and motion test:
```bash
python test_cv_and_motion_deep.py
```
**Verification Matrix (100% Passed):**
* `[PASS]` **Euclidean Centroid Tracker**: Verifies state transitions (`Transient` $\to$ `Verifying...` $\to$ `Verified Present`), SQLite auto-commit at $\ge 10.0\text{s}$, 3.0s occlusion grace period, and deregistration at $> 3.0\text{s}$.
* `[PASS]` **Head-Pose Attention Cosine Decay**: Validates $100\%$ frontal focus, $62.5\%$ mid-turn, $25\%$ side profile, and note-taking downward gaze exemptions.
* `[PASS]` **Optical Motion Differencing & Inactivity Engine**: Verifies stillness detection and proportional penalty calculation ($P = 3.5 \times (t - 8.0)$).
* `[PASS]` **Fused Equilibrium & EMA Smoothing**: Verifies outlier buffering and trend classification across all 4 classroom states.

---

## 9. Technology Stack

* **Language Runtime**: Python 3.11+, Node.js 18+
* **Backend Framework**: FastAPI 0.115+, Uvicorn (ASGI)
* **Computer Vision**: OpenCV 4.10, Haar Cascade Classifiers, Euclidean Distance Bipartite Matching
* **Acoustic Signal Processing**: Librosa 0.10.2, NumPy FFT, WebAudio API (`AnalyserNode`)
* **Persistence & Data Ingestion**: SQLite 3 (WAL mode), SQLAlchemy 2.0, Pandas 2.2
* **Pedagogical Intelligence**: Google GenAI SDK (Gemini 2.5 Flash / 3.5 Flash), Groq SDK (Llama 3.1 8B Instant), Deterministic Offline Heuristic Engine
* **Frontend Ecosystem**: React 18.3, Vite 5.4, Tailwind CSS 3.4
* **Kinematics & Micro-Interactions**: GSAP 3.12 (ScrollTrigger, quickTo spring physics), Lenis 1.1 Smooth Scroll

---

## 10. License & Colophon

Released under the **MIT License**. Engineered with care by [Atharva Bhalerao](https://github.com/atharvabhalerao031005).

> *"We shape our buildings; thereafter, our buildings shape us."* — Winston Churchill  
> *In an architectural atelier, intelligence should be quiet, tactile, and deeply respectful of the human spirit.*
