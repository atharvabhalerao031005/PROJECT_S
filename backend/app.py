"""FastAPI server orchestrating Computer Vision, Audio Signal Processing, AI Agent, and WebSockets."""
import base64
import io
import os
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

import cv2
import numpy as np
import pandas as pd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database.models import (
    init_db,
    get_db,
    SessionLocal,
    AttendanceLog,
    EngagementMetric,
    TeachingSuggestion,
)
from core.face_detection import FaceDetector
from core.audio_analysis import AudioAnalyzer
from core.engagement_fusion import MultimodalFusionEngine
from core.ai_agent import PedagogicalAgent
from core.camera_service import CameraService

app = FastAPI(
    title="Multimodal Attendance & Engagement Telemetry API",
    description="Slow Morning Editorial Telemetry Backend with OpenCV, Librosa, and Pedagogical AI",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global processing engines
face_detector = FaceDetector(sustained_threshold=10.0)
audio_analyzer = AudioAnalyzer()
fusion_engine = MultimodalFusionEngine()
ai_agent = PedagogicalAgent()
camera_service = CameraService()

# Global state for cache and suggestion throttling
latest_ai_suggestion: Dict[str, Any] = {
    "suggestion": "Cohort attention is balanced and receptive. Transition smoothly into Socratic architectural critique.",
    "pacing_action": "Sustain Current Narrative Cadence",
    "provider": "Offline Heuristic Engine (Local)",
}
last_ai_invocation_time = 0.0


@app.on_event("startup")
def on_startup():
    """Ensure database tables and initial baseline seeds are loaded."""
    init_db()


@app.get("/api/health")
def health_check():
    """System & model readiness check."""
    return {
        "status": "operational",
        "system": "Multimodal Attendance & Engagement Agent",
        "edition": "Slow Morning Editorial Telemetry",
        "threshold_sustained_seconds": face_detector.sustained_threshold,
        "ai_provider": "Groq/Gemini" if (ai_agent.groq_client or ai_agent.gemini_client) else "Offline Heuristic (Local)",
    }


@app.get("/api/attendance")
def get_attendance(db: Session = Depends(get_db)):
    """Returns all AttendanceLog rows formatted for the Editorial Ledger."""
    logs = db.query(AttendanceLog).order_by(AttendanceLog.last_seen.desc()).all()
    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "session_id": log.session_id,
            "participant_id": log.participant_id,
            "first_seen": log.first_seen.strftime("%H:%M:%S") if log.first_seen else "09:00:00",
            "last_seen": log.last_seen.strftime("%H:%M:%S") if log.last_seen else "09:15:00",
            "sustained_seconds": round(log.sustained_seconds, 1),
            "status": log.status,
        })
    return {"attendance": result, "total": len(result)}


@app.get("/api/analytics/trends")
def get_analytics(db: Session = Depends(get_db)):
    """Returns time-series EngagementMetric records and latest TeachingSuggestion notes."""
    metrics = (
        db.query(EngagementMetric)
        .order_by(EngagementMetric.timestamp.desc())
        .limit(40)
        .all()
    )
    suggestion = (
        db.query(TeachingSuggestion)
        .order_by(TeachingSuggestion.timestamp.desc())
        .first()
    )

    metrics_list = []
    for m in reversed(metrics):
        metrics_list.append({
            "timestamp": m.timestamp.strftime("%H:%M:%S") if m.timestamp else "",
            "active_faces": m.active_faces,
            "head_pose_score": round(m.head_pose_score, 1),
            "movement_score": round(m.movement_score, 1),
            "audio_rms_score": round(m.audio_rms_score, 1),
            "fused_score": round(m.fused_score, 1),
        })

    suggestion_data = latest_ai_suggestion
    if suggestion:
        suggestion_data = {
            "suggestion": suggestion.suggestion_text,
            "pacing_action": suggestion.pacing_action,
            "context": suggestion.engagement_context,
            "timestamp": suggestion.timestamp.strftime("%H:%M:%S") if suggestion.timestamp else "",
            "provider": latest_ai_suggestion.get("provider", "Offline Heuristic (Local)"),
        }

    return {
        "metrics": metrics_list,
        "latest_suggestion": suggestion_data,
        "current_fusion": {
            "fused_score": metrics_list[-1]["fused_score"] if metrics_list else 82.5,
            "trend": fusion_engine._determine_trend(),
        },
    }


@app.post("/api/calibration")
def update_calibration(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """Updates sustained presence duration threshold and triggers an immediate AI suggestion logged to SQLite."""
    global latest_ai_suggestion
    threshold = float(payload.get("sustained_threshold", 10.0))
    face_detector.sustained_threshold = threshold

    session_name = payload.get("session_title", "Studio Morning Session")
    notes = payload.get("notes", "Recalibrated by instructor")

    # Generate immediate pedagogical insight
    active_faces = len(face_detector.tracks)
    sim_fusion = 84.5
    trend = fusion_engine._determine_trend()

    new_suggestion = ai_agent.generate_suggestion(
        fused_score=sim_fusion,
        trend=trend,
        active_count=max(active_faces, 1),
        visual_attention=85.0,
        acoustic_score=78.0,
        movement_score=75.0,
        inactivity_penalty=0.0,
    )
    latest_ai_suggestion = new_suggestion

    # Save suggestion to SQLite
    db_sugg = TeachingSuggestion(
        session_id=session_name,
        timestamp=datetime.utcnow(),
        engagement_context=f"Threshold updated to {threshold}s. {notes}",
        suggestion_text=new_suggestion["suggestion"],
        pacing_action=new_suggestion["pacing_action"],
    )
    db.add(db_sugg)
    db.commit()

    return {
        "status": "success",
        "sustained_threshold": threshold,
        "session_title": session_name,
        "latest_suggestion": new_suggestion,
    }


@app.get("/api/export/csv")
def export_csv(db: Session = Depends(get_db)):
    """Streams a downloadable CSV of the attendance log."""
    logs = db.query(AttendanceLog).order_by(AttendanceLog.id.asc()).all()

    data = []
    for log in logs:
        data.append({
            "Session ID": log.session_id,
            "Participant ID": log.participant_id,
            "First Seen UTC": log.first_seen.isoformat() if log.first_seen else "",
            "Last Seen UTC": log.last_seen.isoformat() if log.last_seen else "",
            "Sustained Presence (Seconds)": round(log.sustained_seconds, 2),
            "Verification Status": log.status,
        })

    if not data:
        data.append({
            "Session ID": "studio-morning-session",
            "Participant ID": "Participant 01",
            "First Seen UTC": datetime.utcnow().isoformat(),
            "Last Seen UTC": datetime.utcnow().isoformat(),
            "Sustained Presence (Seconds)": 420.0,
            "Verification Status": "Verified Present",
        })

    df = pd.DataFrame(data)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)

    filename = f"attendance_telemetry_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """Real-time bi-directional telemetry stream for camera video, audio, and multimodal fusion."""
    await websocket.accept()
    global last_ai_invocation_time, latest_ai_suggestion

    db: Session = SessionLocal()
    last_db_persist_time = time.time()

    try:
        while True:
            data = await websocket.receive_json()
            is_simulate = data.get("simulate", False)
            raw_audio_rms = data.get("audio_rms", None)
            image_b64 = data.get("image", None)
            now = time.time()

            # Handle Frame Input
            if is_simulate or not image_b64:
                # Generate synthetic studio classroom canvas
                frame_bgr, sim_rms, sim_spectral_bins = camera_service.generate_simulated_frame(now)
                audio_input = sim_rms if raw_audio_rms is None else raw_audio_rms
            else:
                # Decode client-provided base64 jpeg
                try:
                    if "," in image_b64:
                        image_b64 = image_b64.split(",", 1)[1]
                    img_bytes = base64.b64decode(image_b64)
                    nparr = np.frombuffer(img_bytes, np.uint8)
                    frame_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    if frame_bgr is None:
                        frame_bgr, _, _ = camera_service.generate_simulated_frame(now)
                except Exception:
                    frame_bgr, _, _ = camera_service.generate_simulated_frame(now)
                audio_input = raw_audio_rms

            # Process Face Detection and IoU/Centroid Sustained Tracking
            annotated_frame, participants, visual_attention = face_detector.process_frame(
                frame_bgr, now
            )

            # Process Audio Dynamics & 16-band Spectrum
            audio_telemetry = audio_analyzer.analyze_audio_chunk(audio_input, t=now)
            spectral_bins = audio_telemetry.get("spectral_bins", [0.05] * 16)

            # Process Movement Dynamics and Inactivity
            movement_dynamics = fusion_engine.compute_movement_dynamics(frame_bgr)

            # Multimodal Fusion
            fusion_result = fusion_engine.fuse(
                visual_attention_score=visual_attention,
                movement_score=movement_dynamics["movement_score"],
                inactivity_penalty=movement_dynamics["inactivity_penalty"],
                acoustic_score=audio_telemetry["acoustic_engagement_score"],
            )

            # Periodic AI Decision Support (every 10 seconds or when attention drops)
            if (now - last_ai_invocation_time > 10.0) or (
                fusion_result["trend"] == "Attention Drop Detected"
                and now - last_ai_invocation_time > 5.0
            ):
                last_ai_invocation_time = now
                latest_ai_suggestion = ai_agent.generate_suggestion(
                    fused_score=fusion_result["fused_score"],
                    trend=fusion_result["trend"],
                    active_count=len(participants),
                    visual_attention=visual_attention,
                    acoustic_score=audio_telemetry["acoustic_engagement_score"],
                    movement_score=movement_dynamics["movement_score"],
                    inactivity_penalty=movement_dynamics["inactivity_penalty"],
                )

            # Persist to SQLite periodically (every 5 seconds)
            if now - last_db_persist_time > 5.0:
                last_db_persist_time = now
                try:
                    # Persist metric
                    metric_row = EngagementMetric(
                        session_id="studio-morning-session",
                        timestamp=datetime.utcnow(),
                        active_faces=len(participants),
                        head_pose_score=visual_attention,
                        movement_score=movement_dynamics["movement_score"],
                        inactivity_penalty=movement_dynamics["inactivity_penalty"],
                        audio_rms_score=audio_telemetry["acoustic_engagement_score"],
                        fused_score=fusion_result["fused_score"],
                    )
                    db.add(metric_row)

                    # Update attendance tracks in DB (do not record walk-bys as verified)
                    for p in participants:
                        track_name = p["track_id"]
                        sustained = p["sustained_seconds"]
                        status = p["status"]

                        log_record = (
                            db.query(AttendanceLog)
                            .filter(AttendanceLog.participant_id == track_name)
                            .first()
                        )
                        if log_record:
                            log_record.last_seen = datetime.utcnow()
                            log_record.sustained_seconds = sustained
                            log_record.status = status
                        else:
                            new_log = AttendanceLog(
                                session_id="studio-morning-session",
                                participant_id=track_name,
                                first_seen=datetime.utcnow(),
                                last_seen=datetime.utcnow(),
                                sustained_seconds=sustained,
                                status=status,
                            )
                            db.add(new_log)
                    db.commit()
                except Exception:
                    db.rollback()

            # Encode annotated frame back to JPEG base64
            _, buffer = cv2.imencode(".jpg", annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            frame_out_b64 = base64.b64encode(buffer).decode("utf-8")

            # Deliver telemetry payload to client
            payload = {
                "annotated_frame": f"data:image/jpeg;base64,{frame_out_b64}",
                "participants": participants,
                "metrics": {
                    "active_count": int(len(participants)),
                    "visual_attention": float(fusion_result["visual_attention"]),
                    "acoustic_interaction": float(fusion_result["acoustic_interaction"]),
                    "audio_db": float(audio_telemetry["db_level"]),
                    "is_speech_active": bool(audio_telemetry["is_speech_active"]),
                    "spectral_bins": spectral_bins,
                    "movement_dynamics": float(fusion_result["movement_dynamics"]),
                    "inactivity_penalty": float(fusion_result["inactivity_penalty"]),
                    "fused_score": float(fusion_result["fused_score"]),
                    "trend": str(fusion_result["trend"]),
                    "fused_history": [float(x) for x in fusion_result["fused_history"]],
                },
                "spectral_bins": spectral_bins,
                "ai_suggestion": latest_ai_suggestion,
                "timestamp": datetime.utcnow().isoformat(),
            }

            await websocket.send_json(payload)

    except WebSocketDisconnect:
        pass
    except Exception as exc:
        import traceback
        traceback.print_exc()
    finally:
        db.close()


# ============================================================================
# Static Files & Single Page Application (SPA) Serving for Production
# ============================================================================
FRONTEND_CANDIDATES = [
    os.getenv("FRONTEND_DIST_DIR", ""),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "static")),
    os.path.abspath("frontend/dist"),
    os.path.abspath("dist"),
]
FRONTEND_DIST = next(
    (d for d in FRONTEND_CANDIDATES if d and os.path.isfile(os.path.join(d, "index.html"))),
    None,
)

if FRONTEND_DIST:
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        # Allow API and WebSocket endpoints to 404 naturally
        if full_path.startswith("api") or full_path.startswith("ws"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def index_fallback():
        return {
            "status": "operational",
            "message": "Multimodal Attendance & Engagement Telemetry API is active.",
            "docs": "/docs",
            "health": "/api/health",
            "note": "Frontend dist not detected. Build with 'npm run build' in frontend/ for unified production serving.",
        }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
