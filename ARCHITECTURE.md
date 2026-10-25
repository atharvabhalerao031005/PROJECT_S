# ARCHITECTURAL SPECIFICATION & SYSTEM DESIGN
## Multimodal Attendance & Engagement Agent ("Slow Morning" Editorial Edition)

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
    │  WebAudio Analyser   │  /ws/stream    │  Euclidean Centroid  │
    │  Lenis Smooth Scroll │                │  MediaPipe Head Pose │
    │  GSAP ScrollTrigger  │◀──Annotated───│  Librosa Centroid    │
    │  Custom SVG Render   │   Frame + dB   │  Multimodal Fusion   │
    └──────────────────────┘                └──────────┬───────────┘
                                                       │
                                   ┌───────────────────┴───────────────────┐
                                   ▼                                       ▼
                        ┌──────────────────────┐                ┌──────────────────────┐
                        │  SQLITE WAL DATABASE │                │  PEDAGOGICAL AGENT   │
                        │  (Local Air-Gapped)  │                │  (Decision Support)  │
                        │                      │                │                      │
                        │  attendance_logs     │                │  Gemini 3.5 Flash    │
                        │  engagement_sessions │                │  Groq Llama 3.1 8B   │
                        │  ai_insights         │                │  6-State Offline Mtx │
                        │  Pandas CSV Stream   │                │  10s Throttling Cache│
                        └──────────────────────┘                └──────────────────────┘
```

---

## 1. System Philosophy & Anti-Slop Directive

The **Multimodal Attendance & Engagement Agent** treats classroom, studio, and laboratory intelligence not as a corporate monitoring dashboard, but as a tactile, analog study journal.

* **Computational Sovereignty**: All computer vision, centroid tracking, optical flow, and audio feature extraction happen 100% on-device. Zero raw video frames or facial embeddings are stored or transmitted to external servers.
* **Respect for Human Rhythm**: Natural student behaviors—such as looking down at a notebook, resting, or quiet listening—are modeled with temporal tolerance and low-pass smoothing rather than triggering punitive false alarms.
* **Editorial Aesthetic**: Pure black (`#000000`), pure white (`#FFFFFF`), standard Tailwind slate/indigo, glassmorphic blur cards, and generic icon libraries are forbidden. The design system uses an organic, warm 7-color palette (`espresso`, `roast`, `mocha`, `caramel`, `latte`, `crema`, `foam`) with inline SVG line art and variable serif typography (*Fraunces 144opsz* + *Instrument Sans* + *JetBrains Mono*).

---

## 2. Core Mathematical Formulations

### 2.1 Multi-Face Euclidean Centroid Tracking
Incoming bounding boxes $B_k = (x_k, y_k, w_k, h_k)$ detected by the Haar Cascade classifier are mapped to spatial centroid coordinates:
$$cX_k = x_k + \frac{w_k}{2}, \quad cY_k = y_k + \frac{h_k}{2}$$

For all active tracks $i \in \{1, \dots, M\}$ and incoming detections $j \in \{1, \dots, N\}$, the system computes the pairwise Euclidean distance matrix:
$$D_{i,j} = \sqrt{(cX_{\text{track}, i} - cX_{\text{det}, j})^2 + (cY_{\text{track}, i} - cY_{\text{det}, j})^2}$$

* **Bipartite Assignment**: Tracks are assigned to detections via greedy minimum-distance pairing subject to a maximum distance gating threshold $D_{\max} = 140\text{ px}$.
* **Occlusion Grace Period**: If an active track is unobserved in a frame, its `disappeared_duration` accumulates:
  $$\Delta t_{\text{disappeared}} = t_{\text{curr}} - t_{\text{last\_seen}}$$
  Tracks remain active in memory during brief head turns or book occlusions. Only if $\Delta t_{\text{disappeared}} > 3.0\text{ seconds}$ is the participant deregistered.

### 2.2 Sustained Presence Temporal Verification
To eliminate transient false positives (such as hallway walk-bys through an open door), attendance status follows a strict time-integral state machine:
$$\text{Duration}(T_i) = t_{\text{curr}} - t_{\text{first\_seen}}$$

$$\text{Status}(T_i) = \begin{cases}
\text{"Transient (<3s)"} & \text{if } \text{Duration}(T_i) < 3.0\text{ s} \\
\text{"Verifying..."} & \text{if } 3.0\text{ s} \le \text{Duration}(T_i) < 10.0\text{ s} \\
\text{"Verified Present (>=10s)"} & \text{if } \text{Duration}(T_i) \ge 10.0\text{ s}
\end{cases}$$

Upon crossing $\text{Duration} \ge 10.0\text{ s}$, the participant is automatically committed to the local SQLite `attendance_logs` table.

### 2.3 Head Pose Attention Angle & Cosine Decay
Head pose orientation ($\text{yaw } \theta_y$, $\text{pitch } \theta_p$) is estimated via MediaPipe FaceMesh (with automatic geometric fallback analyzing bounding-box aspect ratio, optical axis center offsets, and horizontal cheek intensity asymmetry).

Attention score decays smoothly via a cosine curve:
$$\text{Score}(\theta) = \begin{cases}
100.0 & \text{if } \theta \le 15^\circ \\
25.0 + 75.0 \times 0.5 \times \left(1 + \cos\left(\pi \times \frac{\theta - 15}{30}\right)\right) & \text{if } 15^\circ < \theta \le 45^\circ \\
25.0 & \text{if } \theta > 45^\circ
\end{cases}$$
where $\theta = \max(|\theta_y|, |\theta_p|)$.

### 2.4 Optical Motion Differencing & Inactivity Engine
Optical motion is calculated inside each face ROI ($64 \times 64$ normalized grayscale) across consecutive frames:
$$\Delta I = |I_t - I_{t-1}|$$
$$\text{Motion Energy} = \frac{1}{W \times H} \sum_{x,y} \mathbb{I}(\Delta I(x,y) > 14)$$

If $\text{Motion Energy} < 0.03$ for continuous duration $t_{\text{still}} > 8.0\text{ s}$, a progressive inactivity penalty is applied:
$$\text{Penalty} = \min\left(25.0, \; 3.5 \times (t_{\text{still}} - 8.0)\right)$$

### 2.5 Acoustic Signal Processing (Librosa + WebAudio)
WebAudio streams raw PCM float samples ($x_1, \dots, x_N$) over WebSocket.
* **RMS Energy**:
  $$\text{RMS} = \sqrt{\frac{1}{N} \sum_{i=1}^N x_i^2}$$
* **Decibels relative to Full Scale (dBFS)**:
  $$\text{dBFS} = 20 \times \log_{10}(\max(\text{RMS}, 10^{-6}))$$
* **Spectral Centroid**:
  $$f_c = \frac{\sum_{k} f_k |X(k)|}{\sum_{k} |X(k)|}$$
* **Speech Formant Qualification**:
  $$\text{is\_speech} = (300\text{ Hz} \le f_c \le 3400\text{ Hz}) \land (\text{dBFS} > -42.0\text{ dBFS})$$
* **16-Band Spectral Equalizer**: Audio magnitudes are binned into 16 logarithmic frequency bands spanning $60\text{ Hz}$ to $9500\text{ Hz}$ (440 Hz Concert A peaks sharply in Bin 4).

### 2.6 Multimodal Cognitive Equilibrium Formula & EMA Smoothing
$$\text{Fused Score}_{\text{raw}} = 0.45 \times \text{Visual Attention} + 0.35 \times \text{Movement Score} + 0.20 \times \text{Acoustic Score} - \text{Inactivity Penalty}$$

To prevent visual jitter, the fused score is smoothed with an Exponential Moving Average ($\alpha = 0.25$):
$$\text{EMA}_t = 0.25 \times \text{Fused Score}_{\text{raw}} + 0.75 \times \text{EMA}_{t-1}$$

A 30-sample rolling buffer evaluates the slope and variance to classify trends:
* **Interactive Peak**: Score $> 85$, active speech, and dynamic acoustics.
* **Steady Classroom Rhythm**: Balanced equilibrium between $65$ and $85$.
* **Attention Drop Detected**: Slope $< -0.3$ or score $< 60$.
* **Reflective Silence**: High visual gaze ($\ge 75\%$), low acoustics ($< 40\%$), and low motion (independent writing/sketching).

---

## 3. Database Architecture & Persistence (SQLite WAL)

The system utilizes SQLite with Write-Ahead Logging (`PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;`) ensuring non-blocking reads and concurrent writes.

```sql
-- Core Attendance Ledger Table
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

-- Granular Multimodal Time-Series Metrics
CREATE TABLE engagement_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(64) INDEX,
    timestamp DATETIME INDEX,
    fused_score FLOAT,
    head_pose_score FLOAT,
    movement_score FLOAT,
    audio_rms_score FLOAT,
    inactivity_penalty FLOAT,
    trend VARCHAR(64),
    active_faces INTEGER
);

-- Pedagogical Agent Advisory Journal
CREATE TABLE ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(64) INDEX,
    timestamp DATETIME INDEX,
    engagement_context VARCHAR(255),
    suggestion_text TEXT,
    pacing_action VARCHAR(128),
    provider VARCHAR(64)
);
```

---

## 4. Rate-Protected Agentic AI Architecture

The `PedagogicalAgent` generates context-aware pacing insights reflecting real classroom dynamics:

```text
[Telemetry Stream] ──▶ [Trend Classifier]
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
     Groq Llama 3.1    Gemini 3.5 Flash   Deterministic
     (max_tokens=120)  (max_tokens=120)   6-State Offline Matrix
            │                │                │
            └────────────────┼────────────────┘
                             ▼
                 [Persist to SQLite & Cache]
```

* **Rate Quota Protection**: Capped at `max_tokens = 120`. Telemetry changes only trigger external API calls if the engagement trend shifts or after a 10.0-second delay. Subsequent calls within the 10s window reuse the cached insight.
* **Deterministic 6-State Matrix**: If external APIs are unavailable or daily quota is exceeded (HTTP 429), the engine automatically falls back to the local matrix with zero latency impact.

---

## 5. API & WebSocket Protocol Contract

| Endpoint | Method | Role | Response |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Operational health check | JSON (`status: "operational"`, `sqlite_wal_enabled: true`) |
| `/api/attendance` | `GET` | Full verified attendance ledger | JSON list sorted by `timestamp desc` |
| `/api/analytics/trends` | `GET` | Aggregated session metrics | JSON (`avg_fused_score`, `peak_active_faces`, etc.) |
| `/api/calibration` | `GET` | Retrieve live sensory rig parameters | JSON (`sustained_threshold`, `vad_sensitivity`, `ai_cadence`) |
| `/api/calibration` | `POST` | Update threshold, VAD floor & cadence | JSON (`sustained_threshold`, `vad_sensitivity`, `ai_cadence`) |
| `/api/export/csv` | `GET` | Live attendance CSV download | RFC 4180 streaming `text/csv` via Pandas |
| `/ws/stream` | `WebSocket`| Full-duplex real-time telemetry | Bidirectional JSON stream at 6–10 FPS |

### WebSocket Payload Specification
* **Client Request Payload**:
  ```json
  {
    "frame": "data:image/jpeg;base64,...",
    "audio_samples": [-0.012, 0.045, 0.082, ...],
    "mic_rms": 0.045,
    "simulate": false
  }
  ```
* **Server Response Payload**:
  ```json
  {
    "annotated_frame": "data:image/jpeg;base64,...",
    "participants": [
      {
        "id": "Participant_01",
        "duration_seconds": 12.4,
        "status": "Verified Present (>=10s)",
        "gaze_state": "Direct Focus",
        "attention_score": 94.2
      }
    ],
    "metrics": {
      "fused_score": 82.5,
      "trend": "Steady Classroom Rhythm",
      "visual_attention": 91.0,
      "audio_score": 78.4,
      "audio_db": -18.2,
      "spectral_centroid_hz": 1240.0,
      "is_speech": true,
      "movement_score": 76.0,
      "inactivity_penalty": 0.0,
      "spectral_bins": [0.12, 0.24, 0.48, 0.85, ...]
    },
    "ai_suggestion": {
      "suggestion": "Cohort demonstrates sustained attention during drafting.",
      "pacing_action": "Introduce Structural Critique",
      "provider": "Gemini (gemini-3.5-flash-lite) (Online)"
    }
  }
  ```
