"""Camera capture and synthetic studio classroom simulation generator."""
from typing import Optional, Tuple, List
import time
import math
import cv2
import numpy as np

# BGR color tokens for synthetic studio simulation ("Slow Morning" editorial palette)
# Espresso (#1C1310) -> BGR: (16, 19, 28)
C_ESPRESSO = (16, 19, 28)
# Roast (#3A2619) -> BGR: (25, 38, 58)
C_ROAST = (25, 38, 58)
# Mocha (#6B4630) -> BGR: (48, 70, 107)
C_MOCHA = (48, 70, 107)
# Caramel (#B8772F) -> BGR: (47, 119, 184)
C_CARAMEL = (47, 119, 184)
# Latte (#D2AE82) -> BGR: (130, 174, 210)
C_LATTE = (130, 174, 210)
# Crema (#EBDCC2) -> BGR: (194, 220, 235)
C_CREMA = (194, 220, 235)
# Foam (#F7F0E3) -> BGR: (227, 240, 247)
C_FOAM = (227, 240, 247)


class CameraService:
    """Manages physical webcam video streams and realistic synthetic studio simulations."""

    def __init__(self, camera_index: int = 0):
        self.camera_index = camera_index
        self.cap: Optional[cv2.VideoCapture] = None
        self.sim_start_time = time.time()
        self.sim_frame_count = 0
        self.latest_spectral_bins: List[float] = [0.05] * 16

    def start_webcam(self) -> bool:
        """Attempts to open local hardware camera."""
        if self.cap is None or not self.cap.isOpened():
            self.cap = cv2.VideoCapture(self.camera_index)
            if not self.cap.isOpened():
                self.cap = None
                return False
        return True

    def stop_webcam(self) -> None:
        """Releases the camera device."""
        if self.cap is not None:
            self.cap.release()
            self.cap = None

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """Reads a frame from the live physical camera."""
        if self.cap is not None and self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret and frame is not None:
                return True, frame
        return False, None

    def generate_simulated_frame(
        self, t: Optional[float] = None
    ) -> Tuple[np.ndarray, float, List[float]]:
        """Generates an aesthetic editorial classroom scene with simulated student faces.

        Creates realistic organic micro-movements, periodic note-taking posture shifts,
        sustained presence transitions, transient walk-by candidates, and rich 16-band audio spectrum.
        """
        if t is None:
            t = time.time() - self.sim_start_time

        width, height = 640, 480
        # Create warm dark studio background with subtle vertical architectural gradient
        canvas = np.zeros((height, width, 3), dtype=np.uint8)
        for y in range(height):
            ratio = y / float(height)
            b = int(C_ESPRESSO[0] * (1 - ratio * 0.35) + C_ROAST[0] * (ratio * 0.35))
            g = int(C_ESPRESSO[1] * (1 - ratio * 0.35) + C_ROAST[1] * (ratio * 0.35))
            r = int(C_ESPRESSO[2] * (1 - ratio * 0.35) + C_ROAST[2] * (ratio * 0.35))
            canvas[y, :] = (b, g, r)

        # Draw architectural studio background grid and partition lines
        for x_grid in range(60, width, 120):
            cv2.line(canvas, (x_grid, 0), (x_grid, 340), (32, 42, 60), 1)
        for y_grid in range(60, 340, 70):
            cv2.line(canvas, (0, y_grid), (width, y_grid), (32, 42, 60), 1)

        # Background studio window / warm luminaire panel (top-center)
        cv2.rectangle(canvas, (240, 20), (400, 110), (35, 48, 70), -1)
        cv2.rectangle(canvas, (240, 20), (400, 110), C_MOCHA, 1)
        cv2.putText(
            canvas,
            "ATELIER // STUDIO 04",
            (250, 42),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.32,
            C_LATTE,
            1,
            cv2.LINE_AA,
        )

        # Background Corridor Walk-by Participant (Transient Candidate):
        # Briskly walks across frame every 26 seconds from t=3.0s to 7.0s (duration 4.0s)
        # Demonstrates anti-false-positive rejection: never reaches 10s threshold!
        w_cycle = t % 26.0
        if 3.0 <= w_cycle <= 7.2:
            walk_progress = (w_cycle - 3.0) / 4.2
            # Move from x = -50 to x = 690
            walk_x = int(-50 + walk_progress * 740)
            walk_bounce = int(math.sin(w_cycle * 14.0) * 3.5)
            walk_y = 175 + walk_bounce
            self._draw_stylized_person(
                canvas,
                cx=walk_x,
                cy=walk_y,
                scale=0.74,
                is_nodding=False,
                is_taking_notes=False,
                t=t,
                hair_style="short",
            )

        # Studio Desk surface
        desk_y = 350
        cv2.line(canvas, (0, desk_y), (width, desk_y), C_MOCHA, 2)
        cv2.rectangle(canvas, (0, desk_y), (width, height), (18, 24, 34), -1)

        # Studio desk details: open dot-grid sketchbook & coffee cup
        self._draw_desk_accessories(canvas, desk_y, t)

        # --- SEATED STUDENTS ---
        # Student 1: Sustained present student on left (Elena Rostova - TRK-01)
        # Present continuously from t=0. Smooth organic breathing & attentive nods.
        s1_breath = math.sin(t * 1.5) * 2.5
        s1_sway = math.cos(t * 0.7) * 4.0
        s1_x = int(170 + s1_sway)
        s1_y = int(225 + s1_breath)
        self._draw_stylized_person(
            canvas,
            cx=s1_x,
            cy=s1_y,
            scale=1.02,
            is_nodding=True,
            is_taking_notes=False,
            t=t,
            hair_style="parted",
        )

        # Student 2: Centered active learner with periodic note-taking shifts (Julian Sterling - TRK-02)
        # Every 16 seconds, enters a 4.5s note-taking shift: head tilts down towards sketchbook
        note_cycle = t % 16.0
        is_taking_notes = (8.0 <= note_cycle <= 12.8)
        note_progress = 0.0
        if is_taking_notes:
            # Smooth bell curve for posture transition
            note_rel = (note_cycle - 8.0) / 4.8
            note_progress = math.sin(note_rel * math.pi)

        s2_sway = math.sin(t * 0.5) * 5.0
        s2_head_drop = int(note_progress * 14.0)
        s2_x = int(330 + s2_sway)
        s2_y = int(210 + s2_head_drop)
        self._draw_stylized_person(
            canvas,
            cx=s2_x,
            cy=s2_y,
            scale=1.12,
            is_nodding=not is_taking_notes,
            is_taking_notes=is_taking_notes,
            t=t,
            hair_style="curled",
        )

        # Student 3: Right desk participant (Clara Vance - TRK-03)
        # Sits down at t >= 5.0s, clearly demonstrating 0.0s -> 10.0s verification transition!
        if t >= 5.0:
            s3_sway = math.cos(t * 0.9) * 4.5
            s3_breath = math.sin(t * 1.3) * 2.0
            s3_x = int(485 + s3_sway)
            s3_y = int(235 + s3_breath)
            self._draw_stylized_person(
                canvas,
                cx=s3_x,
                cy=s3_y,
                scale=0.98,
                is_nodding=True,
                is_taking_notes=False,
                t=t,
                hair_style="ponytail",
            )

        # Draw real-time acoustic waveform along the desk border
        self._draw_acoustic_wave(canvas, width, height, t)

        # Compute synthetic audio RMS and 16-band spectrum
        # Base room hum + dialogue bursts every ~6-9 seconds
        dialogue_active = (math.sin(t * 0.45) > 0.35)
        if dialogue_active:
            # Active dialogue with speech cadence modulation
            base_rms = 0.045 + 0.035 * (math.sin(t * 3.8) * 0.5 + 0.5)
        else:
            # Ambient contemplative studio atmosphere
            base_rms = 0.012 + 0.008 * (math.sin(t * 1.2) * 0.5 + 0.5)

        synthetic_audio_rms = float(max(0.005, base_rms))

        # Generate realistic 16-band frequency bins
        spectral_bins = self._generate_synthetic_spectrum(
            rms=synthetic_audio_rms, is_speech=dialogue_active, t=t
        )
        self.latest_spectral_bins = spectral_bins

        # Draw live spectrum visualizer on bottom right corner of simulation canvas
        self._draw_canvas_spectrum(canvas, spectral_bins, width, height)

        # Telemetry timestamp watermark
        timestamp_str = time.strftime("REC %H:%M:%S.00 UTC // SIMULATED STUDIO ATELIER", time.gmtime())
        cv2.putText(
            canvas,
            timestamp_str,
            (20, 28),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.38,
            C_LATTE,
            1,
            cv2.LINE_AA,
        )

        return canvas, synthetic_audio_rms, spectral_bins

    def _draw_desk_accessories(self, canvas: np.ndarray, desk_y: int, t: float) -> None:
        """Renders tactile architectural studio artifacts on the desk surface."""
        # Open Sketchbook in front of center student (x: 290 to 390, y: desk_y+10 to desk_y+65)
        pts_book = np.array(
            [
                [285, desk_y + 12],
                [385, desk_y + 12],
                [395, desk_y + 60],
                [275, desk_y + 60],
            ],
            np.int32,
        )
        cv2.fillPoly(canvas, [pts_book], C_CREMA)
        cv2.polylines(canvas, [pts_book], True, C_MOCHA, 1)
        # Book spine
        cv2.line(canvas, (335, desk_y + 12), (335, desk_y + 60), C_ROAST, 1)
        # Subtle pencil lines on notebook
        for dy in range(desk_y + 20, desk_y + 55, 8):
            cv2.line(canvas, (295, dy), (325, dy), C_LATTE, 1)
            cv2.line(canvas, (345, dy), (380, dy), C_LATTE, 1)

        # Ceramic espresso cup with rising steam (x: 100, y: desk_y + 25)
        cup_cx, cup_cy = 90, desk_y + 30
        cv2.circle(canvas, (cup_cx, cup_cy), 12, C_CREMA, -1)
        cv2.circle(canvas, (cup_cx, cup_cy), 12, C_MOCHA, 2)
        cv2.circle(canvas, (cup_cx, cup_cy), 8, C_ROAST, -1)  # espresso liquid

        # Rising delicate steam line
        steam_y1 = cup_cy - 16 - int((t * 20) % 25)
        steam_x1 = cup_cx + int(math.sin(t * 3.0) * 4.0)
        cv2.line(canvas, (steam_x1, steam_y1), (steam_x1 + 2, steam_y1 - 10), C_LATTE, 1)

    def _draw_stylized_person(
        self,
        canvas: np.ndarray,
        cx: int,
        cy: int,
        scale: float,
        is_nodding: bool,
        is_taking_notes: bool,
        t: float,
        hair_style: str = "parted",
    ) -> None:
        """Renders an anatomically recognizable face/torso silhouette that OpenCV Haar Cascade reliably detects."""
        head_r = int(38 * scale)
        shoulder_w = int(122 * scale)
        torso_h = int(145 * scale)

        # If taking notes, face is slightly foreshortened and head tilted down
        aspect_ratio = 0.94 if is_taking_notes else 1.0

        # Torso / Shoulders
        torso_top = cy + int(head_r * aspect_ratio) - 6
        pts_torso = np.array(
            [
                [cx - shoulder_w // 2, torso_top + torso_h],
                [cx - shoulder_w // 2 + 10, torso_top + 32],
                [cx - 22, torso_top + 12],
                [cx + 22, torso_top + 12],
                [cx + shoulder_w // 2 - 10, torso_top + 32],
                [cx + shoulder_w // 2, torso_top + torso_h],
            ],
            np.int32,
        )
        cv2.fillPoly(canvas, [pts_torso], C_ROAST)
        cv2.polylines(canvas, [pts_torso], True, C_MOCHA, 2)

        # Collar / neckline in latte
        cv2.line(canvas, (cx - 18, torso_top + 12), (cx, torso_top + 28), C_LATTE, 2)
        cv2.line(canvas, (cx + 18, torso_top + 12), (cx, torso_top + 28), C_LATTE, 2)

        # Note-taking hand / arm extending onto desk
        if is_taking_notes:
            hand_x = cx + int(35 * scale) + int(math.sin(t * 12.0) * 2.0)
            hand_y = torso_top + int(90 * scale)
            cv2.ellipse(canvas, (hand_x, hand_y), (10, 6), 30, 0, 360, C_CREMA, -1)
            cv2.ellipse(canvas, (hand_x, hand_y), (10, 6), 30, 0, 360, C_MOCHA, 1)
            # Stylus / pencil
            cv2.line(canvas, (hand_x - 12, hand_y - 12), (hand_x + 8, hand_y + 4), C_CARAMEL, 2)

        # Head / Face oval (sized and shaded to trigger Haar multi-scale cascade reliably)
        head_center = (cx, cy)
        rx = int(head_r * 0.86)
        ry = int(head_r * aspect_ratio)
        cv2.ellipse(canvas, head_center, (rx, ry), 0, 0, 360, C_CREMA, -1)
        cv2.ellipse(canvas, head_center, (rx, ry), 0, 0, 360, C_MOCHA, 2)

        # Stylized hair cap (high contrast edge at forehead triggers Haar horizontal feature)
        if hair_style == "parted":
            cv2.ellipse(canvas, (cx, cy - int(ry * 0.35)), (int(rx * 1.02), int(ry * 0.68)), 0, 180, 360, C_ROAST, -1)
            # Parted sweep
            cv2.line(canvas, (cx - 8, cy - int(ry * 0.7)), (cx + 14, cy - int(ry * 0.25)), C_MOCHA, 2)
        elif hair_style == "curled":
            cv2.ellipse(canvas, (cx, cy - int(ry * 0.32)), (int(rx * 1.05), int(ry * 0.72)), 0, 175, 365, (20, 28, 42), -1)
        elif hair_style == "ponytail":
            cv2.ellipse(canvas, (cx, cy - int(ry * 0.35)), (int(rx * 1.02), int(ry * 0.65)), 0, 180, 360, C_ROAST, -1)
            # Ponytail bun on left
            cv2.circle(canvas, (cx - rx - 4, cy - 8), 10, C_ROAST, -1)
        else:
            cv2.ellipse(canvas, (cx, cy - int(ry * 0.38)), (int(rx * 1.0), int(ry * 0.60)), 0, 180, 360, C_ROAST, -1)

        # High-contrast facial landmarks (eyebrows, eyes, nose, mouth)
        # Eyebrows
        brow_y = cy - int(12 * scale * aspect_ratio)
        eye_y = cy - int(5 * scale * aspect_ratio)
        eye_spacing = int(16 * scale)

        cv2.line(canvas, (cx - eye_spacing - 6, brow_y), (cx - eye_spacing + 6, brow_y), C_ROAST, 2)
        cv2.line(canvas, (cx + eye_spacing - 6, brow_y), (cx + eye_spacing + 6, brow_y), C_ROAST, 2)

        # Eyes: dark sockets + pupils with bright reflection
        # If taking notes, eyes look down towards desk
        gaze_offset_y = 2 if is_taking_notes else 0
        cv2.circle(canvas, (cx - eye_spacing, eye_y), int(4 * scale), C_ROAST, -1)
        cv2.circle(canvas, (cx + eye_spacing, eye_y), int(4 * scale), C_ROAST, -1)
        # Sclera / corneal highlight
        cv2.circle(canvas, (cx - eye_spacing - 1, eye_y - 1 + gaze_offset_y), int(1.2 * scale), C_CREMA, -1)
        cv2.circle(canvas, (cx + eye_spacing - 1, eye_y - 1 + gaze_offset_y), int(1.2 * scale), C_CREMA, -1)

        # Nose bridge and nostrils
        nose_y = cy + int(6 * scale * aspect_ratio)
        cv2.line(canvas, (cx, eye_y + 4), (cx, nose_y), C_MOCHA, 2)
        cv2.circle(canvas, (cx - 3, nose_y + 1), 1, C_MOCHA, -1)
        cv2.circle(canvas, (cx + 3, nose_y + 1), 1, C_MOCHA, -1)

        # Mouth line
        mouth_y = cy + int(18 * scale * aspect_ratio)
        cv2.line(
            canvas,
            (cx - int(10 * scale), mouth_y),
            (cx + int(10 * scale), mouth_y),
            C_ROAST,
            2,
        )

    def _draw_acoustic_wave(self, canvas: np.ndarray, w: int, h: int, t: float) -> None:
        """Draws subtle real-time audio wave pulses along desk border."""
        wave_pts = []
        start_x = w - 190
        center_y = h - 35
        for i, x in enumerate(range(start_x, w - 20, 4)):
            amp = math.sin(t * 4.5 + i * 0.35) * 11.0 * math.sin(i * 0.08)
            y = int(center_y + amp)
            wave_pts.append((x, y))

        if len(wave_pts) > 1:
            for i in range(len(wave_pts) - 1):
                cv2.line(canvas, wave_pts[i], wave_pts[i + 1], C_CARAMEL, 2)

    def _draw_canvas_spectrum(
        self, canvas: np.ndarray, bins: List[float], w: int, h: int
    ) -> None:
        """Renders mini 16-bar analog equalizer in lower-right telemetry overlay."""
        start_x = w - 190
        base_y = h - 14
        bar_w = 7
        gap = 3
        max_h = 24

        cv2.putText(
            canvas,
            "SPECTRUM 16-CH",
            (start_x, base_y - max_h - 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.28,
            C_LATTE,
            1,
            cv2.LINE_AA,
        )

        for i, val in enumerate(bins):
            bx = start_x + i * (bar_w + gap)
            bar_h = max(2, int(val * max_h))
            by = base_y - bar_h
            # Background track
            cv2.line(canvas, (bx, base_y), (bx + bar_w, base_y), C_ROAST, 1)
            # Active bar
            color = C_CARAMEL if val > 0.55 else C_LATTE
            cv2.rectangle(canvas, (bx, by), (bx + bar_w - 1, base_y), color, -1)

    def _generate_synthetic_spectrum(
        self, rms: float, is_speech: bool, t: float
    ) -> List[float]:
        """Calculates 16 normalized frequency bins [0.0 - 1.0] for the visualizer."""
        energy_scale = np.clip((rms - 0.005) / 0.08, 0.05, 1.0)
        bins = [0.0] * 16

        syllable = 0.5 + 0.5 * math.sin(t * 20.0)
        vowel = 0.5 + 0.5 * math.cos(t * 8.5)

        if is_speech:
            bins[0] = 0.12 + 0.08 * math.sin(t * 2.1)
            bins[1] = 0.16 + 0.10 * math.cos(t * 2.7)
            bins[2] = 0.58 + 0.32 * energy_scale * (0.7 + 0.3 * syllable)
            bins[3] = 0.65 + 0.30 * energy_scale
            bins[4] = 0.52 + 0.28 * energy_scale
            bins[5] = 0.70 + 0.25 * energy_scale * (0.6 + 0.4 * vowel)
            bins[6] = 0.76 + 0.22 * energy_scale * (0.7 + 0.3 * syllable)
            bins[7] = 0.60 + 0.28 * energy_scale
            bins[8] = 0.54 + 0.32 * energy_scale * (0.5 + 0.5 * vowel)
            bins[9] = 0.45 + 0.30 * energy_scale
            bins[10] = 0.38 + 0.26 * energy_scale
            bins[11] = 0.30 + 0.35 * energy_scale * (math.sin(t * 9.5)**2)
            bins[12] = 0.24 + 0.30 * energy_scale
            bins[13] = 0.18 + 0.20 * energy_scale
            bins[14] = 0.12 + 0.10 * energy_scale
            bins[15] = 0.08 + 0.06 * energy_scale
        else:
            for i in range(16):
                decay = math.exp(-i * 0.18)
                shimmer = 0.03 * math.sin(t * 1.4 + i * 0.8)
                bins[i] = float(np.clip(0.04 + decay * 0.20 * energy_scale + shimmer, 0.02, 0.40))

        return [float(round(float(np.clip(v, 0.01, 1.0)), 3)) for v in bins]
