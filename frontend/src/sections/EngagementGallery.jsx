import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GazeEyeGlyph,
  AcousticWaveGlyph,
  RestingCroissantGlyph,
  PresenceSealGlyph,
  BotanicalSprigGlyph,
} from '../components/svgs/TelemetryGlyphs';

gsap.registerPlugin(ScrollTrigger);

export default function EngagementGallery() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Horizontal scroll pinned via GSAP
    const trigger = gsap.to(track, {
      xPercent: -65,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.2,
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
    };
  }, []);

  const panels = [
    {
      time: "00 – 10 MIN",
      title: "The Opening Settling",
      subtitle: "Arrival & Postural Alignment",
      fused: "74.2",
      heightClass: "h-[450px] mt-6",
      glyph: <BotanicalSprigGlyph className="w-5 h-5" stroke="#D2AE82" />,
      desc: "Initial cohort arrival: students organize sketching tools, adjust display angles, and settle into collective focus. Visual attention climbs steadily as the morning agenda is introduced.",
      statLabel: "INITIAL ATTENTION GAIN",
      statVal: "+18.4%",
    },
    {
      time: "10 – 25 MIN",
      title: "Deep Concept Immersion",
      subtitle: "Sustained Presence Plateau",
      fused: "88.6",
      heightClass: "h-[495px] mt-0",
      glyph: <GazeEyeGlyph className="w-5 h-5" stroke="#B8772F" />,
      desc: "The cohort reaches cognitive equilibrium. Frontal head pose consistency exceeds 92%, and sustained tracking records uninterrupted attendance without a single false positive trigger.",
      statLabel: "GAZE STABILITY",
      statVal: "93.8%",
    },
    {
      time: "25 – 35 MIN",
      title: "The Mid-Session Dip",
      subtitle: "Cognitive Slump & Posture Drift",
      fused: "61.0",
      heightClass: "h-[440px] mt-10",
      glyph: <RestingCroissantGlyph className="w-5 h-5" stroke="#B8772F" />,
      desc: "Prolonged stillness accumulates an inactivity penalty. Facial vectors tilt downwards as attention wanders. The AI agent flags this interval and suggests an immediate peer synthesis prompt.",
      statLabel: "RECOVERY WINDOW",
      statVal: "90 SEC",
    },
    {
      time: "35 – 45 MIN",
      title: "Interactive Acoustic Peak",
      subtitle: "Librosa Speech Energy Burst",
      fused: "86.4",
      heightClass: "h-[505px] mt-2",
      glyph: <AcousticWaveGlyph className="w-5 h-5" stroke="#D2AE82" />,
      desc: "Socratic inquiry unlocks energetic participatory dialogue. Librosa RMS audio values surge to -14.2 dB within human speech bands while students debate spatial concepts.",
      statLabel: "RMS DECIBEL PEAK",
      statVal: "-14.2 dB",
    },
    {
      time: "45 – 60 MIN",
      title: "Synthesis & Atelier Wrap",
      subtitle: "Archival Verification Stamp",
      fused: "84.0",
      heightClass: "h-[460px] mt-6",
      glyph: <PresenceSealGlyph className="w-5 h-5" stroke="#EBDCC2" />,
      desc: "Attendance ledger commits verified present records to SQLite WAL storage. Final pedagogical summary encapsulates classroom rhythm for instructor review.",
      statLabel: "VERIFICATION RATE",
      statVal: "100%",
    },
  ];

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative min-h-[300vh] bg-espresso text-foam overflow-hidden select-none"
      style={{ backgroundColor: 'var(--espresso)', color: 'var(--foam)' }}
    >
      <div className="h-screen w-full flex flex-col justify-between py-12 px-6 lg:px-12">
        
        {/* Section Top Header */}
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between border-b border-roast pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <span className="micro-label text-mocha tracking-micro">
              04 / SPACE &amp; SESSION DYNAMICS
            </span>
            <span className="text-mocha text-xs font-mono">•</span>
            <div className="tactile-status-pill border-mocha/40 bg-roast/40">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
              <span className="text-latte">CHOREOGRAPHY LOG</span>
            </div>
          </div>
          <span className="font-mono text-xs text-caramel tracking-wider">
            CHRONOLOGICAL SESSION CHOREOGRAPHY
          </span>
        </div>

        {/* Horizontal Pin Track */}
        <div className="w-full overflow-hidden my-auto py-4">
          <div
            ref={trackRef}
            className="flex space-x-10 items-center pl-4 lg:pl-12 will-change-transform"
            style={{ width: '310%' }}
          >
            {panels.map((panel, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`w-[420px] flex-shrink-0 border border-roast p-8 bg-roast/35 flex flex-col justify-between transition-all duration-300 hover:border-caramel/80 hover:bg-roast/50 shadow-xl ${panel.heightClass}`}
                >
                  {/* Top: Interval & Icon */}
                  <div>
                    <div className="flex items-center justify-between border-b border-roast/70 pb-3 mb-6">
                      <span className="font-mono text-xs text-caramel tracking-widest">
                        {panel.time}
                      </span>
                      <div className="p-1.5 rounded-full border border-mocha/40 bg-roast/50">
                        {panel.glyph}
                      </div>
                    </div>

                    <span className="micro-label text-mocha block mb-1 tracking-micro">
                      {panel.subtitle}
                    </span>
                    <h3 className="font-display text-2xl text-foam font-normal">
                      {panel.title}
                    </h3>

                    <p className="font-sans text-sm text-crema/80 leading-relaxed mt-4">
                      {panel.desc}
                    </p>
                  </div>

                  {/* Bottom: Metrics Callout */}
                  <div className="pt-6 border-t border-roast/70 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[10px] text-mocha uppercase block">{panel.statLabel}</span>
                      <span className="text-base text-latte font-medium">{panel.statVal}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-mocha uppercase block">FUSED SCORE</span>
                      <span className="text-lg text-caramel font-semibold">{panel.fused}</span>
                    </div>
                  </div>

                </div>

                {/* Marginalia Note inserted after the Mid-Session Dip card (idx === 2) */}
                {idx === 2 && (
                  <div
                    className="marginalia-note w-[310px] flex-shrink-0 p-6 border border-mocha/40 bg-roast/30 self-center"
                    style={{ transform: 'rotate(-1.6deg)' }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                      <span className="font-mono text-[9px] text-caramel uppercase tracking-widest">
                        ATELIER LAB OBSERVATION
                      </span>
                    </div>
                    <p className="font-display italic text-sm text-crema/90 leading-relaxed">
                      "At minute 28, physiological stillness triggers the inactivity dampener. 
                      A subtle prompt from the pedagogical agent restores energy without breaking the room's intimacy."
                    </p>
                    <span className="font-mono text-[8px] text-mocha block mt-3">
                      REF: COGNITIVE FATIGUE RECOVERY STUDY
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Horizontal Drag/Scroll Guide */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-t border-roast pt-4 text-xs font-mono text-mocha">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
            <span>SCROLL DOWN TO TRAVERSE HORIZONTAL DYNAMICS</span>
          </div>
          <span className="text-latte">5 SESSION INTERVALS • 60 MIN ROTATION</span>
        </div>

      </div>
    </section>
  );
}
