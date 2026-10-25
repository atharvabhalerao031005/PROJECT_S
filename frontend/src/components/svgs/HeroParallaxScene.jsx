import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * HeroParallaxScene
 * 6-layer hand-crafted SVG architectural studio desk scene with cinematic micro-parallax.
 * 
 * Key Visual Achievements:
 * - Seamlessly bleeds into the #1C1310 espresso background (NO boxy borders or rectangular desk polygons)
 * - Radial vignette glow (radial-gradient(ellipse at center, rgba(184, 119, 47, 0.08) 0%, rgba(28, 19, 16, 0) 70%))
 * - Sprawling architectural drafting lines, botanical sprigs, and coordinate crosshairs
 * - Museum-grade ceramic coffee cup with porcelain gloss, tigrato crema marbling, and organic sine-wave steam wisps
 * - Open studio journal with soft cream pages, hand-drafted architectural elevation sketches, and a cascading gold foil bookmark
 * - Calibrated brass optical telemetry reticle with 360° graduation ticks and caramel accent marks (#B8772F)
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

    // Layer 1: Background Drafting Grid & Crosshairs (Gentle negative parallax for infinite wall depth)
    const q1X = l1 ? gsap.quickTo(l1, 'x', { duration: 1.0, ease: 'power2.out' }) : null;
    const q1Y = l1 ? gsap.quickTo(l1, 'y', { duration: 1.0, ease: 'power2.out' }) : null;

    // Layer 2: Botanical Coffee Sprigs (Deep background)
    const q2X = gsap.quickTo(l2, 'x', { duration: 0.9, ease: 'power2.out' });
    const q2Y = gsap.quickTo(l2, 'y', { duration: 0.9, ease: 'power2.out' });

    // Layer 3: Studio Ground Plane & Calibrated Triangle Ruler (Mid-back)
    const q3X = gsap.quickTo(l3, 'x', { duration: 0.8, ease: 'power2.out' });
    const q3Y = gsap.quickTo(l3, 'y', { duration: 0.8, ease: 'power2.out' });

    // Layer 4: Open Field Journal & Ceramic Coffee Cup (Focal midground plane)
    const q4X = gsap.quickTo(l4, 'x', { duration: 0.7, ease: 'power2.out' });
    const q4Y = gsap.quickTo(l4, 'y', { duration: 0.7, ease: 'power2.out' });

    // Layer 5: Brass Reticle, Vintage Studio Mic & Rising Steam (Near midground)
    const q5X = gsap.quickTo(l5, 'x', { duration: 0.6, ease: 'power2.out' });
    const q5Y = gsap.quickTo(l5, 'y', { duration: 0.6, ease: 'power2.out' });

    // Layer 6: Foreground Roasted Coffee Beans & Macro Bokeh (Cinematic foreground depth)
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
        const driftDistance = 7 + index * 3.5;
        const riseDistance = 26 + index * 7;
        const duration = 3.4 + index * 0.75;
        const delay = index * 0.55;

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
          delay: delay * 0.45,
        });

        // Breathing opacity
        const animOp = gsap.to(wisp, {
          opacity: 0.18 + (index % 3) * 0.12,
          duration: duration * 0.92,
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
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="subtleDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#0D0705" floodOpacity="0.6" />
          </filter>

          {/* Radial Vignette Glow - Feathers scene seamlessly into #1C1310 espresso background */}
          <radialGradient id="sceneRadialGlow" cx="54%" cy="60%" r="65%">
            <stop offset="0%" stopColor="#B8772F" stopOpacity="0.08" />
            <stop offset="35%" stopColor="#8C6239" stopOpacity="0.035" />
            <stop offset="70%" stopColor="#1C1310" stopOpacity="0" />
          </radialGradient>

          {/* Organic Feathered Ground Warmth (Replaces hard rectangular desk polygon) */}
          <radialGradient id="groundFadeGrad" cx="52%" cy="65%" rx="62%" ry="32%">
            <stop offset="0%" stopColor="#2A1C16" stopOpacity="0.7" />
            <stop offset="42%" stopColor="#221612" stopOpacity="0.38" />
            <stop offset="75%" stopColor="#1C1310" stopOpacity="0" />
          </radialGradient>

          {/* Feathered Horizontal Drafting Line Gradient (No harsh borders) */}
          <linearGradient id="draftingLineH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8772F" stopOpacity="0" />
            <stop offset="12%" stopColor="#6B4630" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#D2AE82" stopOpacity="0.55" />
            <stop offset="88%" stopColor="#6B4630" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#B8772F" stopOpacity="0" />
          </linearGradient>

          {/* Feathered Vertical Drafting Line Gradient */}
          <linearGradient id="draftingLineV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B8772F" stopOpacity="0" />
            <stop offset="15%" stopColor="#6B4630" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#D2AE82" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#6B4630" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B8772F" stopOpacity="0" />
          </linearGradient>

          {/* Soft Ground Contact Shadow for Saucer */}
          <radialGradient id="saucerShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B0604" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#140D0A" stopOpacity="0.65" />
            <stop offset="78%" stopColor="#1C1310" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1C1310" stopOpacity="0" />
          </radialGradient>

          {/* Saucer Porcelain Rim Gradients */}
          <linearGradient id="saucerRimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="22%" stopColor="#FAF5EC" />
            <stop offset="48%" stopColor="#EBDCC2" />
            <stop offset="78%" stopColor="#D2AE82" />
            <stop offset="100%" stopColor="#8C6239" />
          </linearGradient>

          <radialGradient id="saucerWellGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#D2AE82" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#3A2619" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22150E" stopOpacity="0.98" />
          </radialGradient>

          {/* Ceramic Cup Glaze Gradient */}
          <linearGradient id="cupBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="24%" stopColor="#FAF5EC" />
            <stop offset="56%" stopColor="#EBDCC2" />
            <stop offset="82%" stopColor="#D2AE82" />
            <stop offset="100%" stopColor="#7A522E" />
          </linearGradient>

          {/* Specular Glaze Highlight along Ceramic Shoulder */}
          <linearGradient id="glazeSheenGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="28%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="75%" stopColor="#FAF5EC" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Fresh Espresso & Crema Multi-Stop Gradient */}
          <radialGradient id="cremaGrad" cx="44%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#E5A65D" />
            <stop offset="22%" stopColor="#C88438" />
            <stop offset="48%" stopColor="#925725" />
            <stop offset="78%" stopColor="#4A2916" />
            <stop offset="98%" stopColor="#1F120D" />
          </radialGradient>

          {/* Crema Swirl Hazelnut Marbling Gradient */}
          <linearGradient id="cremaSwirlGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4DE" />
            <stop offset="35%" stopColor="#EAC377" />
            <stop offset="70%" stopColor="#DF9B4C" />
            <stop offset="100%" stopColor="#925725" />
          </linearGradient>

          {/* Studio Journal Parchment Gradients */}
          <linearGradient id="journalPaperGradLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FAF7F2" />
            <stop offset="75%" stopColor="#F5ECE1" />
            <stop offset="100%" stopColor="#DFCCB5" />
          </linearGradient>

          <linearGradient id="journalPaperGradRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D8C3A8" />
            <stop offset="25%" stopColor="#F5ECE1" />
            <stop offset="100%" stopColor="#FAF7F2" />
          </linearGradient>

          {/* Gold Foil Bookmark Multi-Stop Metallic Gradient */}
          <linearGradient id="goldFoilBookmark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4D4" />
            <stop offset="18%" stopColor="#EAC377" />
            <stop offset="38%" stopColor="#DF9B4C" />
            <stop offset="60%" stopColor="#B8772F" />
            <stop offset="82%" stopColor="#F5D899" />
            <stop offset="100%" stopColor="#8C581E" />
          </linearGradient>

          {/* Calibrated Brass Optical Lens Bezel Gradient */}
          <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5E2B8" />
            <stop offset="25%" stopColor="#DF9B4C" />
            <stop offset="50%" stopColor="#B8772F" />
            <stop offset="75%" stopColor="#8C5A20" />
            <stop offset="100%" stopColor="#E8C782" />
          </linearGradient>

          {/* Steam Wisp Vertical Dissolve Gradients */}
          <linearGradient id="steamDissolve1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FAF5EC" stopOpacity="0" />
            <stop offset="22%" stopColor="#FAF5EC" stopOpacity="0.75" />
            <stop offset="68%" stopColor="#EBDCC2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D2AE82" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="steamDissolve2" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#EBDCC2" stopOpacity="0" />
            <stop offset="28%" stopColor="#DF9B4C" stopOpacity="0.7" />
            <stop offset="72%" stopColor="#FAF5EC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FAF5EC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Radial Vignette Glow - Feathers the whole scene into #1C1310 */}
        <rect
          x="-80"
          y="-60"
          width="1120"
          height="720"
          fill="url(#sceneRadialGlow)"
          pointerEvents="none"
        />

        {/* =========================================================================
            LAYER 1: Sprawling Architectural Drafting Grid & Coordinate Crosshairs (Speed -0.05)
            ========================================================================= */}
        <g id="layer-1" ref={layer1Ref} className="opacity-45">
          {/* Sprawling Horizontal Drafting Guidelines (Bleeds outward past frame) */}
          <line x1="-60" y1="90" x2="1020" y2="90" stroke="url(#draftingLineH)" strokeWidth="0.8" strokeDasharray="4 6" />
          <line x1="-60" y1="210" x2="1020" y2="210" stroke="url(#draftingLineH)" strokeWidth="0.8" strokeDasharray="3 5" />
          <line x1="-60" y1="330" x2="1020" y2="330" stroke="url(#draftingLineH)" strokeWidth="0.8" strokeDasharray="6 8" />
          <line x1="-60" y1="450" x2="1020" y2="450" stroke="url(#draftingLineH)" strokeWidth="1" strokeDasharray="12 4" />
          <line x1="-60" y1="530" x2="1020" y2="530" stroke="url(#draftingLineH)" strokeWidth="0.8" strokeDasharray="3 5" />

          {/* Sprawling Vertical Drafting Guidelines */}
          <line x1="80" y1="-30" x2="80" y2="630" stroke="url(#draftingLineV)" strokeWidth="0.8" strokeDasharray="4 6" />
          <line x1="220" y1="-30" x2="220" y2="630" stroke="url(#draftingLineV)" strokeWidth="0.8" strokeDasharray="3 5" />
          <line x1="440" y1="-30" x2="440" y2="630" stroke="url(#draftingLineV)" strokeWidth="0.8" strokeDasharray="6 8" />
          <line x1="680" y1="-30" x2="680" y2="630" stroke="url(#draftingLineV)" strokeWidth="0.8" strokeDasharray="4 6" />
          <line x1="880" y1="-30" x2="880" y2="630" stroke="url(#draftingLineV)" strokeWidth="0.8" strokeDasharray="3 5" />

          {/* Fine Coordinate Crosshairs (+) at Drafting Intersections */}
          <g stroke="#B8772F" strokeWidth="1.2" opacity="0.75">
            {/* Crosshair 1 */}
            <path d="M 75 90 L 85 90 M 80 85 L 80 95" />
            {/* Crosshair 2 */}
            <path d="M 215 210 L 225 210 M 220 205 L 220 215" />
            {/* Crosshair 3 */}
            <path d="M 435 90 L 445 90 M 440 85 L 440 95" />
            {/* Crosshair 4 */}
            <path d="M 675 210 L 685 210 M 680 205 L 680 215" />
            {/* Crosshair 5 */}
            <path d="M 875 330 L 885 330 M 880 325 L 880 335" />
            {/* Crosshair 6 */}
            <path d="M 215 450 L 225 450 M 220 445 L 220 455" />
            {/* Crosshair 7 */}
            <path d="M 675 450 L 685 450 M 680 445 L 680 455" />
          </g>

          {/* Compass Drafting Arcs Linking Focal Points */}
          <circle cx="220" cy="240" r="130" fill="none" stroke="#B8772F" strokeWidth="0.8" strokeDasharray="2 6" opacity="0.35" />
          <circle cx="620" cy="390" r="170" fill="none" stroke="#D2AE82" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.25" />

          {/* Micro Telemetry Notations in JetBrains Mono */}
          <text x="88" y="85" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em">
            SEC.01 // DATUM 0.00
          </text>
          <text x="448" y="85" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em">
            LAT 43.71° N // CHRONO 09:15
          </text>
          <text x="688" y="205" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em">
            OPTICAL AXIS // 16-BAND PCM
          </text>
          <text x="888" y="325" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="8.5" letterSpacing="0.14em">
            FOCAL PLANE Z-80
          </text>
        </g>

        {/* =========================================================================
            LAYER 2: Botanical Coffee Sprigs & Specimen Silhouettes (Speed 0.15)
            ========================================================================= */}
        <g id="layer-2" ref={layer2Ref} className="opacity-35">
          {/* Left Botanical Branch - Arcs gracefully outward toward typography */}
          <path
            d="M 30 550 C 90 470, 140 370, 115 230 C 100 160, 60 100, 20 60"
            stroke="#6B4630"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Leaves with delicate spine veining */}
          <g fill="#4A3022">
            {/* Leaf 1 */}
            <path d="M 112 330 C 152 308, 185 325, 168 355 C 145 375, 122 355, 112 330 Z" />
            <path d="M 112 330 Q 140 340, 168 355" stroke="#2D1D15" strokeWidth="0.8" fill="none" />
            {/* Leaf 2 */}
            <path d="M 118 245 C 160 225, 198 248, 178 278 C 152 298, 130 272, 118 245 Z" />
            <path d="M 118 245 Q 150 258, 178 278" stroke="#2D1D15" strokeWidth="0.8" fill="none" />
            {/* Leaf 3 */}
            <path d="M 92 165 C 125 132, 162 152, 142 182 C 120 200, 98 180, 92 165 Z" />
            {/* Leaf 4 */}
            <path d="M 58 102 C 86 78, 118 95, 102 120 C 85 135, 68 118, 58 102 Z" />
          </g>

          {/* Coffee Cherries / Nodes on Stem in Caramel */}
          <circle cx="114" cy="330" r="4.5" fill="#B8772F" />
          <circle cx="112" cy="328" r="1.5" fill="#FAF5EC" opacity="0.6" />
          <circle cx="120" cy="336" r="3.8" fill="#8C581E" />

          <circle cx="118" cy="245" r="4.2" fill="#B8772F" />
          <circle cx="116" cy="243" r="1.4" fill="#FAF5EC" opacity="0.6" />

          {/* Right Botanical Branch - Reaching toward upper right */}
          <path
            d="M 940 550 C 880 460, 840 340, 865 210 C 880 145, 915 90, 950 50"
            stroke="#6B4630"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <g fill="#4A3022">
            <path d="M 855 340 C 812 322, 780 340, 802 372 C 825 388, 850 368, 855 340 Z" />
            <path d="M 860 235 C 812 218, 784 240, 808 272 C 830 288, 856 262, 860 235 Z" />
            <path d="M 885 150 C 848 132, 825 152, 844 180 C 864 195, 882 172, 885 150 Z" />
          </g>
          <circle cx="854" cy="342" r="4.2" fill="#B8772F" />
          <circle cx="859" cy="237" r="3.8" fill="#8C581E" />
        </g>

        {/* =========================================================================
            LAYER 3: Studio Ground Plane & Calibrated Drafting Instruments (Speed 0.30)
            (NO harsh rectangular desk box; soft feathered ground warmth & hairlines)
            ========================================================================= */}
        <g id="layer-3" ref={layer3Ref}>
          {/* Organic Feathered Ground Warmth seamlessly blending into #1C1310 */}
          <ellipse cx="500" cy="515" rx="480" ry="75" fill="url(#groundFadeGrad)" />

          {/* Studio Surface Datum Lines (Fading gracefully to both left and right edges) */}
          <line x1="-40" y1="465" x2="1000" y2="465" stroke="url(#draftingLineH)" strokeWidth="1" strokeDasharray="14 6" />
          <line x1="-40" y1="485" x2="1000" y2="485" stroke="url(#draftingLineH)" strokeWidth="0.7" opacity="0.6" />

          {/* Calibrated Studio Drafting Triangle (Ruler) with Engraved Millimeter Ticks */}
          <g transform="translate(130, 385)">
            {/* Ambient drop shadow */}
            <polygon points="5,160 165,160 5,0" fill="#0C0806" opacity="0.6" />
            {/* Acrylic body */}
            <polygon
              points="0,155 160,155 0,0"
              fill="#2E1D16"
              fillOpacity="0.45"
              stroke="#6B4630"
              strokeWidth="1.2"
            />
            {/* Inner beveled aperture cutout with caramel border */}
            <polygon
              points="24,136 116,136 24,44"
              fill="#1C1310"
              stroke="#B8772F"
              strokeOpacity="0.75"
              strokeWidth="1"
            />
            {/* Calibrated Millimeter & Centimeter Tick Marks */}
            <g stroke="#D2AE82" strokeWidth="0.8" opacity="0.7">
              <line x1="0" y1="20" x2="10" y2="20" stroke="#B8772F" strokeWidth="1.2" />
              <line x1="0" y1="35" x2="6" y2="35" />
              <line x1="0" y1="50" x2="8" y2="50" />
              <line x1="0" y1="65" x2="6" y2="65" />
              <line x1="0" y1="80" x2="10" y2="80" stroke="#B8772F" strokeWidth="1.2" />
              <line x1="0" y1="95" x2="6" y2="95" />
              <line x1="0" y1="110" x2="8" y2="110" />
              <line x1="0" y1="125" x2="6" y2="125" />
              <line x1="0" y1="140" x2="12" y2="140" stroke="#B8772F" strokeWidth="1.4" />
            </g>
            {/* Ruler Numeric Labels */}
            <text x="13" y="82" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="6.5">2</text>
            <text x="15" y="142" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="600">4</text>
            {/* Brass Corner Reinforcement Eyelet */}
            <circle cx="8" cy="147" r="3.5" fill="#DF9B4C" stroke="#8C581E" strokeWidth="0.8" />
            <circle cx="8" cy="147" r="1.5" fill="#1C1310" />
          </g>
        </g>

        {/* =========================================================================
            LAYER 4: Ceramic Cup, Saucer & Open Studio Journal (Speed 0.50)
            ========================================================================= */}
        <g id="layer-4" ref={layer4Ref}>
          {/* -----------------------------------------------------------------------
              OPEN STUDIO JOURNAL (FIELD NOTEBOOK)
              Featuring hand-drafted architectural elevation sketches and gold foil bookmark
              ----------------------------------------------------------------------- */}
          <g transform="translate(230, 355) rotate(-3.5)">
            {/* Book Base Drop Shadow onto desk */}
            <rect x="4" y="6" width="224" height="152" rx="5" fill="#0C0705" opacity="0.8" />
            {/* Hardcover buckram spine backing */}
            <rect x="0" y="0" width="224" height="152" rx="4" fill="#281A14" stroke="#4A3022" strokeWidth="1.4" />

            {/* Left Page (Soft Cream Parchment with curvature) */}
            <path
              d="M 6 6 Q 56 4, 108 7 L 108 147 Q 56 144, 6 146 Z"
              fill="url(#journalPaperGradLeft)"
            />
            {/* Right Page (Soft Cream Parchment) */}
            <path
              d="M 116 7 Q 168 4, 218 6 L 218 146 Q 168 144, 116 147 Z"
              fill="url(#journalPaperGradRight)"
            />

            {/* Spine Centerfold Gutter Shadow & Thread Stitches */}
            <line x1="112" y1="4" x2="112" y2="149" stroke="#4A2E1D" strokeWidth="3" opacity="0.8" />
            <line x1="110" y1="4" x2="110" y2="149" stroke="#1C120C" strokeWidth="1" opacity="0.6" />
            {/* Binding Thread Dashes */}
            <line x1="112" y1="16" x2="112" y2="28" stroke="#D2AE82" strokeWidth="0.8" opacity="0.7" />
            <line x1="112" y1="44" x2="112" y2="56" stroke="#D2AE82" strokeWidth="0.8" opacity="0.7" />
            <line x1="112" y1="72" x2="112" y2="84" stroke="#D2AE82" strokeWidth="0.8" opacity="0.7" />
            <line x1="112" y1="100" x2="112" y2="112" stroke="#D2AE82" strokeWidth="0.8" opacity="0.7" />
            <line x1="112" y1="128" x2="112" y2="140" stroke="#D2AE82" strokeWidth="0.8" opacity="0.7" />

            {/* --- LEFT PAGE: ARCHITECTURAL ELEVATION SKETCHES --- */}
            {/* Header / Drawing Title */}
            <text x="16" y="22" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="6.5" letterSpacing="0.1em" fontWeight="600">
              ELEVATION // WEST FAÇADE
            </text>
            <text x="16" y="30" fill="#A67B52" fontFamily="JetBrains Mono" fontSize="5" letterSpacing="0.08em">
              STUDIO ATELIER § SCALE 1:50
            </text>

            {/* Hand-Drafted Classical/Modernist Studio Elevation */}
            {/* Triangular Pediment / Eaves */}
            <path
              d="M 22 58 L 56 40 L 90 58 Z"
              stroke="#8C6239"
              strokeWidth="0.9"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M 26 57 L 56 42 L 86 57"
              stroke="#B8772F"
              strokeWidth="0.6"
              fill="none"
            />
            {/* Pediment Central Oculus / Clock Window */}
            <circle cx="56" cy="50" r="4.2" stroke="#B8772F" strokeWidth="0.7" fill="none" />
            <circle cx="56" cy="50" r="1.5" fill="#8C6239" />

            {/* Entablature & Frieze Bands */}
            <line x1="20" y1="58" x2="92" y2="58" stroke="#8C6239" strokeWidth="1" />
            <line x1="20" y1="62" x2="92" y2="62" stroke="#B8772F" strokeWidth="0.7" />

            {/* Slender Atelier Columns / Vertical Mullions */}
            {/* Column 1 */}
            <line x1="24" y1="62" x2="24" y2="118" stroke="#8C6239" strokeWidth="0.8" />
            <line x1="26" y1="62" x2="26" y2="118" stroke="#A67B52" strokeWidth="0.5" />
            {/* Column 2 */}
            <line x1="42" y1="62" x2="42" y2="118" stroke="#8C6239" strokeWidth="0.8" />
            <line x1="44" y1="62" x2="44" y2="118" stroke="#A67B52" strokeWidth="0.5" />
            {/* Column 3 */}
            <line x1="68" y1="62" x2="68" y2="118" stroke="#8C6239" strokeWidth="0.8" />
            <line x1="70" y1="62" x2="70" y2="118" stroke="#A67B52" strokeWidth="0.5" />
            {/* Column 4 */}
            <line x1="86" y1="62" x2="86" y2="118" stroke="#8C6239" strokeWidth="0.8" />
            <line x1="88" y1="62" x2="88" y2="118" stroke="#A67B52" strokeWidth="0.5" />

            {/* Center Arched Atelier Entrance Portal */}
            <path
              d="M 48 84 A 8 8 0 0 1 64 84 L 64 118 L 48 118 Z"
              stroke="#B8772F"
              strokeWidth="0.8"
              fill="none"
            />
            {/* French door center division & horizontal transom */}
            <line x1="56" y1="84" x2="56" y2="118" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="48" y1="96" x2="64" y2="96" stroke="#8C6239" strokeWidth="0.5" />
            <line x1="48" y1="106" x2="64" y2="106" stroke="#8C6239" strokeWidth="0.5" />

            {/* Multipane Studio Windows on Left and Right Flanks */}
            <rect x="29" y="74" width="10" height="32" stroke="#A67B52" strokeWidth="0.6" fill="none" />
            <line x1="29" y1="84" x2="39" y2="84" stroke="#A67B52" strokeWidth="0.5" />
            <line x1="29" y1="94" x2="39" y2="94" stroke="#A67B52" strokeWidth="0.5" />
            <line x1="29" y1="104" x2="39" y2="104" stroke="#A67B52" strokeWidth="0.5" />

            <rect x="73" y="74" width="10" height="32" stroke="#A67B52" strokeWidth="0.6" fill="none" />
            <line x1="73" y1="84" x2="83" y2="84" stroke="#A67B52" strokeWidth="0.5" />
            <line x1="73" y1="94" x2="83" y2="94" stroke="#A67B52" strokeWidth="0.5" />
            <line x1="73" y1="104" x2="83" y2="104" stroke="#A67B52" strokeWidth="0.5" />

            {/* Ground Datum Line with Foundation Hatching */}
            <line x1="16" y1="118" x2="96" y2="118" stroke="#6B4630" strokeWidth="1.2" />
            <line x1="18" y1="118" x2="15" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="24" y1="118" x2="21" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="30" y1="118" x2="27" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="36" y1="118" x2="33" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="76" y1="118" x2="73" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="82" y1="118" x2="79" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="88" y1="118" x2="85" y2="122" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="94" y1="118" x2="91" y2="122" stroke="#8C6239" strokeWidth="0.6" />

            {/* Architectural Dimension Line */}
            <line x1="22" y1="128" x2="90" y2="128" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="22" y1="125" x2="22" y2="131" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="56" y1="125" x2="56" y2="131" stroke="#8C6239" strokeWidth="0.6" />
            <line x1="90" y1="125" x2="90" y2="131" stroke="#8C6239" strokeWidth="0.6" />
            <text x="51" y="136" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="5.5">5.40m</text>
            <text x="92" y="42" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="4.5">▽ +4.20m</text>

            {/* --- RIGHT PAGE: ACOUSTIC TELEMETRY & SECTION --- */}
            <text x="126" y="22" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7" letterSpacing="0.1em" fontWeight="600">
              SESSION LOG // 09:15 CET
            </text>
            <text x="126" y="30" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="5" letterSpacing="0.08em">
              ATTENTION TELEMETRY § FOLIO 04
            </text>

            {/* Ruled Telemetry Lines */}
            <line x1="126" y1="38" x2="208" y2="38" stroke="#D2AE82" strokeWidth="0.6" opacity="0.6" />
            <line x1="126" y1="50" x2="208" y2="50" stroke="#D2AE82" strokeWidth="0.6" opacity="0.6" />
            <line x1="126" y1="84" x2="208" y2="84" stroke="#D2AE82" strokeWidth="0.6" opacity="0.6" />
            <line x1="126" y1="96" x2="208" y2="96" stroke="#D2AE82" strokeWidth="0.6" opacity="0.6" />
            <line x1="126" y1="108" x2="208" y2="108" stroke="#D2AE82" strokeWidth="0.6" opacity="0.6" />

            {/* Acoustic Telemetry Waveform in Rich Caramel */}
            <path
              d="M 126 67 Q 138 42, 148 67 T 170 67 T 190 42 T 208 67"
              fill="none"
              stroke="#B8772F"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Harmonic Overtone Dotted Line */}
            <path
              d="M 126 74 Q 138 58, 148 74 T 170 74 T 190 58 T 208 74"
              fill="none"
              stroke="#D2AE82"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.8"
            />
            <text x="126" y="122" fill="#8C6239" fontFamily="JetBrains Mono" fontSize="6.5">
              f₀ = 138.4 Hz • Q = 4.12
            </text>
            <text x="126" y="132" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="6" fontWeight="600">
              ATTN = 88.4% • LIBROSA PCM
            </text>

            {/* --- GOLD FOIL SILK BOOKMARK RIBBON --- */}
            {/* Soft Cast Drop Shadow of Ribbon on Paper */}
            <path
              d="M 112 0 C 118 28, 146 50, 150 84 C 154 118, 132 142, 138 172 L 144 165 L 150 170 C 144 140, 166 118, 162 84 C 158 50, 130 28, 124 0 Z"
              fill="#2E1B13"
              opacity="0.38"
            />
            {/* Metallic Gold Ribbon Body cascading across the right page */}
            <path
              d="M 108 0 C 114 28, 142 50, 146 84 C 150 118, 128 142, 134 172 L 140 165 L 146 170 C 140 140, 162 118, 158 84 C 154 50, 126 28, 120 0 Z"
              fill="url(#goldFoilBookmark)"
              stroke="#8C581E"
              strokeWidth="0.6"
            />
            {/* Gold Metallic Specular Crest Highlight Line */}
            <path
              d="M 114 0 C 120 28, 148 50, 152 84 C 156 118, 134 142, 140 171"
              stroke="#FFF8E7"
              strokeWidth="0.9"
              fill="none"
              opacity="0.85"
            />
            {/* Embossed Gold Foil Seal on Page Corner */}
            <circle cx="204" cy="20" r="6.5" fill="#DF9B4C" stroke="#8C581E" strokeWidth="0.8" />
            <circle cx="204" cy="20" r="4.5" fill="none" stroke="#FFF5D8" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
            <circle cx="204" cy="20" r="1.8" fill="#FFF5D8" />
          </g>

          {/* -----------------------------------------------------------------------
              ARTISANAL CERAMIC COFFEE CUP & SAUCER
              Museum-grade warm porcelain gloss, tigrato crema marbling, and soft shadows
              ----------------------------------------------------------------------- */}
          <g transform="translate(560, 360)">
            {/* Multi-tier Soft Ground Contact Shadow on Desk */}
            <ellipse cx="65" cy="120" rx="116" ry="38" fill="url(#saucerShadowGrad)" />
            <ellipse cx="65" cy="116" rx="84" ry="24" fill="#0E0805" opacity="0.6" />

            {/* Saucer Outer Rim Bevel */}
            <ellipse cx="65" cy="112" rx="104" ry="40" fill="#241610" stroke="#3A2619" strokeWidth="1.2" />

            {/* Saucer Upper Porcelain Surface (Warm Glaze) */}
            <ellipse cx="65" cy="109" rx="98" ry="36" fill="url(#saucerRimGrad)" stroke="#B8772F" strokeWidth="0.9" />

            {/* Saucer Inner Recessed Well */}
            <ellipse cx="65" cy="111" rx="64" ry="24" fill="url(#saucerWellGrad)" />

            {/* Saucer Lip Specular Reflection catching warm studio light */}
            <path
              d="M -10 104 C 16 82, 108 82, 144 104"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M 10 101 C 30 86, 95 86, 122 101"
              stroke="#FFF8E7"
              strokeWidth="0.9"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />

            {/* Cup Base Cast Shadow in Saucer Well */}
            <ellipse cx="65" cy="107" rx="38" ry="13" fill="#120A07" opacity="0.88" />

            {/* Ceramic Cup Body */}
            <path
              d="M 15 48 C 15 102, 33 116, 65 116 C 97 116, 115 102, 115 48 Z"
              fill="url(#cupBodyGrad)"
              stroke="#523522"
              strokeWidth="1.3"
            />

            {/* Specular Glaze Highlight along Left Flank (Studio window reflection) */}
            <path
              d="M 21 50 C 22 94, 38 110, 61 114 C 47 108, 29 92, 28 50 Z"
              fill="url(#glazeSheenGrad)"
            />

            {/* Ambient Warm Bounce Light on Right Flank */}
            <path
              d="M 109 52 C 108 92, 94 107, 75 113 C 87 108, 102 92, 103 52 Z"
              fill="#D2AE82"
              opacity="0.28"
            />

            {/* Ceramic Cup Handle - 3D Tubular Geometry */}
            {/* Handle Cast Shadow on Cup */}
            <path
              d="M 112 64 C 141 64, 146 101, 106 106"
              fill="none"
              stroke="#1C1310"
              strokeWidth="8"
              opacity="0.45"
            />
            {/* Handle Body */}
            <path
              d="M 111 60 C 139 60, 144 98, 105 102"
              fill="none"
              stroke="url(#cupBodyGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Handle Specular Top Ridge */}
            <path
              d="M 112 58 C 136 58, 141 92, 107 99"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Handle Inner Silhouette Stroke */}
            <path
              d="M 111 60 C 139 60, 144 98, 105 102"
              fill="none"
              stroke="#523522"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Cup Upper Ceramic Rim (Showing wall thickness) */}
            <ellipse cx="65" cy="48" rx="51" ry="20" fill="#FAF5EC" stroke="#6B4630" strokeWidth="1" />
            <ellipse cx="65" cy="49" rx="48" ry="18" fill="#EBDCC2" />

            {/* Hot Espresso & Velvety Crema Liquid Basin */}
            <ellipse cx="65" cy="50" rx="45" ry="16" fill="url(#cremaGrad)" />

            {/* Tigrato Crema Marbling & Artisanal Latte-Art Swirls */}
            {/* Primary Sinuous Golden Crema Swirl */}
            <path
              d="M 36 50 C 42 41, 62 40, 76 46 C 88 51, 84 58, 68 58 C 52 58, 48 49, 58 46 C 66 44, 72 48, 68 52"
              fill="none"
              stroke="url(#cremaSwirlGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Delicate Ivory Micro-Froth Streaks */}
            <path
              d="M 42 47 C 54 42, 68 43, 80 47"
              stroke="#FAF5EC"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M 50 53 C 60 55, 72 54, 78 49"
              stroke="#FFFDF9"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M 58 46 C 64 45, 70 48, 67 51"
              stroke="#FAF5EC"
              strokeWidth="0.9"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Micro-Crema Froth Bubbles & Golden Flecks */}
            <ellipse cx="44" cy="52" rx="4" ry="2" fill="#DF9B4C" opacity="0.85" />
            <ellipse cx="43.5" cy="51.5" rx="1.5" ry="0.8" fill="#FFF2D6" opacity="0.9" />
            <ellipse cx="78" cy="51" rx="3" ry="1.5" fill="#E7C68B" opacity="0.75" />
            <ellipse cx="78.5" cy="50.8" rx="1.2" ry="0.6" fill="#FFF2D6" opacity="0.8" />
            <ellipse cx="33" cy="48" rx="2" ry="1.2" fill="#B8772F" opacity="0.8" />
            <ellipse cx="62" cy="54" rx="2.5" ry="1" fill="#DF9B4C" opacity="0.7" />

            {/* Liquid Surface Meniscus Crescent Reflection */}
            <path
              d="M 26 49 C 35 39, 78 38, 98 47"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
          </g>
        </g>

        {/* =========================================================================
            LAYER 5: Brass Optical Telemetry Reticle, Vintage Studio Mic & Rising Steam (Speed 0.80)
            ========================================================================= */}
        <g id="layer-5" ref={layer5Ref}>
          {/* -----------------------------------------------------------------------
              BRASS OPTICAL TELEMETRY RETICLE (COMPUTER VISION & OPTICS)
              Fine hairline drafting circles with calibrated 360° graduation ticks & caramel accents
              ----------------------------------------------------------------------- */}
          <g transform="translate(170, 220)">
            {/* Outer Beveled Brass Bezel Ring */}
            <circle cx="55" cy="55" r="50" fill="none" stroke="url(#brassGrad)" strokeWidth="2.2" />

            {/* Inner Calibrated Drafting Concentric Rings */}
            <circle cx="55" cy="55" r="45" fill="none" stroke="#D2AE82" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
            <circle cx="55" cy="55" r="38" fill="#3A2619" fillOpacity="0.25" stroke="#6B4630" strokeWidth="0.8" />
            <circle cx="55" cy="55" r="22" fill="none" stroke="#B8772F" strokeWidth="1.2" />
            <circle cx="55" cy="55" r="8" fill="none" stroke="#DF9B4C" strokeWidth="0.9" strokeDasharray="2 2" />

            {/* 360° Calibrated Graduation Ticks around the Perimeter */}
            <g stroke="#D2AE82" strokeWidth="0.8" opacity="0.8">
              {/* 15° ticks */}
              <line x1="95.4" y1="65.8" x2="99.8" y2="67.0" />
              <line x1="91.4" y1="76.0" x2="95.0" y2="78.1" />
              <line x1="84.7" y1="84.7" x2="88.0" y2="88.0" />
              <line x1="76.0" y1="91.4" x2="78.1" y2="95.0" />
              <line x1="65.8" y1="95.4" x2="67.0" y2="99.8" />

              <line x1="44.2" y1="95.4" x2="43.0" y2="99.8" />
              <line x1="34.0" y1="91.4" x2="31.9" y2="95.0" />
              <line x1="25.3" y1="84.7" x2="22.0" y2="88.0" />
              <line x1="18.6" y1="76.0" x2="15.0" y2="78.1" />
              <line x1="14.6" y1="65.8" x2="10.2" y2="67.0" />

              <line x1="14.6" y1="44.2" x2="10.2" y2="43.0" />
              <line x1="18.6" y1="34.0" x2="15.0" y2="31.9" />
              <line x1="25.3" y1="25.3" x2="22.0" y2="22.0" />
              <line x1="34.0" y1="18.6" x2="31.9" y2="15.0" />
              <line x1="44.2" y1="14.6" x2="43.0" y2="10.2" />

              <line x1="65.8" y1="14.6" x2="67.0" y2="10.2" />
              <line x1="76.0" y1="18.6" x2="78.1" y2="15.0" />
              <line x1="84.7" y1="25.3" x2="88.0" y2="22.0" />
              <line x1="91.4" y1="34.0" x2="95.0" y2="31.9" />
              <line x1="95.4" y1="44.2" x2="99.8" y2="43.0" />
            </g>

            {/* Prominent Caramel Accent Ticks (#B8772F) at Cardinal Points */}
            <g stroke="#B8772F" strokeWidth="2.0">
              <line x1="95" y1="55" x2="102" y2="55" />
              <line x1="55" y1="95" x2="55" y2="102" />
              <line x1="15" y1="55" x2="8" y2="55" />
              <line x1="55" y1="15" x2="55" y2="8" />
            </g>

            {/* Precision Crosshair Lines with Central Aperture Gap */}
            <line x1="55" y1="2" x2="55" y2="28" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="55" y1="82" x2="55" y2="108" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="2" y1="55" x2="28" y2="55" stroke="#B8772F" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="108" y2="55" stroke="#B8772F" strokeWidth="1.5" />

            {/* Central Target Pinpoint Dot */}
            <circle cx="55" cy="55" r="2.5" fill="#FAF5EC" />

            {/* Reticle Telemetry Annotations */}
            <text x="2" y="-5" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="6.5" letterSpacing="0.1em">
              f=50mm 1:1.4 // T* RETICLE
            </text>
            <text x="105" y="58" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="5.5" fontWeight="600">
              090°
            </text>
            <text x="50" y="115" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="5.5" fontWeight="600">
              180°
            </text>
          </g>

          {/* -----------------------------------------------------------------------
              VINTAGE STUDIO CONDENSER MICROPHONE SILHOUETTE (AUDIO SIGNAL PROCESSING)
              ----------------------------------------------------------------------- */}
          <g transform="translate(750, 275)">
            {/* Stand Cast Base & Drop Shadow */}
            <ellipse cx="40" cy="195" rx="38" ry="14" fill="#241610" stroke="#3A2619" strokeWidth="1.5" />
            {/* Brass Riser Rod */}
            <line x1="40" y1="195" x2="40" y2="95" stroke="url(#brassGrad)" strokeWidth="4" />
            <line x1="40" y1="195" x2="40" y2="95" stroke="#6B4630" strokeWidth="1" />
            {/* Knurled Adjustment Thumbscrew */}
            <rect x="34" y="130" width="12" height="6" rx="2" fill="#DF9B4C" />

            {/* Shockmount Cradle Yoke */}
            <path d="M 18 95 C 18 120, 62 120, 62 95" fill="none" stroke="#6B4630" strokeWidth="2.5" />

            {/* Microphone Capsule Grille */}
            <rect x="22" y="32" width="36" height="62" rx="18" fill="#1C1310" stroke="#B8772F" strokeWidth="1.8" />
            <line x1="22" y1="63" x2="58" y2="63" stroke="#B8772F" strokeWidth="2" />
            {/* Acoustic Diamond Mesh Crosshatch */}
            <line x1="28" y1="40" x2="52" y2="56" stroke="#6B4630" strokeWidth="0.9" strokeDasharray="2 2" />
            <line x1="52" y1="40" x2="28" y2="56" stroke="#6B4630" strokeWidth="0.9" strokeDasharray="2 2" />

            {/* Emitted Acoustic Audio Telemetry Waveforms (Librosa PCM) */}
            <path
              d="M 68 45 A 25 25 0 0 1 68 81"
              fill="none"
              stroke="#B8772F"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 77 38 A 38 38 0 0 1 77 88"
              fill="none"
              stroke="#D2AE82"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 87 31 A 52 52 0 0 1 87 95"
              fill="none"
              stroke="#B8772F"
              strokeWidth="0.9"
              strokeDasharray="3 3"
              opacity="0.4"
            />
          </g>

          {/* -----------------------------------------------------------------------
              ORGANIC RISING STEAM WISPS WITH SINE-WAVE DRIFT & DISSOLVING TIPS
              ----------------------------------------------------------------------- */}
          <g transform="translate(625, 355)">
            {/* Wisp 1: Delicate Left Plume */}
            <path
              className="steam-wisp steam-line-1"
              d="M -14 -6 C -32 -42, 6 -86, -18 -145 C -30 -175, -8 -205, -22 -225"
              fill="none"
              stroke="url(#steamDissolve1)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.55"
            />
            {/* Wisp 2: Central Tall Plume */}
            <path
              className="steam-wisp steam-line-2"
              d="M 4 -14 C 32 -56, -16 -106, 14 -168 C 30 -200, 4 -232, 20 -255"
              fill="none"
              stroke="url(#steamDissolve2)"
              strokeWidth="3.4"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.7"
            />
            {/* Wisp 3: Right Curving Feather */}
            <path
              className="steam-wisp steam-line-3"
              d="M 20 -10 C 8 -52, 42 -102, 22 -160 C 8 -190, 28 -215, 16 -238"
              fill="none"
              stroke="url(#steamDissolve1)"
              strokeWidth="2.4"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.5"
            />
            {/* Wisp 4: Low Ethereal Thermal Curl */}
            <path
              className="steam-wisp steam-line-4"
              d="M -4 -18 C -18 -48, -4 -78, -24 -115 C -34 -138, -20 -158, -26 -175"
              fill="none"
              stroke="url(#steamDissolve2)"
              strokeWidth="2.1"
              strokeLinecap="round"
              filter="url(#steamBlur)"
              opacity="0.4"
            />
          </g>
        </g>

        {/* =========================================================================
            LAYER 6: Foreground Roasted Coffee Beans & Cinematic Bokeh (Speed 1.20)
            ========================================================================= */}
        <g id="layer-6" ref={layer6Ref}>
          {/* Roasted Coffee Bean 1 (Near Journal) with Crevice & Oil Gloss */}
          <g transform="translate(455, 485) rotate(24)">
            {/* Drop shadow */}
            <ellipse cx="14" cy="11" rx="14" ry="7" fill="#0C0705" opacity="0.6" />
            <ellipse cx="14" cy="9" rx="14" ry="9" fill="#2B1810" stroke="#120A07" strokeWidth="1.2" />
            {/* Center crevice */}
            <path d="M 3 9 Q 14 13.5, 25 9" stroke="#5A3520" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Chaff highlight */}
            <path d="M 6 9 Q 14 12.5, 22 9" stroke="#D2AE82" strokeWidth="0.6" fill="none" opacity="0.6" />
            {/* Natural roasted bean oil gloss */}
            <ellipse cx="10" cy="5.5" rx="6" ry="2.2" fill="#B8772F" opacity="0.4" />
          </g>

          {/* Roasted Coffee Bean 2 (Between Journal and Saucer) */}
          <g transform="translate(495, 510) rotate(-32)">
            <ellipse cx="12" cy="10" rx="12" ry="6" fill="#0C0705" opacity="0.6" />
            <ellipse cx="12" cy="8" rx="12" ry="8" fill="#241610" stroke="#100A08" strokeWidth="1.2" />
            <path d="M 3 8 Q 12 5, 21 8" stroke="#523522" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx="9" cy="5" rx="5" ry="2" fill="#D2AE82" opacity="0.25" />
          </g>

          {/* Roasted Coffee Bean 3 (Resting near saucer edge) */}
          <g transform="translate(685, 498) rotate(48)">
            <ellipse cx="11" cy="9" rx="11" ry="6" fill="#0C0705" opacity="0.5" />
            <ellipse cx="11" cy="7.5" rx="11" ry="7.5" fill="#2D1A12" stroke="#140D0A" strokeWidth="1.1" />
            <path d="M 3 7.5 Q 11 10.5, 19 7.5" stroke="#6B4630" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx="8" cy="5" rx="4.5" ry="1.8" fill="#B8772F" opacity="0.3" />
          </g>

          {/* Foreground Macro Blurred Roasted Bean (Left corner cinematic depth) */}
          <g transform="translate(50, 525) rotate(-18)" filter="url(#soft-blur)" opacity="0.65">
            <ellipse cx="28" cy="18" rx="28" ry="18" fill="#3A2619" />
            <path d="M 8 18 Q 28 24, 48 18" stroke="#1C1310" strokeWidth="3" fill="none" />
          </g>

          {/* Foreground Macro Blurred Botanical Leaf (Right corner cinematic depth) */}
          <g transform="translate(870, 485) rotate(35)" filter="url(#soft-blur)" opacity="0.55">
            <path d="M 0 0 C 40 -20, 70 10, 50 40 C 30 60, 0 30, 0 0 Z" fill="#3A2619" />
          </g>
        </g>
      </svg>
    </div>
  );
}
