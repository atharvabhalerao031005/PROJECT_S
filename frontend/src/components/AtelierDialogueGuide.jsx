import React, { useState, useEffect } from 'react';

/**
 * AtelierDialogueGuide
 * Bespoke floating interactive concierge & step-by-step dialogue guide.
 * Breaks down the platform into 5 digestible, human-friendly milestones
 * with instant "Jump to Section" triggers, visual highlight pulses,
 * keyboard shortcut ('?'), and minimizable badge state.
 */
export default function AtelierDialogueGuide({ isOpen, onClose, onOpen }) {
  const [step, setStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Guide milestones
  const steps = [
    {
      badge: '01 / 05 // OVERVIEW',
      title: 'What is Atelier?',
      summary: 'A quiet, non-invasive attendance and engagement companion designed for studio seminars.',
      body: 'Instead of cold corporate surveillance, Atelier uses analog-inspired mathematical telemetry. It tracks sustained student presence, head-pose attention, optical movement, and microphone speech frequencies in real time—without saving student faces or private biometric photos to disk.',
      targetId: 'hero',
      actionLabel: 'Next: The Live Rig →',
    },
    {
      badge: '02 / 05 // SENSORY RIG',
      title: 'Live Camera & Mic Tracking',
      summary: 'Experience real-time Euclidean centroid tracking and 16-band WebAudio.',
      body: 'Scroll to Section 03 (The Telemetry Desk). Click [Initialize Live Camera & Mic] for your physical webcam, or [Classroom Simulation] for synthetic student avatars. Your face is tracked with caramel drafting brackets, calculating gaze angle and micro-movement in real time.',
      targetId: 'live-desk',
      actionLabel: 'Jump to Telemetry Desk ⚡',
    },
    {
      badge: '03 / 05 // TEMPORAL FILTER',
      title: 'The 10-Second Sustained Rule',
      summary: 'How transient corridor walk-bys are rejected.',
      body: 'Casual walk-bys or glances are categorized as "Transient (<3s)". Only attendees who maintain uninterrupted optical presence for 10 continuous seconds earn the "Verified Present" seal and are automatically logged into the SQLite Attendance Ledger.',
      targetId: 'live-desk',
      actionLabel: 'Inspect Live Ledger 📋',
    },
    {
      badge: '04 / 05 // ACOUSTIC INTELLIGENCE',
      title: 'Librosa Spectrum & AI Agent',
      summary: 'Voice frequency validation and pedagogical pacing advice.',
      body: 'Speak into your microphone. Watch the 16-band studio visualizer light up as Librosa verifies human speech formants (300Hz–3400Hz). When cohort attention drifts or inactivity spikes, the AI Teaching Agent (Gemini/Groq) suggests live pedagogical adjustments.',
      targetId: 'live-desk',
      actionLabel: 'View AI Pedagogical Notes 🎙️',
    },
    {
      badge: '05 / 05 // CALIBRATION & EXPORT',
      title: 'Calibrate & Export to CSV',
      summary: 'Live Python engine tuning with zero reload.',
      body: 'In Section 05, adjust the sustained duration slider (3s–30s), acoustic VAD floor (-50dB to -15dB), or review cadence. Calibration commits immediately to the running Python engine. Click [Export Attendance as CSV] to download verified records via pandas.',
      targetId: 'calibration',
      actionLabel: 'Jump to Calibration ⚙️',
    },
  ];

  // Keyboard shortcut: Press '?' to toggle guide, 'Escape' to minimize/close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        if (!isOpen) onOpen?.();
        else setIsMinimized((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsMinimized(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpen]);

  const jumpToSection = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Temporary caramel pulse highlight on target
      el.classList.add('ring-2', 'ring-caramel', 'transition-all');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-caramel');
      }, 2000);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      jumpToSection(steps[step + 1].targetId);
    } else {
      setIsMinimized(true);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      jumpToSection(steps[step - 1].targetId);
    }
  };

  if (!isOpen) return null;

  // MINIMIZED FLOATING BADGE
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9990] animate-in fade-in slide-in-from-bottom-2 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="group flex items-center space-x-2.5 px-4 py-2.5 bg-[#1C1310]/95 border border-caramel/70 text-foam shadow-2xl backdrop-blur-md cursor-pointer hover:border-caramel hover:bg-[#3A2619] transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
          <span className="font-mono text-xs uppercase tracking-wider text-caramel font-semibold">
            [ ? ] FIELD GUIDE // STEP {step + 1} OF 5
          </span>
          <span className="text-latte/60 group-hover:text-foam text-xs transition-colors">▲ Expand</span>
        </button>
      </div>
    );
  }

  const current = steps[step];

  return (
    <div
      role="dialog"
      aria-label="Atelier Interactive Walkthrough Guide"
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9990] w-[calc(100vw-2rem)] sm:w-[440px] max-w-[92vw] bg-[#1C1310]/96 border border-caramel/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md text-foam select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Drafting Corner Registration Marks */}
      <div className="absolute top-1.5 left-1.5 text-caramel/60 font-mono text-[9px] leading-none select-none">+</div>
      <div className="absolute top-1.5 right-1.5 text-caramel/60 font-mono text-[9px] leading-none select-none">+</div>
      <div className="absolute bottom-1.5 left-1.5 text-caramel/60 font-mono text-[9px] leading-none select-none">+</div>
      <div className="absolute bottom-1.5 right-1.5 text-caramel/60 font-mono text-[9px] leading-none select-none">+</div>

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-roast/80 px-5 py-3 bg-roast/40">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-caramel font-bold">
            {current.badge}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize guide to corner badge (Press '?' to restore)"
            className="w-6 h-6 flex items-center justify-center font-mono text-xs text-latte hover:text-foam hover:bg-roast/60 transition-colors cursor-pointer"
          >
            —
          </button>
          {/* Close Button */}
          <button
            onClick={onClose}
            title="Close guide"
            className="w-6 h-6 flex items-center justify-center font-mono text-xs text-latte hover:text-caramel hover:bg-roast/60 transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 space-y-3.5">
        <div>
          <h4 className="font-display text-xl sm:text-2xl text-foam font-normal tracking-tight">
            {current.title}
          </h4>
          <p className="font-sans text-xs text-caramel font-medium mt-0.5">
            {current.summary}
          </p>
        </div>

        <p className="font-sans text-xs sm:text-sm text-crema/85 leading-relaxed font-light">
          {current.body}
        </p>

        {/* Quick Action Button to Jump directly to the relevant tool */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => jumpToSection(current.targetId)}
            className="w-full py-2 px-3 border border-caramel/50 bg-roast/60 hover:bg-caramel hover:text-espresso hover:border-caramel font-mono text-xs uppercase tracking-wider text-caramel transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{current.actionLabel}</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="border-t border-roast/80 px-5 py-3 flex items-center justify-between bg-roast/20">
        {/* Step dots */}
        <div className="flex items-center space-x-1.5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStep(idx);
                jumpToSection(steps[idx].targetId);
              }}
              className={`h-1.5 transition-all cursor-pointer ${
                idx === step
                  ? 'w-6 bg-caramel'
                  : 'w-2 bg-mocha/50 hover:bg-latte'
              }`}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Back Controls */}
        <div className="flex items-center space-x-2">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-latte hover:text-foam border border-roast hover:border-mocha transition-colors cursor-pointer"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-3 py-1 font-mono text-[11px] uppercase tracking-wider font-semibold bg-caramel text-espresso hover:bg-foam transition-colors cursor-pointer"
          >
            {step === steps.length - 1 ? 'Finish Tour ✓' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
}
