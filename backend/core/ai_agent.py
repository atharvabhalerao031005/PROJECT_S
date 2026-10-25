"""Pedagogical decision-support agent with Groq, Gemini 2.0 Flash, and 100% offline heuristic fallback."""
from typing import Dict, Any, Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()


class PedagogicalAgent:
    """Provides non-enforcing pedagogical pacing insights based on multimodal telemetry."""

    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")

        # Initialize Groq client if key exists
        self.groq_client = None
        if self.groq_api_key:
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=self.groq_api_key)
            except Exception:
                self.groq_client = None

        # Initialize Gemini client if key exists (supports modern google-genai and legacy google.generativeai)
        self.gemini_client = None
        self.is_modern_genai = False
        if self.gemini_api_key:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=self.gemini_api_key)
                self.is_modern_genai = True
            except Exception:
                try:
                    import google.generativeai as legacy_genai
                    legacy_genai.configure(api_key=self.gemini_api_key)
                    self.gemini_client = legacy_genai.GenerativeModel("gemini-2.0-flash")
                    self.is_modern_genai = False
                except Exception:
                    self.gemini_client = None

    def generate_suggestion(
        self,
        fused_score: float,
        trend: str,
        active_count: int,
        visual_attention: float,
        acoustic_score: float,
        movement_score: float,
        inactivity_penalty: float,
    ) -> Dict[str, Any]:
        """Synthesizes multimodal streams into a context-aware pedagogical recommendation."""

        # Attempt Groq LLM if configured
        if self.groq_client:
            try:
                return self._call_groq(
                    fused_score, trend, active_count, visual_attention, acoustic_score
                )
            except Exception:
                pass

        # Attempt Gemini Flash if configured (with strict 4.0s timeout to protect real-time FPS)
        if self.gemini_client:
            try:
                import concurrent.futures
                executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
                try:
                    future = executor.submit(
                        self._call_gemini,
                        fused_score, trend, active_count, visual_attention, acoustic_score
                    )
                    return future.result(timeout=6.5)
                finally:
                    executor.shutdown(wait=False, cancel_futures=True)
            except Exception:
                pass

        # High-craft deterministic offline heuristic engine (100% offline-ready)
        return self._offline_heuristic(
            fused_score, trend, active_count, visual_attention, acoustic_score, movement_score, inactivity_penalty
        )

    def _call_groq(
        self, fused: float, trend: str, count: int, visual: float, acoustic: float
    ) -> Dict[str, Any]:
        prompt = (
            f"You are an empathetic, studio-pedagogy advisor in an architectural and technical atelier. "
            f"Live Telemetry: Fused Engagement: {fused:.1f}/100, Trend: {trend}, Active Heads: {count}, "
            f"Visual Gaze: {visual:.1f}%, Acoustic RMS Score: {acoustic:.1f}%. "
            f"Generate a strictly two-sentence pedagogical recommendation. Sentence 1: diagnose the cohort dynamic. "
            f"Sentence 2: provide a concrete action (e.g. Socratic query, 2-minute paired sketch, vocal cadence shift). "
            f"Provide output as JSON: {{\"suggestion\": \"...\", \"pacing_action\": \"...\"}}"
        )

        response = self.groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile" if "llama-3.3" in str(self.groq_client) else "llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.4,
            max_tokens=180,
        )
        data = json.loads(response.choices[0].message.content)
        return {
            "suggestion": data.get("suggestion", "Cohort attention remains balanced and receptive."),
            "pacing_action": data.get("pacing_action", "Maintain Natural Rhythm"),
            "provider": "Groq Llama 3 (Online)",
        }

    def _call_gemini(
        self, fused: float, trend: str, count: int, visual: float, acoustic: float
    ) -> Dict[str, Any]:
        prompt = (
            f"You are an architectural studio pedagogical advisor observing classroom telemetry. "
            f"Current status: Fused Score {fused:.1f}/100, Trend: {trend}, Active Learners: {count}, "
            f"Visual Attention: {visual:.1f}%, Acoustic Score: {acoustic:.1f}%. "
            f"Respond in exactly two sentences recommending a pacing adjustment. "
            f"Return valid JSON with keys: suggestion and pacing_action."
        )

        if self.is_modern_genai:
            model_names = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-2.5-flash"]
            response = None
            used_model = "gemini-3.8-flash"
            for m in model_names:
                try:
                    response = self.gemini_client.models.generate_content(
                        model=m,
                        contents=prompt,
                    )
                    used_model = m
                    break
                except Exception:
                    continue
            if response is None:
                raise RuntimeError("All Gemini model variants failed")
            text = response.text.strip()
        else:
            response = self.gemini_client.generate_content(prompt)
            text = response.text.strip()
            used_model = "Gemini Flash"

        if "{" in text and "}" in text:
            raw_json = text[text.find("{") : text.rfind("}") + 1]
            data = json.loads(raw_json)
            return {
                "suggestion": data.get("suggestion", text),
                "pacing_action": data.get("pacing_action", "Calibrate Rhythm"),
                "provider": f"Gemini ({used_model}) (Online)",
            }
        return {
            "suggestion": text,
            "pacing_action": "Adaptive Cadence",
            "provider": f"Gemini ({used_model}) (Online)",
        }

    def _offline_heuristic(
        self,
        fused: float,
        trend: str,
        count: int,
        visual: float,
        acoustic: float,
        movement: float,
        inactivity: float,
    ) -> Dict[str, Any]:
        """Deterministic, nuanced heuristic rules mimicking expert studio coaching."""
        if count == 0:
            return {
                "suggestion": "The atelier space is currently calm with no active participants in frame. Standing by for the morning cohort to assemble.",
                "pacing_action": "Awaiting Cohort Arrival",
                "provider": "Offline Heuristic Engine (Local)",
            }

        if inactivity > 8.0 or (visual < 65.0 and fused < 60.0):
            return {
                "suggestion": "A subtle mid-morning cognitive slump is emerging with prolonged postural stillness. Prompt a 90-second turn-and-talk exercise or invite a peer sketch comparison to reactivate room energy.",
                "pacing_action": "Initiate 90s Turn-and-Talk",
                "provider": "Offline Heuristic Engine (Local)",
            }

        if acoustic > 85.0 and fused >= 75.0:
            return {
                "suggestion": "Vigorous acoustic interaction indicates lively participatory debate across the studio. Channel this organic momentum into structured Socratic inquiry before summarizing key takeaways.",
                "pacing_action": "Harness Dialogue into Socratic Prompt",
                "provider": "Offline Heuristic Engine (Local)",
            }

        if trend == "Attention Drop Detected":
            return {
                "suggestion": "Telemetry registers an incremental dip in visual gaze over the last three minutes. Shift vocal inflection or bring a physical sample/visual diagram to the primary display to anchor focus.",
                "pacing_action": "Anchor with Physical Diagram",
                "provider": "Offline Heuristic Engine (Local)",
            }

        if fused >= 80.0:
            return {
                "suggestion": "The cohort exhibits exceptional equilibrium across visual orientation and posture. Deepen the theoretical complexity of the concept now while receptive bandwidth is at its morning zenith.",
                "pacing_action": "Deepen Theoretical Rigor",
                "provider": "Offline Heuristic Engine (Local)",
            }

        return {
            "suggestion": "Classroom telemetry is settled within steady operational thresholds. Sustain the current narrative cadence and observe student note-taking progress.",
            "pacing_action": "Sustain Current Narrative Cadence",
            "provider": "Offline Heuristic Engine (Local)",
        }
