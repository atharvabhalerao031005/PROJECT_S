import React from 'react';

/**
 * Stage 01: Raw Capture (The Bean)
 * Precision optical aperture blades, sensor calibration reticle, and radiating acoustic waveform seeds.
 */
export function PipelineStep1SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sensorAtmosphere" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#B8772F" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#3A2619" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1C1310" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="apertureBladeGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A2619" />
          <stop offset="100%" stopColor="#1E1410" />
        </linearGradient>
        <linearGradient id="apertureBladeGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A3222" />
          <stop offset="100%" stopColor="#281A12" />
        </linearGradient>
        <radialGradient id="beanCoreGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#4A2E1C" />
          <stop offset="60%" stopColor="#261710" />
          <stop offset="100%" stopColor="#140B07" />
        </radialGradient>
      </defs>
      
      {/* Background Sensor Calibration Atmosphere */}
      <circle cx="210" cy="165" r="145" fill="url(#sensorAtmosphere)" />
      
      {/* Drafting Crosshairs & Polar Angle Grid */}
      <circle cx="210" cy="165" r="130" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="210" cy="165" r="115" stroke="#6B4630" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.8" />
      <circle cx="210" cy="165" r="98" stroke="#3A2619" strokeWidth="1" />
      
      {/* 4 Polar Axis Crosshairs */}
      <line x1="210" y1="20" x2="210" y2="45" stroke="#B8772F" strokeWidth="1.5" />
      <line x1="210" y1="285" x2="210" y2="310" stroke="#B8772F" strokeWidth="1.5" />
      <line x1="65" y1="165" x2="90" y2="165" stroke="#B8772F" strokeWidth="1.5" />
      <line x1="330" y1="165" x2="355" y2="165" stroke="#B8772F" strokeWidth="1.5" />

      {/* Optical Angle Scale Ticks (0°, 45°, 90°, etc.) */}
      <text x="210" y="40" textAnchor="middle" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="7">0°</text>
      <text x="340" y="168" textAnchor="start" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7">90°</text>
      <text x="210" y="298" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7">180°</text>
      <text x="80" y="168" textAnchor="end" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7">270°</text>
      
      {/* 6 Overlapping Precision Aperture Blades */}
      <g transform="translate(10, 5)">
        <path d="M 200 65 L 275 120 L 225 152 Z" fill="url(#apertureBladeGrad1)" stroke="#B8772F" strokeWidth="1.4" />
        <path d="M 275 120 L 275 205 L 225 172 Z" fill="url(#apertureBladeGrad2)" stroke="#B8772F" strokeWidth="1.4" />
        <path d="M 275 205 L 200 260 L 175 228 Z" fill="url(#apertureBladeGrad1)" stroke="#B8772F" strokeWidth="1.4" />
        <path d="M 200 260 L 125 205 L 175 172 Z" fill="url(#apertureBladeGrad2)" stroke="#B8772F" strokeWidth="1.4" />
        <path d="M 125 205 L 125 120 L 175 152 Z" fill="url(#apertureBladeGrad1)" stroke="#B8772F" strokeWidth="1.4" />
        <path d="M 125 120 L 200 65 L 175 92 Z" fill="url(#apertureBladeGrad2)" stroke="#B8772F" strokeWidth="1.4" />
      </g>

      {/* Central Roasted Coffee Bean Core (The Seed of Telemetry) */}
      <g transform="translate(182, 140)">
        {/* Soft Bean Drop Shadow */}
        <ellipse cx="28" cy="27" rx="34" ry="23" fill="#140A07" opacity="0.75" />
        {/* Bean Body */}
        <ellipse cx="28" cy="25" rx="32" ry="21" fill="url(#beanCoreGrad)" stroke="#D2AE82" strokeWidth="1.4" />
        {/* Sinuous roasted crevice */}
        <path d="M 6 25 Q 18 34, 28 25 Q 38 16, 50 25" stroke="#B8772F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Specular roast oil sheen */}
        <ellipse cx="24" cy="18" rx="14" ry="5" fill="#FAF5EC" opacity="0.22" transform="rotate(-8 24 18)" />
      </g>

      {/* Radiating Acoustic Sine Wave Seeds (Left & Right) */}
      <path d="M 35 165 Q 55 135, 75 165 T 115 165" stroke="#D2AE82" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 35 165 Q 55 145, 75 165 T 115 165" stroke="#B8772F" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
      
      <path d="M 305 165 Q 325 135, 345 165 T 385 165" stroke="#D2AE82" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 305 165 Q 325 145, 345 165 T 385 165" stroke="#B8772F" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
      
      {/* Calibration Metadata Stamped Text */}
      <g transform="translate(14, 25)">
        <text x="0" y="0" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.1em">
          APERTURE: f/1.4 • 50mm
        </text>
        <text x="0" y="12" fill="#523522" fontFamily="JetBrains Mono" fontSize="7" letterSpacing="0.08em">
          SENSOR: 1/1.8" CMOS 1080p
        </text>
      </g>

      <g transform="translate(290, 25)">
        <text x="110" y="0" textAnchor="end" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.1em">
          AUDIO: 16.0 kHz PCM
        </text>
        <text x="110" y="12" textAnchor="end" fill="#523522" fontFamily="JetBrains Mono" fontSize="7" letterSpacing="0.08em">
          SENSITIVITY: -42 dBFS
        </text>
      </g>

      {/* Editorial Footer Label */}
      <text x="210" y="322" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="9.5" letterSpacing="0.2em">
        STAGE 01 // OPTICAL APERTURE &amp; ACOUSTIC HARVEST
      </text>
    </svg>
  );
}

/**
 * Stage 02: Feature Extraction (The Grind)
 * Haar Cascade multi-scale geometry + Delaunay facial mesh landmarks + Librosa spectral slices.
 */
export function PipelineStep2SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="specBarGrad1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3A2619" />
          <stop offset="60%" stopColor="#B8772F" />
          <stop offset="100%" stopColor="#D2AE82" />
        </linearGradient>
        <linearGradient id="specBarGradPeak" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6B4630" />
          <stop offset="50%" stopColor="#B8772F" />
          <stop offset="100%" stopColor="#FAF5EC" />
        </linearGradient>
      </defs>

      {/* Outer Studio Video Frame */}
      <rect x="50" y="24" width="320" height="250" stroke="#3A2619" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* Multi-Scale Haar Cascade Bounding Boxes */}
      <rect x="80" y="48" width="260" height="195" stroke="#6B4630" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6" />
      <rect x="115" y="62" width="190" height="155" stroke="#B8772F" strokeWidth="1.8" />
      
      {/* Corner Crop Brackets on Primary Haar Detection Frame */}
      <path d="M 115 80 L 115 62 L 133 62" stroke="#FAF5EC" strokeWidth="2.5" />
      <path d="M 305 80 L 305 62 L 287 62" stroke="#FAF5EC" strokeWidth="2.5" />
      <path d="M 115 199 L 115 217 L 133 217" stroke="#FAF5EC" strokeWidth="2.5" />
      <path d="M 305 199 L 305 217 L 287 217" stroke="#FAF5EC" strokeWidth="2.5" />

      {/* Target Tracker ID Overlay Tag */}
      <g transform="translate(120, 68)">
        <rect x="0" y="0" width="88" height="16" fill="#1C1310" stroke="#B8772F" strokeWidth="1" />
        <text x="6" y="11" fill="#EBDCC2" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">
          ID: #042 [0.94]
        </text>
      </g>

      {/* Delaunay Facial Landmark Wireframe */}
      {/* Eye Line & Sockets */}
      <line x1="145" y1="112" x2="275" y2="112" stroke="#6B4630" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="170" cy="112" r="9" stroke="#D2AE82" strokeWidth="1.5" />
      <circle cx="250" cy="112" r="9" stroke="#D2AE82" strokeWidth="1.5" />
      <circle cx="170" cy="112" r="2.5" fill="#B8772F" />
      <circle cx="250" cy="112" r="2.5" fill="#B8772F" />

      {/* Active Gaze Vector Vectors (Attention Projection) */}
      <line x1="170" y1="112" x2="164" y2="98" stroke="#FAF5EC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="250" y1="112" x2="244" y2="98" stroke="#FAF5EC" strokeWidth="1.5" strokeLinecap="round" />

      {/* Delaunay Mesh Bridge Triangles (Forehead, Nose, Cheeks) */}
      <polygon points="210,88 170,112 210,128" stroke="#B8772F" strokeWidth="1" fill="#3A2619" fillOpacity="0.25" />
      <polygon points="210,88 250,112 210,128" stroke="#B8772F" strokeWidth="1" fill="#3A2619" fillOpacity="0.25" />
      <polygon points="210,128 170,112 185,150" stroke="#6B4630" strokeWidth="0.9" fill="none" />
      <polygon points="210,128 250,112 235,150" stroke="#6B4630" strokeWidth="0.9" fill="none" />
      <polygon points="210,128 185,150 210,154 235,150" stroke="#B8772F" strokeWidth="1.2" fill="#3A2619" fillOpacity="0.4" />
      
      {/* Mouth & Chin Contours */}
      <line x1="190" y1="174" x2="230" y2="174" stroke="#D2AE82" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="185,150 210,154 210,188 190,174" stroke="#6B4630" strokeWidth="0.8" fill="none" />
      <polygon points="235,150 210,154 210,188 230,174" stroke="#6B4630" strokeWidth="0.8" fill="none" />
      <circle cx="210" cy="198" r="3" fill="#B8772F" />

      {/* Librosa Spectral Slices / Frequency Decomposition Rack at bottom of frame */}
      <g transform="translate(105, 252)">
        {/* Background baseline */}
        <line x1="-10" y1="0" x2="220" y2="0" stroke="#3A2619" strokeWidth="1" />
        
        {/* 11 Frequency Slices */}
        <rect x="0" y="-14" width="12" height="14" fill="#3A2619" stroke="#6B4630" strokeWidth="0.8" />
        <rect x="18" y="-22" width="12" height="22" fill="#6B4630" stroke="#B8772F" strokeWidth="0.8" />
        <rect x="36" y="-34" width="12" height="34" fill="url(#specBarGrad1)" stroke="#B8772F" strokeWidth="1" />
        <rect x="54" y="-46" width="12" height="46" fill="url(#specBarGrad1)" stroke="#D2AE82" strokeWidth="1" />
        <rect x="72" y="-58" width="12" height="58" fill="url(#specBarGradPeak)" stroke="#FAF5EC" strokeWidth="1.2" />
        <rect x="90" y="-40" width="12" height="40" fill="url(#specBarGrad1)" stroke="#B8772F" strokeWidth="1" />
        <rect x="108" y="-30" width="12" height="30" fill="#6B4630" />
        <rect x="126" y="-20" width="12" height="20" fill="#3A2619" />
        <rect x="144" y="-32" width="12" height="32" fill="url(#specBarGrad1)" />
        <rect x="162" y="-42" width="12" height="42" fill="url(#specBarGrad1)" stroke="#B8772F" strokeWidth="0.8" />
        <rect x="180" y="-18" width="12" height="18" fill="#3A2619" />

        {/* Spectral Centroid Needle Marker */}
        <line x1="78" y1="-64" x2="78" y2="4" stroke="#FAF5EC" strokeWidth="1.5" strokeDasharray="2 2" />
        <polygon points="78,-66 74,-72 82,-72" fill="#FAF5EC" />
        <text x="84" y="-68" fill="#FAF5EC" fontFamily="JetBrains Mono" fontSize="7">fc = 1.42 kHz</text>
      </g>

      <text x="210" y="322" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="9.5" letterSpacing="0.2em">
        STAGE 02 // HAAR CASCADE MESH &amp; SPECTRAL DECOMPOSITION
      </text>
    </svg>
  );
}

/**
 * Stage 03: Sustained Tracking (The Bloom)
 * Concentric temporal bloom rings, 10-second verification chronometer, and walk-by noise filtering.
 */
export function PipelineStep3SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bloomGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8772F" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#3A2619" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1C1310" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Temporal Glow */}
      <circle cx="210" cy="155" r="135" fill="url(#bloomGlow)" />

      {/* Concentric Temporal Bloom Rings (Expanding extraction profile) */}
      <circle cx="210" cy="155" r="125" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="210" cy="155" r="100" stroke="#6B4630" strokeWidth="1.2" strokeDasharray="6 6" />
      <circle cx="210" cy="155" r="75" stroke="#B8772F" strokeWidth="1.5" />
      <circle cx="210" cy="155" r="50" stroke="#D2AE82" strokeWidth="1.8" />
      <circle cx="210" cy="155" r="24" fill="#281A12" stroke="#FAF5EC" strokeWidth="2" />
      
      {/* Central Verified Presence Core */}
      <circle cx="210" cy="155" r="7" fill="#B8772F" />
      <circle cx="210" cy="155" r="3" fill="#FAF5EC" />

      {/* 10-Second Chronometer Radial Scale Ticks */}
      <line x1="210" y1="20" x2="210" y2="40" stroke="#B8772F" strokeWidth="2.5" />
      <text x="210" y="16" textAnchor="middle" fill="#FAF5EC" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold">
        10.0s (VERIFIED)
      </text>

      <line x1="345" y1="155" x2="325" y2="155" stroke="#6B4630" strokeWidth="1.5" />
      <text x="352" y="158" textAnchor="start" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7">2.5s</text>

      <line x1="210" y1="290" x2="210" y2="270" stroke="#6B4630" strokeWidth="1.5" />
      <text x="210" y="302" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7">5.0s</text>

      <line x1="75" y1="155" x2="95" y2="155" stroke="#6B4630" strokeWidth="1.5" />
      <text x="68" y="158" textAnchor="end" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7">7.5s</text>

      {/* Full 10.0s Sweeping Verified Arc */}
      <path
        d="M 210 80 A 75 75 0 1 1 142 188"
        stroke="#FAF5EC"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leading Edge Glow Pip */}
      <circle cx="142" cy="188" r="4.5" fill="#B8772F" stroke="#FAF5EC" strokeWidth="1.5" />

      {/* Stamped Industrial Note: Hallway Walk-By Rejection */}
      <g transform="translate(68, 70) rotate(-8)">
        <rect x="0" y="0" width="86" height="28" fill="#1C1310" stroke="#6B4630" strokeWidth="1" />
        <div className="flex items-center">
          <text x="8" y="12" fill="#D94E34" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="bold">
            × 1.2s REJECTED
          </text>
          <text x="8" y="22" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="6.5">
            TRANSIENT NOISE
          </text>
        </div>
      </g>

      {/* Verified Participant Stamped Seal Badge */}
      <g transform="translate(262, 70) rotate(5)">
        <rect x="0" y="0" width="105" height="32" fill="#1C1310" stroke="#B8772F" strokeWidth="1.4" />
        <text x="10" y="13" fill="#FAF5EC" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold">
          ✓ 10.0s ACCUMULATED
        </text>
        <text x="10" y="25" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="7">
          ATTENDANCE LOGGED
        </text>
      </g>

      <text x="210" y="322" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="9.5" letterSpacing="0.2em">
        STAGE 03 // TEMPORAL BLOOM &amp; SUSTAINED PERSISTENCE
      </text>
    </svg>
  );
}

/**
 * Stage 04: Agentic Pedagogy & Decision Fusion (The Pour)
 * Fluted V60 Pour-Over dripper distilling multimodal streams into an artisanal espresso cup & pedagogical advice card.
 */
export function PipelineStep4SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="v60GlassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A3222" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#281A12" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1C1310" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="pourStreamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8772F" />
          <stop offset="50%" stopColor="#FAF5EC" />
          <stop offset="100%" stopColor="#B8772F" />
        </linearGradient>
      </defs>

      {/* V60 Pour-Over Dripper Body */}
      <polygon
        points="135,45 285,45 225,145 195,145"
        fill="url(#v60GlassGrad)"
        stroke="#B8772F"
        strokeWidth="1.8"
      />
      {/* V60 Fluted Spiral Ribs */}
      <path d="M 152 60 Q 200 95, 205 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      <path d="M 185 55 Q 210 95, 215 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      <path d="M 235 55 Q 215 95, 210 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      <path d="M 268 60 Q 225 95, 215 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />

      {/* Glass Collar Rim & Bevel */}
      <line x1="130" y1="45" x2="290" y2="45" stroke="#FAF5EC" strokeWidth="2" strokeLinecap="round" />

      {/* Multimodal Telemetry Input Streams entering top */}
      <g transform="translate(0, 0)">
        <text x="145" y="36" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">
          VISUAL 45%
        </text>
        <line x1="168" y1="39" x2="168" y2="45" stroke="#D2AE82" strokeWidth="1" strokeDasharray="2 2" />

        <text x="210" y="24" textAnchor="middle" fill="#FAF5EC" fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="bold">
          ACOUSTIC 30%
        </text>
        <line x1="210" y1="28" x2="210" y2="45" stroke="#FAF5EC" strokeWidth="1.2" strokeDasharray="2 2" />

        <text x="275" y="36" textAnchor="end" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">
          MOTION 25%
        </text>
        <line x1="252" y1="39" x2="252" y2="45" stroke="#D2AE82" strokeWidth="1" strokeDasharray="2 2" />
      </g>

      {/* Distilled Telemetry Pouring Stream */}
      <line x1="210" y1="145" x2="210" y2="218" stroke="url(#pourStreamGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="210" cy="180" r="2" fill="#FAF5EC" />
      <circle cx="210" cy="205" r="2.5" fill="#FAF5EC" />

      {/* Receiving Ceramic Demitasse Cup */}
      <g transform="translate(170, 215)">
        {/* Cup Shadow */}
        <ellipse cx="40" cy="58" rx="46" ry="12" fill="#140D0A" opacity="0.8" />
        {/* Saucer */}
        <ellipse cx="40" cy="56" rx="44" ry="11" fill="#3A2619" stroke="#6B4630" strokeWidth="1.2" />
        <ellipse cx="40" cy="55" rx="38" ry="9" fill="#EBDCC2" stroke="#B8772F" strokeWidth="0.8" />
        
        {/* Cup Body */}
        <path
          d="M 10 15 C 10 45, 25 55, 40 55 C 55 55, 70 45, 70 15 Z"
          fill="#FAF5EC"
          stroke="#6B4630"
          strokeWidth="1.5"
        />
        {/* Liquid Surface */}
        <ellipse cx="40" cy="15" rx="30" ry="10" fill="#1C1310" stroke="#B8772F" strokeWidth="1.2" />
        <ellipse cx="40" cy="16" rx="25" ry="7" fill="#B8772F" />
        <path d="M 28 16 Q 40 13, 52 16" stroke="#FAF5EC" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Cup Handle */}
        <path d="M 68 22 C 84 22, 86 42, 66 45" stroke="#FAF5EC" strokeWidth="3.5" fill="none" />
        <path d="M 68 22 C 84 22, 86 42, 66 45" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      </g>

      {/* AI Pedagogical Insight Synthesis Card */}
      <g transform="translate(262, 160)">
        <rect x="0" y="0" width="132" height="54" rx="2" fill="#1C1310" stroke="#B8772F" strokeWidth="1.2" />
        <rect x="0" y="0" width="132" height="12" fill="#3A2619" />
        <text x="6" y="9" fill="#FAF5EC" fontFamily="JetBrains Mono" fontSize="7" fontWeight="bold">
          LLM SYNTHESIS // CONF: 96.4%
        </text>
        <text x="6" y="25" fill="#FAF5EC" fontFamily="Fraunces" fontStyle="italic" fontSize="9">
          "Attention dip at min 18.
        </text>
        <text x="6" y="38" fill="#D2AE82" fontFamily="Fraunces" fontStyle="italic" fontSize="9">
          Prompt peer discussion."
        </text>
        <text x="6" y="48" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="6.5">
          NON-ENFORCING CONTEXT
        </text>
      </g>

      <text x="210" y="322" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="9.5" letterSpacing="0.2em">
        STAGE 04 // AGENTIC SYNTHESIS &amp; PEDAGOGICAL INSIGHT
      </text>
    </svg>
  );
}