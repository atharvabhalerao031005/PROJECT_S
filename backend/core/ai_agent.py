"""Pedagogical decision-support agent with Groq, Gemini 3.5 Flash, and deterministic 6-state matrix offline engine."""
from typing import Dict, Any, Optional
import os
import json
import time
import concurrent.futures
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

        # Initialize Gemini client if key exists
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
                    self.gemini_client = legacy_genai.GenerativeModel("gemini-1.5-flash")
                    self.is_modern_genai = False
                except Exception:
                    self.gemini_client = None

        # 10-second Throttling Cache & Rate Protection State
        self.last_query_time: float = 0.0
        self.last_trend: Optional[str] = None
        self.cached_insight: Optional[Dict[str, Any]] = None

    def generate_suggestion(
        self,
        fused_score: float,
        trend: str,
        active_count: int,
        visual_attention: float,
        acoustic_score: float,
        movement_score: float = 70.0,
        inactivity_penalty: float = 0.0,
        is_speech: bool = False,
        force_refresh: bool = False,
    ) -> Dict[str, Any]:
        """Synthesizes multimodal telemetry streams into a context-aware pedagogical recommendation.

        Rate Protection: Uses an internal 10-second cache. LLMs are only queried if the trend changes,
        at least 10 seconds have elapsed, or force_refresh is requested.
        """
        now = time.time()
        elapsed = now - self.last_query_time
        trend_changed = (trend != self.last_trend)

        # Re-use cached insight if within 10 seconds and trend hasn't changed
        if (
            not force_refresh
            and self.cached_insight is not None
            and not trend_changed
            and elapsed < 10.0
        ):
            return self.cached_insight

        # Query LLM or fallback
        result = self._query_decision_engine(
            fused_score=fused_score,
            trend=trend,
            active_count=active_count,
            visual_attention=visual_attention,
            acoustic_score=acoustic_score,
            movement_score=movement_score,
            inactivity_penalty=inactivity_penalty,
            is_speech=is_speech,
        )

        # Update cache state
        self.cached_insight = result
        self.last_query_time = now
        self.last_trend = trend

        return result

    def _query_decision_engine(
        self,
        fused_score: float,
        trend: str,
        active_count: int,
        visual_attention: float,
        acoustic_score: float,
        movement_score: float,
        inactivity_penalty: float,
        is_speech: bool,
    ) -> Dict[str, Any]:
        """Queries Groq (llama-3.1-8b-instant), Gemini 3.5 Flash, or the deterministic 6-state engine."""
        # 1. Attempt Groq llama-3.1-8b-instant if configured
        if self.groq_client:
            try:
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(
                        self._call_groq,
                        fused_score,
                        trend,
                        active_count,
                        visual_attention,
                        acoustic_score,
                        movement_score,
                        inactivity_penalty,
                        is_speech,
                    )
                    return future.result(timeout=4.0)
            except Exception:
                pass

        # 2. Attempt Gemini gemini-3.5-flash / gemini-3.5-flash-lite if configured
        if self.gemini_client:
            try:
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(
                        self._call_gemini,
                        fused_score,
                        trend,
                        active_count,
                        visual_attention,
                        acoustic_score,
                        movement_score,
                        inactivity_penalty,
                        is_speech,
                    )
                    return future.result(timeout=4.5)
            except Exception:
                pass

        # 3. High-craft deterministic 6-state matrix offline engine (always available as fallback)
        return self._offline_6state_heuristic(
            fused_score=fused_score,
            trend=trend,
            active_count=active_count,
            visual_attention=visual_attention,
            acoustic_score=acoustic_score,
            movement_score=movement_score,
            inactivity_penalty=inactivity_penalty,
            is_speech=is_speech,
        )

    def _build_telemetry_prompt(
        self,
        fused: float,
        trend: str,
        count: int,
        visual: float,
        acoustic: float,
        movement: float,
        inactivity: float,
        is_speech: bool,
    ) -> str:
        return (
            "You are an empathetic, studio-pedagogy advisor in an architectural and technical atelier. "
            f"Live Telemetry: Fused Engagement: {fused:.1f}/100, Trend: {trend}, Active Learners: {count}, "
            f"Visual Gaze: {visual:.1f}%, Acoustic Score: {acoustic:.1f}%, Movement Score: {movement:.1f}%, "
            f"Inactivity Penalty: {inactivity:.1f}, Speech Active: {is_speech}. "
            "Pedagogical Guidelines: "
            "- If visual attention dropped (< 50%): address gaze drift / screen fatigue. "
            "- If inactivity penalty is high: prompt physical posture shift / quick sketch break. "
            "- If speech is active and acoustic score high: recognize interactive dialogue and recommend constructive facilitation. "
            "- If room is in steady plateau: recommend deepening theoretical complexity. "
            "Provide a strictly 2-sentence pedagogical recommendation as valid JSON with keys: "
            '{"suggestion": "Sentence 1 dynamic diagnosis. Sentence 2 actionable pacing adjustment.", "pacing_action": "3-5 word action label"}'
        )

    def _call_groq(
        self,
        fused: float,
        trend: str,
        count: int,
        visual: float,
        acoustic: float,
        movement: float,
        inactivity: float,
        is_speech: bool,
    ) -> Dict[str, Any]:
        prompt = self._build_telemetry_prompt(
            fused, trend, count, visual, acoustic, movement, inactivity, is_speech
        )
        response = self.groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.4,
            max_tokens=120,
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return {
            "suggestion": data.get("suggestion", "Cohort attention remains balanced and receptive."),
            "pacing_action": data.get("pacing_action", "Maintain Natural Rhythm"),
            "provider": "Groq Llama 3.1 Instant (Online)",
        }

    def _call_gemini(
        self,
        fused: float,
        trend: str,
        count: int,
        visual: float,
        acoustic: float,
        movement: float,
        inactivity: float,
        is_speech: bool,
    ) -> Dict[str, Any]:
        prompt = self._build_telemetry_prompt(
            fused, trend, count, visual, acoustic, movement, inactivity, is_speech
        )

        if self.is_modern_genai:
            from google.genai import types

            candidate_models = ["gemini-3.5-flash", "gemini-3.5-flash-lite"]
            last_err = None
            for model_name in candidate_models:
                configs_to_try = [
                    types.GenerateContentConfig(
                        max_output_tokens=120,
                        temperature=0.4,
                        response_mime_type="application/json",
                        thinking_config=types.ThinkingConfig(thinking_budget=0),
                    ),
                    types.GenerateContentConfig(
                        max_output_tokens=120,
                        temperature=0.4,
                        response_mime_type="application/json",
                    ),
                ]
                for config in configs_to_try:
                    try:
                        response = self.gemini_client.models.generate_content(
                            model=model_name,
                            contents=prompt,
                            config=config,
                        )
                        text = response.text.strip()
                        if "{" in text and "}" in text:
                            raw_json = text[text.find("{") : text.rfind("}") + 1]
                            data = json.loads(raw_json)
                            return {
                                "suggestion": data.get("suggestion", text),
                                "pacing_action": data.get("pacing_action", "Calibrate Rhythm"),
                                "provider": f"Gemini ({model_name}) (Online)",
                            }
                        return {
                            "suggestion": text,
                            "pacing_action": "Adaptive Cadence",
                            "provider": f"Gemini ({model_name}) (Online)",
                        }
                    except Exception as exc:
                        last_err = exc
                        continue
            raise RuntimeError(f"All Gemini models failed: {last_err}")
        else:
            response = self.gemini_client.generate_content(
                prompt,
                generation_config={"max_output_tokens": 120, "temperature": 0.4},
            )
            text = response.text.strip()
            if "{" in text and "}" in text:
                raw_json = text[text.find("{") : text.rfind("}") + 1]
                data = json.loads(raw_json)
                return {
                    "suggestion": data.get("suggestion", text),
                    "pacing_action": data.get("pacing_action", "Calibrate Rhythm"),
                    "provider": "Gemini Flash (Legacy) (Online)",
                }
            return {
                "suggestion": text,
                "pacing_action": "Adaptive Cadence",
                "provider": "Gemini Flash (Legacy) (Online)",
            }

    def _offline_6state_heuristic(
        self,
        fused_score: float,
        trend: str,
        active_count: int,
        visual_attention: float,
        acoustic_score: float,
        movement_score: float,
        inactivity_penalty: float,
        is_speech: bool,
    ) -> Dict[str, Any]:
        """High-craft deterministic 6-state matrix offline engine."""
        # State 1: Empty Room / Awaiting Cohort
        if active_count == 0:
            return {
                "suggestion": "The atelier space is currently calm with no active participants in frame. Standing by for the morning cohort to assemble.",
                "pacing_action": "Awaiting Cohort Arrival",
                "provider": "Offline Heuristic Engine (Local)",
            }

        # State 2: Visual Gaze Drift & Screen Fatigue (< 50% visual attention or drop detected)
        if visual_attention < 50.0 or (trend == "Attention Drop Detected" and visual_attention < 60.0):
            return {
                "suggestion": "Visual attention has dropped below 50%, indicating emerging gaze drift or screen fatigue across the room. Re-anchor learner focus by spotlighting a central architectural sketch or altering vocal cadence.",
                "pacing_action": "Address Gaze Drift & Screen Fatigue",
                "provider": "Offline Heuristic Engine (Local)",
            }

        # State 3: High Inactivity Penalty / Prolonged Stillness (inactivity_penalty >= 5.0 or movement < 30%)
        if inactivity_penalty >= 5.0 or movement_score < 30.0:
            return {
                "suggestion": "Extended postural stillness and an elevated inactivity penalty suggest a physical energy lull. Prompt a 2-minute tactile sketch break or a quick posture shift to reactivate motor alertness.",
                "pacing_action": "Prompt Posture Shift / Sketch Break",
                "provider": "Offline Heuristic Engine (Local)",
            }

        # State 4: Active Speech & High Acoustic Interaction (speech active and acoustic_score >= 70%)
        if is_speech and acoustic_score >= 70.0:
            return {
                "suggestion": "Active speech dynamics and high acoustic resonance reflect vigorous collaborative dialogue across the studio. Channel this organic momentum into structured peer debate and Socratic facilitation.",
                "pacing_action": "Facilitate Interactive Dialogue",
                "provider": "Offline Heuristic Engine (Local)",
            }

        # State 5: Steady Plateau & Cognitive Equilibrium (fused >= 75% or Steady Plateau)
        if fused_score >= 75.0 or trend == "Steady Plateau":
            return {
                "suggestion": "The cohort is maintaining exceptional cognitive equilibrium in a sustained plateau state. Seize this receptive window to deepen the theoretical complexity and nuance of the subject matter.",
                "pacing_action": "Deepen Theoretical Complexity",
                "provider": "Offline Heuristic Engine (Local)",
            }

        # State 6: Baseline Operational Cadence
        return {
            "suggestion": "Classroom telemetry is settled within steady operational thresholds. Sustain the current narrative cadence and observe student note-taking progress.",
            "pacing_action": "Sustain Current Narrative Cadence",
            "provider": "Offline Heuristic Engine (Local)",
        }
