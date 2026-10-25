import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryPhilosophy() {
  const containerRef = useRef(null);
  const [statementIndex, setStatementIndex] = useState(0);

  const statements = [
    { main: "Presence is not a single frame.", highlight: "It is a sustained commitment over time." },
    { main: "Attention is a rhythm, not a metric.", highlight: "It breathes with the cadence of thought." },
    { main: "Privacy lives on the local machine.", highlight: "No cloud dependencies, zero facial storage." },
  ];

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    // ScrollTrigger to cycle statements based on scroll depth through this section
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        if (progress < 0.35) {
          setStatementIndex(0);
        } else if (progress < 0.70) {
          setStatementIndex(1);
        } else {
          setStatementIndex(2);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="philosophy"
      data-theme="light"
      ref={containerRef}
      className="relative min-h-[160vh] py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-foam text-espresso transition-colors duration-700 select-none"
      style={{ backgroundColor: 'var(--foam)', color: 'var(--espresso)' }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Top Header Rule */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-mocha/25 pb-4 mb-10 sm:mb-16 gap-3">
          <div className="flex items-center space-x-3">
            <span className="micro-label text-mocha font-semibold text-[10px] sm:text-[11px]">
              01 / MANIFESTO &amp; ETHICAL FOUNDATION
            </span>
            <span className="text-mocha text-xs font-mono">•</span>
            <div className="tactile-status-pill-paper">
              <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-incandescent" />
              <span className="text-[9px] font-mono tracking-wider text-espresso font-medium">ETHICS PROTOCOL 2026</span>
            </div>
          </div>
          <span className="micro-label text-mocha font-semibold tracking-micro text-[10px] sm:text-[11px]">
            STUDIO ATELIER PRINCIPLES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
          
          {/* Left Column: Pinned Dynamic Italic Statement + Stamp */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 xl:top-28 lg:self-start min-w-zero">
            <div className="space-y-6 sm:space-y-8">
              <span className="micro-label text-mocha tracking-micro font-semibold">
                THE EDITORIAL CREED
              </span>

              {/* Dynamic crossfading italic statement */}
              <div className="min-h-[180px] transition-all duration-500 ease-out">
                <h2 className="font-display text-3xl md:text-5xl tracking-tight leading-tight italic font-normal text-espresso">
                  "{statements[statementIndex].main}"
                </h2>
                <p className="mt-4 font-sans text-lg text-roast font-medium">
                  {statements[statementIndex].highlight}
                </p>
              </div>

              {/* -2deg Rotated Circular Archival Stamp */}
              <div className="pt-4 flex items-center space-x-6">
                <div
                  className="inline-block transform -rotate-2 select-none"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  <svg
                    className="w-36 h-36 animate-[spin_20s_linear_infinite]"
                    viewBox="0 0 160 160"
                  >
                    <defs>
                      <path
                        id="stampTextPath"
                        d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                      />
                    </defs>
                    <circle cx="80" cy="80" r="74" fill="none" stroke="#6B4630" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="80" cy="80" r="68" fill="none" stroke="#B8772F" strokeWidth="1.5" />
                    <circle cx="80" cy="80" r="44" fill="none" stroke="#3A2619" strokeWidth="1" />
                    
                    {/* Center Seal Icon */}
                    <circle cx="80" cy="80" r="4" fill="#B8772F" />
                    <path d="M 75 80 L 80 85 L 87 75" stroke="#B8772F" strokeWidth="1.8" fill="none" />

                    <text fill="#3A2619" fontSize="8.5" fontFamily="JetBrains Mono" letterSpacing="0.22em">
                      <textPath href="#stampTextPath" startOffset="0%">
                        OFFLINE FIRST • LOCAL WEIGHTS • PRIVACY PRESERVED •
                      </textPath>
                    </text>
                  </svg>
                </div>

                <div className="hidden sm:block text-xs font-mono space-y-1">
                  <span className="block text-espresso font-semibold">SOVEREIGN ATELIER</span>
                  <span className="block text-[10px] text-mocha font-medium">ZERO BIOMETRIC CLOUD PERSISTENCE</span>
                  <span className="block text-[10px] text-caramel font-semibold">100% AIR-GAPPED HARDWARE</span>
                </div>
              </div>

              {/* Marginalia Note § 02 tilted at 1.8deg */}
              <div
                className="marginalia-note p-5 border border-mocha/30 bg-crema/45 max-w-sm mt-6 shadow-sm"
                style={{ transform: 'rotate(1.8deg)' }}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-mocha font-semibold">
                    MARGINALIA § 02 // GAZE DISPERSION
                  </span>
                </div>
                <p className="font-display italic text-sm text-espresso leading-snug">
                  "Beware naive camera metrics. A student looking down is sketching or reflecting, 
                  not disengaged. True attendance honors the whole human."
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Three Warm Thoughtful Editorial Paragraphs */}
          <div className="lg:col-span-7 space-y-12 lg:pl-8 lg:border-l lg:border-mocha/25">
            
            <div className="space-y-4">
              <span className="micro-label text-mocha tracking-micro font-semibold">
                01.01 // BEYOND THE SNAPSHOT
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-espresso">
                The Fallacy of Single-Frame Facial Verification
              </h3>
              <p className="font-sans text-base md:text-lg text-roast leading-relaxed font-normal">
                Conventional attendance software captures a fleeting frame and claims comprehension. 
                A student walking across a doorway or glancing past a lens registers as present; 
                conversely, an attentive learner looking down into their sketchbook disappears into absentia. 
                We discard the snapshot. By anchoring validation to continuous IoU and Euclidean trajectory tracking 
                with a configurable temporal threshold, verification requires a sustained temporal footprint. 
                False positives dissolve naturally into the ambient studio environment.
              </p>
            </div>

            <div className="space-y-4">
              <span className="micro-label text-mocha tracking-micro font-semibold">
                01.02 // MULTIMODAL HARMONY
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-espresso">
                Fusing Visual Orientation with Acoustic Breath
              </h3>
              <p className="font-sans text-base md:text-lg text-roast leading-relaxed font-normal">
                True cognitive resonance is multi-sensory. When a classroom is silent, optical head-pose symmetry 
                and gentle postural shifts indicate contemplative note-taking. When debate erupts, 
                acoustic energy within human vocal bands (16 kHz PCM processed through Librosa spectral centroids) 
                peaks while visual gaze disperses across peers. Our fusion engine balances these complementary 
                signals, evaluating human engagement not as rigid compliance, but as a living dialogue.
              </p>
            </div>

            <div className="space-y-4">
              <span className="micro-label text-mocha tracking-micro font-semibold">
                01.03 // EMBEDDED SOVEREIGNTY
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-espresso">
                Offline Execution as an Ethical Requirement
              </h3>
              <p className="font-sans text-base md:text-lg text-roast leading-relaxed font-normal">
                Educational environments demand unwavering data sovereignty. Raw frames never cross a network 
                gateway; neural embeddings are ephemeral; and facial vector calculations vanish from memory 
                the instant their sustained counter terminates. All session telemetry persists locally inside an 
                unencrypted, auditable SQLite WAL database. Even the pedagogical decision agent is paired with an 
                offline heuristic engine that operates indefinitely without internet access or API credentials.
              </p>
            </div>

            {/* Editorial Quotation Box */}
            <div className="p-8 border border-mocha/30 bg-crema/35 relative shadow-sm">
              <span className="absolute -top-3 left-6 px-3 bg-foam font-mono text-[10px] text-mocha uppercase tracking-widest border border-mocha/25 font-medium">
                ARCHITECTURAL NOTE
              </span>
              <p className="font-display italic text-lg text-espresso leading-relaxed">
                "We do not build surveillance instruments for administrators; we craft a warm analog compass 
                for educators seeking to harmonize their studio's rhythm."
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="micro-label text-mocha tracking-micro font-medium">ATELIER PEDAGOGICAL LAB</span>
                <span className="font-mono text-xs text-caramel font-semibold">LEIPZIG &amp; KYOTO</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
