import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTelemetrySocket Hook
 * Coordinates WebSocket communication, WebRTC hardware webcam/mic, and synthetic simulation.
 * Includes WebAudio AnalyserNode pipeline for real-time PCM sample extraction, RMS computation,
 * and graceful fallback.
 */
export function useTelemetrySocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [micRms, setMicRms] = useState(0.015);
  const [annotatedFrame, setAnnotatedFrame] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [metrics, setMetrics] = useState({
    active_count: 0,
    visual_attention: 0,
    acoustic_interaction: 0,
    audio_db: null,
    is_speech_active: false,
    movement_dynamics: 0,
    inactivity_penalty: 0,
    fused_score: 0,
    trend: 'Standby — Awaiting Stream',
    fused_history: [],
    spectral_bins: Array(16).fill(0.02),
  });
  const [aiSuggestion, setAiSuggestion] = useState({
    suggestion: "Telemetry rig is in standby. Initialize local camera and microphone or launch classroom simulation to begin real-time pedagogical observation.",
    pacing_action: "Awaiting Live Sensor Activation",
    provider: "Standby Engine",
  });

  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const videoElemRef = useRef(null);
  const canvasElemRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const isMicMutedRef = useRef(false);
  const audioRmsRef = useRef(0.015);
  const intervalRef = useRef(null);

  // Initialize hidden video and canvas for frame capture
  useEffect(() => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    videoElemRef.current = video;

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvasElemRef.current = canvas;

    return () => {
      stopHardware();
    };
  }, []);

  const getWsUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    // When running with Vite proxy or direct port
    if (window.location.port === '5173') {
      return `ws://localhost:8000/ws/stream`;
    }
    return `${protocol}//${window.location.host}/ws/stream`;
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return wsRef.current;
    }

    const socketUrl = getWsUrl();
    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.annotated_frame) {
          setAnnotatedFrame(data.annotated_frame);
        }
        if (data.participants) {
          setParticipants(data.participants);
        }
        if (data.metrics) {
          setMetrics((prev) => ({
            ...prev,
            ...data.metrics,
            spectral_bins:
              data.metrics.spectral_bins && data.metrics.spectral_bins.length === 16
                ? data.metrics.spectral_bins
                : prev.spectral_bins,
          }));
        }
        if (data.ai_suggestion) {
          setAiSuggestion(data.ai_suggestion);
        }
      } catch (err) {
        // Safe json handling
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    wsRef.current = ws;
    return ws;
  }, [getWsUrl]);

  const captureAndSend = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (isSimulating) {
      wsRef.current.send(JSON.stringify({
        simulate: true,
      }));
      return;
    }

    // Capture from real webcam
    const video = videoElemRef.current;
    const canvas = canvasElemRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameBase64 = canvas.toDataURL('image/jpeg', 0.65);

    // Extract time-domain PCM float samples & calculate real RMS
    let timeData = new Float32Array(512);
    let rms = 0.015;
    let extractedBins = null;

    if (audioAnalyserRef.current && !isMicMutedRef.current) {
      const analyser = audioAnalyserRef.current;
      timeData = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(timeData);

      let sum = 0;
      for (let i = 0; i < timeData.length; i++) {
        sum += timeData[i] * timeData[i];
      }
      rms = Math.sqrt(sum / timeData.length);
      if (isNaN(rms)) rms = 0.001;

      audioRmsRef.current = rms;
      setMicRms(rms);

      // Compute 16 frequency bands for zero-latency local spectrum responsiveness
      const freqArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqArray);
      const binCount = 16;
      const binWidth = Math.max(1, Math.floor((freqArray.length * 0.7) / binCount));
      extractedBins = [];
      for (let b = 0; b < binCount; b++) {
        let bSum = 0;
        for (let j = 0; j < binWidth; j++) {
          bSum += freqArray[b * binWidth + j] || 0;
        }
        extractedBins.push(Number(Math.max(0.04, bSum / (binWidth * 255)).toFixed(3)));
      }
    } else {
      // Muted or no audio track
      rms = 0.005;
      audioRmsRef.current = rms;
      setMicRms(rms);
    }

    // Local state immediate refresh for instant feedback
    const dbVal = rms > 1e-5 ? Math.max(-60, 20 * Math.log10(rms)) : -60;
    setMetrics((prev) => ({
      ...prev,
      audio_db: Number(dbVal.toFixed(1)),
      is_speech_active: dbVal > -38,
      ...(extractedBins && extractedBins.length === 16 ? { spectral_bins: extractedBins } : {}),
    }));

    // Send payload to WebSocket /ws/stream adhering strictly to contract
    wsRef.current.send(JSON.stringify({
      frame: frameBase64,
      image: frameBase64,
      audio_samples: Array.from(timeData.slice(0, 128)),
      mic_rms: rms,
      audio_rms: rms,
      simulate: false,
    }));
  }, [isSimulating]);

  const stopHardware = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.disconnect();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    if (audioAnalyserRef.current) {
      try {
        audioAnalyserRef.current.disconnect();
      } catch (e) {}
      audioAnalyserRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch (e) {}
      audioContextRef.current = null;
    }
    if (videoElemRef.current) {
      videoElemRef.current.srcObject = null;
    }
    setHasMic(false);
    setIsMicMuted(false);
    isMicMutedRef.current = false;
  }, []);

  const startSimulationStream = useCallback(() => {
    setIsSimulating(true);
    setIsStreaming(true);
    stopHardware();

    connectWebSocket();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ simulate: true }));
      }
    }, 150); // ~6-7 fps for simulated telemetry stream
  }, [connectWebSocket, stopHardware]);

  const startWebcam = useCallback(async () => {
    setIsSimulating(false);
    stopHardware();

    let stream = null;
    let micActive = false;

    // 1. Request video with ideal dimensions and real microphone audio
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      micActive = true;
    } catch (avErr) {
      console.warn("Audio+Video getUserMedia failed, attempting video-only fallback:", avErr);
      // 2. Graceful fallback if audio permission is denied or no mic is present
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        micActive = false;
      } catch (vErr) {
        console.warn("Hardware camera unavailable or denied, falling back to simulation:", vErr);
        startSimulationStream();
        return;
      }
    }

    mediaStreamRef.current = stream;
    setHasMic(micActive);
    setIsMicMuted(false);
    isMicMutedRef.current = false;

    if (videoElemRef.current) {
      videoElemRef.current.srcObject = stream;
      try {
        await videoElemRef.current.play();
      } catch (pErr) {
        console.warn("Video element play error:", pErr);
      }
    }

    // Initialize Web AudioContext & AnalyserNode
    if (micActive) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.35;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        audioAnalyserRef.current = analyser;
        audioSourceRef.current = source;

        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
      } catch (audioErr) {
        console.warn("WebAudio initialization error:", audioErr);
        setHasMic(false);
      }
    }

    setIsStreaming(true);
    connectWebSocket();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(captureAndSend, 160);
  }, [connectWebSocket, captureAndSend, startSimulationStream, stopHardware]);

  const toggleMicMute = useCallback(() => {
    setIsMicMuted((prev) => {
      const next = !prev;
      isMicMutedRef.current = next;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !next;
        });
      }
      return next;
    });
  }, []);

  const stopWebcam = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopHardware();
    setIsStreaming(false);
    setIsSimulating(false);
  }, [stopHardware]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopHardware();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stopHardware]);

  return {
    isConnected,
    isStreaming,
    isSimulating,
    hasMic,
    isMicMuted,
    micRms,
    annotatedFrame,
    participants,
    metrics,
    aiSuggestion,
    startWebcam,
    startHardwareStream: startWebcam,
    startSimulationStream,
    stopWebcam,
    stopStream: stopWebcam,
    toggleMicMute,
  };
}
