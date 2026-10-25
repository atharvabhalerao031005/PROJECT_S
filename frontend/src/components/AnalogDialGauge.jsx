import React from 'react';

/**
 * AnalogDialGauge
 * Galvanometer-style analog meter with damped pivoting needle and warm vintage scale.
 * Ideal for Gaze Attention Index, Equilibrium Score, or RMS Acoustic Level.
 */
export default function AnalogDialGauge({
  value = 84.2,
  min = 0,
  max = 100,
  label = 'GAZE EQUILIBRIUM',
  unit = '%',
  sublabel = 'VISUAL ATTENTION INDEX',
  size = 140,
}) {
  const clamped = Math.min(max, Math.max(min, value));
  const normalized = (clamped - min) / (max - min);

  // Needle angle: from -50 degrees (left) to +50 degrees (right)
  const angle = -50 + normalized * 100;

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="relative flex items-center justify-center p-3 border border-roast bg-espresso/90 overflow-hidden"
        style={{ width: `${size}px`, height: `${size * 0.78}px` }}
      >
        {/* Subtle vintage parchment backlight glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 50% 90%, #B8772F 0%, transparent 70%)',
          }}
        />

        {/* SVG Dial Arc and Ticks */}
        <svg
          viewBox="0 0 120 90"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main outer scale arc */}
          <path
            d="M 16 75 A 56 56 0 0 1 104 75"
            fill="none"
            stroke="#6B4630"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />

          {/* Active zone colored arc */}
          <path
            d="M 68 31 A 56 56 0 0 1 104 75"
            fill="none"
            stroke="#B8772F"
            strokeWidth="1.8"
          />

          {/* Scale Tick Marks */}
          {[-50, -35, -20, -5, 10, 25, 40, 50].map((deg, i) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const x1 = 60 + 52 * Math.cos(rad);
            const y1 = 78 + 52 * Math.sin(rad);
            const x2 = 60 + 58 * Math.cos(rad);
            const y2 = 78 + 58 * Math.sin(rad);
            const isRedZone = deg >= 25;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isRedZone ? '#B8772F' : '#6B4630'}
                strokeWidth={deg % 25 === 0 ? '1.5' : '0.9'}
              />
            );
          })}

          {/* Scale Labels */}
          <text x="18" y="84" fill="#6B4630" fontSize="5.5" fontFamily="JetBrains Mono">
            0
          </text>
          <text x="56" y="26" fill="#D2AE82" fontSize="5.5" fontFamily="JetBrains Mono">
            50
          </text>
          <text x="96" y="84" fill="#B8772F" fontSize="5.5" fontFamily="JetBrains Mono">
            100
          </text>

          {/* Center Brand Text inside Dial */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            fill="#6B4630"
            fontSize="4.5"
            fontFamily="JetBrains Mono"
            letterSpacing="0.1em"
          >
            WESTON TYPE 301
          </text>

          {/* Pivoting Needle */}
          <g transform={`rotate(${angle} 60 78)`} style={{ transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <line
              x1="60"
              y1="78"
              x2="60"
              y2="28"
              stroke="#B8772F"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="78"
              x2="60"
              y2="83"
              stroke="#6B4630"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Brass Pivot Cap */}
          <circle cx="60" cy="78" r="4.5" fill="#3A2619" stroke="#B8772F" strokeWidth="1" />
          <circle cx="60" cy="78" r="1.8" fill="#B8772F" />
        </svg>

        {/* Small Corner Crop Brackets */}
        <span className="absolute top-1 left-1 font-mono text-[7px] text-mocha">+</span>
        <span className="absolute top-1 right-1 font-mono text-[7px] text-mocha">+</span>
      </div>

      {/* Numerical Readout & Label */}
      <div className="pt-2 text-center space-y-0.5">
        <span className="font-mono text-[10px] text-mocha uppercase tracking-wider block">
          {label}
        </span>
        <div className="font-mono text-base font-bold text-foam">
          <span className="text-caramel">{clamped.toFixed(1)}</span>
          <span className="text-xs text-latte font-normal ml-0.5">{unit}</span>
        </div>
        <span className="font-mono text-[8px] text-mocha tracking-widest block">
          {sublabel}
        </span>
      </div>
    </div>
  );
}
