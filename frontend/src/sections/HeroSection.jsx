import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import HeroParallaxScene from '../components/svgs/HeroParallaxScene';
import { useMagnetic } from '../hooks/useMagnetic';

export default function HeroSection({ onStartSession, onOpenGuide }) {
  const containerRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const marginaliaRef = useRef(null);
  const magneticButtonRef = useMagnetic(0.35);

  const [heroClock, setHeroClock] = useState('09:41:02 UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setHeroClock(`${hrs}:${mins}:${secs} UTC`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Staggered line mask reveals
    tl.fromTo(
      [titleLine1Ref.current, titleLine2Ref.current],
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.12, delay: 0.2 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.6'
      )
      .fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        marginaliaRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7 },
        '-=0.4'
      );
  }, []);

  const scrollToLive = () => {
    const el = document.getElementById('live-desk');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPour = () => {
    const el = document.getElementById('the-pour');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 lg:px-12 bg-espresso overflow-hidden select-none"
    >
      {/* Top Editorial Index Meta */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-roast/60 pb-4 pt-4">
        <div className="flex items-center space-x-3">
          <span className="micro-label text-latte/75 font-medium">
            FOLIO N° 04 // 2026 EDITION
          </span>
          <span className="hidden sm:inline text-latte/50 text-xs font-mono">•</span>
          <span className="tactile-status-pill hidden sm:inline-flex border-roast/60 bg-roast/40">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
            <span className="text-latte font-medium">{heroClock}</span>
          </span>
        </div>

        <span className="micro-label text-latte/85 hidden lg:inline tracking-micro font-medium">
          LOCAL WEIGHTS • SUSTAINED COGNITION • ZERO BIOMETRIC STORAGE
        </span>

        <span className="micro-label text-latte/75 font-medium">
          SYS.VER 2.0.4 [STANDALONE]
        </span>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Typography Column */}
          <div className="lg:col-span-7 z-10 space-y-6">
            {/* Tactile Live Indicator Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 border border-mocha/40 bg-roast/35 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
              <span className="font-mono text-[10px] uppercase tracking-micro text-caramel font-semibold">
                MULTIMODAL ATELIER RIG // ONLINE
              </span>
            </div>

            <h1 className="fluid-headline font-display text-foam font-normal tracking-tight">
              <span className="line-mask">
                <span ref={titleLine1Ref} className="line-inner block">
                  Slow mornings,
                </span>
              </span>
              <span className="line-mask">
                <span ref={titleLine2Ref} className="line-inner block italic text-caramel">
                  attentive minds.
                </span>
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-crema/85 font-sans max-w-xl font-normal leading-relaxed"
            >
              Multimodal attendance and cognitive engagement telemetry crafted like an analog 
              architectural study journal. Combining OpenCV Haar Cascades, sustained temporal presence, 
              and Librosa acoustic dynamics into gentle pedagogical insights—running entirely offline on local hardware.
            </p>

            {/* CTAs */}
            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <button
                ref={magneticButtonRef}
                onClick={scrollToLive}
                className="relative group overflow-hidden px-7 py-3.5 sm:px-8 sm:py-4 border border-caramel bg-transparent text-foam font-mono text-xs uppercase tracking-widest transition-colors duration-300 cursor-pointer shadow-lg font-medium"
              >
                {/* Bottom-up caramel fill wipe */}
                <span className="absolute inset-0 bg-caramel translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 group-hover:text-espresso font-semibold flex items-center space-x-3">
                  <span>Enter Telemetry Studio</span>
                  <span className="text-sm font-display">→</span>
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenGuide}
                className="relative group px-5 py-3.5 sm:py-4 border border-mocha/60 bg-roast/40 hover:bg-roast hover:border-caramel text-foam font-mono text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
                <span className="text-caramel font-semibold">Concierge Guide [ ? ]</span>
              </button>

              <button
                onClick={scrollToPour}
                className="micro-label text-latte hover:text-foam border-b border-mocha/60 hover:border-foam pb-1 transition-colors bg-transparent cursor-pointer font-medium text-[11px]"
              >
                02 / Pipeline
              </button>
            </div>

            {/* Subtle Marginalia Note tilted at -1.5deg */}
            <div
              ref={marginaliaRef}
              className="marginalia-note p-4 border border-mocha/35 bg-roast/30 max-w-lg mt-6 relative shadow-md"
              style={{ transform: 'rotate(-1.5deg)' }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-caramel font-semibold">
                  FIELD NOTE § 01 // ROOM 402 OBSERVATION
                </span>
              </div>
              <p className="font-display italic text-sm text-crema/90 leading-snug">
                "Attention is not a binary switch flipped by a camera shutter. 
                It is a slow pour that breathes with the cadence of thought and natural morning light."
              </p>
            </div>
          </div>

          {/* 6-Layer Parallax Illustration Column */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <HeroParallaxScene />
          </div>

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pt-6 border-t border-roast/50">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
          <span className="micro-label text-latte/75 font-medium">
            DESK TELEMETRY // CALIBRATED
          </span>
        </div>

        {/* Tiny animated SVG coffee bean bobbing inside fine capsule */}
        <div className="flex flex-col items-center space-y-1.5">
          <span className="micro-label text-latte/80 text-[9px] font-medium">SCROLL TO READ</span>
          <div className="w-5 h-9 rounded-full border border-mocha/60 flex items-start justify-center pt-1.5">
            <svg
              className="w-2.5 h-2.5 text-caramel animate-bounce"
              viewBox="0 0 10 10"
              fill="currentColor"
            >
              <ellipse cx="5" cy="5" rx="4" ry="2.5" />
            </svg>
          </div>
        </div>

        <span className="micro-label text-latte/75 font-medium">
          AUDIO VAD // 16KHZ PCM
        </span>
      </div>
    </section>
  );
}
