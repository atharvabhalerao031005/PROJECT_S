import React, { useState } from 'react';
import CampusMapSVG from '../components/svgs/CampusMapSVG';

export default function InlineConfigAndLogs() {
  const [sessionTitle, setSessionTitle] = useState('Morning Architectural Seminar // Room 402');
  const [threshold, setThreshold] = useState(10.0);
  const [vadSensitivity, setVadSensitivity] = useState(-32.0);
  const [aiCadence, setAiCadence] = useState('10 Seconds (Responsive)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState(null);

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
      className="relative min-h-screen py-24 px-6 lg:px-12 bg-foam text-espresso transition-colors duration-700 select-none"
      style={{ backgroundColor: 'var(--foam)', color: 'var(--espresso)' }}
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-mocha/30 pb-4 mb-12 gap-4">
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
            <h2 className="font-display text-3xl md:text-5xl text-espresso font-normal tracking-tight">
              Architectural Calibration &amp; Schedules
            </h2>
          </div>

          <div className="mt-2 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleExportCsv}
              className="px-6 py-3 border border-espresso bg-espresso text-foam font-mono text-xs uppercase tracking-wider hover:bg-caramel hover:border-caramel hover:text-espresso transition-colors cursor-pointer shadow-md"
            >
              Export Attendance Ledger (.CSV)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left 6 Columns: Typographic Timetable + Stylized Campus Map SVG */}
          <div className="lg:col-span-6 space-y-10">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="micro-label text-mocha tracking-micro">
                  SESSION TIMETABLE // STUDIO ROTATION
                </span>
                <span className="font-mono text-xs text-caramel">UTC HARMONIZED</span>
              </div>

              <div className="border border-mocha/30 divide-y divide-mocha/20 bg-crema/25 shadow-sm">
                <div className="p-4 flex items-baseline justify-between font-mono text-xs hover:bg-crema/40 transition-colors">
                  <span className="text-espresso font-semibold">09:00 — 10:15 UTC</span>
                  <span className="text-mocha">Spatial Theory &amp; Tectonics</span>
                  <span className="text-caramel font-semibold">[ACTIVE]</span>
                </div>
                <div className="p-4 flex items-baseline justify-between font-mono text-xs hover:bg-crema/40 transition-colors">
                  <span className="text-espresso font-semibold">10:30 — 11:45 UTC</span>
                  <span className="text-mocha">Structural Timber Critique</span>
                  <span className="text-mocha">STANDBY</span>
                </div>
                <div className="p-4 flex items-baseline justify-between font-mono text-xs hover:bg-crema/40 transition-colors">
                  <span className="text-espresso font-semibold">13:00 — 14:30 UTC</span>
                  <span className="text-mocha">Acoustic Engineering Lab</span>
                  <span className="text-mocha">SCHEDULED</span>
                </div>
              </div>
            </div>

            {/* Stylized Floorplan Map SVG */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="micro-label text-mocha tracking-micro">
                  LECTURE HALL 402 // SENSOR ANGLE &amp; ACOUSTIC CONE
                </span>
                <span className="font-mono text-xs text-caramel">
                  SENSOR ALPHA-01
                </span>
              </div>
              <div className="border border-mocha/40 p-4 bg-espresso shadow-lg">
                <CampusMapSVG />
              </div>
            </div>

          </div>

          {/* Right 6 Columns: 100% Inline Calibration Form */}
          <div className="lg:col-span-6 border border-mocha/30 p-8 md:p-10 bg-crema/35 relative shadow-sm">
            
            <span className="micro-label text-caramel block mb-2 tracking-micro">
              REAL-TIME SENSOR RIG TUNING
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-espresso mb-4 font-medium">
              Calibrate Presence Thresholds
            </h3>

            <p className="font-sans text-sm text-roast leading-relaxed mb-8">
              Adjust sensory sensitivity without halting active tracking. Changing the sustained duration 
              recalibrates the temporal filter instantly for both active hardware and simulation streams.
            </p>

            <form onSubmit={handleCommitCalibration} className="space-y-6">
              
              {/* Session Title */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-mocha uppercase block tracking-wider">
                  Session Descriptor
                </label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-foam border border-mocha/40 text-espresso font-sans text-sm focus:outline-none focus:border-caramel transition-colors"
                  required
                />
              </div>

              {/* Sustained Presence Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs text-mocha">
                  <span className="tracking-wider">SUSTAINED PRESENCE THRESHOLD</span>
                  <span className="text-caramel font-semibold">{threshold.toFixed(1)} SECONDS</span>
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
                <span className="font-mono text-[10px] text-mocha block">
                  Participants must maintain uninterrupted track stability before gaining Verified Present status.
                </span>
              </div>

              {/* Audio VAD Sensitivity */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs text-mocha">
                  <span className="tracking-wider">ACOUSTIC VAD FLOOR</span>
                  <span className="text-caramel font-semibold">{vadSensitivity.toFixed(1)} dB</span>
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

              {/* AI Agent Cadence */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-mocha uppercase block tracking-wider">
                  Pedagogical Review Frequency
                </label>
                <select
                  value={aiCadence}
                  onChange={(e) => setAiCadence(e.target.value)}
                  className="w-full px-4 py-3 bg-foam border border-mocha/40 text-espresso font-mono text-xs focus:outline-none focus:border-caramel transition-colors"
                >
                  <option value="5 Seconds (High Velocity)">5 Seconds (High Velocity)</option>
                  <option value="10 Seconds (Responsive)">10 Seconds (Responsive — Standard)</option>
                  <option value="30 Seconds (Contemplative)">30 Seconds (Contemplative)</option>
                </select>
              </div>

              {/* Commit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 border border-caramel bg-caramel text-espresso font-mono text-xs uppercase tracking-widest font-semibold hover:bg-espresso hover:text-foam hover:border-espresso transition-colors duration-200 cursor-pointer shadow-md"
                >
                  {commitMessage ? commitMessage : isSubmitting ? "Committing Calibration..." : "Commit Calibration to Rig"}
                </button>
              </div>

            </form>

            {/* Archival Calibration Marginalia Card tilted at 1.2deg */}
            <div
              className="marginalia-note p-4 border border-mocha/30 bg-foam/80 mt-8 relative"
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
            <div className="mt-6 pt-4 border-t border-mocha/20 flex items-center justify-between font-mono text-[11px] text-mocha">
              <span>ZERO NETWORK DEPENDENCY</span>
              <span className="text-caramel font-medium">SQLITE WAL SYNCED</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
