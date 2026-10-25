import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTelemetrySocket Hook
 * Coordinates WebSocket communication, WebRTC hardware webcam/mic, and synthetic simulation
 */
export function useTelemetrySocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [annotatedFrame, setAnnotatedFrame] = useState(null);
  const [participants, setParticipants] = useState([
    { track_id: "Participant 01", sustained_seconds: 420.5, status: "Verified Present", head_pose_score: 92.4, bbox: [120, 90, 110, 130] },
    { track_id: "Participant 02", sustained_seconds: 395.2, status: "Verified Present", head_pose_score: 87.1, bbox: [280, 85, 105, 125] },
    { track_id: "Participant 03", sustained_seconds: 14.8, status: "Verified Present", head_pose_score: 79.5, bbox: [430, 95, 115, 135] }
  ]);
  const [metrics, setMetrics] = useState({
    active_count: 3,
    visual_attention: 84.2,
    acoustic_interaction: 78.5,
    audio_db: -18.4,
    is_speech_active: true,
    movement_dynamics: 76.0,
    inactivity_penalty: 0.0,
    fused_score: 81.5,
    trend: 'Steady Plateau',
    fused_history: [78.2, 79.0, 80.4, 82.1, 81.5],
    spectral_bins: [0.18, 0.24, 0.36, 0.52, 0.74, 0.86, 0.82, 0.68, 0.55, 0.46, 0.38, 0.31, 0.25, 0.19, 0.13, 0.08],
  });
  const [aiSuggestion, setAiSuggestion] = useState({
    suggestion: "Cohort attention remains balanced and receptive. Transition smoothly into Socratic architectural critique without pausing for a formal break.",
    pacing_action: "Deepen Discussion Cadence",
    provider: "Offline Heuristic Engine (Local)",
  });

  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const videoElemRef = useRef(null);
  const canvasElemRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const audioRmsRef = useRef(0.02);
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
    const frameBase64 = canvas.toDataURL('image/jpeg', 0.75);

    // Read mic RMS & 16-bin frequency spectrum
    let currentRms = audioRmsRef.current;
    if (audioAnalyserRef.current) {
      const dataArray = new Uint8Array(audioAnalyserRef.current.fftSize);
      audioAnalyserRef.current.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      currentRms = Math.sqrt(sum / dataArray.length);

      // Compute 16 frequency bands (focusing on 20Hz - 12kHz range)
      const freqArray = new Uint8Array(audioAnalyserRef.current.frequencyBinCount);
      audioAnalyserRef.current.getByteFrequencyData(freqArray);
      const binCount = 16;
      const binWidth = Math.max(1, Math.floor((freqArray.length * 0.65) / binCount));
      const extractedBins = [];
      for (let b = 0; b < binCount; b++) {
        let bSum = 0;
        for (let j = 0; j < binWidth; j++) {
          bSum += freqArray[b * binWidth + j] || 0;
        }
        extractedBins.push(Number(Math.max(0.04, bSum / (binWidth * 255)).toFixed(3)));
      }
      setMetrics((prev) => ({
        ...prev,
        spectral_bins: extractedBins,
      }));
    }

    wsRef.current.send(JSON.stringify({
      simulate: false,
      image: frameBase64,
      audio_rms: currentRms,
    }));
  }, [isSimulating]);

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
    }, 120); // ~8-10 fps for telemetry stream
  }, [connectWebSocket]);

  const startHardwareStream = useCallback(async () => {
    setIsSimulating(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
      mediaStreamRef.current = stream;

      if (videoElemRef.current) {
        videoElemRef.current.srcObject = stream;
        videoElemRef.current.play();
      }

      // Audio setup
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      audioAnalyserRef.current = analyser;

      setIsStreaming(true);
      connectWebSocket();

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(captureAndSend, 120);
    } catch (err) {
      // If hardware permissions are denied, fallback seamlessly to simulation mode
      startSimulationStream();
    }
  }, [connectWebSocket, captureAndSend, startSimulationStream]);

  const stopHardware = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (videoElemRef.current) {
      videoElemRef.current.srcObject = null;
    }
  }, []);

  const stopStream = useCallback(() => {
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
    annotatedFrame,
    participants,
    metrics,
    aiSuggestion,
    startHardwareStream,
    startSimulationStream,
    stopStream,
  };
}
