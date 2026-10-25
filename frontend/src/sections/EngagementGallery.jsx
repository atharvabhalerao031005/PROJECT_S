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

    // Calculate exact scroll distance so the final card docks perfectly in view
    // and NEVER slides off the screen to reveal a blank background.
    const calculateDistance = () => {
      const paddingRight = window.innerWidth > 1024 ? 96 : 48;
      const totalWidth = track.scrollWidth;
      const viewportWidth = container.clientWidth;
      return Math.max(0, totalWidth - viewportWidth + paddingRight);
    };

    const trigger = gsap.to(track, {
      x: () => -calculateDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${calculateDistance()}`,
        pin: true,
        scrub: 1.0,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
    };
  }, []);

  const benchmarkPhases = [
    {
      phase: "01",
      time: "00 – 10 MIN",
      stage: "THE ARRIVAL",
      title: "Opening Settling",
      subtitle: "Spatial Organization & Focus",
      benchmarkFused: "74.2",
      heightClass: "h-[450px]",
      glyph: <BotanicalSprigGlyph className="w-5 h-5" stroke="#D2AE82" />,
      desc: "Initial cohort arrival: students organize physical sketching tools, open laptops, and settle posture. Gaze alignment climbs as the morning design brief is introduced.",
      metricLabel: "BENCHMARK GAZE GAIN",
      metricVal: "+18.4%",
      waveformScale: "w-[45%]",
    },
    {
      phase: "02",
      time: "10 – 25 MIN",
      stage: "DEEP IMMERSION",
      title: "Concept Plateau",
      subtitle: "Sustained Cognitive Flow",
      benchmarkFused: "88.6",
      heightClass: "h-[475px]",
      glyph: <GazeEyeGlyph className="w-5 h-5" stroke="#B8772F" />,
      desc: "The cohort reaches collective cognitive equilibrium. Frontal head pose consistency exceeds 92%, and sustained tracking records uninterrupted attendance without false triggers.",
      metricLabel: "GAZE ALIGNMENT",
      metricVal: "93.8%",
      waveformScale: "w-[88%]",
    },
    {
      phase: "03",
      time: "25 – 35 MIN",
      stage: "POSTURAL SHIFT",
      title: "The Mid-Session Lull",
      subtitle: "Stillness & Inactivity Accumulation",
      benchmarkFused: "61.0",
      heightClass: "h-[440px]",
      glyph: <RestingCroissantGlyph className="w-5 h-5" stroke="#B8772F" />,
      desc: "Prolonged stillness accumulates an optical inactivity penalty. Facial vectors tilt downward during deep drawing. The AI agent flags this interval and suggests a peer critique prompt.",
      metricLabel: "INACTIVITY RISK",
      metricVal: "8 MIN STILL",
      waveformScale: "w-[30%]",
    },
    {
      phase: "04",
      time: "35 – 45 MIN",
      stage: "ACOUSTIC SURGE",
      title: "Interactive Debate",
      subtitle: "Librosa Speech Energy Peak",
      benchmarkFused: "86.4",
      heightClass: "h-[490px]",
      glyph: <AcousticWaveGlyph className="w-5 h-5" stroke="#D2AE82" />,
      desc: "Socratic inquiry unlocks energetic participatory dialogue. Librosa RMS audio values surge to -14.2 dBFS within human speech bands as students debate spatial strategies.",
      metricLabel: "SPEECH PEAK",
      metricVal: "-14.2 dBFS",
      waveformScale: "w-[95%]",
    },
    {
      phase: "05",
      time: "45 – 60 MIN",
      stage: "SYNTHESIS",
      title: "Atelier Wrap & Stamp",
      subtitle: "Archival Verification Seal",
      benchmarkFused: "84.0",
      heightClass: "h-[460px]",
      glyph: <PresenceSealGlyph className="w-5 h-5" stroke="#EBDCC2" />,
      desc: "Attendance ledger commits verified present records to SQLite WAL storage. Final pedagogical summary encapsulates classroom rhythm for instructor review.",
      metricLabel: "VERIFICATION RATE",
      metricVal: "100%",
      waveformScale: "w-[75%]",
    },
  ];

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-espresso text-foam select-none"
      style={{ backgroundColor: 'var(--espresso)', color: 'var(--foam)' }}
    >
      <div className="h-full w-full flex flex-col justify-between py-8 px-6 lg:px-12">
        
        {/* Section Top Header with Clear Benchmark Labeling */}
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between border-b border-roast/80 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <span className="micro-label text-latte/75 font-medium tracking-micro">
              04 / CHOREOGRAPHY ARCHIVE
            </span>
            <span className="text-latte/50 text-xs font-mono">•</span>
            <div className="tactile-status-pill border-mocha/40 bg-roast/40">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
              <span className="text-latte font-medium font-mono text-[10px]">
                60-MIN STUDIO REFERENCE BENCHMARK
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-caramel tracking-wider font-semibold">
            CHRONOLOGICAL SESSION CHOREOGRAPHY
          </span>
        </div>

        {/* Horizontal Pin Track with Precise Clamping (No Blank Void) */}
        <div className="w-full overflow-hidden my-auto py-2">
          <div
            ref={trackRef}
            className="flex space-x-8 items-center pl-4 lg:pl-12 pr-12 w-max will-change-transform"
          >
            {benchmarkPhases.map((phase, idx) => (
              <React.Fragment key={idx}>
                {/* Tactile Archival Card */}
                <div
                  className={`w-[400px] flex-shrink-0 border border-mocha/40 p-7 bg-roast/35 flex flex-col justify-between transition-all duration-300 hover:border-caramel/70 hover:bg-roast/50 shadow-2xl relative ${phase.heightClass}`}
                >
                  {/* Corner registration drafting marks */}
                  <div className="absolute top-2 left-2 text-mocha/50 font-mono text-[10px] leading-none select-none">+</div>
                  <div className="absolute top-2 right-2 text-mocha/50 font-mono text-[10px] leading-none select-none">+</div>
                  <div className="absolute bottom-2 left-2 text-mocha/50 font-mono text-[10px] leading-none select-none">+</div>
                  <div className="absolute bottom-2 right-2 text-mocha/50 font-mono text-[10px] leading-none select-none">+</div>

                  {/* Top: Phase Pill + Time + Glyph */}
                  <div>
                    <div className="flex items-center justify-between border-b border-roast/80 pb-3 mb-5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-espresso bg-caramel font-bold px-1.5 py-0.5 rounded-none">
                          PHASE {phase.phase}
                        </span>
                        <span className="font-mono text-xs text-caramel tracking-wider font-semibold">
                          {phase.time}
                        </span>
                      </div>
                      <div className="p-1.5 rounded-full border border-mocha/50 bg-roast/60">
                        {phase.glyph}
                      </div>
                    </div>

                    <span className="micro-label text-latte/75 font-medium block mb-1 tracking-micro text-[10px]">
                      {phase.stage} // {phase.subtitle}
                    </span>
                    <h3 className="font-display text-2xl text-foam font-normal tracking-tight">
                      {phase.title}
                    </h3>

                    <p className="font-sans text-xs text-crema/85 leading-relaxed mt-3.5 font-normal">
                      {phase.desc}
                    </p>
                  </div>

                  {/* Middle: Miniature Visual Rhythm Bar */}
                  <div className="py-3 border-t border-b border-roast/60 my-2">
                    <div className="flex items-center justify-between font-mono text-[9px] text-latte/65 mb-1">
                      <span>RHYTHM INTENSITY</span>
                      <span className="text-caramel font-semibold">{phase.benchmarkFused}/100</span>
                    </div>
                    <div className="w-full h-1 bg-roast/80 overflow-hidden">
                      <div className={`h-full bg-caramel ${phase.waveformScale} transition-all duration-500`} />
                    </div>
                  </div>

                  {/* Bottom: Metrics Callout */}
                  <div className="pt-2 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[9px] text-latte/70 uppercase block font-medium">
                        {phase.metricLabel}
                      </span>
                      <span className="text-sm text-latte font-medium">{phase.metricVal}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-latte/70 uppercase block font-medium">
                        BENCHMARK FUSION
                      </span>
                      <span className="text-base text-caramel font-bold">{phase.benchmarkFused}</span>
                    </div>
                  </div>
                </div>

                {/* Marginalia Note inserted after the Mid-Session Lull (idx === 2) */}
                {idx === 2 && (
                  <div
                    className="marginalia-note w-[290px] flex-shrink-0 p-5 border border-mocha/40 bg-roast/40 self-center shadow-lg"
                    style={{ transform: 'rotate(-1.5deg)' }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                      <span className="font-mono text-[9px] text-caramel uppercase tracking-widest font-semibold">
                        STUDIO RESEARCH DISPATCH
                      </span>
                    </div>
                    <p className="font-display italic text-xs text-crema/90 leading-relaxed">
                      "At minute 28, physiological stillness triggers the inactivity dampener. 
                      A subtle prompt from the pedagogical agent restores energy without breaking the room's intimacy."
                    </p>
                    <span className="font-mono text-[8px] text-latte/70 block mt-2.5 font-medium">
                      REF: COGNITIVE FATIGUE RECOVERY STUDY
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Final Anchor Card: Marks the conclusion of the 60-min arc so the final card docks on screen */}
            <div className="w-[340px] flex-shrink-0 border-2 border-caramel/60 p-7 bg-roast/50 flex flex-col justify-between shadow-2xl h-[450px]">
              <div>
                <div className="flex items-center space-x-2 pb-3 border-b border-roast/80 mb-4">
                  <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
                  <span className="font-mono text-[10px] text-caramel uppercase tracking-widest font-bold">
                    ARC COMPLETE // 60 MIN
                  </span>
                </div>
                <h4 className="font-display text-2xl text-foam font-normal">
                  End of Session Choreography
                </h4>
                <p className="font-sans text-xs text-crema/85 leading-relaxed mt-3">
                  The studio cycle concludes. Real-time verified attendance and aggregated telemetry are logged to SQLite WAL storage.
                </p>
              </div>

              <div className="p-4 bg-espresso/80 border border-mocha/50 space-y-2 text-center">
                <span className="font-mono text-[10px] text-latte uppercase tracking-widest block font-medium">
                  READY TO CONFIGURE?
                </span>
                <span className="font-mono text-xs text-caramel block font-bold">
                  SCROLL DOWN TO CALIBRATION ↓
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Horizontal Drag/Scroll Guide */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-t border-roast/80 pt-3 text-xs font-mono text-latte/75">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
            <span className="font-medium text-[11px]">SCROLL TO EXPLORE 60-MIN STUDIO CHOREOGRAPHY</span>
          </div>
          <span className="text-latte font-medium text-[11px]">DOCKS AT ARC CONCLUSION • FLOWS SEAMLESSLY DOWN</span>
        </div>

      </div>
    </section>
  );
}
