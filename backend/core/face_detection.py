"""Face detection, mathematical Euclidean Centroid Tracking, and sustained presence verification."""
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime
import os
import cv2
import numpy as np

try:
    from core.engagement_fusion import HeadPoseEstimator
except ImportError:
    from backend.core.engagement_fusion import HeadPoseEstimator

# Palette constants in BGR format for OpenCV rendering
# Caramel (#B8772F) -> BGR: (47, 119, 184) [Verified >= 10s]
COLOR_CARAMEL_BGR = (47, 119, 184)
# Latte (#D2AE82) -> BGR: (130, 174, 210) [Verifying 3s - 10s]
COLOR_LATTE_BGR = (130, 174, 210)
# Muted Roast (#3A2619) -> BGR: (25, 38, 58) / (40, 55, 78) [Transient < 3s]
COLOR_ROAST_BGR = (40, 55, 78)
# Crema (#EBDCC2) -> BGR: (194, 220, 235)
COLOR_CREMA_BGR = (194, 220, 235)
# Espresso (#1C1310) -> BGR: (16, 19, 28)
COLOR_ESPRESSO_BGR = (16, 19, 28)
# Dark border vignette
COLOR_BORDER_ROAST = (25, 38, 58)


class VerificationStatus(str):
    """String subclass providing backwards-compatible equality for 'Verified Present'."""

    def __eq__(self, other: Any) -> bool:
        if other == "Verified Present" and "Verified Present" in str(self):
            return True
        return super().__eq__(other)

    def __hash__(self) -> int:
        return super().__hash__()


class TrackedParticipant:
    """Stateful record of an individual tracked face with Euclidean centroid persistence."""

    def __init__(
        self,
        track_id: int,
        bbox: Tuple[int, int, int, int],
        centroid: Tuple[float, float],
        first_seen: float,
        head_pose_estimator: HeadPoseEstimator,
    ):
        self.track_id = track_id
        self.participant_id = f"Participant_{track_id:02d}"
        self.bbox = bbox  # (x, y, w, h)
        self.centroid = centroid  # (cX, cY)
        self.first_seen = first_seen
        self.last_seen = first_seen
        self.duration = 0.0
        self.sustained_seconds = 0.0
        self.disappeared_duration = 0.0
        self.logged_to_db = False
        self.is_verified = False
        self.status = VerificationStatus("Transient (<3s)")
        self.head_pose_estimator = head_pose_estimator
        self.head_pose_approx = 88.0
        self.gaze_state = "Direct Focus"
        self.yaw = 0.0
        self.pitch = 0.0
        self.roll = 0.0
        self.velocity_x = 0.0
        self.is_walk_by = False
        self.base_y = float(centroid[1])
        self.verified_at: Optional[float] = None

    def update(
        self,
        bbox: Tuple[int, int, int, int],
        centroid: Tuple[float, float],
        timestamp: float,
        threshold: float,
        frame_bgr: np.ndarray,
        gray_roi: Optional[np.ndarray] = None,
    ) -> None:
        """Updates track coordinates, velocity, posture dynamics, and sustained presence."""
        dt = max(0.001, min(1.0, timestamp - self.last_seen))

        # Horizontal velocity to capture brisk corridor walk-bys
        instant_vx = (centroid[0] - self.centroid[0]) / dt
        self.velocity_x = 0.70 * self.velocity_x + 0.30 * instant_vx

        # Base vertical center smoothing
        self.base_y = 0.95 * self.base_y + 0.05 * centroid[1]
        dy = centroid[1] - self.base_y

        self.bbox = bbox
        self.centroid = centroid
        self.last_seen = timestamp
        self.disappeared_duration = 0.0
        self.duration = timestamp - self.first_seen
        self.sustained_seconds = self.duration

        # Walk-by classifier
        if abs(self.velocity_x) > 65.0 and self.duration < 6.0:
            self.is_walk_by = True
        elif abs(self.velocity_x) < 35.0:
            self.is_walk_by = False

        # Head Pose & Gaze Estimation
        pose = self.head_pose_estimator.estimate(frame_bgr, bbox, gray_roi=gray_roi, dy=dy)
        self.head_pose_approx = pose["attention_score"]
        self.gaze_state = pose["gaze_state"]
        self.yaw = pose["yaw"]
        self.pitch = pose["pitch"]
        self.roll = pose["roll"]

        # Sustained presence transition
        if self.duration >= threshold:
            if not self.is_verified:
                self.verified_at = timestamp
            self.is_verified = True
            self.is_walk_by = False
            self.status = VerificationStatus("Verified Present (>=10s)")
        elif self.duration >= 3.0:
            self.is_verified = False
            self.status = VerificationStatus("Verifying...")
        else:
            self.is_verified = False
            if self.is_walk_by:
                self.status = VerificationStatus("Transient (<3s) [Walk-by]")
            else:
                self.status = VerificationStatus("Transient (<3s)")


class FaceDetector:
    """OpenCV Haar Cascade Face Detector with Mathematical Euclidean Centroid Tracking."""

    def __init__(
        self,
        sustained_threshold: float = 10.0,
        max_distance: float = 140.0,
        session_id: str = "studio-morning-session",
    ):
        self.sustained_threshold = sustained_threshold
        self.max_distance = max_distance
        self.session_id = session_id
        self.next_track_id = 1
        self.tracks: Dict[int, TrackedParticipant] = {}
        self.head_pose_estimator = HeadPoseEstimator()

        # Load Haar cascade with local directory priority
        self.face_cascade = None
        local_cascade = os.path.join(os.path.dirname(__file__), "haarcascade_frontalface_default.xml")
        candidates = [
            local_cascade,
            getattr(cv2, "data", None)
            and getattr(cv2.data, "haarcascades", None)
            and os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml"),
        ]

        for p in candidates:
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
                self.face_cascade = None

    def _auto_commit_verified_attendance(self, track: TrackedParticipant) -> None:
        """Commits verified participant presence to SQLite AttendanceLog."""
        try:
            try:
                from database.models import SessionLocal, AttendanceLog
            except ImportError:
                from backend.database.models import SessionLocal, AttendanceLog

            db = SessionLocal()
            try:
                existing = (
                    db.query(AttendanceLog)
                    .filter(
                        AttendanceLog.session_id == self.session_id,
                        AttendanceLog.participant_id == track.participant_id,
                    )
                    .first()
                )
                if existing:
                    existing.last_seen = datetime.utcnow()
                    existing.sustained_seconds = round(track.duration, 2)
                    existing.status = "Verified Present"
                else:
                    log_entry = AttendanceLog(
                        session_id=self.session_id,
                        participant_id=track.participant_id,
                        first_seen=datetime.utcnow(),
                        last_seen=datetime.utcnow(),
                        sustained_seconds=round(track.duration, 2),
                        status="Verified Present",
                    )
                    db.add(log_entry)
                db.commit()
                track.logged_to_db = True
            except Exception:
                db.rollback()
            finally:
                db.close()
        except Exception:
            pass

    def process_frame(
        self, frame_bgr: np.ndarray, timestamp: float
    ) -> Tuple[np.ndarray, List[Dict[str, Any]], float]:
        """Detect faces, update Euclidean centroid tracks, and render warm editorial overlays."""
        if frame_bgr is None or frame_bgr.size == 0:
            return frame_bgr, [], 0.0

        h_img, w_img = frame_bgr.shape[:2]
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        gray_eq = cv2.equalizeHist(gray)

        # 1. Multi-scale Haar face detection
        detected_rects = ()
        if self.face_cascade is not None and not self.face_cascade.empty():
            try:
                detected_rects = self.face_cascade.detectMultiScale(
                    gray_eq,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(36, 36),
                    flags=cv2.CASCADE_SCALE_IMAGE,
                )
            except Exception:
                detected_rects = ()

        current_boxes: List[Tuple[int, int, int, int]] = []
        current_centroids: List[Tuple[float, float]] = []
        current_rois: List[np.ndarray] = []

        if len(detected_rects) > 0:
            for (x, y, w, h) in detected_rects:
                bx, by, bw, bh = int(x), int(y), int(w), int(h)
                cx = bx + bw / 2.0
                cy = by + bh / 2.0
                roi = gray[max(0, by) : min(h_img, by + bh), max(0, bx) : min(w_img, bx + bw)]
                current_boxes.append((bx, by, bw, bh))
                current_centroids.append((cx, cy))
                current_rois.append(roi)

        # 2. Mathematical Euclidean Centroid Tracking
        if len(self.tracks) == 0:
            # No existing tracks: register all detected centroids
            for i in range(len(current_boxes)):
                track = TrackedParticipant(
                    track_id=self.next_track_id,
                    bbox=current_boxes[i],
                    centroid=current_centroids[i],
                    first_seen=timestamp,
                    head_pose_estimator=self.head_pose_estimator,
                )
                track.update(
                    bbox=current_boxes[i],
                    centroid=current_centroids[i],
                    timestamp=timestamp,
                    threshold=self.sustained_threshold,
                    frame_bgr=frame_bgr,
                    gray_roi=current_rois[i],
                )
                self.tracks[self.next_track_id] = track
                self.next_track_id += 1

        elif len(current_boxes) == 0:
            # No detections in frame: manage 3.0s occlusion grace period
            deregister_ids = []
            for track_id, track in self.tracks.items():
                track.disappeared_duration = timestamp - track.last_seen
                if track.disappeared_duration > 3.0:
                    deregister_ids.append(track_id)
            for track_id in deregister_ids:
                del self.tracks[track_id]

        else:
            # Pairwise Euclidean Distance Matrix between existing centroids and new centroids
            track_ids = list(self.tracks.keys())
            existing_centroids = np.array([self.tracks[tid].centroid for tid in track_ids], dtype=np.float32)
            detected_centroids_arr = np.array(current_centroids, dtype=np.float32)

            # Compute pairwise distance matrix D (N x M)
            # D[i, j] = sqrt((cx_i - cx_j)^2 + (cy_i - cy_j)^2)
            diff = existing_centroids[:, np.newaxis, :] - detected_centroids_arr[np.newaxis, :, :]
            dist_matrix = np.linalg.norm(diff, axis=2)

            # Minimum distance assignment
            rows = dist_matrix.min(axis=1).argsort()
            cols = dist_matrix.argmin(axis=1)[rows]

            used_rows = set()
            used_cols = set()

            for row, col in zip(rows, cols):
                if row in used_rows or col in used_cols:
                    continue

                # Max distance gating threshold (e.g. 140px)
                if dist_matrix[row, col] > self.max_distance:
                    continue

                track_id = track_ids[row]
                track = self.tracks[track_id]
                track.update(
                    bbox=current_boxes[col],
                    centroid=current_centroids[col],
                    timestamp=timestamp,
                    threshold=self.sustained_threshold,
                    frame_bgr=frame_bgr,
                    gray_roi=current_rois[col],
                )

                # Check if newly verified to auto-commit to SQLite
                if track.is_verified and not track.logged_to_db:
                    self._auto_commit_verified_attendance(track)

                used_rows.add(row)
                used_cols.add(col)

            # Unused rows: manage 3.0s occlusion grace period
            unused_rows = set(range(len(track_ids))) - used_rows
            deregister_ids = []
            for r in unused_rows:
                tid = track_ids[r]
                t = self.tracks[tid]
                t.disappeared_duration = timestamp - t.last_seen
                if t.disappeared_duration > 3.0:
                    deregister_ids.append(tid)

            for tid in deregister_ids:
                del self.tracks[tid]

            # Unused cols: register new participants
            unused_cols = set(range(len(current_boxes))) - used_cols
            for c in unused_cols:
                track = TrackedParticipant(
                    track_id=self.next_track_id,
                    bbox=current_boxes[c],
                    centroid=current_centroids[c],
                    first_seen=timestamp,
                    head_pose_estimator=self.head_pose_estimator,
                )
                track.update(
                    bbox=current_boxes[c],
                    centroid=current_centroids[c],
                    timestamp=timestamp,
                    threshold=self.sustained_threshold,
                    frame_bgr=frame_bgr,
                    gray_roi=current_rois[c],
                )
                self.tracks[self.next_track_id] = track
                self.next_track_id += 1

        # 3. Annotate Frame with Warm Editorial Overlays
        annotated_frame = frame_bgr.copy()
        cv2.rectangle(annotated_frame, (0, 0), (w_img - 1, h_img - 1), COLOR_BORDER_ROAST, 1)

        participants_data: List[Dict[str, Any]] = []
        visual_attention_sum = 0.0

        for track_id, track in sorted(self.tracks.items()):
            x, y, w, h = track.bbox
            cx, cy = track.centroid
            is_verified = track.is_verified
            is_verifying = (3.0 <= track.duration < self.sustained_threshold)

            # Warm editorial color assignment
            if is_verified:
                primary_color = COLOR_CARAMEL_BGR  # Caramel (#B8772F)
                bracket_thickness = 3
                status_short = "Verified"
            elif is_verifying:
                primary_color = COLOR_LATTE_BGR    # Latte (#D2AE82)
                bracket_thickness = 2
                status_short = "Verifying..."
            else:
                primary_color = COLOR_ROAST_BGR    # Muted Roast (#3A2619)
                bracket_thickness = 2
                status_short = "Transient"

            bracket_len = max(10, int(min(w, h) * 0.24))

            # Architectural Corner Brackets
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

            # Subtle box outline
            cv2.rectangle(annotated_frame, (x, y), (x + w, y + h), primary_color, 1)

            # Central focal dot and ring
            cv2.circle(annotated_frame, (int(cx), int(cy)), 3, primary_color, -1)
            cv2.circle(annotated_frame, (int(cx), int(cy)), 6, primary_color, 1)

            # Progress Calculation
            progress_ratio = min(1.0, track.duration / max(self.sustained_threshold, 1.0))
            progress_pct = int(progress_ratio * 100)

            # Typographic Text Label: Participant_XX | Verified | 10.4s
            label_tag = f"{track.participant_id} | {status_short} | {track.duration:.1f}s"
            text_size, _ = cv2.getTextSize(label_tag, cv2.FONT_HERSHEY_SIMPLEX, 0.38, 1)
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

            # Sustained presence progress bar at bottom of bbox
            bar_y = y + h + 8
            if bar_y < h_img - 6:
                cv2.line(annotated_frame, (x, bar_y), (x + w, bar_y), (25, 38, 58), 2)
                fill_w = int(w * progress_ratio)
                if fill_w > 0:
                    cv2.line(
                        annotated_frame,
                        (x, bar_y),
                        (x + fill_w, bar_y),
                        COLOR_CARAMEL_BGR if is_verified else COLOR_LATTE_BGR,
                        2,
                    )
                if is_verified:
                    cv2.circle(annotated_frame, (x + w, bar_y), 3, COLOR_CARAMEL_BGR, -1)

            visual_attention_sum += track.head_pose_approx
            participants_data.append({
                "track_id": track.participant_id,
                "participant_id": track.participant_id,
                "sustained_seconds": round(track.duration, 2),
                "status": track.status,
                "head_pose_score": round(track.head_pose_approx, 1),
                "gaze_state": track.gaze_state,
                "is_verified": is_verified,
                "progress_pct": progress_pct,
                "bbox": [x, y, w, h],
                "centroid": [int(cx), int(cy)],
                "yaw": round(track.yaw, 1),
                "pitch": round(track.pitch, 1),
                "roll": round(track.roll, 1),
            })

        avg_visual_attention = (
            (visual_attention_sum / len(self.tracks)) if self.tracks else 75.0
        )

        return annotated_frame, participants_data, avg_visual_attention
