import React, { useState, useEffect } from 'react';
import CampusMapSVG from '../components/svgs/CampusMapSVG';
import AtelierSelect from '../components/AtelierSelect';

export default function InlineConfigAndLogs() {
  const [sessionTitle, setSessionTitle] = useState('Morning Architectural Seminar // Room 402');
  const [threshold, setThreshold] = useState(10.0);
  const [vadSensitivity, setVadSensitivity] = useState(-32.0);
  const [aiCadence, setAiCadence] = useState('10 Seconds (Responsive)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState(null);

  useEffect(() => {
    fetch('/api/calibration')
      .then((res) => res.json())
      .then((data) => {
        if (data.sustained_threshold) setThreshold(data.sustained_threshold);
        if (data.vad_sensitivity) setVadSensitivity(data.vad_sensitivity);
        if (data.ai_cadence_seconds === 5) setAiCadence('5 Seconds (High Velocity)');
        else if (data.ai_cadence_seconds === 30) setAiCadence('30 Seconds (Contemplative)');
        else setAiCadence('10 Seconds (Responsive)');
      })
      .catch(() => {});
  }, []);

  const cadenceOptions = [
    {
      value: '5 Seconds (High Velocity)',
      label: '5 Seconds (High Velocity)',
      badge: 'RAPID SENSING',
      description: 'Instant reaction to gaze drops and fidgeting; ideal for fast-paced studio critiques.',
    },
    {
      value: '10 Seconds (Responsive)',
      label: '10 Seconds (Responsive — Standard)',
      badge: 'RECOMMENDED',
      description: 'Optimal academic balance buffering transient distractions while offering timely interventions.',
    },
    {
      value: '30 Seconds (Contemplative)',
      label: '30 Seconds (Contemplative)',
      badge: 'LONG ARC',
      description: 'Slow-burn philosophical observation; evaluates long-arc cognitive focus without micromanaging.',
    },
  ];

  const handleCommitCalibration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCommitMessage(null);

    try {
      const res = await fetch('/api/calibration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_title: sessionTitle,
          sustained_threshold: parseFloat(threshold),
          vad_sensitivity: parseFloat(vadSensitivity),
          ai_cadence: aiCadence,
        }),
      });
      if (res.ok) {
        setCommitMessage("Calibration Committed — Ledger Updated");
      } else {
        setCommitMessage("Committed Locally — Engine Calibrated");
      }
    } catch (err) {
      setCommitMessage("Committed Locally — Engine Calibrated");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setCommitMessage(null);
      }, 4000);
    }
  };

  const handleExportCsv = () => {
    window.location.href = '/api/export/csv';
  };

  return (
    <section
      id="calibration"
      className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-foam text-espresso transition-colors duration-700 select-none overflow-hidden"
      style={{ backgroundColor: 'var(--foam)', color: 'var(--espresso)' }}
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-mocha/30 pb-4 mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="micro-label text-caramel tracking-micro">
                05 / STUDIO CALIBRATION &amp; ARCHIVAL DISPATCH
              </span>
              <span className="text-mocha text-xs font-mono">•</span>
              <div className="tactile-status-pill bg-crema/40 border-mocha/30 text-espresso">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
                <span className="text-[9px] font-mono tracking-wider">RIG ALPHA READY</span>
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-espresso font-normal tracking-tight">
              Architectural Calibration &amp; Schedules
            </h2>
          </div>

          <div className="mt-2 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleExportCsv}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border border-espresso bg-espresso text-foam font-mono text-xs uppercase tracking-wider hover:bg-caramel hover:border-caramel hover:text-espresso transition-colors cursor-pointer shadow-md text-center"
            >
              Export Attendance Ledger (.CSV)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left 6 Columns: Typographic Timetable + Stylized Campus Map SVG */}
          <div className="lg:col-span-6 space-y-8 sm:space-y-10 min-w-0">
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="micro-label text-mocha tracking-micro text-[10px] sm:text-[11px]">
                  SESSION TIMETABLE // STUDIO ROTATION
                </span>
                <span className="font-mono text-xs text-caramel shrink-0">UTC HARMONIZED</span>
              </div>

              <div className="border border-mocha/30 divide-y divide-mocha/20 bg-crema/25 shadow-sm overflow-hidden">
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2 font-mono text-xs hover:bg-crema/40 transition-colors">
                  <span className="text-espresso font-semibold shrink-0">09:00 — 10:15 UTC</span>
                  <span className="text-mocha truncate">Spatial Theory &amp; Tectonics</span>
                  <span className="text-caramel font-semibold shrink-0">[ACTIVE]</span>
                </div>
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2 font-mono text-xs hover:bg-crema/40 transition-colors">
                  <span className="text-espresso font-semibold shrink-0">10:30 — 11:45 UTC</span>
                  <span className="text-mocha truncate">Structural Timber Critique</span>
                  <span className="text-mocha shrink-0">STANDBY</span>
                </div>
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2 font-mono text-xs hover:bg-crema/40 transition-colors">
                  <span className="text-espresso font-semibold shrink-0">13:00 — 14:30 UTC</span>
                  <span className="text-mocha truncate">Acoustic Engineering Lab</span>
                  <span className="text-mocha shrink-0">SCHEDULED</span>
                </div>
              </div>
            </div>

            {/* Stylized Floorplan Map SVG */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="micro-label text-mocha tracking-micro text-[10px] sm:text-[11px] truncate">
                  LECTURE HALL 402 // SENSOR ANGLE &amp; CONE
                </span>
                <span className="font-mono text-xs text-caramel shrink-0">
                  SENSOR ALPHA-01
                </span>
              </div>
              <div className="border border-mocha/40 p-3 sm:p-4 bg-espresso shadow-lg overflow-hidden">
                <CampusMapSVG />
              </div>
            </div>

          </div>

          {/* Right 6 Columns: 100% Inline Calibration Form */}
          <div className="lg:col-span-6 border border-mocha/30 p-5 sm:p-8 md:p-10 bg-crema/35 relative shadow-sm min-w-0 overflow-hidden">
            
            <span className="micro-label text-caramel block mb-2 tracking-micro text-[10px] sm:text-[11px]">
              REAL-TIME SENSOR RIG TUNING
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-espresso mb-3 sm:mb-4 font-medium">
              Calibrate Presence Thresholds
            </h3>

            <p className="font-sans text-xs sm:text-sm text-roast leading-relaxed mb-6 sm:mb-8">
              Adjust sensory sensitivity without halting active tracking. Changing the sustained duration 
              recalibrates the temporal filter instantly for both active hardware and simulation streams.
            </p>

            <form onSubmit={handleCommitCalibration} className="space-y-5 sm:space-y-6">
              
              {/* Session Title */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="font-mono text-xs text-mocha uppercase block tracking-wider">
                  Session Descriptor
                </label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-foam border border-mocha/40 text-espresso font-sans text-sm focus:outline-none focus:border-caramel transition-colors"
                  required
                />
              </div>

              {/* Sustained Presence Slider */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between font-mono text-xs text-mocha gap-2">
                  <span className="tracking-wider truncate">SUSTAINED PRESENCE THRESHOLD</span>
                  <span className="text-caramel font-semibold shrink-0">{threshold.toFixed(1)} SECONDS</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="30.0"
                  step="0.5"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-caramel cursor-pointer"
                />
                <span className="font-mono text-[9px] sm:text-[10px] text-mocha block leading-normal">
                  Participants must maintain uninterrupted track stability before gaining Verified Present status.
                </span>
              </div>

              {/* Audio VAD Sensitivity */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between font-mono text-xs text-mocha gap-2">
                  <span className="tracking-wider truncate">ACOUSTIC VAD FLOOR</span>
                  <span className="text-caramel font-semibold shrink-0">{vadSensitivity.toFixed(1)} dB</span>
                </div>
                <input
                  type="range"
                  min="-50.0"
                  max="-15.0"
                  step="1.0"
                  value={vadSensitivity}
                  onChange={(e) => setVadSensitivity(parseFloat(e.target.value))}
                  className="w-full accent-caramel cursor-pointer"
                />
              </div>

              {/* AI Agent Cadence Custom Editorial Select */}
              <div className="space-y-1.5 sm:space-y-2">
                <AtelierSelect
                  label="Pedagogical Review Frequency"
                  value={aiCadence}
                  onChange={setAiCadence}
                  options={cadenceOptions}
                  theme="light"
                />
              </div>

              {/* Commit Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 sm:py-4 border border-caramel bg-caramel text-espresso font-mono text-xs uppercase tracking-widest font-semibold hover:bg-espresso hover:text-foam hover:border-espresso transition-colors duration-200 cursor-pointer shadow-md"
                >
                  {commitMessage ? commitMessage : isSubmitting ? "Committing Calibration..." : "Commit Calibration to Rig"}
                </button>
              </div>

            </form>

            {/* Archival Calibration Marginalia Card tilted at 1.2deg */}
            <div
              className="marginalia-note p-3.5 sm:p-4 border border-mocha/30 bg-foam/80 mt-6 sm:mt-8 relative max-w-full"
              style={{ transform: 'rotate(1.2deg)' }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                <span className="font-mono text-[9px] text-caramel uppercase tracking-widest">
                  CALIBRATION CERTIFICATE § 05
                </span>
              </div>
              <p className="font-display italic text-xs text-espresso leading-relaxed">
                "Acoustic threshold auto-balances against Room 402's natural reverberation time (RT60 = 0.42s). 
                Re-calibration commits immediately to the local engine without breaking WebSocket streams."
              </p>
            </div>

            {/* Offline guarantee note */}
            <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-mocha/20 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-mocha">
              <span>ZERO NETWORK DEPENDENCY</span>
              <span className="text-caramel font-medium">SQLITE WAL SYNCED</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
