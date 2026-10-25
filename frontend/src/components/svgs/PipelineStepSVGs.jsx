import React from 'react';

/**
 * Stage 01: Raw Capture (The Bean)
 * Optical aperture blades intersecting acoustic waveform seeds.
 */
export function PipelineStep1SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="beanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8772F" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1C1310" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background radial atmosphere */}
      <circle cx="200" cy="160" r="140" fill="url(#beanGlow)" />
      
      {/* Outer Optical Aperture Housing */}
      <circle cx="200" cy="160" r="110" stroke="#6B4630" strokeWidth="1.5" strokeDasharray="6 4" />
      <circle cx="200" cy="160" r="95" stroke="#3A2619" strokeWidth="1" />
      
      {/* 6 Overlapping Optical Aperture Blades */}
      <path d="M 200 65 L 270 120 L 225 150 Z" fill="#3A2619" stroke="#B8772F" strokeWidth="1.5" />
      <path d="M 270 120 L 270 200 L 225 170 Z" fill="#281A12" stroke="#B8772F" strokeWidth="1.5" />
      <path d="M 270 200 L 200 255 L 175 225 Z" fill="#3A2619" stroke="#B8772F" strokeWidth="1.5" />
      <path d="M 200 255 L 130 200 L 175 170 Z" fill="#281A12" stroke="#B8772F" strokeWidth="1.5" />
      <path d="M 130 200 L 130 120 L 175 150 Z" fill="#3A2619" stroke="#B8772F" strokeWidth="1.5" />
      <path d="M 130 120 L 200 65 L 175 95 Z" fill="#281A12" stroke="#B8772F" strokeWidth="1.5" />

      {/* Central Roasted Coffee Bean Core */}
      <g transform="translate(175, 135)">
        <ellipse cx="25" cy="25" rx="30" ry="20" fill="#3A2619" stroke="#D2AE82" strokeWidth="1.5" />
        <path d="M 5 25 Q 25 32, 45 25" stroke="#B8772F" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Radiating Acoustic Sine Wave Seeds */}
      <path d="M 40 160 Q 60 130, 80 160 T 120 160" stroke="#D2AE82" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 280 160 Q 300 130, 320 160 T 360 160" stroke="#D2AE82" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      
      {/* Editorial Telemetry Labels */}
      <text x="200" y="300" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="0.18em">
        STAGE 01 // OPTICAL APERTURE &amp; ACOUSTIC HARVEST
      </text>
    </svg>
  );
}

/**
 * Stage 02: Feature Extraction (The Grind)
 * Haar Cascade multi-scale geometry + spectral frequency slices.
 */
export function PipelineStep2SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Frame */}
      <rect x="60" y="30" width="280" height="240" stroke="#3A2619" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* Multi-Scale Haar Cascade Bounding Boxes */}
      <rect x="90" y="60" width="220" height="180" stroke="#6B4630" strokeWidth="1" strokeDasharray="2 4" />
      <rect x="120" y="80" width="160" height="140" stroke="#B8772F" strokeWidth="1.8" />
      
      {/* Corner Crop Brackets on primary box */}
      <path d="M 120 95 L 120 80 L 135 80" stroke="#EBDCC2" strokeWidth="2.5" />
      <path d="M 280 95 L 280 80 L 265 80" stroke="#EBDCC2" strokeWidth="2.5" />
      <path d="M 120 205 L 120 220 L 135 220" stroke="#EBDCC2" strokeWidth="2.5" />
      <path d="M 280 205 L 280 220 L 265 220" stroke="#EBDCC2" strokeWidth="2.5" />

      {/* Human Facial Mesh Wireframe Structure */}
      {/* Eye Line */}
      <line x1="140" y1="125" x2="260" y2="125" stroke="#6B4630" strokeWidth="1" />
      <circle cx="165" cy="125" r="8" stroke="#D2AE82" strokeWidth="1.5" />
      <circle cx="235" cy="125" r="8" stroke="#D2AE82" strokeWidth="1.5" />
      <circle cx="165" cy="125" r="2" fill="#B8772F" />
      <circle cx="235" cy="125" r="2" fill="#B8772F" />

      {/* Nose & Chin Vector Triangles */}
      <polygon points="200,125 190,165 210,165" stroke="#B8772F" strokeWidth="1.2" fill="#3A2619" fillOpacity="0.4" />
      <line x1="180" y1="185" x2="220" y2="185" stroke="#D2AE82" strokeWidth="1.5" />
      
      {/* Librosa Spectral Slices / Frequency Bars below */}
      <g transform="translate(100, 235)">
        <rect x="0" y="5" width="10" height="20" fill="#3A2619" stroke="#6B4630" strokeWidth="1" />
        <rect x="18" y="0" width="10" height="25" fill="#6B4630" stroke="#B8772F" strokeWidth="1" />
        <rect x="36" y="-12" width="10" height="37" fill="#B8772F" stroke="#D2AE82" strokeWidth="1" />
        <rect x="54" y="-22" width="10" height="47" fill="#B8772F" stroke="#EBDCC2" strokeWidth="1" />
        <rect x="72" y="-30" width="10" height="55" fill="#D2AE82" />
        <rect x="90" y="-15" width="10" height="40" fill="#B8772F" />
        <rect x="108" y="-5" width="10" height="30" fill="#6B4630" />
        <rect x="126" y="2" width="10" height="23" fill="#3A2619" />
        <rect x="144" y="-8" width="10" height="33" fill="#6B4630" />
        <rect x="162" y="-18" width="10" height="43" fill="#B8772F" />
        <rect x="180" y="4" width="10" height="21" fill="#3A2619" />
      </g>

      <text x="200" y="300" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="0.18em">
        STAGE 02 // HAAR CASCADE MESH &amp; SPECTRAL DECOMPOSITION
      </text>
    </svg>
  );
}

/**
 * Stage 03: Sustained Tracking (The Bloom)
 * Temporal presence rings expanding over time (eliminating single-frame false positives).
 */
export function PipelineStep3SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Concentric Temporal Bloom Rings */}
      <circle cx="200" cy="150" r="120" stroke="#3A2619" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="200" cy="150" r="95" stroke="#6B4630" strokeWidth="1.2" strokeDasharray="6 6" />
      <circle cx="200" cy="150" r="70" stroke="#B8772F" strokeWidth="1.5" />
      <circle cx="200" cy="150" r="45" stroke="#D2AE82" strokeWidth="1.8" />
      <circle cx="200" cy="150" r="20" fill="#3A2619" stroke="#EBDCC2" strokeWidth="2" />
      
      {/* Central Verified Presence Marker */}
      <circle cx="200" cy="150" r="6" fill="#B8772F" />

      {/* Time Radial Ticks (10-second presence threshold markers) */}
      <line x1="200" y1="20" x2="200" y2="40" stroke="#B8772F" strokeWidth="2" />
      <line x1="330" y1="150" x2="310" y2="150" stroke="#6B4630" strokeWidth="1.5" />
      <line x1="200" y1="280" x2="200" y2="260" stroke="#6B4630" strokeWidth="1.5" />
      <line x1="70" y1="150" x2="90" y2="150" stroke="#6B4630" strokeWidth="1.5" />

      {/* Progress Arc: Sustained Presence 10.0s */}
      <path
        d="M 200 80 A 70 70 0 1 1 135 175"
        stroke="#EBDCC2"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rejection of walk-by transient false positive */}
      <g transform="translate(65, 80) rotate(-12)">
        <rect x="0" y="0" width="75" height="26" fill="#1C1310" stroke="#6B4630" strokeWidth="1" />
        <text x="37" y="17" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="8">
          1.2s REJECTED
        </text>
      </g>

      {/* Verified Participant Badge */}
      <g transform="translate(255, 75) rotate(6)">
        <rect x="0" y="0" width="95" height="28" fill="#1C1310" stroke="#B8772F" strokeWidth="1.2" />
        <text x="47" y="18" textAnchor="middle" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">
          10.0s VERIFIED
        </text>
      </g>

      <text x="200" y="300" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="0.18em">
        STAGE 03 // TEMPORAL BLOOM &amp; SUSTAINED PERSISTENCE
      </text>
    </svg>
  );
}

/**
 * Stage 04: Agentic Pedagogy & Decision Fusion (The Pour)
 * V60 Pour-over dripper distilling multimodal streams into an espresso cup of pedagogical insight.
 */
export function PipelineStep4SVG({ className = "w-full h-full max-h-80" }) {
  return (
    <svg className={className} viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* V60 Pour-Over Glass Dripper Geometry */}
      <polygon
        points="130,50 270,50 215,145 185,145"
        fill="#3A2619"
        fillOpacity="0.4"
        stroke="#B8772F"
        strokeWidth="1.8"
      />
      {/* Internal Spiral Ribs of V60 */}
      <path d="M 145 65 Q 190 95, 195 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      <path d="M 175 60 Q 200 95, 205 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      <path d="M 225 60 Q 205 95, 200 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />
      <path d="M 255 65 Q 215 95, 205 140" stroke="#6B4630" strokeWidth="1.2" fill="none" />

      {/* Stream indicators entering top */}
      <text x="145" y="42" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="8">
        VISUAL
      </text>
      <text x="200" y="42" textAnchor="middle" fill="#B8772F" fontFamily="JetBrains Mono" fontSize="8">
        ACOUSTIC
      </text>
      <text x="255" y="42" textAnchor="end" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="8">
        MOTION
      </text>

      {/* Distilled Telemetry Pouring Stream */}
      <line x1="200" y1="145" x2="200" y2="215" stroke="#B8772F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="200" y1="150" x2="200" y2="210" stroke="#EBDCC2" strokeWidth="1" strokeDasharray="4 4" />

      {/* Receiving Ceramic Espresso Cup */}
      <g transform="translate(160, 215)">
        <path
          d="M 10 15 C 10 45, 25 55, 40 55 C 55 55, 70 45, 70 15 Z"
          fill="#EBDCC2"
          stroke="#6B4630"
          strokeWidth="1.5"
        />
        <ellipse cx="40" cy="15" rx="30" ry="10" fill="#1C1310" stroke="#B8772F" strokeWidth="1.2" />
        <ellipse cx="40" cy="16" rx="24" ry="7" fill="#B8772F" />
        {/* Handle */}
        <path d="M 68 22 C 82 22, 85 42, 65 45" stroke="#EBDCC2" strokeWidth="3" fill="none" />
        {/* Saucer */}
        <ellipse cx="40" cy="56" rx="46" ry="12" fill="#3A2619" stroke="#6B4630" strokeWidth="1.2" />
      </g>

      {/* Rising Editorial Speech Bubble / Insight Wisp */}
      <g transform="translate(260, 165)">
        <rect x="0" y="0" width="115" height="42" rx="2" fill="#1C1310" stroke="#B8772F" strokeWidth="1" />
        <text x="8" y="16" fill="#EBDCC2" fontFamily="Fraunces" fontStyle="italic" fontSize="9">
          "Deepen conceptual
        </text>
        <text x="8" y="30" fill="#D2AE82" fontFamily="Fraunces" fontStyle="italic" fontSize="9">
          cadence now."
        </text>
      </g>

      <text x="200" y="300" textAnchor="middle" fill="#6B4630" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="0.18em">
        STAGE 04 // AGENTIC SYNTHESIS &amp; PEDAGOGICAL INSIGHT
      </text>
    </svg>
  );
}
