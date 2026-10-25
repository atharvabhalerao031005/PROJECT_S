import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * HeroParallaxScene
 * 6-layer hand-crafted SVG studio/study desk scene with cinematic micro-parallax.
 * Includes artisanal ceramic cup, saucer with warm specular highlights and ambient drop shadows,
 * organic undulating steam wisps with sine-wave drift and opacity breathing, open field notebook,
 * brass optical lens, vintage mic silhouette, and roasted coffee beans.
 */
export default function HeroParallaxScene() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);
  const layer5Ref = useRef(null);
  const layer6Ref = useRef(null);

  useEffect(() => {
    // Micro-parallax on mouse movement for non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const svg = svgRef.current;
    const l1 = layer1Ref.current;
    const l2 = layer2Ref.current;
    const l3 = layer3Ref.current;
    const l4 = layer4Ref.current;
    const l5 = layer5Ref.current;
    const l6 = layer6Ref.current;

    // Subtle 3D perspective tilt on the SVG canvas
    const rotX = svg ? gsap.quickTo(svg, 'rotateX', { duration: 1.2, ease: 'power2.out' }) : null;
    const rotY = svg ? gsap.quickTo(svg, 'rotateY', { duration: 1.2, ease: 'power2.out' }) : null;

    // Layer 1: Background Drafting Grid (Gentle negative parallax for infinite wall depth)
    const q1X = l1 ? gsap.quickTo(l1, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
    const q1Y = l1 ? gsap.quickTo(l1, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

    // Layer 2: Botanical Branches (Deep background)
    const q2X = gsap.quickTo(l2, 'x', { duration: 0.9, ease: 'power2.out' });
    const q2Y = gsap.quickTo(l2, 'y', { duration: 0.9, ease: 'power2.out' });

    // Layer 3: Studio Desk Geometry & Ruler (Mid-back)
    const q3X = gsap.quickTo(l3, 'x', { duration: 0.8, ease: 'power2.out' });
    const q3Y = gsap.quickTo(l3, 'y', { duration: 0.8, ease: 'power2.out' });

    // Layer 4: Field Notebook & Ceramic Cup (Focal midground plane)
    const q4X = gsap.quickTo(l4, 'x', { duration: 0.7, ease: 'power2.out' });
    const q4Y = gsap.quickTo(l4, 'y', { duration: 0.7, ease: 'power2.out' });

    // Layer 5: Brass Optical Lens, Studio Mic & Steam (Near midground)
    const q5X = gsap.quickTo(l5, 'x', { duration: 0.6, ease: 'power2.out' });
    const q5Y = gsap.quickTo(l5, 'y', { duration: 0.6, ease: 'power2.out' });

    // Layer 6: Foreground Roasted Beans & Macro Bokeh (Cinematic foreground pop)
    const q6X = gsap.quickTo(l6, 'x', { duration: 0.5, ease: 'power2.out' });
    const q6Y = gsap.quickTo(l6, 'y', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // 3D tilt
      if (rotX && rotY) {
        rotX(-normY * 3.5);
        rotY(normX * 4.5);
      }

      // Micro-parallax depth tiers
      if (q1X && q1Y) {
        q1X(normX * -3);
        q1Y(normY * -2);
      }

      q2X(normX * 5);
      q2Y(normY * 4);

      q3X(normX * 10);
      q3Y(normY * 7);

      q4X(normX * 17);
      q4Y(normY * 12);

      q5X(normX * 25);
      q5Y(normY * 18);

      q6X(normX * 36);
      q6Y(normY * 26);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Organic Steam Animation with Sine-Wave Drift & Opacity Breathing
    const steamWisps = containerRef.current?.querySelectorAll('.steam-wisp');
    const steamAnimations = [];

    if (steamWisps && steamWisps.length > 0) {
      steamWisps.forEach((wisp, index) => {
        // Individualized organic drift parameters per wisp
        const driftDistance = 6 + index * 3;
        const riseDistance = 24 + index * 6;
        const duration = 3.2 + index * 0.7;
        const delay = index * 0.65;

        // Continuous vertical rise and fade
        const animY = gsap.to(wisp, {
          y: -riseDistance,
          duration: duration,
          repeat: -1,
          ease: 'sine.inOut',
          yoyo: true,
          delay: delay,
        });

        // Lateral thermal sine drift
        const animX = gsap.to(wisp, {
          x: (index % 2 === 0 ? 1 : -1) * driftDistance,
          duration: duration * 0.85,
          repeat: -1,
          ease: 'sine.inOut',
          yoyo: true,
          delay: delay * 0.5,
        });

        // Breathing opacity
        const animOp = gsap.to(wisp, {
          opacity: 0.15 + (index % 3) * 0.1,
          duration: duration * 0.9,
          repeat: -1,
          ease: 'sine.inOut',
          yoyo: true,
          delay: delay * 0.3,
        });

        steamAnimations.push(animY, animX, animOp);
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      steamAnimations.forEach((anim) => anim.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] max-w-4xl mx-auto overflow-visible select-none perspective-[1200px]"
      style={{ perspective: '1200px' }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible transition-transform duration-300 will-change-transform"
        viewBox="0 0 960 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <defs>
          {/* Depth of Field Blur */}
          <filter id="soft-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          <filter id="steamBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>

          {/* Soft Ground Contact Shadow for Saucer */}
          <radialGradient id="saucerShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#100A08" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#1C1310" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1C1310" stopOpacity="0" />
          </radialGradient>

          {/* Saucer Porcelain Rim Gradients */}
          <linearGradient id="saucerRimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF5EC" />
            <stop offset="25%" stopColor="#EBDCC2" />
            <stop offset="70%" stopColor="#D2AE82" />
            <stop offset="100%" stopColor="#9E7348" />
          </linearGradient>

          <radialGradient id="saucerWellGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#D2AE82" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#3A2619" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#241610" stopOpacity="0.95" />
          </radialGradient>

          {/* Ceramic Cup Glaze Gradient */}
          <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAF5EC" />
            <stop offset="35%" stopColor="#EBDCC2" />
            <stop offset="75%" stopColor="#D2AE82" />
            <stop offset="100%" stopColor="#8C6239" />
          </linearGradient>

          {/* Specular Glaze Highlight along Ceramic Shoulder */}
          <linearGradient id="glazeSheenGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#EBDCC2" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>

          {/* Fresh Espresso & Crema Multi-Stop Gradient */}
          <radialGradient id="cremaGrad" cx="42%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#DF9B4C" />
            <stop offset="35%" stopColor="#B8772F" />
            <stop offset="70%" stopColor="#4A2D1A" />
            <stop offset="100%" stopColor="#1C1310" />
          </radialGradient>

          {/* Notebook Paper Gradient */}
          <linearGradient id="notebookGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FBF7F0" />
            <stop offset="48%" stopColor="#EBDCC2" />
            <stop offset="52%" stopColor="#D8C3A4" />
            <stop offset="100%" stopColor="#FBF7F0" />
          </linearGradient>

          {/* Steam Wisp Vertical Dissolve Gradients */}
          <linearGradient id="steamDissolve1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FAF5EC" stopOpacity="0" />
            <stop offset="25%" stopColor="#FAF5EC" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#EBDCC2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D2AE82" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="steamDissolve2" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#EBDCC2" stopOpacity="0" />
            <stop offset="30%" stopColor="#D2AE82" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#FAF5EC" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FAF5EC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* =========================================================================
            LAYER 1: Static Architectural Studio Wall & Drafting Grid (Speed -0.05)
            ========================================================================= */}
        <g id="layer-1" ref={layer1Ref} className="opacity-40">
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
            OPTICAL RADIAL AXIS // 16-BAND
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
          {/* Solid Architectural Desk Surface */}
          <path
            d="M 40 450 L 920 450 L 920 580 L 40 580 Z"
            fill="#231713"
            stroke="#3A2619"
            strokeWidth="1.5"
          />
          <line x1="40" y1="465" x2="920" y2="465" stroke="#6B4630" strokeWidth="1" strokeDasharray="12 4" />

          {/* Drafting Acrylic Triangle (Ruler) with Calibrated Bevel */}
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
            stroke="#B8772F"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
          {/* Calibrated Tick Marks on Ruler */}
          <line x1="140" y1="420" x2="148" y2="420" stroke="#D2AE82" strokeWidth="1" opacity="0.6" />
          <line x1="140" y1="440" x2="145" y2="440" stroke="#D2AE82" strokeWidth="0.8" opacity="0.5" />
          <line x1="140" y1="460" x2="150" y2="460" stroke="#D2AE82" strokeWidth="1" opacity="0.6" />
          <line x1="140" y1="480" x2="145" y2="480" stroke="#D2AE82" strokeWidth="0.8" opacity="0.5" />
          <line x1="140" y1="500" x2="152" y2="500" stroke="#B8772F" strokeWidth="1.2" opacity="0.8" />
        </g>

        {/* =========================================================================
            LAYER 4: Ceramic Cup, Saucer & Open Field Notebook (Speed 0.50)
            ========================================================================= */}
        <g id="layer-4" ref={layer4Ref}>
          {/* Open Telemetry Field Notebook on the left */}
          <g transform="translate(240, 360) rotate(-4)">
            {/* Book Base Shadow & Cover */}
            <rect x="2" y="4" width="220" height="150" rx="4" fill="#140D0A" opacity="0.7" />
            <rect x="0" y="0" width="220" height="150" rx="4" fill="#3A2619" stroke="#6B4630" strokeWidth="1.5" />
            
            {/* Left Page with Subtle Parchment Texture */}
            <path d="M 6 6 L 106 6 L 106 144 L 6 144 Z" fill="url(#notebookGrad)" />
            {/* Right Page */}
            <path d="M 114 6 L 214 6 L 214 144 L 114 144 Z" fill="url(#notebookGrad)" />
            
            {/* Spine Centerfold Shadow */}
            <line x1="110" y1="4" x2="110" y2="146" stroke="#523522" strokeWidth="2.5" />
            <line x1="108" y1="4" x2="108" y2="146" stroke="#241610" strokeWidth="1" opacity="0.6" />
            
            {/* Ruled Telemetry Lines */}
            <line x1="16" y1="28" x2="96" y2="28" stroke="#D2AE82" strokeWidth="0.8" opacity="0.85" />
            <line x1="16" y1="46" x2="96" y2="46" stroke="#D2AE82" strokeWidth="0.8" opacity="0.85" />
            <line x1="16" y1="64" x2="96" y2="64" stroke="#D2AE82" strokeWidth="0.8" opacity="0.85" />
            <line x1="16" y1="82" x2="96" y2="82" stroke="#D2AE82" strokeWidth="0.8" opacity="0.85" />
            <line x1="16" y1="100" x2="96" y2="100" stroke="#D2AE82" strokeWidth="0.8" opacity="0.85" />
            <line x1="16" y1="118" x2="70" y2="118" stroke="#D2AE82" strokeWidth="0.8" opacity="0.85" />
            
            {/* Right Page: Hand-Drawn Acoustic Waveform in Caramel */}
            <path
              d="M 124 75 Q 135 45, 145 75 T 165 75 T 185 45 T 205 75"
              fill="none"
              stroke="#B8772F"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Harmonic Dotted Overtone Line */}
            <path
              d="M 124 82 Q 135 65, 145 82 T 165 82 T 185 65 T 205 82"
              fill="none"
              stroke="#D2AE82"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.75"
            />
            <text x="124" y="32" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.1em">
              SESSION LOG // 09:15 CET
            </text>
            <text x="124" y="125" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="7" letterSpacing="0.08em">
              f0 = 138Hz • ATTN = 84.2%
            </text>
          </g>

          {/* Central Artisanal Ceramic Cup & Saucer */}
          <g transform="translate(560, 365)">
            {/* Contact Drop Shadow on Desk */}
            <ellipse cx="60" cy="116" rx="108" ry="34" fill="url(#saucerShadowGrad)" />

            {/* Saucer Outer Rim Bevel */}
            <ellipse cx="60" cy="110" rx="98" ry="38" fill="#241610" stroke="#3A2619" strokeWidth="1" />
            
            {/* Saucer Upper Porcelain Surface */}
            <ellipse cx="60" cy="107" rx="92" ry="34" fill="url(#saucerRimGrad)" stroke="#B8772F" strokeWidth="0.8" />
            
            {/* Saucer Inner Recessed Well */}
            <ellipse cx="60" cy="109" rx="60" ry="22" fill="url(#saucerWellGrad)" />
            
            {/* Saucer Lip Specular Reflection (Light catching the top rim curve) */}
            <path
              d="M -15 102 C 10 82, 90 82, 132 102"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Cup Base Cast Shadow in Saucer Well */}
            <ellipse cx="60" cy="105" rx="36" ry="12" fill="#140D0A" opacity="0.8" />

            {/* Ceramic Cup Body */}
            <path
              d="M 12 48 C 12 100, 30 114, 60 114 C 90 114, 108 100, 108 48 Z"
              fill="url(#cupGrad)"
              stroke="#523522"
              strokeWidth="1.2"
            />

            {/* Ceramic Specular Glaze Highlight along Left Flank */}
            <path
              d="M 17 50 C 18 92, 34 108, 56 112 C 42 106, 25 90, 24 50 Z"
              fill="url(#glazeSheenGrad)"
            />

            {/* Ambient Reflection on Right Flank */}
            <path
              d="M 103 52 C 102 90, 88 105, 70 111 C 82 106, 96 90, 97 52 Z"
              fill="#D2AE82"
              opacity="0.25"
            />

            {/* Cup Handle - Outer & Inner Ceramic Geometry */}
            {/* Handle Cast Shadow */}
            <path
              d="M 105 64 C 132 64, 137 99, 99 104"
              fill="none"
              stroke="#1C1310"
              strokeWidth="8"
              opacity="0.4"
            />
            {/* Handle Body */}
            <path
              d="M 104 60 C 130 60, 135 96, 98 100"
              fill="none"
              stroke="url(#cupGrad)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            {/* Handle Specular Ridge */}
            <path
              d="M 105 58 C 127 58, 132 90, 100 97"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.65"
            />
            <path
              d="M 104 60 C 130 60, 135 96, 98 100"
              fill="none"
              stroke="#523522"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Cup Upper Ceramic Rim */}
            <ellipse cx="60" cy="48" rx="48" ry="19" fill="#FAF5EC" stroke="#6B4630" strokeWidth="1" />
            <ellipse cx="60" cy="49" rx="45" ry="17" fill="#EBDCC2" />

            {/* Hot Espresso & Rich Crema Liquid Basin */}
            <ellipse cx="60" cy="50" rx="42" ry="15" fill="url(#cremaGrad)" />
            
            {/* Artisanal Crema Swirls (Tigrato marbling) */}
            <path
              d="M 38 50 Q 55 45, 78 49 Q 68 54, 48 53 Z"
              fill="#E7C68B"
              opacity="0.75"
            />
            <path
              d="M 46 47 Q 62 43, 72 47"
              stroke="#FAF5EC"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <ellipse cx="44" cy="52" rx="3.5" ry="1.8" fill="#DF9B4C" opacity="0.8" />
            <ellipse cx="74" cy="51" rx="2.5" ry="1.2" fill="#E7C68B" opacity="0.6" />

            {/* Surface Meniscus Specular Crescent */}
            <path
              d="M 24 49 C 32 40, 72 39, 90 47"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
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

          {/* 4 Organic Rising Steam Wisps with Sine-Wave Drift & Dissolving Tips */}
          <g transform="translate(620, 360)">
            {/* Wisp 1: Delicate Left Plume */}
            <path
              className="steam-wisp steam-line-1"
              d="M -12 -5 C -28 -38, 4 -78, -18 -135 C -28 -160, -10 -185, -20 -205"
              fill="none"
              stroke="url(#steamDissolve1)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.5"
            />
            {/* Wisp 2: Central Tall Plume */}
            <path
              className="steam-wisp steam-line-2"
              d="M 4 -12 C 28 -52, -14 -98, 12 -155 C 26 -185, 2 -215, 16 -235"
              fill="none"
              stroke="url(#steamDissolve2)"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.65"
            />
            {/* Wisp 3: Right Curving Feather */}
            <path
              className="steam-wisp steam-line-3"
              d="M 18 -8 C 6 -48, 36 -94, 18 -148 C 6 -175, 24 -198, 14 -218"
              fill="none"
              stroke="url(#steamDissolve1)"
              strokeWidth="2.2"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.45"
            />
            {/* Wisp 4: Low Ethereal Thermal Swirl */}
            <path
              className="steam-wisp steam-line-4"
              d="M -2 -15 C -15 -42, -5 -70, -22 -105 C -30 -125, -18 -145, -24 -160"
              fill="none"
              stroke="url(#steamDissolve2)"
              strokeWidth="2.0"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.35"
            />
          </g>
        </g>

        {/* =========================================================================
            LAYER 6: Foreground Roasted Coffee Beans & Blurred Accents (Speed 1.20)
            ========================================================================= */}
        <g id="layer-6" ref={layer6Ref}>
          {/* Scattered Roasted Coffee Beans near notebook with Crevice Sheen */}
          <g transform="translate(460, 480) rotate(22)">
            <ellipse cx="14" cy="9" rx="14" ry="9" fill="#2D1A12" stroke="#140D0A" strokeWidth="1.2" />
            <path d="M 4 9 Q 14 13, 24 9" stroke="#6B4630" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Bean oil gloss highlight */}
            <ellipse cx="11" cy="6" rx="6" ry="2.5" fill="#B8772F" opacity="0.35" />
          </g>

          <g transform="translate(500, 505) rotate(-35)">
            <ellipse cx="12" cy="8" rx="12" ry="8" fill="#241610" stroke="#100A08" strokeWidth="1.2" />
            <path d="M 3 8 Q 12 5, 21 8" stroke="#523522" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx="9" cy="5" rx="5" ry="2" fill="#D2AE82" opacity="0.25" />
          </g>

          {/* Third bean resting near saucer */}
          <g transform="translate(680, 495) rotate(52)">
            <ellipse cx="11" cy="7.5" rx="11" ry="7.5" fill="#2D1A12" stroke="#140D0A" strokeWidth="1.1" />
            <path d="M 3 7.5 Q 11 10, 19 7.5" stroke="#6B4630" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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