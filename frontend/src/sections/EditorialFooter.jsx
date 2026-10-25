import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function EditorialFooter() {
  const containerRef = useRef(null);

  useEffect(() => {
    const steam1 = containerRef.current?.querySelector('.footer-steam-1');
    const steam2 = containerRef.current?.querySelector('.footer-steam-2');
    const steam3 = containerRef.current?.querySelector('.footer-steam-3');

    if (steam1 && steam2 && steam3) {
      gsap.to([steam1, steam2, steam3], {
        y: -20,
        opacity: 0.15,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.5,
      });
    }
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative pt-24 pb-0 px-6 lg:px-12 bg-espresso text-foam overflow-hidden border-t border-roast select-none"
      style={{ backgroundColor: 'var(--espresso)', color: 'var(--foam)' }}
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Colophon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16 border-b border-roast/60">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
              <span className="micro-label text-mocha tracking-micro">THE STUDIO FOLIO</span>
            </div>
            <p className="font-sans text-sm text-crema/85 max-w-sm leading-relaxed">
              Crafted as an analog study journal from an architectural studio. Multimodal telemetry 
              respecting human dignity, student attention, and offline computational sovereignty.
            </p>
            <div className="tactile-status-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-tape-blink" />
              <span className="text-latte font-mono text-[9px]">AIR-GAPPED TELEMETRY ARCHITECTURE</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <span className="micro-label text-mocha block tracking-micro">CORE ALGORITHMS</span>
            <ul className="font-mono text-xs text-latte space-y-1.5 list-none">
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>OpenCV Haar Frontal 1.1x</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>IoU &amp; Centroid Persistence</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>Librosa Spectral Centroids</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>Groq &amp; Gemini 2.0 Flash</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>Offline Heuristic Engine</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <span className="micro-label text-mocha block tracking-micro">LOCAL ARTIFACTS</span>
            <ul className="font-mono text-xs text-latte space-y-1.5 list-none">
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>SQLite WAL Ledger</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>CSV Attendance Export</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>16 kHz PCM Audio Pipeline</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-caramel">›</span>
                <span>WebSocket Stream /ws/stream</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 text-right md:text-left">
            <div>
              <span className="micro-label text-mocha block tracking-micro">EDITION</span>
              <span className="font-mono text-xs text-caramel block font-semibold">SLOW MORNING 2026</span>
              <span className="font-mono text-[10px] text-mocha block">AWWWARDS EDITORIAL SPEC</span>
            </div>

            <div
              className="marginalia-note p-3 border border-mocha/30 bg-roast/40 text-left mt-2"
              style={{ transform: 'rotate(-1.2deg)' }}
            >
              <span className="font-display italic text-[11px] text-crema/90 block leading-snug">
                "Zero cloud tracking. Zero facial vectors stored. A quiet pedagogical companion."
              </span>
            </div>
          </div>

        </div>

        {/* Rising Steam SVG Layer above giant wordmark */}
        <div className="relative h-16 w-full flex justify-center items-end pointer-events-none">
          <svg className="w-96 h-16 overflow-visible" viewBox="0 0 400 60" fill="none">
            <path
              className="footer-steam-1"
              d="M 80 50 C 70 30, 95 15, 85 0"
              stroke="#D2AE82"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              className="footer-steam-2"
              d="M 200 50 C 215 30, 185 15, 205 0"
              stroke="#EBDCC2"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              className="footer-steam-3"
              d="M 320 50 C 310 30, 335 15, 325 0"
              stroke="#D2AE82"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>
        </div>

      </div>

      {/* Giant Cropped Fraunces Wordmark at Very Bottom Edge */}
      <div className="w-full overflow-hidden text-center leading-none select-none">
        <h1
          className="font-display font-bold tracking-tighter text-roast hover:text-mocha transition-colors duration-500 text-[14vw] md:text-[15.5vw] uppercase translate-y-[20%]"
          style={{ letterSpacing: '-0.05em' }}
        >
          ATELIER // PRESENCE
        </h1>
      </div>
    </footer>
  );
}
