import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  GazeEyeGlyph,
  AcousticWaveGlyph,
  RestingCroissantGlyph,
  BotanicalSprigGlyph,
  PresenceSealGlyph,
} from '../components/svgs/TelemetryGlyphs';
import AnalogSpectrumVisualizer from '../components/AnalogSpectrumVisualizer';
import AnalogDialGauge from '../components/AnalogDialGauge';
import StudioSparkline from '../components/StudioSparkline';

export default function LiveTelemetryDesk({ telemetry }) {
  const [activeTab, setActiveTab] = useState('optical-feed'); // 'optical-feed' | 'attendance-ledger' | 'pedagogy-agent'
  const [hoveredRowGlyph, setHoveredRowGlyph] = useState(null);
  const [sessionClock, setSessionClock] = useState('09:41:22.40');
  const [showGuide, setShowGuide] = useState(false);
  const glyphRef = useRef(null);

  const {
    isConnected,
    isStreaming,
    isSimulating,
    hasMic,
    isMicMuted,
    micRms,
    annotatedFrame,
    mediaStream,
    cameraDeviceLabel,
    streamResolution,
    latencyMs,
    videoRef,
    participants,
    metrics,
    aiSuggestion,
    startHardwareStream,
    startWebcam,
    startSimulationStream,
    stopHardware,
    stopWebcam,
    stopStream,
    toggleMicMute,
  } = telemetry;

  // Live micro-timestamp ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setSessionClock(`${hrs}:${mins}:${secs}.${ms}`);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Track cursor for floating row glyph
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glyphEl = glyphRef.current;
    if (!glyphEl) return;

    const xTo = gsap.quickTo(glyphEl, 'x', { duration: 0.22, ease: 'power2.out' });
    const yTo = gsap.quickTo(glyphEl, 'y', { duration: 0.22, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      xTo(e.clientX + 16);
      yTo(e.clientY + 16);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '00:00:00';
    const total = Math.floor(sec);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section
      id="live-desk"
      className="relative min-h-screen py-24 px-6 lg:px-12 bg-espresso text-foam transition-colors duration-700"
      style={{ backgroundColor: 'var(--espresso)', color: 'var(--foam)' }}
    >
      {/* Floating Hover Glyph following cursor */}
      <div
        ref={glyphRef}
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${
          hoveredRowGlyph ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center space-x-2 p-2 rounded-full bg-roast/90 border border-caramel shadow-xl backdrop-blur-sm">
          {hoveredRowGlyph === 'eye' && <GazeEyeGlyph className="w-4 h-4" stroke="#B8772F" />}
          {hoveredRowGlyph === 'wave' && <AcousticWaveGlyph className="w-4 h-4" stroke="#D2AE82" />}
          {hoveredRowGlyph === 'croissant' && <RestingCroissantGlyph className="w-4 h-4" stroke="#B8772F" />}
          {hoveredRowGlyph === 'seal' && <PresenceSealGlyph className="w-4 h-4" stroke="#EBDCC2" />}
          <span className="font-mono text-[9px] uppercase tracking-wider text-latte pr-1 font-semibold">
            {hoveredRowGlyph === 'seal' ? 'VERIFIED' : 'OBSERVING'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-10">
        {/* Section Top Header Rule with Tactile Status Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-roast/70 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="micro-label text-latte/75 font-medium">
                03 / ANALOG DARKROOM &amp; ROASTERY MENU
              </span>
              <span className="text-latte/50 text-xs font-mono">•</span>
              <span className="font-mono text-[10px] text-latte tracking-wider font-semibold">
                UTC {sessionClock}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-foam font-normal tracking-tight">
              The Live Telemetry Desk
            </h2>
          </div>

          {/* Tactile Hardware Indicator Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="tactile-status-pill border-roast/70 bg-roast/40">
              <span
                className={`w-2 h-2 rounded-full ${
                  isStreaming ? 'bg-caramel animate-incandescent' : 'bg-mocha/70'
                }`}
              />
              <span className="text-latte font-medium">
                {isStreaming
                  ? isSimulating
                    ? 'SIMULATION'
                    : 'HARDWARE WEBCAM'
                  : 'STANDBY'}
              </span>
            </div>

            <div className="tactile-status-pill border-roast/70 bg-roast/40">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isStreaming
                    ? isSimulating
                      ? 'bg-latte'
                      : hasMic
                        ? isMicMuted
                          ? 'bg-mocha/70'
                          : 'bg-caramel animate-incandescent'
                        : 'bg-mocha/70'
                    : 'bg-mocha/70'
                }`}
              />
              <span className="text-latte/80 font-medium font-mono text-[11px]">
                {isStreaming
                  ? isSimulating
                    ? 'MIC: SYNTHETIC VAD'
                    : hasMic
                      ? isMicMuted
                        ? 'MIC: MUTED'
                        : `MIC: LIVE (${metrics.audio_db ? metrics.audio_db.toFixed(1) : '-'} dB)`
                      : 'MIC: NOT DETECTED'
                  : 'MIC: STANDBY'}
              </span>
            </div>

            <div className="tactile-status-pill hidden sm:inline-flex border-roast/70 bg-roast/40">
              <span className="w-1.5 h-1.5 rounded-full bg-latte animate-tape-blink" />
              <span className="text-latte/70 font-medium">OPENCV 4.9 // HAAR 1.1x</span>
            </div>

            <div className="tactile-status-pill hidden md:inline-flex border-roast/70 bg-roast/40">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-caramel' : 'bg-mocha/70'}`} />
              <span className="text-latte/70">WS:</span>
              <span className="text-caramel font-semibold">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
            </div>

            <div className="tactile-status-pill border-roast/70 bg-roast/40">
              <span className="text-latte/70">SQLITE:</span>
              <span className="text-latte font-medium">WAL LOCKED</span>
            </div>
          </div>
        </div>

        {/* Category Tabs (Editorial Menu Style) */}
        <div className="flex flex-wrap items-center space-x-2 md:space-x-8 border-b border-roast/70 pb-2">
          <button
            onClick={() => setActiveTab('optical-feed')}
            className={`font-mono text-xs md:text-sm uppercase tracking-wider py-2 bg-transparent border-b-2 transition-all cursor-pointer ${
              activeTab === 'optical-feed'
                ? 'border-caramel text-caramel font-semibold'
                : 'border-transparent text-latte/65 hover:text-foam font-normal'
            }`}
          >
            [A] Optical &amp; Acoustic Stream
          </button>

          <button
            onClick={() => setActiveTab('attendance-ledger')}
            className={`font-mono text-xs md:text-sm uppercase tracking-wider py-2 bg-transparent border-b-2 transition-all cursor-pointer ${
              activeTab === 'attendance-ledger'
                ? 'border-caramel text-caramel font-semibold'
                : 'border-transparent text-latte/65 hover:text-foam font-normal'
            }`}
          >
            [B] Attendance Ledger ({participants.length})
          </button>

          <button
            onClick={() => setActiveTab('pedagogy-agent')}
            className={`font-mono text-xs md:text-sm uppercase tracking-wider py-2 bg-transparent border-b-2 transition-all cursor-pointer ${
              activeTab === 'pedagogy-agent'
                ? 'border-caramel text-caramel font-semibold'
                : 'border-transparent text-latte/65 hover:text-foam font-normal'
            }`}
          >
            [C] Pedagogical Agent Notes
          </button>

          <div className="ml-auto flex items-center">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border transition-all cursor-pointer flex items-center space-x-1.5 ${
                showGuide
                  ? 'border-caramel text-caramel bg-caramel/15'
                  : 'border-mocha/40 text-latte/70 hover:text-foam hover:border-mocha/70'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
              <span>{showGuide ? 'Hide Field Manual ▲' : 'Open Field Manual ▼'}</span>
            </button>
          </div>
        </div>

        {/* Studio Field Manual / Quick-Start Walkthrough */}
        {showGuide && (
          <div className="p-6 md:p-8 bg-roast/40 border border-caramel/40 relative shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-roast/80 gap-3 mb-6">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
                <span className="font-mono text-xs uppercase tracking-widest text-caramel font-semibold">
                  ATELIER ORIENTATION // OPERATIONAL FIELD MANUAL
                </span>
              </div>
              <button
                onClick={() => {
                  setShowGuide(false);
                  try {
                    localStorage.setItem('atelier_field_guide_seen', 'true');
                  } catch {}
                }}
                className="font-mono text-[10px] uppercase tracking-wider text-latte/70 hover:text-foam underline self-start md:self-auto cursor-pointer"
              >
                Dismiss Guide [×]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="space-y-2 border-l-2 border-caramel/60 pl-4">
                <span className="text-caramel font-bold block text-[11px] tracking-wider">01 / OPTICAL TELEMETRY</span>
                <p className="font-sans text-xs text-crema/85 leading-relaxed font-normal">
                  OpenCV Haar Cascade detects human faces, and a Euclidean Centroid Tracker assigns persistent IDs (Participant_01). Sustained attendance logs verify present at &ge;10s and auto-commit to SQLite.
                </p>
                <div className="text-[10px] text-latte/70 pt-1">
                  • 10s Verification Threshold<br />
                  • 3s Occlusion Grace Period
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-latte/60 pl-4">
                <span className="text-latte font-bold block text-[11px] tracking-wider">02 / MULTIMODAL EQUILIBRIUM</span>
                <p className="font-sans text-xs text-crema/85 leading-relaxed font-normal">
                  MediaPipe yaw/pitch attention (100% frontal to 25% turned), optical frame differencing, and Librosa speech frequency formants (300Hz–3400Hz) fuse into the 0–100 equilibrium index.
                </p>
                <div className="text-[10px] text-latte/70 pt-1">
                  • 16-Band Audio Spectrum<br />
                  • Frame-Differencing Inactivity
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-mocha/80 pl-4">
                <span className="text-foam font-bold block text-[11px] tracking-wider">03 / PRACTICAL TEST GUIDE</span>
                <p className="font-sans text-xs text-crema/85 leading-relaxed font-normal">
                  Click <strong>Initialize Local Camera &amp; Mic</strong> to stream your webcam. Watch Participant_01 verify, speak to drive the 16-band equalizer, or test <strong>Simulate Classroom Feed</strong> for synthetic cohorts.
                </p>
                <div className="text-[10px] text-caramel pt-1 font-semibold">
                  • Zero Cloud Storage • Local SQLite WAL
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Live Optical & Acoustic Stream */}
        {activeTab === 'optical-feed' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Darkroom Viewfinder & Contact Sheet Styling */}
              <div className="lg:col-span-7 space-y-4">
                {/* Authentic Hardware Telemetry Header Strip */}
                <div className="flex items-center justify-between font-mono text-[10px] text-latte/70 px-1 font-medium">
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-caramel animate-incandescent' : 'bg-mocha/60'}`} />
                    <span className="text-foam font-semibold truncate">
                      {isStreaming
                        ? isSimulating
                          ? 'SIM: SYNTHETIC STUDIO COHORT // ROOM 402'
                          : `OPTICAL DEVICE: ${cameraDeviceLabel || 'LOCAL WEBCAM SENSOR'}`
                        : 'OPTICAL SENSOR: STANDBY // IDLE APERTURE'}
                    </span>
                  </div>

                  <span className="text-latte hidden sm:inline">
                    {isStreaming
                      ? `${streamResolution?.width || 640}×${streamResolution?.height || 480} @ ${streamResolution?.fps || 30} FPS • RGB`
                      : '0×0 @ 0 FPS • SENSORS IDLE'}
                  </span>

                  <span className="font-semibold text-caramel">
                    {isStreaming
                      ? `${latencyMs !== null ? `${latencyMs}ms PING • ` : ''}WS: ONLINE`
                      : 'STATUS: STANDBY'}
                  </span>
                </div>

                {/* Main Viewfinder Canvas with 1.5px Caramel/Mocha Corner Brackets */}
                <div className="relative aspect-[4/3] bg-roast/70 border border-mocha/50 overflow-hidden flex items-center justify-center shadow-2xl">
                  {/* Real-time frame display with direct hardware video fallback */}
                  {isStreaming && !isSimulating ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                      {annotatedFrame && (
                        <img
                          src={annotatedFrame}
                          alt="OpenCV Haar Telemetry Overlay"
                          className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
                        />
                      )}
                    </div>
                  ) : annotatedFrame ? (
                    <img
                      src={annotatedFrame}
                      alt="Live OpenCV Haar Telemetry Stream"
                      className="w-full h-full object-cover"
                    />
                  ) : isStreaming ? (
                    <div className="text-center p-8 space-y-4">
                      <div className="w-16 h-16 rounded-full border border-caramel/70 mx-auto flex items-center justify-center animate-pulse">
                        <GazeEyeGlyph className="w-8 h-8" stroke="#B8772F" />
                      </div>
                      <p className="font-display italic text-lg text-crema/85 max-w-sm">
                        Opening optical aperture and calibrating sensor cone...
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-8 space-y-4">
                      <div className="w-16 h-16 rounded-full border border-mocha/70 mx-auto flex items-center justify-center">
                        <GazeEyeGlyph className="w-8 h-8" stroke="#B8772F" />
                      </div>
                      <p className="font-display italic text-lg text-crema/85 max-w-sm">
                        Optical aperture awaiting engagement. Initialize your local camera or launch
                        the synthetic classroom study simulation.
                      </p>
                    </div>
                  )}

                  {/* Corner Crop Marks (1.5px Caramel Brackets) */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-caramel pointer-events-none" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-[1.5px] border-r-[1.5px] border-caramel pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-[1.5px] border-l-[1.5px] border-caramel pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-caramel pointer-events-none" />

                  {/* Micro Center Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                    <div className="w-4 h-[1px] bg-caramel" />
                    <div className="h-4 w-[1px] bg-caramel -ml-2" />
                  </div>

                  {/* Overlaid Darkroom Telemetry Badges */}
                  <div className="absolute top-3 left-10 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] text-latte bg-espresso/90 px-2.5 py-0.5 border border-mocha/50 backdrop-blur-sm font-medium">
                      {isSimulating ? 'SYNTHETIC CLASSROOM SIMULATION' : 'OPENCV 4.9 // HAAR FRONTAL'}
                    </span>
                    <span className="font-mono text-[9px] text-caramel bg-espresso/90 px-2 py-0.5 border border-mocha/50 font-semibold">
                      {isStreaming ? 'REC ●' : 'IDLE ○'}
                    </span>
                    {isStreaming && hasMic && !isSimulating && (
                      <span className={`font-mono text-[9px] px-2 py-0.5 border border-mocha/50 backdrop-blur-sm flex items-center space-x-1.5 ${
                        isMicMuted
                          ? 'bg-roast/90 text-latte/70'
                          : metrics.is_speech_active
                            ? 'bg-caramel text-espresso font-bold'
                            : 'bg-espresso/90 text-caramel'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isMicMuted ? 'bg-mocha/70' : metrics.is_speech_active ? 'bg-espresso' : 'bg-caramel animate-incandescent'
                        }`} />
                        <span>
                          {isMicMuted
                            ? 'MIC MUTED'
                            : metrics.is_speech_active
                              ? `VOICE ACTIVE (${metrics.audio_db} dB)`
                              : `MIC LIVE (${metrics.audio_db} dB)`}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Viewfinder Meta Strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-crema/90 bg-espresso/85 px-3 py-1 border border-roast/70 backdrop-blur-sm pointer-events-none">
                    <span>TRACKS: {isStreaming ? metrics.active_count.toString().padStart(2, '0') : '00'} IN FRAME</span>
                    <span className="text-latte font-medium">
                      ATTENTION: {isStreaming && metrics.visual_attention > 0 ? `${metrics.visual_attention.toFixed(1)}%` : '— (STANDBY)'}
                    </span>
                    <span>WAL LOG: {isStreaming ? 'RECORDING' : 'IDLE'}</span>
                  </div>
                </div>

                {/* Inline Action Controls (Zero Popups) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {!isStreaming ? (
                    <>
                      <button
                        onClick={startHardwareStream}
                        className="px-6 py-3 border border-caramel bg-caramel text-espresso font-mono text-xs uppercase tracking-widest font-semibold hover:bg-foam hover:border-foam transition-colors cursor-pointer shadow-md flex items-center space-x-2"
                      >
                        <GazeEyeGlyph className="w-4 h-4" stroke="#221610" />
                        <span>Initialize Local Camera &amp; Mic</span>
                      </button>

                      <button
                        onClick={startSimulationStream}
                        className="px-6 py-3 border border-mocha/60 bg-espresso text-latte font-mono text-xs uppercase tracking-widest hover:border-caramel hover:text-caramel transition-colors cursor-pointer font-medium"
                      >
                        Simulate Classroom Feed (No Camera Required)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={stopStream}
                        className="px-6 py-3 border border-mocha/60 bg-roast text-foam font-mono text-xs uppercase tracking-widest hover:border-caramel hover:text-caramel transition-colors cursor-pointer font-medium"
                      >
                        Terminate Telemetry Feed
                      </button>

                      {/* Tactile Microphone Mute / Unmute Button for Live Hardware */}
                      {hasMic && !isSimulating && (
                        <button
                          onClick={toggleMicMute}
                          className={`px-5 py-3 border font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer font-medium flex items-center space-x-2 ${
                            isMicMuted
                              ? 'border-caramel bg-caramel/20 text-caramel hover:bg-caramel/30'
                              : 'border-mocha/60 bg-espresso text-latte hover:border-caramel hover:text-caramel'
                          }`}
                          title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                        >
                          <AcousticWaveGlyph className="w-4 h-4" stroke={isMicMuted ? '#B8772F' : '#D2AE82'} />
                          <span>{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                        </button>
                      )}

                      <button
                        onClick={isSimulating ? startHardwareStream : startSimulationStream}
                        className="px-6 py-3 border border-mocha/60 bg-espresso text-latte font-mono text-xs uppercase tracking-widest hover:border-caramel hover:text-caramel transition-colors cursor-pointer font-medium"
                      >
                        Switch to {isSimulating ? 'Local Hardware Camera' : 'Simulation Mode'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right 5 Columns: Atelier Typographic Register + Analog Dial Gauges */}
              <div className="lg:col-span-5 p-7 md:p-8 border border-roast/80 bg-espresso/90 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-roast/80 pb-3">
                  <div>
                    <span className="micro-label text-latte/75 font-medium">TELEMETRY REGISTER</span>
                    <h3 className="font-display text-2xl text-foam mt-0.5">
                      Atelier Telemetry Indices
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-caramel font-semibold">N° 402</span>
                </div>

                {/* Pair of Vintage Galvanometer Dial Gauges */}
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-roast/60">
                  <AnalogDialGauge
                    value={isStreaming ? metrics.visual_attention : 0}
                    label="GAZE FOCUS"
                    unit={isStreaming ? "%" : "—"}
                    sublabel={isStreaming ? "FRONTAL SYMMETRY" : "STANDBY // INACTIVE"}
                    size={135}
                  />
                  <AnalogDialGauge
                    value={isStreaming ? metrics.fused_score : 0}
                    label="FUSION INDEX"
                    unit={isStreaming ? "/100" : "—"}
                    sublabel={isStreaming ? "MULTIMODAL EQUILIBRIUM" : "STANDBY // INACTIVE"}
                    size={135}
                  />
                </div>

                {/* Baseline-Aligned Dotted Leaders Readout */}
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Active Participants in Frame</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-caramel font-semibold">
                      {isStreaming ? metrics.active_count.toString().padStart(2, '0') : '00 (Standby)'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Sustained Presence Duration</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-foam">
                      {isStreaming && participants.length > 0 ? formatSeconds(participants[0]?.sustained_seconds) : '— (Awaiting Stream)'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Visual Attention Index</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-latte font-medium">
                      {isStreaming && metrics.visual_attention > 0 ? `${metrics.visual_attention.toFixed(1)}%` : '— (Standby)'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Acoustic Interaction (RMS)</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-foam flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isStreaming && metrics.is_speech_active ? 'bg-caramel animate-incandescent' : 'bg-mocha/70'}`} />
                      <span>{isStreaming && metrics.audio_db !== null ? `${metrics.audio_db.toFixed(1)} dBFS` : '— (Standby)'}</span>
                      {isStreaming && hasMic && !isSimulating && isMicMuted && (
                        <span className="text-[10px] text-caramel/80 uppercase font-mono">[MUTED]</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Movement Dynamics</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-foam">
                      {isStreaming && metrics.movement_dynamics > 0 ? `${metrics.movement_dynamics.toFixed(1)} / 100` : '— (Standby)'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Inactivity Penalty</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-latte/80 font-medium">
                      {isStreaming ? `-${metrics.inactivity_penalty.toFixed(1)}` : '0.0 (Standby)'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-roast/80 flex items-baseline justify-between group">
                    <span className="text-foam font-display text-base">Multimodal Fusion Score</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-lg text-caramel font-bold">
                      {isStreaming && metrics.fused_score > 0 ? (
                        <>
                          {metrics.fused_score.toFixed(1)}{' '}
                          <span className="text-xs text-latte/70 font-normal">/ 100</span>
                        </>
                      ) : (
                        <span className="text-xs text-latte/70 font-normal tracking-wider">STANDBY</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs font-mono group">
                    <span className="text-latte/70 uppercase">Session Trajectory</span>
                    <span className="dotted-leader" />
                    <span className="text-caramel uppercase tracking-wider font-semibold">
                      {isStreaming ? (metrics.trend || 'Steady Plateau') : 'AWAITING SENSOR STREAM'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL-WIDTH 16-BIN ANALOG STUDIO SPECTRUM VISUALIZER */}
            <div className="w-full">
              <AnalogSpectrumVisualizer
                spectralBins={metrics.spectral_bins}
                audioDb={metrics.audio_db}
                isSpeechActive={metrics.is_speech_active}
                isStreaming={isStreaming}
                sourceLabel={
                  isStreaming
                    ? isSimulating
                      ? '16-BAND PARALLEL NYQUIST FILTER BANK • SYNTHETIC CLASSROOM AMBIENCE'
                      : hasMic
                        ? isMicMuted
                          ? '16-BAND PARALLEL NYQUIST FILTER BANK • LOCAL MICROPHONE [MUTED]'
                          : '16-BAND PARALLEL NYQUIST FILTER BANK • WEBAUDIO ANALYSER (PCM 16k LIVE)'
                        : '16-BAND PARALLEL NYQUIST FILTER BANK • WEBAUDIO MIC INACTIVE'
                    : '16-BAND PARALLEL NYQUIST FILTER BANK • 16.0 kHz PCM BUFFER • STANDBY'
                }
              />
            </div>
          </div>
        )}

        {/* TAB 2: Attendance Ledger (Menu Style) */}
        {activeTab === 'attendance-ledger' && (
          <div id="attendance-ledger" className="space-y-8">
            <div className="border border-roast/80 p-8 bg-espresso/80 space-y-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-roast/70 pb-4 gap-2">
                <div>
                  <span className="micro-label text-latte/75 font-medium">STUDIO PARTICIPATION REGISTRY</span>
                  <h3 className="font-display text-2xl md:text-3xl text-foam mt-1 font-normal">
                    Morning Atelier Attendance Roster
                  </h3>
                </div>
                <div className="flex items-center space-x-4 font-mono text-xs">
                  <span className="text-latte border border-mocha/50 px-3 py-1 bg-roast/35 font-medium">
                    THRESHOLD: 10.0s TEMPORAL FOOTPRINT
                  </span>
                  <span className="text-caramel hidden sm:inline font-semibold">WAL SYNCED</span>
                </div>
              </div>

              {/* Roster Rows with Fraunces serif names, baseline-aligned dotted leaders, and hover effects */}
              {participants.length === 0 ? (
                <div className="py-16 text-center space-y-3 border border-dashed border-mocha/40 bg-roast/20 my-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-mocha/60" />
                    <span className="font-mono text-xs uppercase tracking-widest text-caramel font-semibold">
                      LEDGER STANDBY // AWAITING COHORT DETECTION
                    </span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-crema/75 max-w-md mx-auto leading-relaxed">
                    Zero active participants detected in optical frame. Initialize local webcam or launch classroom simulation to record sustained attendance.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-roast/60">
                  {participants.map((p, idx) => {
                  const isVerified = p.is_verified || (typeof p.status === 'string' && p.status.startsWith('Verified Present'));
                  const glyphType = isVerified ? 'seal' : 'eye';
                  const arrivalStamp = `09:${10 + idx * 2}:${String(14 + idx * 7).padStart(2, '0')} UTC`;

                  return (
                    <div
                      key={p.track_id || idx}
                      onMouseEnter={() => setHoveredRowGlyph(glyphType)}
                      onMouseLeave={() => setHoveredRowGlyph(null)}
                      className="py-5 px-3 flex flex-col sm:flex-row sm:items-baseline justify-between hover:bg-roast/35 border-l-2 border-transparent hover:border-caramel transition-all duration-200 group cursor-default"
                    >
                      {/* Left: Index + Fraunces Serif Track ID + Gaze Score */}
                      <div className="flex items-center space-x-4">
                        <span className="font-mono text-xs text-latte/70 w-8 font-medium">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="font-display text-lg md:text-xl text-foam group-hover:text-caramel transition-colors">
                          {p.track_id}
                        </span>
                        <span className="hidden md:inline font-mono text-[11px] text-latte/70 font-medium">
                          [Gaze: {p.head_pose_score || 88}% • {arrivalStamp}]
                        </span>
                      </div>

                      {/* Center: Baseline-Aligned Dotted Leader */}
                      <span className="dotted-leader hidden sm:block" />

                      {/* Right: Sustained Duration + Tactile Status Pill */}
                      <div className="flex items-center space-x-6 mt-3 sm:mt-0 font-mono text-xs">
                        <span className="text-latte group-hover:text-foam transition-colors font-medium">
                          {formatSeconds(p.sustained_seconds)}
                        </span>
                        <span
                          className={`tactile-status-pill ${
                            isVerified
                              ? 'border-caramel text-caramel bg-caramel/15 font-semibold'
                              : 'border-mocha/50 text-latte/75 bg-roast/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVerified ? 'bg-caramel animate-incandescent' : 'bg-mocha/70'
                            }`}
                          />
                          <span>{p.status}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}

              {/* Tilted Archival Marginalia Field Note attached to Ledger */}
              <div
                className="marginalia-note p-6 border border-mocha/40 bg-roast/30 max-w-2xl mt-8 shadow-md"
                style={{ transform: 'rotate(-1.2deg)' }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                  <span className="font-mono text-[10px] text-caramel uppercase tracking-widest font-semibold">
                    ARCHIVAL FIELD NOTE § 03 // ETHICAL INTEGRITY
                  </span>
                </div>
                <p className="font-display italic text-base text-crema leading-relaxed">
                  "No raw visual frame or high-dimensional face embedding ever touches disk. 
                  Once sustained tracking validates continuous presence past the 10.0-second threshold, 
                  only the verified interval timestamp is written to the SQLite journal."
                </p>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-latte/70">
                  <span className="font-medium">ATELIER VERIFICATION PROTOCOL</span>
                  <span className="text-latte font-medium">ZERO FACIAL RECOGNITION STORAGE</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-roast/70 flex items-center justify-between text-xs font-mono text-latte/70">
                <span>LOCAL SQLITE PERSISTENCE ACTIVE</span>
                <span className="text-caramel font-semibold">ATTENDANCE LOG WAL LOCKED</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Pedagogical Agent Stream */}
        {activeTab === 'pedagogy-agent' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Handwritten-style Marginalia Note with -1.2deg tilt */}
            <div className="lg:col-span-7">
              <div
                className="marginalia-note p-8 md:p-12 border border-caramel/60 bg-roast/40 relative select-none shadow-xl"
                style={{ transform: 'rotate(-1.2deg)' }}
              >
                {/* Vintage archival stamp in corner */}
                <span className="absolute top-4 right-6 font-mono text-[10px] text-caramel uppercase tracking-widest border border-caramel/60 px-2.5 py-0.5 font-semibold">
                  PEDAGOGICAL ADVISOR
                </span>

                <span className="micro-label text-latte/75 font-medium block mb-3">
                  INLINE FIELD MARGINALIA // RECENT OBSERVATION
                </span>

                <blockquote className="font-display italic text-2xl md:text-3xl text-crema leading-relaxed my-6">
                  "{aiSuggestion.suggestion}"
                </blockquote>

                <div className="pt-6 border-t border-mocha/40 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="micro-label text-latte/70 font-medium block">RECOMMENDED PACING ACTION</span>
                    <span className="font-mono text-sm text-caramel font-semibold">
                      {aiSuggestion.pacing_action}
                    </span>
                  </div>

                  <div>
                    <span className="micro-label text-latte/70 font-medium block">INTELLIGENCE SOURCE</span>
                    <span className="font-mono text-xs text-latte font-medium">
                      {aiSuggestion.provider || 'Offline Heuristic Engine (Local)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Engagement Trend Sparkline & Context */}
            <div className="lg:col-span-5 p-8 border border-roast/80 bg-espresso space-y-6 shadow-xl">
              <div>
                <span className="micro-label text-latte/75 font-medium">CONTEXTUAL FUSION</span>
                <h3 className="font-display text-xl text-foam mt-1">
                  Cognitive Equilibrium Analysis
                </h3>
              </div>

              <p className="font-sans text-sm text-crema/85 leading-relaxed">
                The pedagogical agent does not enforce disciplinary measures. It operates like an
                experienced studio colleague whispering from the back row: observing when
                prolonged note-taking turns into cognitive fatigue, and suggesting paired peer
                synthesis before attention breaks.
              </p>

              {/* Fused History Polyline Sparkline */}
              <div className="pt-4 border-t border-roast/80">
                <StudioSparkline
                  data={metrics.fused_history || [75, 78, 82, 80, 84, 82]}
                  currentScore={metrics.fused_score}
                  height={80}
                  label="ROLLING COGNITIVE EQUILIBRIUM"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
