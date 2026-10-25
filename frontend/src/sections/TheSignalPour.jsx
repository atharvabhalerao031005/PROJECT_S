import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PipelineStep1SVG,
  PipelineStep2SVG,
  PipelineStep3SVG,
  PipelineStep4SVG,
} from '../components/svgs/PipelineStepSVGs';

gsap.registerPlugin(ScrollTrigger);

export default function TheSignalPour() {
  const containerRef = useRef(null);
  const pinContentRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Visual Capture & Haar Cascade",
      sub: "The Bean: Multi-Scale Frontal Aperture",
      copy: "Continuous multi-scale Haar cascades scan grayscale frame buffers at 1.1x scale factor, isolating frontal face features and assigning persistent trajectory IDs through IoU and Euclidean centroid tracking.",
      code: "cv2.CascadeClassifier(haarcascade_frontalface_default.xml)",
      marginalia: "Aperture Note: 1.1x scale factor balances real-time 30fps throughput with edge sensitivity across varying studio distances.",
      tilt: "-1.2deg",
    },
    {
      num: "02",
      title: "Feature Extraction & Mesh Geometry",
      sub: "The Grind: Spectral Decomposition & Head Pose",
      copy: "Bounding-box aspect symmetry isolates visual gaze angle while Librosa computes spectral centroids across 16 kHz PCM audio chunks to isolate human vocal bands from classroom room noise.",
      code: "librosa.feature.spectral_centroid(y=samples, sr=16000)",
      marginalia: "Acoustic Note: Speech centroids cluster cleanly between 800Hz and 2.5kHz, distinguishing lively debate from paper rustling.",
      tilt: "1.5deg",
    },
    {
      num: "03",
      title: "Sustained Presence Logic",
      sub: "The Bloom: Temporal Verification Threshold",
      copy: "Eliminating single-frame false positives from hallway walk-bys: participants must accumulate continuous presence beyond the 10.0-second threshold before being logged as Verified Present.",
      code: "if sustained_seconds >= threshold: status = 'Verified Present'",
      marginalia: "Bloom Note: The 10.0s window acts as a temporal low-pass filter, effortlessly discarding transitory interruptions.",
      tilt: "-1.4deg",
    },
    {
      num: "04",
      title: "Agentic Pedagogy & Decision Fusion",
      sub: "The Pour: Distilled Teaching Pacing Insights",
      copy: "Multimodal fusion weighs 45% visual attention, 25% movement, and 30% acoustics. When attention dips occur, Groq Llama 3 or Gemini 2.0 Flash synthesizes non-enforcing, context-aware teaching prompts.",
      code: "Fused = 0.45(Vis) + 0.25(Mvmt) + 0.30(Aud) - InactivityPenalty",
      marginalia: "Pedagogy Note: The AI agent acts like an observant colleague, prompting small peer discussions before fatigue settles.",
      tilt: "1.6deg",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const pinContent = pinContentRef.current;
    if (!container || !pinContent) return;

    // Pinning for 300vh
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=300%',
      pin: pinContent,
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.25) {
          setActiveStep(0);
        } else if (p < 0.5) {
          setActiveStep(1);
        } else if (p < 0.75) {
          setActiveStep(2);
        } else {
          setActiveStep(3);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="the-pour"
      ref={containerRef}
      className="relative min-h-[400vh] bg-roast text-foam overflow-hidden select-none"
      style={{ backgroundColor: 'var(--roast)', color: 'var(--foam)' }}
    >
      {/* Pinned Screen Container */}
      <div
        ref={pinContentRef}
        className="h-screen w-full flex flex-col justify-between py-12 px-6 lg:px-12 max-w-7xl mx-auto"
      >
        {/* Top Section Header with Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-mocha/40 pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
            <span className="micro-label text-latte font-medium tracking-micro">
              02 / THE POUR — MULTIMODAL PIPELINE ARCHITECTURE
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="tactile-status-pill border-mocha/50 bg-espresso/70">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-tape-blink" />
              <span className="text-latte font-mono text-[9px] font-medium">PIPELINE STREAM 30 FPS</span>
            </div>
            <span className="font-mono text-xs text-caramel font-semibold">
              STAGE {steps[activeStep].num} OF 04
            </span>
          </div>
        </div>

        {/* Center 3-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Big Typographic Counter & Stage Name */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-6xl md:text-8xl font-light text-latte tracking-tighter">
              {steps[activeStep].num}
              <span className="text-latte/65 text-2xl font-mono">/04</span>
            </span>
            <div className="pt-2">
              <span className="micro-label text-caramel block mb-1 tracking-micro font-semibold">
                {steps[activeStep].sub}
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-foam font-medium leading-tight">
                {steps[activeStep].title}
              </h3>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center space-x-2 pt-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === activeStep ? 'w-8 bg-caramel' : 'w-2 bg-mocha/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Center Column: Morphing/Crossfading Custom SVG */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 border border-mocha/40 bg-espresso/70 relative min-h-[340px] shadow-2xl">
            <div className="w-full flex items-center justify-center transition-opacity duration-500">
              {activeStep === 0 && <PipelineStep1SVG className="w-full h-72" />}
              {activeStep === 1 && <PipelineStep2SVG className="w-full h-72" />}
              {activeStep === 2 && <PipelineStep3SVG className="w-full h-72" />}
              {activeStep === 3 && <PipelineStep4SVG className="w-full h-72" />}
            </div>

            {/* Corner Crop Marks on the frame */}
            <span className="absolute top-2 left-2 font-mono text-[9px] text-latte/50">+</span>
            <span className="absolute top-2 right-2 font-mono text-[9px] text-latte/50">+</span>
            <span className="absolute bottom-2 left-2 font-mono text-[9px] text-latte/50">+</span>
            <span className="absolute bottom-2 right-2 font-mono text-[9px] text-latte/50">+</span>

            {/* Center Frame Contact Tag */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between font-mono text-[8px] text-latte/70 pointer-events-none">
              <span>LATENCY: &lt; 14ms</span>
              <span className="text-caramel font-semibold">LOCAL COMPUTE ONLY</span>
            </div>
          </div>

          {/* Right Column: Crisp Copy, Code Equation & Marginalia Note */}
          <div className="lg:col-span-4 space-y-5 lg:pl-6">
            <span className="micro-label text-latte/75 font-medium tracking-micro">
              ARCHITECTURAL FORMULATION
            </span>
            <p className="font-sans text-base md:text-lg text-crema/90 leading-relaxed font-normal">
              {steps[activeStep].copy}
            </p>

            {/* Code / Algorithm Snippet */}
            <div className="p-4 bg-espresso/90 border border-mocha/50 font-mono text-xs text-caramel shadow-md">
              <span className="text-latte/70 block text-[10px] mb-1 font-mono tracking-wider font-semibold">// TELEMETRY EQUATION</span>
              <code>{steps[activeStep].code}</code>
            </div>

            {/* Tilted Step Marginalia Note */}
            <div
              className="marginalia-note p-3.5 border border-mocha/40 bg-espresso/60 relative shadow-sm"
              style={{ transform: `rotate(${steps[activeStep].tilt})` }}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                <span className="font-mono text-[9px] text-caramel uppercase tracking-wider font-semibold">
                  PIPELINE FIELD NOTE
                </span>
              </div>
              <p className="font-display italic text-xs text-crema/90 leading-snug">
                "{steps[activeStep].marginalia}"
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Velocity-Reactive Marquee Strip */}
        <div className="border-t border-mocha/40 pt-4 overflow-hidden select-none">
          <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] space-x-12">
            <span className="font-mono text-xs text-latte/85 tracking-widest uppercase font-medium">
              HAAR CASCADE 1.1x • LIBROSA 16KHZ PCM • SUSTAINED PRESENCE THRESHOLD 10.0S • LOCAL SQLITE WAL • DEEPSORT IOU TRACKING •
            </span>
            <span className="font-mono text-xs text-latte/85 tracking-widest uppercase font-medium">
              HAAR CASCADE 1.1x • LIBROSA 16KHZ PCM • SUSTAINED PRESENCE THRESHOLD 10.0S • LOCAL SQLITE WAL • DEEPSORT IOU TRACKING •
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
