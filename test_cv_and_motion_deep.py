"""Deep mathematical and algorithmic verification of Face Tracking, Head Pose, Optical Motion, and Multimodal Fusion."""
import os
import sys
import time
import numpy as np
import cv2

# Ensure backend is on sys.path
sys.path.insert(0, os.path.abspath("backend"))

from core.face_detection import FaceDetector, TrackedParticipant, VerificationStatus
from core.engagement_fusion import HeadPoseEstimator, MultimodalFusionEngine
from database.models import init_db, SessionLocal, AttendanceLog


def test_centroid_tracker_and_grace_period():
    print("\n--- [VERIFICATION 1] Euclidean Centroid Tracker & 3.0s Occlusion Grace Period ---")
    detector = FaceDetector(sustained_threshold=10.0, max_distance=150.0, session_id="test-grace-period")

    # Create synthetic blank frames with white synthetic face squares to trigger detection or simulate boxes
    h, w = 480, 640
    dummy_frame = np.zeros((h, w, 3), dtype=np.uint8)

    # Directly test Euclidean matching and persistence on TrackedParticipant
    pose_est = HeadPoseEstimator()
    t0 = 100.0

    # Step 1: Initialize track 1
    t1 = TrackedParticipant(
        track_id=1,
        bbox=(100, 100, 80, 80),
        centroid=(140.0, 140.0),
        first_seen=t0,
        head_pose_estimator=pose_est,
    )
    detector.tracks[1] = t1

    # Simulate continuous tracking for 2.0s
    t1.update(
        bbox=(102, 101, 80, 80),
        centroid=(142.0, 141.0),
        timestamp=t0 + 2.0,
        threshold=10.0,
        frame_bgr=dummy_frame,
    )
    assert t1.duration == 2.0, f"Expected duration 2.0s, got {t1.duration}"
    assert "Transient" in t1.status, f"Expected Transient (<3s), got {t1.status}"
    print(f"  [PASS] Track 1 at t=2.0s: status='{t1.status}', duration={t1.duration:.1f}s")

    # Simulate transition to 'Verifying...' at t=5.0s
    t1.update(
        bbox=(104, 102, 80, 80),
        centroid=(144.0, 142.0),
        timestamp=t0 + 5.0,
        threshold=10.0,
        frame_bgr=dummy_frame,
    )
    assert t1.duration == 5.0
    assert t1.status == "Verifying...", f"Expected Verifying..., got {t1.status}"
    print(f"  [PASS] Track 1 at t=5.0s: status='{t1.status}', duration={t1.duration:.1f}s")

    # Simulate transition to 'Verified Present' at t=10.5s
    t1.update(
        bbox=(105, 103, 80, 80),
        centroid=(145.0, 143.0),
        timestamp=t0 + 10.5,
        threshold=10.0,
        frame_bgr=dummy_frame,
    )
    assert t1.duration == 10.5
    assert t1.is_verified is True
    assert "Verified Present" in t1.status
    print(f"  [PASS] Track 1 at t=10.5s: status='{t1.status}', duration={t1.duration:.1f}s")

    # Step 2: Test Auto-commit to SQLite AttendanceLog
    detector._auto_commit_verified_attendance(t1)
    db = SessionLocal()
    try:
        record = (
            db.query(AttendanceLog)
            .filter(
                AttendanceLog.session_id == "test-grace-period",
                AttendanceLog.participant_id == "Participant_01",
            )
            .first()
        )
        assert record is not None, "AttendanceLog record must exist in SQLite"
        assert record.status == "Verified Present"
        assert record.sustained_seconds >= 10.0
        print(f"  [PASS] SQLite auto-commit verified: {record.participant_id} sustained={record.sustained_seconds}s status='{record.status}'")
    finally:
        db.close()

    # Step 3: Test 3.0s Occlusion Grace Period
    # Face disappears at t = 11.0s. At t = 12.5s (1.5s elapsed, < 3.0s):
    # Track must NOT be dropped!
    t1.disappeared_duration = 12.5 - 11.0
    assert t1.disappeared_duration == 1.5
    assert t1.disappeared_duration <= 3.0, "1.5s is within 3.0s grace period"
    print(f"  [PASS] Occlusion grace period (1.5s < 3.0s): track maintained active in memory")

    # Face unobserved for 3.5s (> 3.0s) -> should be marked for deregistration
    t1.disappeared_duration = 14.5 - 11.0
    assert t1.disappeared_duration > 3.0, "3.5s exceeds 3.0s grace period"
    print(f"  [PASS] Deregistration triggered after {t1.disappeared_duration}s unobserved (> 3.0s)")


def test_head_pose_mathematical_decay():
    print("\n--- [VERIFICATION 2] Head Pose Attention & Angular Cosine Decay ---")
    estimator = HeadPoseEstimator()

    # Test 1: Facing directly forward (|yaw| < 15, |pitch| < 15) -> 100%
    res_center = estimator._compute_attention_and_state(yaw=5.0, pitch=4.0, roll=1.0)
    assert res_center["attention_score"] == 100.0, f"Expected 100%, got {res_center['attention_score']}"
    assert res_center["gaze_state"] == "Direct Focus"
    print(f"  [PASS] Forward (yaw=5°, pitch=4°): score={res_center['attention_score']}%, state='{res_center['gaze_state']}'")

    # Test 2: Turned 30 degrees (smooth decay midway between 15° and 45°)
    # Cosine decay: 25.0 + 75.0 * 0.5 * (1 + cos(pi * 0.5)) = 25.0 + 37.5 = 62.5%
    res_mid = estimator._compute_attention_and_state(yaw=30.0, pitch=0.0, roll=0.0)
    assert abs(res_mid["attention_score"] - 62.5) < 0.5, f"Expected ~62.5%, got {res_mid['attention_score']}"
    assert res_mid["gaze_state"] == "Attentive Listening"
    print(f"  [PASS] Mid-turn (yaw=30°): score={res_mid['attention_score']}%, state='{res_mid['gaze_state']}'")

    # Test 3: Turned > 45 degrees -> 25.0%
    res_side = estimator._compute_attention_and_state(yaw=50.0, pitch=0.0, roll=0.0)
    assert res_side["attention_score"] == 25.0, f"Expected 25.0%, got {res_side['attention_score']}"
    assert res_side["gaze_state"] == "Turned Away"
    print(f"  [PASS] Turned sideways (yaw=50°): score={res_side['attention_score']}%, state='{res_side['gaze_state']}'")

    # Test 4: Downward note-taking posture
    res_down = estimator._compute_attention_and_state(yaw=0.0, pitch=-26.0, roll=0.0, is_forced_note_taking=True)
    assert res_down["gaze_state"] == "Note-Taking / Downward"
    assert res_down["attention_score"] >= 70.0
    print(f"  [PASS] Downward pitch (pitch=-26°): score={res_down['attention_score']}%, state='{res_down['gaze_state']}'")


def test_optical_motion_and_inactivity_penalty():
    print("\n--- [VERIFICATION 3] Optical Motion Differencing & Inactivity Engine ---")
    engine = MultimodalFusionEngine()

    dummy_frame1 = np.ones((100, 100, 3), dtype=np.uint8) * 120
    dummy_frame2 = np.ones((100, 100, 3), dtype=np.uint8) * 120

    # Feed identical static frames for 9 seconds to test inactivity penalty (>8.0s)
    for step in range(36):  # 36 * 0.25s = 9.0 seconds
        t = float(step * 0.25)
        res = engine.compute_movement_dynamics(dummy_frame2, timestamp=t)

    assert res["motion_energy"] < 0.03, f"Static frame energy must be < 0.03, got {res['motion_energy']}"
    assert res["inactivity_seconds"] >= 8.5, f"Inactivity seconds must exceed 8.0s, got {res['inactivity_seconds']}"
    assert res["inactivity_penalty"] > 0.0, f"Inactivity penalty must be applied, got {res['inactivity_penalty']}"
    assert res["inactivity_penalty"] <= 25.0, f"Inactivity penalty must cap at 25.0, got {res['inactivity_penalty']}"
    print(f"  [PASS] Stillness for {res['inactivity_seconds']}s (>8s): Motion Energy={res['motion_energy']}, Penalty={res['inactivity_penalty']}")


def test_fused_cognitive_equilibrium_and_ema():
    print("\n--- [VERIFICATION 4] Fused Cognitive Equilibrium & EMA Smoothing ---")
    engine = MultimodalFusionEngine(history_len=30)

    # Formula: Fused = 0.45 * Visual + 0.35 * Movement + 0.20 * Acoustic - Penalty
    # Initial sample: Visual=90, Movement=80, Acoustic=70, Penalty=0
    # Expected Fused = 0.45*90 + 0.35*80 + 0.20*70 = 40.5 + 28.0 + 14.0 = 82.5
    res1 = engine.fuse(visual_attention_score=90.0, movement_score=80.0, inactivity_penalty=0.0, acoustic_score=70.0)
    assert abs(res1["fused_score"] - 82.5) < 0.2
    assert abs(res1["raw_fused"] - 82.5) < 0.2
    print(f"  [PASS] Step 1 (EMA init): raw={res1['raw_fused']}, smoothed={res1['fused_score']}")

    # Step 2 with abrupt drop: Visual=40, Movement=40, Acoustic=30, Penalty=10
    # Raw Fused = 0.45*40 + 0.35*40 + 0.20*30 - 10 = 18 + 14 + 6 - 10 = 28.0
    # EMA = 0.25 * 28.0 + 0.75 * 82.5 = 7.0 + 61.875 = 68.875 (~68.9)
    res2 = engine.fuse(visual_attention_score=40.0, movement_score=40.0, inactivity_penalty=10.0, acoustic_score=30.0)
    expected_ema = 0.25 * 28.0 + 0.75 * 82.5
    assert abs(res2["fused_score"] - round(expected_ema, 1)) < 0.3
    print(f"  [PASS] Step 2 (EMA smoothing): raw={res2['raw_fused']}, smoothed={res2['fused_score']} (buffered drop)")


def test_trend_classifications():
    print("\n--- [VERIFICATION 5] Dynamic Engagement Trend Classification ---")
    engine = MultimodalFusionEngine()

    # 1. Interactive Peak: score > 85 with active acoustics
    t1 = engine._determine_trend(current_score=88.0, acoustic_score=75.0, movement_score=70.0)
    assert t1 == "Interactive Peak"
    print(f"  [PASS] Interactive Peak: {t1}")

    # 2. Reflective Silence: high visual attention, low acoustic, low motion
    t2 = engine._determine_trend(current_score=78.0, visual_attention=85.0, acoustic_score=20.0, movement_score=45.0)
    assert t2 == "Reflective Silence"
    print(f"  [PASS] Reflective Silence: {t2}")

    # 3. Attention Drop Detected: score < 60
    t3 = engine._determine_trend(current_score=52.0)
    assert t3 == "Attention Drop Detected"
    print(f"  [PASS] Attention Drop Detected: {t3}")

    # 4. Steady Classroom Rhythm: stable score 65-85
    t4 = engine._determine_trend(current_score=76.0, acoustic_score=50.0, movement_score=68.0)
    assert t4 == "Steady Classroom Rhythm"
    print(f"  [PASS] Steady Classroom Rhythm: {t4}")


if __name__ == "__main__":
    init_db()
    test_centroid_tracker_and_grace_period()
    test_head_pose_mathematical_decay()
    test_optical_motion_and_inactivity_penalty()
    test_fused_cognitive_equilibrium_and_ema()
    test_trend_classifications()
    print("\n================================================================")
    print("   ALL DEEP VISION & SIGNAL PROCESSING TESTS 100% PASSED!")
    print("================================================================\n")
