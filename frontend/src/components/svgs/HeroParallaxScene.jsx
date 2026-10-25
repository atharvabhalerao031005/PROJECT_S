import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * HeroParallaxScene
 * 6-layer hand-crafted SVG studio/study desk scene
 * Includes ceramic cup, saucer, rising animated steam wisps, open field notebook,
 * brass optical lens, vintage mic silhouette, and roasted coffee beans.
 */
export default function HeroParallaxScene() {
  const containerRef = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);
  const layer5Ref = useRef(null);
  const layer6Ref = useRef(null);

  useEffect(() => {
    // Micro-parallax on mouse movement for non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const l2 = layer2Ref.current;
    const l3 = layer3Ref.current;
    const l4 = layer4Ref.current;
    const l5 = layer5Ref.current;
    const l6 = layer6Ref.current;

    const q2X = gsap.quickTo(l2, 'x', { duration: 0.8, ease: 'power2.out' });
    const q2Y = gsap.quickTo(l2, 'y', { duration: 0.8, ease: 'power2.out' });

    const q3X = gsap.quickTo(l3, 'x', { duration: 0.7, ease: 'power2.out' });
    const q3Y = gsap.quickTo(l3, 'y', { duration: 0.7, ease: 'power2.out' });

    const q4X = gsap.quickTo(l4, 'x', { duration: 0.6, ease: 'power2.out' });
    const q4Y = gsap.quickTo(l4, 'y', { duration: 0.6, ease: 'power2.out' });

    const q5X = gsap.quickTo(l5, 'x', { duration: 0.5, ease: 'power2.out' });
    const q5Y = gsap.quickTo(l5, 'y', { duration: 0.5, ease: 'power2.out' });

    const q6X = gsap.quickTo(l6, 'x', { duration: 0.4, ease: 'power2.out' });
    const q6Y = gsap.quickTo(l6, 'y', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      q2X(normX * 4);
      q2Y(normY * 3);

      q3X(normX * 8);
      q3Y(normY * 6);

      q4X(normX * 12);
      q4Y(normY * 9);

      q5X(normX * 16);
      q5Y(normY * 12);

      q6X(normX * 22);
      q6Y(normY * 16);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Continuous subtle steam animation
    const steam1 = containerRef.current?.querySelector('.steam-line-1');
    const steam2 = containerRef.current?.querySelector('.steam-line-2');
    const steam3 = containerRef.current?.querySelector('.steam-line-3');

    if (steam1 && steam2 && steam3) {
      gsap.to([steam1, steam2, steam3], {
        y: -14,
        opacity: 0.15,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] max-w-4xl mx-auto overflow-visible select-none"
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 960 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EBDCC2" />
            <stop offset="100%" stopColor="#D2AE82" />
          </linearGradient>
          <linearGradient id="coffeeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1C1310" />
            <stop offset="60%" stopColor="#3A2619" />
            <stop offset="100%" stopColor="#B8772F" />
          </linearGradient>
          <linearGradient id="notebookGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F7F0E3" />
            <stop offset="50%" stopColor="#EBDCC2" />
            <stop offset="100%" stopColor="#F7F0E3" />
          </linearGradient>
        </defs>

        {/* =========================================================================
            LAYER 1: Static Architectural Studio Wall & Drafting Grid (Speed 0.0)
            ========================================================================= */}
        <g id="layer-1" className="opacity-40">
          {/* Subtle Grid Lines */}
          <line x1="80" y1="40" x2="80" y2="560" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="240" y1="40" x2="240" y2="560" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="480" y1="40" x2="480" y2="560" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="720" y1="40" x2="720" y2="560" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="880" y1="40" x2="880" y2="560" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          
          <line x1="40" y1="120" x2="920" y2="120" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="280" x2="920" y2="280" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="40" y1="440" x2="920" y2="440" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />

          {/* Architectural Axis Coordinates */}
          <text x="88" y="55" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="0.15em">
            SEC.01 // LAT 43.71° N
          </text>
          <text x="728" y="55" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="0.15em">
            OPTICAL RADIAL AXIS
          </text>
        </g>

        {/* =========================================================================
            LAYER 2: Faded Giant Botanical Leaf & Coffee Branch Silhouettes (Speed 0.15)
            ========================================================================= */}
        <g id="layer-2" ref={layer2Ref} className="opacity-25">
          {/* Left Botanical Branch */}
          <path
            d="M 60 520 C 110 460, 150 360, 130 240 C 120 180, 80 120, 50 90"
            stroke="#3A2619"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path d="M 125 320 C 160 300, 190 315, 175 345 C 155 365, 135 345, 125 320 Z" fill="#3A2619" />
          <path d="M 130 250 C 170 230, 205 250, 185 280 C 160 300, 140 275, 130 250 Z" fill="#3A2619" />
          <path d="M 105 180 C 135 150, 170 170, 150 198 C 130 215, 110 195, 105 180 Z" fill="#3A2619" />

          {/* Right Botanical Branch */}
          <path
            d="M 900 520 C 850 440, 820 340, 840 220 C 850 160, 880 110, 910 80"
            stroke="#3A2619"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M 830 330 C 790 315, 760 330, 780 360 C 800 375, 825 355, 830 330 Z" fill="#3A2619" />
          <path d="M 835 240 C 790 225, 765 245, 785 275 C 805 290, 830 265, 835 240 Z" fill="#3A2619" />
        </g>

        {/* =========================================================================
            LAYER 3: Studio Desk Geometry & Drafting Instruments (Speed 0.30)
            ========================================================================= */}
        <g id="layer-3" ref={layer3Ref}>
          {/* Solid Architectural Desk Edge */}
          <path
            d="M 40 450 L 920 450 L 920 580 L 40 580 Z"
            fill="#231713"
            stroke="#3A2619"
            strokeWidth="1.5"
          />
          <line x1="40" y1="465" x2="920" y2="465" stroke="#6B4630" strokeWidth="1" strokeDasharray="12 4" />

          {/* Drafting Acrylic Triangle (Ruler) */}
          <polygon
            points="140,540 280,540 140,400"
            fill="#3A2619"
            fillOpacity="0.45"
            stroke="#6B4630"
            strokeWidth="1.5"
          />
          <polygon
            points="160,525 240,525 160,445"
            fill="#1C1310"
            stroke="#6B4630"
            strokeWidth="1"
          />
        </g>

        {/* =========================================================================
            LAYER 4: Ceramic Cup, Saucer & Open Field Notebook (Speed 0.50)
            ========================================================================= */}
        <g id="layer-4" ref={layer4Ref}>
          {/* Open Telemetry Field Notebook on the left */}
          <g transform="translate(240, 360) rotate(-4)">
            {/* Book Base Cover */}
            <rect x="0" y="0" width="220" height="150" rx="4" fill="#3A2619" stroke="#6B4630" strokeWidth="1.5" />
            {/* Left Page */}
            <path d="M 6 6 L 106 6 L 106 144 L 6 144 Z" fill="url(#notebookGrad)" />
            {/* Right Page */}
            <path d="M 114 6 L 214 6 L 214 144 L 114 144 Z" fill="url(#notebookGrad)" />
            {/* Spine Shadow */}
            <line x1="110" y1="4" x2="110" y2="146" stroke="#6B4630" strokeWidth="2" />
            {/* Ruled Telemetry Lines */}
            <line x1="16" y1="28" x2="96" y2="28" stroke="#D2AE82" strokeWidth="1" />
            <line x1="16" y1="46" x2="96" y2="46" stroke="#D2AE82" strokeWidth="1" />
            <line x1="16" y1="64" x2="96" y2="64" stroke="#D2AE82" strokeWidth="1" />
            <line x1="16" y1="82" x2="96" y2="82" stroke="#D2AE82" strokeWidth="1" />
            <line x1="16" y1="100" x2="96" y2="100" stroke="#D2AE82" strokeWidth="1" />
            <line x1="16" y1="118" x2="70" y2="118" stroke="#D2AE82" strokeWidth="1" />
            
            {/* Right Page: Hand-Drawn Acoustic Waveform in Caramel */}
            <path
              d="M 124 75 Q 135 45, 145 75 T 165 75 T 185 45 T 205 75"
              fill="none"
              stroke="#B8772F"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <text x="124" y="32" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.1em">
              SESSION LOG // 09:15
            </text>
          </g>

          {/* Central Ceramic Cup & Saucer */}
          <g transform="translate(560, 370)">
            {/* Saucer Outer Rim */}
            <ellipse cx="60" cy="110" rx="95" ry="38" fill="#3A2619" stroke="#6B4630" strokeWidth="1.5" />
            <ellipse cx="60" cy="107" rx="85" ry="32" fill="#EBDCC2" stroke="#D2AE82" strokeWidth="1.5" />
            <ellipse cx="60" cy="107" rx="55" ry="20" fill="#D2AE82" opacity="0.6" />

            {/* Cup Body */}
            <path
              d="M 10 50 C 10 100, 30 115, 60 115 C 90 115, 110 100, 110 50 Z"
              fill="url(#cupGrad)"
              stroke="#6B4630"
              strokeWidth="1.5"
            />
            {/* Cup Handle */}
            <path
              d="M 105 60 C 130 60, 135 95, 98 100"
              fill="none"
              stroke="#EBDCC2"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 105 60 C 130 60, 135 95, 98 100"
              fill="none"
              stroke="#6B4630"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Cup Rim & Hot Crema/Espresso Liquid */}
            <ellipse cx="60" cy="50" rx="50" ry="20" fill="#EBDCC2" stroke="#6B4630" strokeWidth="1.5" />
            <ellipse cx="60" cy="52" rx="44" ry="16" fill="url(#coffeeGrad)" />
            {/* Crema swirl */}
            <path
              d="M 45 52 Q 60 48, 75 52 Q 65 56, 45 52 Z"
              fill="#D2AE82"
              opacity="0.7"
            />
          </g>
        </g>

        {/* =========================================================================
            LAYER 5: Optical Lens, Vintage Mic Silhouette & Rising Steam (Speed 0.80)
            ========================================================================= */}
        <g id="layer-5" ref={layer5Ref}>
          {/* Vintage Studio Condenser Mic Silhouette (Audio Signal Processing) */}
          <g transform="translate(740, 290)">
            {/* Stand Base */}
            <ellipse cx="40" cy="180" rx="36" ry="14" fill="#3A2619" stroke="#6B4630" strokeWidth="1.5" />
            <line x1="40" y1="180" x2="40" y2="90" stroke="#D2AE82" strokeWidth="4" />
            <line x1="40" y1="180" x2="40" y2="90" stroke="#6B4630" strokeWidth="1" />
            {/* Capsule Grille */}
            <rect x="22" y="30" width="36" height="60" rx="18" fill="#1C1310" stroke="#B8772F" strokeWidth="1.8" />
            <line x1="22" y1="60" x2="58" y2="60" stroke="#B8772F" strokeWidth="1.5" />
            {/* Mesh crosshatch */}
            <line x1="28" y1="38" x2="52" y2="52" stroke="#6B4630" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="52" y1="38" x2="28" y2="52" stroke="#6B4630" strokeWidth="1" strokeDasharray="2 2" />
            {/* Audio Wave Emitting Rings */}
            <path d="M 68 45 A 25 25 0 0 1 68 75" fill="none" stroke="#B8772F" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M 76 38 A 38 38 0 0 1 76 82" fill="none" stroke="#D2AE82" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Brass Optical Lens & Focal Target (Computer Vision) */}
          <g transform="translate(180, 240)">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#B8772F" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="38" fill="#3A2619" fillOpacity="0.3" stroke="#D2AE82" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="50" y1="2" x2="50" y2="24" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="50" y1="76" x2="50" y2="98" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="2" y1="50" x2="24" y2="50" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="76" y1="50" x2="98" y2="50" stroke="#B8772F" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="2.5" fill="#EBDCC2" />
          </g>

          {/* Rising Tactile Steam Wisps from the Coffee Cup */}
          <g transform="translate(620, 360)">
            <path
              className="steam-line-1"
              d="M -10 -5 C -25 -40, 5 -80, -15 -130"
              fill="none"
              stroke="#EBDCC2"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.45"
            />
            <path
              className="steam-line-2"
              d="M 5 -10 C 25 -50, -10 -95, 10 -150"
              fill="none"
              stroke="#D2AE82"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              className="steam-line-3"
              d="M 20 -8 C 5 -45, 30 -90, 15 -140"
              fill="none"
              stroke="#EBDCC2"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>
        </g>

        {/* =========================================================================
            LAYER 6: Foreground Roasted Coffee Beans & Blurred Accents (Speed 1.20)
            ========================================================================= */}
        <g id="layer-6" ref={layer6Ref}>
          {/* Scattered Roasted Coffee Beans near notebook */}
          <g transform="translate(460, 480) rotate(22)">
            <ellipse cx="14" cy="9" rx="14" ry="9" fill="#3A2619" stroke="#1C1310" strokeWidth="1.2" />
            <path d="M 4 9 Q 14 12, 24 9" stroke="#6B4630" strokeWidth="1.5" fill="none" />
          </g>

          <g transform="translate(500, 505) rotate(-35)">
            <ellipse cx="12" cy="8" rx="12" ry="8" fill="#281A12" stroke="#1C1310" strokeWidth="1.2" />
            <path d="M 3 8 Q 12 5, 21 8" stroke="#6B4630" strokeWidth="1.5" fill="none" />
          </g>

          {/* Foreground Soft Blurred Roasted Bean (Left corner depth) */}
          <g transform="translate(60, 520) rotate(-15)" filter="url(#soft-blur)" opacity="0.75">
            <ellipse cx="28" cy="18" rx="28" ry="18" fill="#3A2619" />
            <path d="M 8 18 Q 28 24, 48 18" stroke="#1C1310" strokeWidth="3" fill="none" />
          </g>

          {/* Foreground Soft Blurred Botanical Leaf (Right corner depth) */}
          <g transform="translate(860, 480) rotate(40)" filter="url(#soft-blur)" opacity="0.6">
            <path d="M 0 0 C 40 -20, 70 10, 50 40 C 30 60, 0 30, 0 0 Z" fill="#3A2619" />
          </g>
        </g>
      </svg>
    </div>
  );
}
