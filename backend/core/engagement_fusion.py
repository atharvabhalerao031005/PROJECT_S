"""Multimodal engagement fusion combining visual attention, movement dynamics, and acoustic activity."""
from typing import Dict, Any, List
from collections import deque
import cv2
import numpy as np


class MultimodalFusionEngine:
    """Fuses multi-sensory telemetry into an editorial engagement index."""

    def __init__(self, history_len: int = 30):
        self.history_len = history_len
        self.fused_history = deque(maxlen=history_len)
        self.prev_gray_frame = None
        self.inactivity_counter = 0

    def compute_movement_dynamics(self, frame_bgr: np.ndarray) -> Dict[str, float]:
        """Calculates optical movement dynamics and inactivity penalties via frame differencing."""
        if frame_bgr is None or frame_bgr.size == 0:
            return {"movement_score": 70.0, "inactivity_penalty": 0.0}

        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if self.prev_gray_frame is None:
            self.prev_gray_frame = gray
            return {"movement_score": 75.0, "inactivity_penalty": 0.0}

        # Frame difference to capture subtle human motions (head nods, note taking)
        diff = cv2.absdiff(self.prev_gray_frame, gray)
        self.prev_gray_frame = gray

        motion_val = float(np.mean(diff))

        # Balanced movement: subtle motion (0.8 to 8.0) is ideal attentive engagement.
        # Zero motion indicates freeze/zoning out, while extreme motion (>25.0) is distraction.
        if motion_val < 0.4:
            self.inactivity_counter += 1
            movement_score = max(20.0, 60.0 - self.inactivity_counter * 1.5)
        elif motion_val > 25.0:
            self.inactivity_counter = max(0, self.inactivity_counter - 2)
            movement_score = max(40.0, 90.0 - (motion_val - 25.0) * 1.5)
        else:
            self.inactivity_counter = max(0, self.inactivity_counter - 1)
            movement_score = min(95.0, 70.0 + (motion_val * 4.0))

        # Inactivity penalty accrues if static stillness persists past 15 consecutive checks
        inactivity_penalty = min(18.0, max(0.0, (self.inactivity_counter - 15) * 0.8))

        return {
            "movement_score": float(round(movement_score, 1)),
            "inactivity_penalty": float(round(inactivity_penalty, 1)),
        }

    def fuse(
        self,
        visual_attention_score: float,
        movement_score: float,
        inactivity_penalty: float,
        acoustic_score: float,
    ) -> Dict[str, Any]:
        """Applies the canonical fusion formula and computes session trend.

        Fused Score = 0.45(Visual Attention) + 0.25(Movement Dynamics) +
                      0.30(Acoustic Interaction) - Inactivity Penalty
        """
        fused = (
            0.45 * visual_attention_score
            + 0.25 * movement_score
            + 0.30 * acoustic_score
            - inactivity_penalty
        )
        fused = float(np.clip(fused, 0.0, 100.0))
        self.fused_history.append(fused)

        trend = self._determine_trend()

        return {
            "visual_attention": float(round(visual_attention_score, 1)),
            "movement_dynamics": float(round(movement_score, 1)),
            "inactivity_penalty": float(round(inactivity_penalty, 1)),
            "acoustic_interaction": float(round(acoustic_score, 1)),
            "fused_score": float(round(fused, 1)),
            "trend": str(trend),
            "fused_history": [float(round(x, 1)) for x in list(self.fused_history)],
        }

    def _determine_trend(self) -> str:
        """Determines velocity and slope over rolling observation window."""
        if len(self.fused_history) < 6:
            return "Steady Plateau"

        recent = list(self.fused_history)
        first_half = np.mean(recent[: len(recent) // 2])
        second_half = np.mean(recent[len(recent) // 2 :])
        delta = second_half - first_half

        if delta > 3.5:
            return "Ascending Attention"
        elif delta < -4.0:
            return "Attention Drop Detected"
        else:
            return "Steady Plateau"
