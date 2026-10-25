import React from 'react';

/**
 * CampusMapSVG
 * Stylized architectural floorplan of the studio atelier with a pulsing caramel sensor pin.
 */
export default function CampusMapSVG({ className = "w-full h-auto" }) {
  return (
    <svg className={className} viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sensorPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8772F" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#B8772F" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#B8772F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Exterior Architectural Studio Boundary Walls */}
      <rect x="30" y="30" width="440" height="300" stroke="#6B4630" strokeWidth="2.5" fill="#231713" />
      <rect x="38" y="38" width="424" height="284" stroke="#3A2619" strokeWidth="1" strokeDasharray="6 6" />

      {/* Entry Vestibule & Double Swing Door Arc */}
      <path d="M 30 180 L 10 180 L 10 240 L 30 240" stroke="#6B4630" strokeWidth="2" fill="none" />
      <path d="M 30 190 A 25 25 0 0 1 55 215" stroke="#D2AE82" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <line x1="30" y1="190" x2="30" y2="215" stroke="#B8772F" strokeWidth="2" />
      <text x="18" y="258" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.1em">
        ENTRY
      </text>

      {/* Acoustic Wall Baffles on North & South Walls */}
      <g stroke="#6B4630" strokeWidth="1.5">
        <line x1="80" y1="30" x2="110" y2="42" />
        <line x1="140" y1="30" x2="170" y2="42" />
        <line x1="200" y1="30" x2="230" y2="42" />
        <line x1="260" y1="30" x2="290" y2="42" />
        <line x1="320" y1="30" x2="350" y2="42" />
        <line x1="380" y1="30" x2="410" y2="42" />

        <line x1="80" y1="330" x2="110" y2="318" />
        <line x1="140" y1="330" x2="170" y2="318" />
        <line x1="200" y1="330" x2="230" y2="318" />
        <line x1="260" y1="330" x2="290" y2="318" />
        <line x1="320" y1="330" x2="350" y2="318" />
        <line x1="380" y1="330" x2="410" y2="318" />
      </g>

      {/* Studio Lectern / Dais on East Wall */}
      <rect x="380" y="140" width="45" height="80" rx="3" stroke="#B8772F" strokeWidth="1.5" fill="#3A2619" />
      <text x="402" y="184" textAnchor="middle" fill="#D2AE82" fontFamily="JetBrains Mono" fontSize="9" transform="rotate(-90 402 184)">
        PODIUM
      </text>

      {/* Student Studio Desks (Row Layout) */}
      {/* Row 1 */}
      <g stroke="#3A2619" strokeWidth="1.2" fill="#1C1310">
        <rect x="290" y="70" width="35" height="60" rx="2" />
        <rect x="290" y="150" width="35" height="60" rx="2" />
        <rect x="290" y="230" width="35" height="60" rx="2" />

        {/* Row 2 */}
        <rect x="210" y="70" width="35" height="60" rx="2" />
        <rect x="210" y="150" width="35" height="60" rx="2" />
        <rect x="210" y="230" width="35" height="60" rx="2" />

        {/* Row 3 */}
        <rect x="130" y="70" width="35" height="60" rx="2" />
        <rect x="130" y="150" width="35" height="60" rx="2" />
        <rect x="130" y="230" width="35" height="60" rx="2" />
      </g>

      {/* Desk Chairs */}
      <g stroke="#6B4630" strokeWidth="1">
        <circle cx="280" cy="100" r="8" />
        <circle cx="280" cy="180" r="8" />
        <circle cx="280" cy="260" r="8" />

        <circle cx="200" cy="100" r="8" />
        <circle cx="200" cy="180" r="8" />
        <circle cx="200" cy="260" r="8" />

        <circle cx="120" cy="100" r="8" />
        <circle cx="120" cy="180" r="8" />
        <circle cx="120" cy="260" r="8" />
      </g>

      {/* Optical Camera Field-of-View Cone from Podium */}
      <polygon
        points="380,180 110,50 110,310"
        fill="#B8772F"
        fillOpacity="0.06"
        stroke="#B8772F"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Pulsing Caramel Sensor Pin on Podium */}
      <g transform="translate(380, 180)">
        {/* Pulsing radar waves */}
        <circle cx="0" cy="0" r="28" fill="url(#sensorPulse)" className="animate-ping opacity-75" />
        <circle cx="0" cy="0" r="14" stroke="#B8772F" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="6" fill="#B8772F" />

        <text x="0" y="32" textAnchor="middle" fill="#EBDCC2" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="0.12em">
          SENSOR 01
        </text>
      </g>

      {/* Grid Coordinates Overlay */}
      <g fill="#6B4630" fontFamily="JetBrains Mono" fontSize="7" opacity="0.6">
        <text x="36" y="22">Y: 00</text>
        <text x="440" y="22">X: 100</text>
        <text x="440" y="342">ROOM 402</text>
      </g>
    </svg>
  );
}
