"""Real-time multimodal engagement fusion, 3D head pose estimation, optical motion energy, and dynamic trend classification."""
from typing import Dict, Any, List, Optional, Tuple
from collections import deque
import math
import time
import cv2
import numpy as np


class HeadPoseEstimator:
    """Estimates 3D head pose (yaw, pitch, roll) and gaze attention score.
    
    Attempts MediaPipe 3D landmark mesh solvePnP; falls back automatically to
    a robust mathematical OpenCV geometric symmetry and optical axis estimator.
    """

    def __init__(self):
        self.use_mediapipe = False
        self.face_mesh = None
        self._init_mediapipe()

        # 3D canonical facial model points in mm for solvePnP
        self.model_points = np.array([
            (0.0, 0.0, 0.0),          # Nose tip (Landmark 1)
            (0.0, -330.0, -65.0),     # Chin (Landmark 152)
            (-225.0, 170.0, -135.0),  # Left eye outer corner (Landmark 33)
            (225.0, 170.0, -135.0),   # Right eye outer corner (Landmark 263)
            (-150.0, -150.0, -125.0), # Left mouth corner (Landmark 61)
            (150.0, -150.0, -125.0),  # Right mouth corner (Landmark 291)
        ], dtype=np.float64)

    def _init_mediapipe(self) -> None:
        """Attempts to initialize MediaPipe FaceMesh."""
        try:
            import mediapipe as mp
            if hasattr(mp, "solutions") and hasattr(mp.solutions, "face_mesh"):
                self.face_mesh = mp.solutions.face_mesh.FaceMesh(
                    static_image_mode=False,
                    max_num_faces=4,
                    refine_landmarks=True,
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5,
                )
                self.use_mediapipe = True
        except Exception:
            self.use_mediapipe = False
            self.face_mesh = None

    def estimate(
        self,
        frame_bgr: np.ndarray,
        bbox: Tuple[int, int, int, int],
        gray_roi: Optional[np.ndarray] = None,
        dy: float = 0.0,
    ) -> Dict[str, Any]:
        """Calculates yaw, pitch, roll, gaze state, and head pose attention score.

        Attention Score:
        - 100% when facing forward (|yaw| < 15 deg, |pitch| < 15 deg)
        - Smooth cosine decay down to 25% when turned sideways (>45 deg) or steeply up/down.
        """
        h_img, w_img = frame_bgr.shape[:2]
        x, y, w, h = bbox

        # Attempt MediaPipe solvePnP if available
        if self.use_mediapipe and self.face_mesh is not None:
            try:
                rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
                results = self.face_mesh.process(rgb)
                if results and results.multi_face_landmarks:
                    # Select face closest to bbox centroid
                    cx_box, cy_box = x + w / 2.0, y + h / 2.0
                    best_landmarks = None
                    best_dist = float("inf")
                    for fl in results.multi_face_landmarks:
                        nose = fl.landmark[1]
                        dist = np.hypot(nose.x * w_img - cx_box, nose.y * h_img - cy_box)
                        if dist < best_dist:
                            best_dist = dist
                            best_landmarks = fl

                    if best_landmarks is not None and best_dist < max(w, h):
                        lm = best_landmarks.landmark
                        image_points = np.array([
                            (lm[1].x * w_img, lm[1].y * h_img),     # Nose tip
                            (lm[152].x * w_img, lm[152].y * h_img), # Chin
                            (lm[33].x * w_img, lm[33].y * h_img),   # Left eye corner
                            (lm[263].x * w_img, lm[263].y * h_img), # Right eye corner
                            (lm[61].x * w_img, lm[61].y * h_img),   # Left mouth
                            (lm[291].x * w_img, lm[291].y * h_img), # Right mouth
                        ], dtype=np.float64)

                        focal_length = w_img
                        center = (w_img / 2.0, h_img / 2.0)
                        camera_matrix = np.array([
                            [focal_length, 0, center[0]],
                            [0, focal_length, center[1]],
                            [0, 0, 1]
                        ], dtype=np.float64)
                        dist_coeffs = np.zeros((4, 1), dtype=np.float64)

                        success, rvec, tvec = cv2.solvePnP(
                            self.model_points,
                            image_points,
                            camera_matrix,
                            dist_coeffs,
                            flags=cv2.SOLVEPNP_ITERATIVE,
                        )
                        if success:
                            rmat, _ = cv2.Rodrigues(rvec)
                            angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
                            pitch, yaw, roll = angles[0], angles[1], angles[2]
                            return self._compute_attention_and_state(yaw, pitch, roll)
            except Exception:
                pass

        # Robust Mathematical OpenCV Fallback
        return self._estimate_opencv_fallback(h_img, w_img, bbox, gray_roi, dy)

    def _estimate_opencv_fallback(
        self,
        h_img: int,
        w_img: int,
        bbox: Tuple[int, int, int, int],
        gray_roi: Optional[np.ndarray],
        dy: float,
    ) -> Dict[str, Any]:
        """Mathematically estimates head pose from optical axis offset and facial symmetry."""
        x, y, w, h = bbox
        cx = x + w / 2.0
        cy = y + h / 2.0

        # Normalized offset from camera optical center
        norm_opt_x = (cx - w_img / 2.0) / (w_img / 2.0)
        norm_opt_y = (cy - h_img / 2.0) / (h_img / 2.0)

        # Facial asymmetry and vertical luminance distribution
        horizontal_asymmetry = 0.0
        top_bottom_ratio = 0.90

        if gray_roi is not None and gray_roi.size > 0:
            h_r, w_r = gray_roi.shape[:2]
            if w_r >= 4 and h_r >= 4:
                # Bilateral cheek luminance
                w_split = int(w_r * 0.40)
                left_mean = float(np.mean(gray_roi[:, :w_split]))
                right_mean = float(np.mean(gray_roi[:, w_r - w_split :]))
                if (left_mean + right_mean) > 1e-3:
                    horizontal_asymmetry = (left_mean - right_mean) / (left_mean + right_mean)

                # Vertical top/bottom ratio (forehead/eyes vs chin/desk)
                h_split = h_r // 2
                top_mean = float(np.mean(gray_roi[:h_split, :]))
                bot_mean = float(np.mean(gray_roi[h_split:, :]))
                if bot_mean > 1e-3:
                    top_bottom_ratio = top_mean / bot_mean

        # Yaw calculation (in degrees)
        # Combination of optical center displacement and cheek intensity asymmetry
        yaw = float(horizontal_asymmetry * 55.0 + norm_opt_x * 12.0)

        # Pitch calculation (in degrees)
        # Note-taking / downward shift: top_bottom_ratio drops (<0.78) or vertical shift dy > 4.5
        is_note_taking = (dy > 4.5) or (top_bottom_ratio < 0.77)
        if is_note_taking:
            pitch = float(-24.0 - max(0.0, (0.78 - top_bottom_ratio) * 45.0) - min(15.0, dy * 1.5))
        else:
            pitch = float((top_bottom_ratio - 0.88) * 35.0 + norm_opt_y * 8.0)

        roll = float(horizontal_asymmetry * 10.0)

        return self._compute_attention_and_state(yaw, pitch, roll, is_forced_note_taking=is_note_taking)

    def _compute_attention_and_state(
        self,
        yaw: float,
        pitch: float,
        roll: float,
        is_forced_note_taking: bool = False,
    ) -> Dict[str, Any]:
        """Calculates attention score with smooth cosine decay and classifies gaze state."""
        eff_angle = max(abs(yaw), abs(pitch))

        # Head Pose Attention Score:
        # 100% when |yaw| < 15 and |pitch| < 15
        # Smoothly decays to 25% when turned sideways (>45) or looking steeply down/up
        if eff_angle <= 15.0:
            score = 100.0
        elif eff_angle >= 45.0:
            score = 25.0
        else:
            # Cosine decay between 15 and 45 degrees
            ratio = (eff_angle - 15.0) / 30.0
            score = 25.0 + 75.0 * 0.5 * (1.0 + math.cos(math.pi * ratio))

        # Classify qualitative gaze state
        if is_forced_note_taking or pitch < -18.0:
            gaze_state = "Note-Taking / Downward"
            # Note-taking in an atelier retains healthy pedagogical attention (~70-85%)
            score = max(70.0, score)
        elif eff_angle > 40.0:
            gaze_state = "Turned Away"
        elif eff_angle > 15.0:
            gaze_state = "Attentive Listening"
        else:
            gaze_state = "Direct Focus"

        return {
            "yaw": float(round(yaw, 1)),
            "pitch": float(round(pitch, 1)),
            "roll": float(round(roll, 1)),
            "attention_score": float(round(score, 1)),
            "gaze_state": gaze_state,
        }


class MultimodalFusionEngine:
    """Fuses multi-sensory telemetry into an editorial engagement index."""

    def __init__(self, history_len: int = 30):
        self.history_len = history_len
        self.fused_history = deque(maxlen=history_len)
        self.ema_score: Optional[float] = None  # Exponential Moving Average state (alpha=0.25)
        self.prev_gray_frame: Optional[np.ndarray] = None
        self.prev_rois: Dict[str, np.ndarray] = {}
        self.inactivity_seconds: float = 0.0
        self.last_compute_time: Optional[float] = None
        self.head_pose_estimator = HeadPoseEstimator()

    def compute_movement_dynamics(
        self,
        frame_bgr: np.ndarray,
        face_rois: Optional[Dict[str, np.ndarray]] = None,
        timestamp: Optional[float] = None,
    ) -> Dict[str, float]:
        """Calculates optical movement dynamics and inactivity penalties via frame differencing."""
        curr_time = timestamp if timestamp is not None else time.time()
        dt = 0.25
        if self.last_compute_time is not None:
            dt = max(0.01, min(1.0, curr_time - self.last_compute_time))
        self.last_compute_time = curr_time

        if frame_bgr is None or frame_bgr.size == 0:
            return {
                "movement_score": 75.0,
                "inactivity_penalty": 0.0,
                "motion_energy": 0.06,
                "inactivity_seconds": 0.0,
            }

        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)

        # 1. Optical Movement via Face ROI Differencing
        roi_motion_energies = []
        if face_rois and len(face_rois) > 0:
            for p_id, roi in face_rois.items():
                if roi is None or roi.size == 0:
                    continue
                std_roi = cv2.resize(roi, (64, 64))
                if len(std_roi.shape) == 3:
                    std_roi = cv2.cvtColor(std_roi, cv2.COLOR_BGR2GRAY)
                std_roi = cv2.GaussianBlur(std_roi, (5, 5), 0)

                if p_id in self.prev_rois:
                    diff_roi = cv2.absdiff(self.prev_rois[p_id], std_roi)
                    _, thresh_roi = cv2.threshold(diff_roi, 14, 255, cv2.THRESH_BINARY)
                    energy = float(np.count_nonzero(thresh_roi)) / float(thresh_roi.size)
                    roi_motion_energies.append(energy)
                self.prev_rois[p_id] = std_roi

        # Full frame differencing fallback and environment baseline
        gray_blurred = cv2.GaussianBlur(gray, (21, 21), 0)
        frame_energy = 0.05
        if self.prev_gray_frame is not None:
            diff_frame = cv2.absdiff(self.prev_gray_frame, gray_blurred)
            _, thresh_frame = cv2.threshold(diff_frame, 15, 255, cv2.THRESH_BINARY)
            frame_energy = float(np.count_nonzero(thresh_frame)) / float(thresh_frame.size)
        self.prev_gray_frame = gray_blurred

        if roi_motion_energies:
            motion_energy = float(np.mean(roi_motion_energies)) * 0.75 + frame_energy * 0.25
        else:
            motion_energy = frame_energy

        # 2. Track Inactivity:
        # If optical motion remains below threshold (< 0.03) for > 8.0 seconds continuously,
        # apply an Inactivity Penalty (reducing engagement by up to 25 points).
        if motion_energy < 0.03:
            self.inactivity_seconds += dt
        else:
            self.inactivity_seconds = max(0.0, self.inactivity_seconds - 2.0 * dt)

        if self.inactivity_seconds > 8.0:
            inactivity_penalty = min(25.0, (self.inactivity_seconds - 8.0) * 3.5)
        else:
            inactivity_penalty = 0.0

        # 3. Calculate movement score (0-100 scale):
        # Subtle motion (0.03 - 0.25) is ideal active presence (nodding, writing, shifting gaze)
        if 0.03 <= motion_energy <= 0.25:
            movement_score = 75.0 + 20.0 * math.sin(math.pi * (motion_energy - 0.03) / 0.22)
        elif motion_energy < 0.03:
            movement_score = 50.0 + (motion_energy / 0.03) * 25.0
        else:
            movement_score = max(30.0, 95.0 - (motion_energy - 0.25) * 120.0)

        return {
            "movement_score": float(round(movement_score, 1)),
            "inactivity_penalty": float(round(inactivity_penalty, 1)),
            "motion_energy": float(round(motion_energy, 4)),
            "inactivity_seconds": float(round(self.inactivity_seconds, 2)),
        }

    def fuse(
        self,
        visual_attention_score: float,
        movement_score: float,
        inactivity_penalty: float,
        acoustic_score: float,
    ) -> Dict[str, Any]:
        """Applies Fused Cognitive Equilibrium formula and Exponential Moving Average.

        Fused Cognitive Equilibrium Formula:
            fused = (0.45 * visual_attention) + (0.35 * movement_score) + (0.20 * acoustic_score) - inactivity_penalty
        Smooth with EMA (alpha = 0.25):
            EMA_t = 0.25 * fused_t + 0.75 * EMA_{t-1}
        """
        raw_fused = (
            0.45 * visual_attention_score
            + 0.35 * movement_score
            + 0.20 * acoustic_score
            - inactivity_penalty
        )
        raw_fused = float(np.clip(raw_fused, 0.0, 100.0))

        # Exponential Moving Average (alpha = 0.25)
        if self.ema_score is None:
            self.ema_score = raw_fused
        else:
            self.ema_score = 0.25 * raw_fused + 0.75 * self.ema_score

        smoothed_fused = float(np.clip(self.ema_score, 0.0, 100.0))
        self.fused_history.append(float(round(smoothed_fused, 1)))

        trend = self._determine_trend(
            current_score=smoothed_fused,
            visual_attention=visual_attention_score,
            acoustic_score=acoustic_score,
            movement_score=movement_score,
        )

        return {
            "visual_attention": float(round(visual_attention_score, 1)),
            "movement_dynamics": float(round(movement_score, 1)),
            "movement_score": float(round(movement_score, 1)),
            "inactivity_penalty": float(round(inactivity_penalty, 1)),
            "acoustic_interaction": float(round(acoustic_score, 1)),
            "raw_fused": float(round(raw_fused, 1)),
            "fused_score": float(round(smoothed_fused, 1)),
            "trend": str(trend),
            "fused_history": [float(round(x, 1)) for x in list(self.fused_history)],
        }

    def _determine_trend(
        self,
        current_score: Optional[float] = None,
        visual_attention: float = 75.0,
        acoustic_score: float = 50.0,
        movement_score: float = 70.0,
    ) -> str:
        """Dynamically classifies trend over rolling observation window:
        - 'Interactive Peak' (score > 85, active acoustics/movement)
        - 'Attention Drop Detected' (slope < -0.3 or score < 60)
        - 'Steady Classroom Rhythm' (stable score 65-85)
        - 'Reflective Silence' (high gaze, low acoustics, low motion)
        """
        if current_score is None:
            current_score = self.fused_history[-1] if self.fused_history else 75.0

        # Calculate finite difference slope over recent window
        slope = 0.0
        if len(self.fused_history) >= 4:
            recent = list(self.fused_history)[-min(8, len(self.fused_history)) :]
            n = len(recent)
            x = np.arange(n)
            slope = float(np.polyfit(x, recent, 1)[0])

        # Priority 1: Attention Drop Detected (slope < -0.3 or score < 60)
        if slope < -0.3 or current_score < 60.0:
            return "Attention Drop Detected"

        # Priority 2: Interactive Peak (score > 85, active acoustics/movement)
        if current_score > 85.0 and (acoustic_score > 60.0 or movement_score > 65.0):
            return "Interactive Peak"

        # Priority 3: Reflective Silence (high gaze, low acoustics, low motion)
        if visual_attention >= 75.0 and acoustic_score < 40.0 and movement_score < 65.0:
            return "Reflective Silence"

        # Priority 4: Steady Classroom Rhythm (stable score 65-85)
        return "Steady Classroom Rhythm"
