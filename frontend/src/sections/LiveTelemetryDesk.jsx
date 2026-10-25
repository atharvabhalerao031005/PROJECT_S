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
  const glyphRef = useRef(null);

  const {
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
          <span className="font-mono text-[9px] uppercase tracking-wider text-latte pr-1">
            {hoveredRowGlyph === 'seal' ? 'VERIFIED' : 'OBSERVING'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-10">
        {/* Section Top Header Rule with Tactile Status Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-roast pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="micro-label text-mocha">
                03 / ANALOG DARKROOM &amp; ROASTERY MENU
              </span>
              <span className="text-mocha text-xs font-mono">•</span>
              <span className="font-mono text-[10px] text-latte tracking-wider">
                UTC {sessionClock}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-foam font-normal tracking-tight">
              The Live Telemetry Desk
            </h2>
          </div>

          {/* Tactile Hardware Indicator Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="tactile-status-pill">
              <span
                className={`w-2 h-2 rounded-full ${
                  isStreaming ? 'bg-caramel animate-incandescent' : 'bg-mocha'
                }`}
              />
              <span className="text-latte font-medium">
                {isStreaming
                  ? isSimulating
                    ? 'SIMULATION'
                    : 'HARDWARE LIVE'
                  : 'STANDBY'}
              </span>
            </div>

            <div className="tactile-status-pill hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-latte animate-tape-blink" />
              <span className="text-mocha">OPENCV 4.9 // HAAR 1.1x</span>
            </div>

            <div className="tactile-status-pill hidden md:inline-flex">
              <span className="text-mocha">AUDIO VAD:</span>
              <span className="text-caramel font-semibold">16.0 kHz PCM</span>
            </div>

            <div className="tactile-status-pill">
              <span className="text-mocha">SQLITE:</span>
              <span className="text-latte">WAL LOCKED</span>
            </div>
          </div>
        </div>

        {/* Category Tabs (Editorial Menu Style) */}
        <div className="flex flex-wrap items-center space-x-2 md:space-x-8 border-b border-roast pb-2">
          <button
            onClick={() => setActiveTab('optical-feed')}
            className={`font-mono text-xs md:text-sm uppercase tracking-wider py-2 bg-transparent border-b-2 transition-all cursor-pointer ${
              activeTab === 'optical-feed'
                ? 'border-caramel text-caramel font-semibold'
                : 'border-transparent text-mocha hover:text-latte'
            }`}
          >
            [A] Optical &amp; Acoustic Stream
          </button>

          <button
            onClick={() => setActiveTab('attendance-ledger')}
            className={`font-mono text-xs md:text-sm uppercase tracking-wider py-2 bg-transparent border-b-2 transition-all cursor-pointer ${
              activeTab === 'attendance-ledger'
                ? 'border-caramel text-caramel font-semibold'
                : 'border-transparent text-mocha hover:text-latte'
            }`}
          >
            [B] Attendance Ledger ({participants.length})
          </button>

          <button
            onClick={() => setActiveTab('pedagogy-agent')}
            className={`font-mono text-xs md:text-sm uppercase tracking-wider py-2 bg-transparent border-b-2 transition-all cursor-pointer ${
              activeTab === 'pedagogy-agent'
                ? 'border-caramel text-caramel font-semibold'
                : 'border-transparent text-mocha hover:text-latte'
            }`}
          >
            [C] Pedagogical Agent Notes
          </button>
        </div>

        {/* TAB 1: Live Optical & Acoustic Stream */}
        {activeTab === 'optical-feed' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Darkroom Viewfinder & Contact Sheet Styling */}
              <div className="lg:col-span-7 space-y-4">
                {/* Contact Sheet Frame Header Strip */}
                <div className="flex items-center justify-between font-mono text-[10px] text-mocha px-1">
                  <span>FRAME: 024 // KODAK PORTRA 400</span>
                  <span className="text-latte hidden sm:inline">
                    EXPOSURE: 1/125s • f/2.8 • ISO 400
                  </span>
                  <span>OPTICAL STATUS: SENSING</span>
                </div>

                {/* Main Viewfinder Canvas with 1.5px Caramel/Mocha Corner Brackets */}
                <div className="relative aspect-[4/3] bg-roast/70 border border-mocha/70 overflow-hidden flex items-center justify-center shadow-2xl">
                  {/* Real-time frame display */}
                  {annotatedFrame ? (
                    <img
                      src={annotatedFrame}
                      alt="Live OpenCV Haar Telemetry Stream"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-8 space-y-4">
                      <div className="w-16 h-16 rounded-full border border-mocha/80 mx-auto flex items-center justify-center">
                        <GazeEyeGlyph className="w-8 h-8" stroke="#B8772F" />
                      </div>
                      <p className="font-display italic text-lg text-crema/80 max-w-sm">
                        Optical aperture awaiting engagement. Initialize your local camera or launch
                        the synthetic classroom study simulation.
                      </p>
                    </div>
                  )}

                  {/* Corner Crop Marks (1.5px Caramel & Mocha Brackets) */}
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
                  <div className="absolute top-3 left-10 flex items-center space-x-2">
                    <span className="font-mono text-[9px] text-latte bg-espresso/90 px-2.5 py-0.5 border border-mocha backdrop-blur-sm">
                      {isSimulating ? 'SYNTHETIC CLASSROOM SIMULATION' : 'OPENCV 4.9 // HAAR FRONTAL'}
                    </span>
                    <span className="font-mono text-[9px] text-caramel bg-espresso/90 px-2 py-0.5 border border-mocha">
                      {isStreaming ? 'REC ●' : 'IDLE ○'}
                    </span>
                  </div>

                  {/* Bottom Viewfinder Meta Strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-crema/80 bg-espresso/80 px-3 py-1 border border-roast backdrop-blur-sm pointer-events-none">
                    <span>TRACKS: {metrics.active_count.toString().padStart(2, '0')} IN FRAME</span>
                    <span className="text-latte">
                      ATTENTION: {metrics.visual_attention.toFixed(1)}%
                    </span>
                    <span>WAL LOG: ACTIVE</span>
                  </div>
                </div>

                {/* Inline Action Controls (Zero Popups) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {!isStreaming ? (
                    <>
                      <button
                        onClick={startHardwareStream}
                        className="px-6 py-3 border border-caramel bg-caramel text-espresso font-mono text-xs uppercase tracking-widest font-semibold hover:bg-foam hover:border-foam transition-colors cursor-pointer"
                      >
                        Initialize Local Camera &amp; Mic
                      </button>

                      <button
                        onClick={startSimulationStream}
                        className="px-6 py-3 border border-mocha bg-espresso text-latte font-mono text-xs uppercase tracking-widest hover:border-caramel hover:text-caramel transition-colors cursor-pointer"
                      >
                        Simulate Classroom Feed (No Camera Required)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={stopStream}
                        className="px-6 py-3 border border-mocha bg-roast text-foam font-mono text-xs uppercase tracking-widest hover:border-caramel hover:text-caramel transition-colors cursor-pointer"
                      >
                        Terminate Telemetry Feed
                      </button>

                      <button
                        onClick={isSimulating ? startHardwareStream : startSimulationStream}
                        className="px-6 py-3 border border-mocha/60 bg-espresso text-latte font-mono text-xs uppercase tracking-widest hover:border-latte transition-colors cursor-pointer"
                      >
                        Switch to {isSimulating ? 'Local Hardware Camera' : 'Simulation Mode'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right 5 Columns: Atelier Typographic Register + Analog Dial Gauges */}
              <div className="lg:col-span-5 p-7 md:p-8 border border-roast bg-espresso/90 space-y-6">
                <div className="flex items-center justify-between border-b border-roast/80 pb-3">
                  <div>
                    <span className="micro-label text-mocha">TELEMETRY REGISTER</span>
                    <h3 className="font-display text-2xl text-foam mt-0.5">
                      Atelier Telemetry Indices
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-caramel">N° 402</span>
                </div>

                {/* Pair of Vintage Galvanometer Dial Gauges */}
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-roast/60">
                  <AnalogDialGauge
                    value={metrics.visual_attention}
                    label="GAZE FOCUS"
                    unit="%"
                    sublabel="FRONTAL SYMMETRY"
                    size={135}
                  />
                  <AnalogDialGauge
                    value={metrics.fused_score}
                    label="FUSION INDEX"
                    unit="/100"
                    sublabel="MULTIMODAL EQUILIBRIUM"
                    size={135}
                  />
                </div>

                {/* Baseline-Aligned Dotted Leaders Readout */}
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Active Participants in Frame</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-caramel font-semibold">
                      {metrics.active_count.toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Sustained Presence Duration</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-foam">
                      {formatSeconds(participants[0]?.sustained_seconds || 258)}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Visual Attention Index</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-latte font-medium">
                      {metrics.visual_attention.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Acoustic Interaction (RMS)</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-foam">
                      {metrics.audio_db ? `${metrics.audio_db.toFixed(1)} dB` : '-18.4 dB'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Movement Dynamics</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-foam">
                      {metrics.movement_dynamics ? `${metrics.movement_dynamics.toFixed(1)} / 100` : '76.0 / 100'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between group">
                    <span className="text-crema">Inactivity Penalty</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-sm text-mocha">
                      -{metrics.inactivity_penalty ? metrics.inactivity_penalty.toFixed(1) : '0.0'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-roast flex items-baseline justify-between group">
                    <span className="text-foam font-display text-base">Multimodal Fusion Score</span>
                    <span className="dotted-leader" />
                    <span className="font-mono text-lg text-caramel font-bold">
                      {metrics.fused_score.toFixed(1)}{' '}
                      <span className="text-xs text-mocha font-normal">/ 100</span>
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs font-mono group">
                    <span className="text-mocha uppercase">Session Trajectory</span>
                    <span className="dotted-leader" />
                    <span className="text-caramel uppercase tracking-wider">
                      {metrics.trend || 'Steady Plateau'}
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
              />
            </div>
          </div>
        )}

        {/* TAB 2: Attendance Ledger (Menu Style) */}
        {activeTab === 'attendance-ledger' && (
          <div id="attendance-ledger" className="space-y-8">
            <div className="border border-roast p-8 bg-espresso/80 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-roast pb-4 gap-2">
                <div>
                  <span className="micro-label text-mocha">STUDIO PARTICIPATION REGISTRY</span>
                  <h3 className="font-display text-2xl md:text-3xl text-foam mt-1 font-normal">
                    Morning Atelier Attendance Roster
                  </h3>
                </div>
                <div className="flex items-center space-x-4 font-mono text-xs">
                  <span className="text-latte border border-mocha/50 px-3 py-1 bg-roast/30">
                    THRESHOLD: 10.0s TEMPORAL FOOTPRINT
                  </span>
                  <span className="text-caramel hidden sm:inline">WAL SYNCED</span>
                </div>
              </div>

              {/* Roster Rows with Fraunces serif names, baseline-aligned dotted leaders, and hover effects */}
              <div className="divide-y divide-roast/60">
                {participants.map((p, idx) => {
                  const isVerified = p.status === 'Verified Present';
                  const glyphType = isVerified ? 'seal' : 'eye';
                  const arrivalStamp = `09:${10 + idx * 2}:${String(14 + idx * 7).padStart(2, '0')} UTC`;

                  return (
                    <div
                      key={p.track_id || idx}
                      onMouseEnter={() => setHoveredRowGlyph(glyphType)}
                      onMouseLeave={() => setHoveredRowGlyph(null)}
                      className="py-5 px-3 flex flex-col sm:flex-row sm:items-baseline justify-between hover:bg-roast/30 border-l-2 border-transparent hover:border-caramel transition-all duration-200 group cursor-default"
                    >
                      {/* Left: Index + Fraunces Serif Track ID + Gaze Score */}
                      <div className="flex items-center space-x-4">
                        <span className="font-mono text-xs text-mocha w-8">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="font-display text-lg md:text-xl text-foam group-hover:text-caramel transition-colors">
                          {p.track_id}
                        </span>
                        <span className="hidden md:inline font-mono text-[11px] text-mocha">
                          [Gaze: {p.head_pose_score || 88}% • {arrivalStamp}]
                        </span>
                      </div>

                      {/* Center: Baseline-Aligned Dotted Leader */}
                      <span className="dotted-leader hidden sm:block" />

                      {/* Right: Sustained Duration + Tactile Status Pill */}
                      <div className="flex items-center space-x-6 mt-3 sm:mt-0 font-mono text-xs">
                        <span className="text-latte group-hover:text-foam transition-colors">
                          {formatSeconds(p.sustained_seconds)}
                        </span>
                        <span
                          className={`tactile-status-pill ${
                            isVerified
                              ? 'border-caramel text-caramel bg-caramel/10'
                              : 'border-mocha text-mocha'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVerified ? 'bg-caramel animate-incandescent' : 'bg-mocha'
                            }`}
                          />
                          <span>{p.status}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tilted Archival Marginalia Field Note attached to Ledger */}
              <div
                className="marginalia-note p-6 border border-mocha/40 bg-roast/30 max-w-2xl mt-8"
                style={{ transform: 'rotate(-1.2deg)' }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                  <span className="font-mono text-[10px] text-caramel uppercase tracking-widest">
                    ARCHIVAL FIELD NOTE § 03 // ETHICAL INTEGRITY
                  </span>
                </div>
                <p className="font-display italic text-base text-crema leading-relaxed">
                  "No raw visual frame or high-dimensional face embedding ever touches disk. 
                  Once sustained tracking validates continuous presence past the 10.0-second threshold, 
                  only the verified interval timestamp is written to the SQLite journal."
                </p>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-mocha">
                  <span>ATELIER VERIFICATION PROTOCOL</span>
                  <span className="text-latte">ZERO FACIAL RECOGNITION STORAGE</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-roast flex items-center justify-between text-xs font-mono text-mocha">
                <span>LOCAL SQLITE PERSISTENCE ACTIVE</span>
                <span>ATTENDANCE LOG WAL LOCKED</span>
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
                <span className="absolute top-4 right-6 font-mono text-[10px] text-caramel uppercase tracking-widest border border-caramel/60 px-2.5 py-0.5">
                  PEDAGOGICAL ADVISOR
                </span>

                <span className="micro-label text-mocha block mb-3">
                  INLINE FIELD MARGINALIA // RECENT OBSERVATION
                </span>

                <blockquote className="font-display italic text-2xl md:text-3xl text-crema leading-relaxed my-6">
                  "{aiSuggestion.suggestion}"
                </blockquote>

                <div className="pt-6 border-t border-mocha/40 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="micro-label text-mocha block">RECOMMENDED PACING ACTION</span>
                    <span className="font-mono text-sm text-caramel font-semibold">
                      {aiSuggestion.pacing_action}
                    </span>
                  </div>

                  <div>
                    <span className="micro-label text-mocha block">INTELLIGENCE SOURCE</span>
                    <span className="font-mono text-xs text-latte">
                      {aiSuggestion.provider || 'Offline Heuristic Engine (Local)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Engagement Trend Sparkline & Context */}
            <div className="lg:col-span-5 p-8 border border-roast bg-espresso space-y-6">
              <div>
                <span className="micro-label text-mocha">CONTEXTUAL FUSION</span>
                <h3 className="font-display text-xl text-foam mt-1">
                  Cognitive Equilibrium Analysis
                </h3>
              </div>

              <p className="font-sans text-sm text-crema/80 leading-relaxed">
                The pedagogical agent does not enforce disciplinary measures. It operates like an
                experienced studio colleague whispering from the back row: observing when
                prolonged note-taking turns into cognitive fatigue, and suggesting paired peer
                synthesis before attention breaks.
              </p>

              {/* Fused History Polyline Sparkline */}
              <div className="pt-4 border-t border-roast">
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
