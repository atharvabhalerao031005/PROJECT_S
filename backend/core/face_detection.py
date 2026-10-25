"""Face detection and sustained presence tracking using OpenCV Haar Cascades and IoU/Centroid persistence."""
from typing import Dict, List, Tuple, Any, Optional
import os
import cv2
import numpy as np

# Palette constants in BGR format for OpenCV rendering
# Caramel (#B8772F) -> BGR: (47, 119, 184)
COLOR_CARAMEL_BGR = (47, 119, 184)
# Crema (#EBDCC2) -> BGR: (194, 220, 235)
COLOR_CREMA_BGR = (194, 220, 235)
# Latte (#D2AE82) -> BGR: (130, 174, 210)
COLOR_LATTE_BGR = (130, 174, 210)
# Mocha (#6B4630) -> BGR: (48, 70, 107)
COLOR_MOCHA_BGR = (48, 70, 107)
# Espresso (#1C1310) -> BGR: (16, 19, 28)
COLOR_ESPRESSO_BGR = (16, 19, 28)
# Roast (#3A2619) -> BGR: (25, 38, 58)
COLOR_ROAST_BGR = (25, 38, 58)


class TrackedParticipant:
    """Stateful record of an individual tracked face with sustained presence verification."""

    def __init__(self, track_id: int, bbox: Tuple[int, int, int, int], first_seen: float):
        self.track_id = track_id
        self.bbox = bbox  # (x, y, w, h)
        self.first_seen = first_seen
        self.last_seen = first_seen
        self.total_tracked_time = 0.0
        self.sustained_seconds = 0.0
        self.disappeared_frames = 0
        self.status = "Tracking..."
        self.head_pose_approx = 88.0  # Percentage gaze forward
        self.gaze_state = "Direct Focus"
        self.velocity_x = 0.0
        self.is_walk_by = False
        self.verified_at: Optional[float] = None
        self.base_y = float(bbox[1] + bbox[3] / 2.0)

    def update(
        self,
        bbox: Tuple[int, int, int, int],
        timestamp: float,
        threshold: float,
        gray_roi: Optional[np.ndarray] = None,
    ):
        dt = min(0.5, max(0.001, timestamp - self.last_seen))

        # Calculate horizontal movement velocity to identify transient walk-bys
        curr_cx = bbox[0] + bbox[2] / 2.0
        curr_cy = bbox[1] + bbox[3] / 2.0
        prev_cx = self.bbox[0] + self.bbox[2] / 2.0
        instant_vx = (curr_cx - prev_cx) / dt
        self.velocity_x = 0.70 * self.velocity_x + 0.30 * instant_vx

        # Smooth baseline vertical position
        self.base_y = 0.95 * self.base_y + 0.05 * curr_cy
        dy = curr_cy - self.base_y

        # Walk-by classifier: sustained high horizontal velocity (>85 px/s) across frame
        if abs(self.velocity_x) > 85.0 and self.sustained_seconds < 6.0:
            self.is_walk_by = True
        elif abs(self.velocity_x) < 40.0:
            self.is_walk_by = False

        self.bbox = bbox
        self.last_seen = timestamp
        self.total_tracked_time += dt
        self.sustained_seconds += dt
        self.disappeared_frames = 0

        # Assess head pose and gaze approximation via vertical posture shift and ROI luminance
        ratio = 0.82
        if gray_roi is not None and gray_roi.size > 0:
            mid = gray_roi.shape[0] // 2
            top_mean = float(np.mean(gray_roi[:mid, :]))
            bot_mean = float(np.mean(gray_roi[mid:, :]))
            if bot_mean > 1e-3:
                ratio = top_mean / bot_mean

        # Downward tilt detection: head shifted down by >5px or top/bot luminance darkened by hair/tilt
        if dy > 5.5 or ratio < 0.76:
            self.head_pose_approx = max(68.0, self.head_pose_approx - 1.2)
            self.gaze_state = "Note-Taking / Downward"
        elif abs(dy) < 3.5:
            self.head_pose_approx = min(96.0, self.head_pose_approx + 1.2)
            self.gaze_state = "Direct Focus"
        else:
            self.head_pose_approx = min(90.0, max(75.0, self.head_pose_approx))
            self.gaze_state = "Attentive Listening"

        # Sustained presence state transition
        if self.sustained_seconds >= threshold:
            if self.status != "Verified Present":
                self.verified_at = timestamp
            self.status = "Verified Present"
            self.is_walk_by = False
        elif self.is_walk_by:
            self.status = "Walk-by / Transient"
        else:
            self.status = "Tracking..."


class FaceDetector:
    """OpenCV Haar Cascade Face Detector with Temporal Sustained Presence Tracking."""

    def __init__(self, sustained_threshold: float = 10.0):
        self.sustained_threshold = sustained_threshold
        self.next_track_id = 1
        self.tracks: Dict[int, TrackedParticipant] = {}
        self.max_disappeared = 12  # frames (~1.0s) before pruning transient track

        # Load OpenCV default frontal face haar cascade with robust local fallback
        local_cascade = os.path.join(os.path.dirname(__file__), "haarcascade_frontalface_default.xml")
        self.face_cascade = None

        cascade_candidates = [
            local_cascade,
            getattr(cv2, "data", None) and getattr(cv2.data, "haarcascades", None) and os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml"),
        ]

        for p in cascade_candidates:
            if p and os.path.exists(p):
                try:
                    cc = cv2.CascadeClassifier(p)
                    if not cc.empty():
                        self.face_cascade = cc
                        break
                except Exception:
                    pass

        if self.face_cascade is None or self.face_cascade.empty():
            try:
                sample_path = cv2.samples.findFile("haarcascade_frontalface_default.xml")
                self.face_cascade = cv2.CascadeClassifier(sample_path)
            except Exception:
                pass

        if self.face_cascade is None:
            try:
                self.face_cascade = cv2.CascadeClassifier()
            except Exception:
                self.face_cascade = None

    def _compute_iou(self, boxA: Tuple[int, int, int, int], boxB: Tuple[int, int, int, int]) -> float:
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[0] + boxA[2], boxB[0] + boxB[2])
        yB = min(boxA[1] + boxA[3], boxB[1] + boxB[3])

        interW = max(0, xB - xA)
        interH = max(0, yB - yA)
        interArea = interW * interH

        boxAArea = boxA[2] * boxA[3]
        boxBArea = boxB[2] * boxB[3]
        unionArea = float(boxAArea + boxBArea - interArea)

        if unionArea <= 0:
            return 0.0
        return interArea / unionArea

    def process_frame(
        self, frame_bgr: np.ndarray, timestamp: float
    ) -> Tuple[np.ndarray, List[Dict[str, Any]], float]:
        """Detect faces, update sustained presence, and render warm editorial overlays."""
        if frame_bgr is None or frame_bgr.size == 0:
            return frame_bgr, [], 0.0

        h_img, w_img = frame_bgr.shape[:2]
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)

        # Detect multi-scale frontal faces
        detected_rects = ()
        if self.face_cascade is not None and not self.face_cascade.empty():
            try:
                detected_rects = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(36, 36),
                    flags=cv2.CASCADE_SCALE_IMAGE,
                )
            except Exception:
                detected_rects = ()

        current_boxes: List[Tuple[int, int, int, int]] = []
        if len(detected_rects) > 0:
            current_boxes = [(int(x), int(y), int(w), int(h)) for (x, y, w, h) in detected_rects]

        # Match detected boxes with existing tracks using Greedy Bipartite Matching on IoU + Proximity
        matched_tracks = set()
        matched_boxes = set()

        if self.tracks and current_boxes:
            candidates = []
            for track_id, track in self.tracks.items():
                tx_c = track.bbox[0] + track.bbox[2] / 2.0
                ty_c = track.bbox[1] + track.bbox[3] / 2.0
                max_dim = max(track.bbox[2], track.bbox[3])
                for idx, box in enumerate(current_boxes):
                    iou = self._compute_iou(track.bbox, box)
                    bx_c = box[0] + box[2] / 2.0
                    by_c = box[1] + box[3] / 2.0
                    dist = np.hypot(tx_c - bx_c, ty_c - by_c)
                    if iou >= 0.15 or dist < max_dim * 1.0:
                        score = iou * 2.0 + max(0.0, 1.0 - (dist / (max_dim * 1.5)))
                        # Stationary track affinity bonus: lock onto seated participants
                        if dist < 45.0:
                            score += 4.0
                        candidates.append((score, track_id, idx))

            # Prioritize best matching pairs first
            candidates.sort(key=lambda c: c[0], reverse=True)
            for score, track_id, box_idx in candidates:
                if track_id in matched_tracks or box_idx in matched_boxes:
                    continue
                matched_tracks.add(track_id)
                matched_boxes.add(box_idx)
                matched_box = current_boxes[box_idx]
                bx, by, bw, bh = matched_box
                roi = gray[max(0, by):min(h_img, by+bh), max(0, bx):min(w_img, bx+bw)]
                self.tracks[track_id].update(matched_box, timestamp, self.sustained_threshold, gray_roi=roi)

        # Register unmatched boxes as new tracks
        for idx, box in enumerate(current_boxes):
            if idx not in matched_boxes:
                new_track = TrackedParticipant(self.next_track_id, box, timestamp)
                self.tracks[self.next_track_id] = new_track
                self.next_track_id += 1

        # Increment disappearance counter for unmatched tracks
        to_prune = []
        for track_id, track in self.tracks.items():
            if track_id not in matched_tracks and len(current_boxes) > 0:
                track.disappeared_frames += 1
                if track.disappeared_frames > self.max_disappeared:
                    to_prune.append(track_id)

        for track_id in to_prune:
            del self.tracks[track_id]

        # Draw bespoke editorial overlays onto frame_bgr
        annotated_frame = frame_bgr.copy()
        participants_data: List[Dict[str, Any]] = []
        visual_attention_sum = 0.0

        # Subtle dark editorial vignette border
        cv2.rectangle(annotated_frame, (0, 0), (w_img - 1, h_img - 1), COLOR_ROAST_BGR, 1)

        for track_id, track in sorted(self.tracks.items()):
            x, y, w, h = track.bbox
            is_verified = (track.status == "Verified Present")
            is_walk_by = track.is_walk_by

            # Select palette based on sustained state
            if is_verified:
                primary_color = COLOR_CARAMEL_BGR
                bracket_thickness = 2
            elif is_walk_by:
                primary_color = COLOR_MOCHA_BGR
                bracket_thickness = 1
            else:
                primary_color = COLOR_CREMA_BGR
                bracket_thickness = 2

            bracket_len = max(10, int(min(w, h) * 0.24))

            # Architectural corner crop brackets
            # Top-Left
            cv2.line(annotated_frame, (x, y), (x + bracket_len, y), primary_color, bracket_thickness)
            cv2.line(annotated_frame, (x, y), (x, y + bracket_len), primary_color, bracket_thickness)
            # Top-Right
            cv2.line(annotated_frame, (x + w, y), (x + w - bracket_len, y), primary_color, bracket_thickness)
            cv2.line(annotated_frame, (x + w, y), (x + w, y + bracket_len), primary_color, bracket_thickness)
            # Bottom-Left
            cv2.line(annotated_frame, (x, y + h), (x + bracket_len, y + h), primary_color, bracket_thickness)
            cv2.line(annotated_frame, (x, y + h), (x, y + h - bracket_len), primary_color, bracket_thickness)
            # Bottom-Right
            cv2.line(annotated_frame, (x + w, y + h), (x + w - bracket_len, y + h), primary_color, bracket_thickness)
            cv2.line(annotated_frame, (x + w, y + h), (x + w, y + h - bracket_len), primary_color, bracket_thickness)

            # Central focal dot
            cx = x + w // 2
            cy = y + h // 2
            cv2.circle(annotated_frame, (cx, cy), 2, primary_color, -1)

            # Progress calculation
            progress_ratio = min(1.0, track.sustained_seconds / max(self.sustained_threshold, 1.0))
            progress_pct = int(progress_ratio * 100)

            # Editorial Tagline Label
            if is_verified:
                label_tag = f"TRK-{track.track_id:02d} // {track.sustained_seconds:.1f}s [VERIFIED]"
            elif is_walk_by:
                label_tag = f"TRK-{track.track_id:02d} // {track.sustained_seconds:.1f}s [WALK-BY CANDIDATE]"
            else:
                label_tag = f"TRK-{track.track_id:02d} // {track.sustained_seconds:.1f}s [{progress_pct}%]"

            # Background pill
            text_size, _ = cv2.getTextSize(label_tag, cv2.FONT_HERSHEY_SIMPLEX, 0.40, 1)
            pill_y1 = max(0, y - 24)
            pill_y2 = max(18, y - 4)
            cv2.rectangle(
                annotated_frame,
                (x, pill_y1),
                (x + text_size[0] + 12, pill_y2),
                COLOR_ESPRESSO_BGR,
                -1,
            )
            cv2.rectangle(
                annotated_frame,
                (x, pill_y1),
                (x + text_size[0] + 12, pill_y2),
                primary_color,
                1,
            )
            cv2.putText(
                annotated_frame,
                label_tag,
                (x + 6, pill_y2 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.36,
                primary_color,
                1,
                cv2.LINE_AA,
            )

            # Dynamic sustained presence progress bar at bottom of bbox
            bar_y = y + h + 8
            if bar_y < h_img - 6:
                # Dark track line
                cv2.line(annotated_frame, (x, bar_y), (x + w, bar_y), COLOR_ROAST_BGR, 2)
                # Caramel fill line
                fill_w = int(w * progress_ratio)
                if fill_w > 0:
                    cv2.line(
                        annotated_frame,
                        (x, bar_y),
                        (x + fill_w, bar_y),
                        COLOR_CARAMEL_BGR if is_verified else COLOR_LATTE_BGR,
                        2,
                    )
                # Terminal pip at 100% verification threshold
                if is_verified:
                    cv2.circle(annotated_frame, (x + w, bar_y), 3, COLOR_CARAMEL_BGR, -1)

            visual_attention_sum += track.head_pose_approx
            participants_data.append({
                "track_id": f"Participant {track.track_id:02d}",
                "sustained_seconds": round(track.sustained_seconds, 2),
                "status": track.status,
                "head_pose_score": round(track.head_pose_approx, 1),
                "gaze_state": track.gaze_state,
                "is_verified": is_verified,
                "progress_pct": progress_pct,
                "bbox": [x, y, w, h],
            })

        avg_visual_attention = (
            (visual_attention_sum / len(self.tracks)) if self.tracks else 75.0
        )

        return annotated_frame, participants_data, avg_visual_attention
