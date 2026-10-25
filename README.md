# ATELIER // PRESENCE
## Multimodal Attendance & Engagement Agent ("Slow Morning" Editorial Telemetry Edition)

> *An analog study journal from an architectural studio crossed with a warm 35mm film still.*

An architectural multimodal attendance and classroom cognitive telemetry platform engineered with FastAPI, OpenCV Haar Cascades, temporal sustained presence tracking, Librosa audio signal processing, SQLite WAL persistence, and context-aware pedagogical pacing insights—orchestrated within an Awwwards-caliber editorial interface.

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
│   │   ├── face_detection.py       # OpenCV Haar Cascade + IoU/Centroid sustained presence
│   │   ├── audio_analysis.py       # Librosa + SoundFile/NumPy RMS energy & spectral centroid
│   │   ├── engagement_fusion.py    # Visual + Movement + Audio multimodal fusion engine
│   │   └── ai_agent.py             # Groq / Gemini + 100% offline heuristic pedagogical agent
│   └── database/
│       └── models.py               # SQLAlchemy SQLite models (AttendanceLog, EngagementMetric)
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
│       │   ├── useTelemetrySocket.js # WebSocket client + WebRTC webcam/mic capture
│       │   └── useMagnetic.js        # GSAP quickTo magnetic button physics
│       ├── components/
│       │   ├── CustomCursor.jsx    # Caramel dot + lagging ring
│       │   ├── GrainOverlay.jsx    # Inline SVG feTurbulence 5.5% opacity overlay
│       │   ├── Navbar.jsx          # Hide-on-scroll-down thin editorial nav
│       │   └── svgs/
│       │       ├── HeroParallaxScene.jsx  # 6-layer hand-crafted SVG studio desk scene
│       │       ├── PipelineStepSVGs.jsx   # 4 morphing SVGs for "The Signal Pour"
│       │       ├── TelemetryGlyphs.jsx    # Custom 1.5px stroke vector glyphs
│       │       └── CampusMapSVG.jsx       # Architectural studio floorplan with pulsing sensor pin
│       └── sections/
│           ├── HeroSection.jsx            # Section 1: 6-Layer Parallax + Fluid Headline
│           ├── StoryPhilosophy.jsx        # Section 2: Pinned Italic Manifesto + Rotating Stamp
│           ├── TheSignalPour.jsx          # Section 3: 300vh Pinned 4-Stage Multimodal Pipeline
│           ├── LiveTelemetryDesk.jsx      # Section 4: Inline Live Webcam/Audio Canvas + Ledger
│           ├── EngagementGallery.jsx      # Section 5: Horizontal Pinned Collage of Session Trends
│           ├── InlineConfigAndLogs.jsx    # Section 6: Typographic Schedule + Inline Form + SVG Map
│           └── EditorialFooter.jsx        # Section 7: Cropped Giant Wordmark + Rising Steam SVG
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
- **Display Serif (`font-display`):** `Fraunces, serif` (optical size 72–144, italic accents).
- **Body Sans (`font-sans`):** `Instrument Sans, sans-serif` (16–18px, 1.6 line height).
- **Telemetry Mono (`font-mono`):** `JetBrains Mono, monospace` (coordinates, dB, and leader metrics).

---

## 3. Mathematical Telemetry & Multimodal Fusion

### 3.1 Sustained Temporal Presence (Anti-False-Positive Filter)
Single-frame detections (such as hallway walk-bys or doorway glances) are rejected until tracking duration satisfies:
$$\text{Duration}(T_i) = \sum_{k=1}^{N} \Delta t_k \ge \Theta_{\text{sustained}} \quad (\text{Default } \Theta = 10.0\text{ s})$$

### 3.2 Multimodal Cognitive Equilibrium Formula
The fused engagement metric integrates visual orientation, physical posture motion, and acoustic energy:
$$\text{Fused Score} = 0.45(\text{Visual Attention}) + 0.25(\text{Movement Dynamics}) + 0.30(\text{Acoustic Interaction}) - \text{Inactivity Penalty}$$
- **Visual Attention ($0.45$):** Evaluated from Haar Cascade face aspect-ratio symmetry and bounding-box stability.
- **Movement Dynamics ($0.25$):** Gaussian blurred frame differencing ($\text{mean}(|I_t - I_{t-1}|)$) rewarding subtle organic human motion.
- **Acoustic Interaction ($0.30$):** Librosa spectral centroid and RMS decibel energy within human vocal bands ($-32\text{ dB}$ to $-12\text{ dB}$).
- **Inactivity Penalty:** Progressive penalty applied when stillness exceeds 15 consecutive cycles (cognitive fatigue/zoning out).

---

## 4. Quick Start (Running Backend & Frontend)

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Start the Backend (FastAPI + OpenCV)
```bash
cd backend
python app.py
```
*The backend starts at `http://localhost:8000` with SQLite WAL database auto-initialized.*

### Step 2: Start the Frontend (Vite + GSAP + Lenis)
```bash
cd frontend
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 5. Evaluation & Testing Features

1. **Simulate Classroom Feed (Zero Hardware Required):**
   - Click the **"Simulate Classroom Feed"** button inline inside the Live Telemetry Desk.
   - The backend immediately generates a synthetic studio classroom scene with 3 animated students, running live Haar Cascade detection, corner bracket overlays, 10-second sustained tracking progress, and synthetic audio RMS fluctuations.
2. **Real Hardware Mode:**
   - Click **"Initialize Local Camera & Mic"** to stream your real hardware webcam and microphone through the WebSocket.
3. **Attendance Ledger:**
   - Switch to tab `[B] Attendance Ledger` to view individual participants with Fraunces serif typography, dotted leaders, and floating cursor glyphs.
4. **Pedagogical Agent Stream:**
   - Switch to tab `[C] Pedagogical Agent Notes` to read real-time teaching suggestions tilted at `-1.2deg`.
5. **Inline Calibration & CSV Export:**
   - Scroll to Section 6 to adjust the sustained presence slider in real-time or click **"Export Attendance Ledger (.CSV)"** to stream SQLite logs.

---

## 6. Architecture & Editorial Quality Standards

- [x] **Zero External Icon Libraries:** 100% custom-drawn inline SVGs (`HeroParallaxScene`, `PipelineStepSVGs`, `TelemetryGlyphs`, `CampusMapSVG`).
- [x] **Zero Overlays / Zero Popups:** Every view transition, threshold adjustment, and video stream is rendered strictly inline.
- [x] **Disciplined Visual Chemistry:** Strictly uses `--espresso`, `--roast`, `--mocha`, `--caramel`, `--latte`, `--crema`, `--foam`.
- [x] **100% Offline Capability:** Runs completely offline with deterministic pedagogical heuristic engines when no API keys are present.
