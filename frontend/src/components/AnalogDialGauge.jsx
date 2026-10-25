import React, { useEffect, useRef, useState } from 'react';

/**
 * AnalogDialGauge
 * Precision laboratory D'Arsonval / Weston Type 301 galvanometer meter.
 * Features:
 * - Second-order damped harmonic spring-mass physics with authentic magnetic damping & subtle mechanical micro-inertia
 * - Anti-parallax mirrored scale strip (eliminates visual parallax error like genuine laboratory instruments)
 * - Directional needle drop shadow cast onto dial face
 * - Counterbalanced needle with knife-edge tip and balance spade tail
 * - Slotted brass zero-adjust screw & curved crystal bezel reflection
 */
export default function AnalogDialGauge({
  value = 84.2,
  min = 0,
  max = 100,
  label = 'GAZE EQUILIBRIUM',
  unit = '%',
  sublabel = 'VISUAL ATTENTION INDEX',
  size = 145,
}) {
  const clamped = Math.min(max, Math.max(min, value));
  const normalized = (clamped - min) / (max - min);

  // Target angle: -50 degrees (left) to +50 degrees (right)
  const targetAngle = -50 + normalized * 100;

  // Galvanometer needle physics state (damping ratio ~0.72, resonant angular frequency)
  const [currentAngle, setCurrentAngle] = useState(targetAngle);
  const physicsRef = useRef({
    angle: targetAngle,
    velocity: 0,
    target: targetAngle,
  });

  const rafRef = useRef(null);

  useEffect(() => {
    physicsRef.current.target = targetAngle;
  }, [targetAngle]);

  useEffect(() => {
    let lastTime = performance.now();

    const updateNeedlePhysics = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = time;

      const p = physicsRef.current;
      
      // Galvanometer D'Arsonval spring constant & electromagnetic Eddy current damping
      const springK = 95.0; // Spring return stiffness
      const dampingC = 13.5; // Magnetic damping coefficient

      const displacement = p.target - p.angle;
      const springForce = springK * displacement;
      const dampingForce = -dampingC * p.velocity;
      const acceleration = springForce + dampingForce;

      p.velocity += acceleration * dt;
      p.angle += p.velocity * dt;

      // Subtle mechanical micro-jitter (Brownian motion & desk vibration)
      const microJitter = (Math.random() - 0.5) * 0.08;

      setCurrentAngle(p.angle + microJitter);

      rafRef.current = requestAnimationFrame(updateNeedlePhysics);
    };

    rafRef.current = requestAnimationFrame(updateNeedlePhysics);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none group">
      {/* Laboratory Meter Housing */}
      <div
        className="relative flex items-center justify-center p-3 border border-roast bg-espresso/95 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-caramel/70"
        style={{ width: `${size}px`, height: `${size * 0.8}px` }}
      >
        {/* Subtle vintage parchment backlight glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(ellipse at 50% 95%, #B8772F 0%, #3A2619 45%, transparent 75%)',
          }}
        />

        {/* Meter SVG */}
        <svg
          viewBox="0 0 120 92"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mirror Anti-Parallax Ribbon Gradient */}
            <linearGradient id="mirrorStripGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2A1B14" />
              <stop offset="25%" stopColor="#8C6239" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FAF5EC" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#8C6239" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2A1B14" />
            </linearGradient>

            {/* Convex Crystal Glare Reflection */}
            <linearGradient id="crystalGlare" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Brass Pivot Cap Gradient */}
            <radialGradient id="brassPivot" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FAF5EC" />
              <stop offset="40%" stopColor="#D2AE82" />
              <stop offset="85%" stopColor="#6B4630" />
              <stop offset="100%" stopColor="#281A12" />
            </radialGradient>
          </defs>

          {/* Dial Face Textured Plate */}
          <path
            d="M 12 78 A 58 58 0 0 1 108 78 L 108 85 L 12 85 Z"
            fill="#231713"
            opacity="0.8"
          />

          {/* Precision Mirror Anti-Parallax Strip (Used to eliminate reading parallax) */}
          <path
            d="M 22 75 A 50 50 0 0 1 98 75"
            fill="none"
            stroke="url(#mirrorStripGrad)"
            strokeWidth="3.2"
            opacity="0.45"
          />

          {/* Main outer scale arc */}
          <path
            d="M 16 75 A 56 56 0 0 1 104 75"
            fill="none"
            stroke="#6B4630"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />

          {/* Active zone colored arc (High Attention / Normal Band) */}
          <path
            d="M 68 31 A 56 56 0 0 1 104 75"
            fill="none"
            stroke="#B8772F"
            strokeWidth="1.8"
          />

          {/* Calibrated Scale Tick Marks */}
          {[-50, -42.5, -35, -27.5, -20, -12.5, -5, 2.5, 10, 17.5, 25, 32.5, 40, 45, 50].map((deg, i) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const isMajor = deg % 25 === 0;
            const isMid = deg % 12.5 === 0;
            const tickLen = isMajor ? 6.5 : isMid ? 4.5 : 2.5;

            const x1 = 60 + 52 * Math.cos(rad);
            const y1 = 78 + 52 * Math.sin(rad);
            const x2 = 60 + (52 + tickLen) * Math.cos(rad);
            const y2 = 78 + (52 + tickLen) * Math.sin(rad);
            
            const isRedZone = deg >= 25;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isRedZone ? '#B8772F' : isMajor ? '#D2AE82' : '#6B4630'}
                strokeWidth={isMajor ? '1.4' : '0.8'}
              />
            );
          })}

          {/* Precision Scale Numerical Labels */}
          <text x="17" y="84" fill="#6B4630" fontSize="5.5" fontFamily="JetBrains Mono" fontWeight="500">
            0
          </text>
          <text x="35" y="47" fill="#6B4630" fontSize="5" fontFamily="JetBrains Mono">
            25
          </text>
          <text x="56" y="25" fill="#D2AE82" fontSize="5.5" fontFamily="JetBrains Mono" fontWeight="600">
            50
          </text>
          <text x="80" y="47" fill="#B8772F" fontSize="5" fontFamily="JetBrains Mono">
            75
          </text>
          <text x="96" y="84" fill="#B8772F" fontSize="5.5" fontFamily="JetBrains Mono" fontWeight="600">
            100
          </text>

          {/* Center Brand Text inside Dial */}
          <text
            x="60"
            y="54"
            textAnchor="middle"
            fill="#6B4630"
            fontSize="4.5"
            fontFamily="JetBrains Mono"
            letterSpacing="0.12em"
          >
            WESTON TYPE 301
          </text>
          <text
            x="60"
            y="61"
            textAnchor="middle"
            fill="#523522"
            fontSize="3.8"
            fontFamily="JetBrains Mono"
            letterSpacing="0.08em"
          >
            MOVING COIL // DAMPED
          </text>

          {/* Needle Cast Drop Shadow onto Dial Face */}
          <g transform={`rotate(${currentAngle} 60 78)`} opacity="0.45">
            <line
              x1="61.5"
              y1="79.5"
              x2="61.5"
              y2="28"
              stroke="#100A08"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* Precision Galvanometer Needle Assembly */}
          <g transform={`rotate(${currentAngle} 60 78)`}>
            {/* Knife-Edge Needle Pointer */}
            <line
              x1="60"
              y1="78"
              x2="60"
              y2="26"
              stroke="#B8772F"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            {/* Fine Needle Tip Accent in White/Crema */}
            <line
              x1="60"
              y1="34"
              x2="60"
              y2="26"
              stroke="#FAF5EC"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            {/* Counterweight Tail Spade */}
            <line
              x1="60"
              y1="78"
              x2="60"
              y2="85"
              stroke="#6B4630"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="60" cy="84" r="1.6" fill="#3A2619" stroke="#B8772F" strokeWidth="0.8" />
          </g>

          {/* Jeweled Center Pivot Assembly & Brass Retaining Cap */}
          <circle cx="60" cy="78" r="5.2" fill="#1C1310" stroke="#3A2619" strokeWidth="1" />
          <circle cx="60" cy="78" r="3.8" fill="url(#brassPivot)" stroke="#B8772F" strokeWidth="0.8" />
          {/* Slotted Center Screw Detail */}
          <line x1="58.2" y1="78" x2="61.8" y2="78" stroke="#3A2619" strokeWidth="0.8" strokeLinecap="round" />

          {/* Convex Protective Crystal Glass Reflection Highlight */}
          <path
            d="M 12 18 C 35 10, 85 10, 108 18 C 95 32, 25 32, 12 18 Z"
            fill="url(#crystalGlare)"
          />
        </svg>

        {/* Small Corner Drafting Marks */}
        <span className="absolute top-1 left-1 font-mono text-[7px] text-mocha">+</span>
        <span className="absolute top-1 right-1 font-mono text-[7px] text-mocha">+</span>
        <span className="absolute bottom-1 left-1 font-mono text-[7px] text-mocha">+</span>
        <span className="absolute bottom-1 right-1 font-mono text-[7px] text-mocha">+</span>
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