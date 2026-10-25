import React from 'react';

/**
 * StudioSparkline
 * Precise archival polyline graph with grid coordinates, min/max limits,
 * and warm caramel gradient fill for engagement trajectory.
 */
export default function StudioSparkline({
  data = [75, 78, 82, 80, 84, 82],
  min = 40,
  max = 100,
  height = 64,
  label = 'COGNITIVE TRAJECTORY',
  currentScore = 81.5,
}) {
  const points = data.length > 1 ? data : [70, 75, 78, 82];

  const svgPoints = points
    .map((val, i) => {
      const x = (i / (points.length - 1)) * 100;
      const normalized = Math.min(1, Math.max(0, (val - min) / (max - min)));
      const y = 40 - normalized * 34; // 3 to 37 range
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastPoint = points[points.length - 1];
  const lastY = (40 - Math.min(1, Math.max(0, (lastPoint - min) / (max - min))) * 34).toFixed(1);

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between font-mono text-[10px] text-mocha">
        <span className="tracking-wider">{label}</span>
        <span className="text-caramel font-semibold">
          {currentScore ? `${currentScore.toFixed(1)} / 100` : 'STEADY'}
        </span>
      </div>

      <div
        className="relative border border-mocha/40 bg-roast/20 p-2 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Subtle Horizontal Guide Lines */}
        <div className="absolute inset-0 px-2 py-1 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-mocha w-full" />
          <div className="border-b border-mocha/50 w-full" />
          <div className="border-b border-mocha w-full" />
        </div>

        {/* Min/Max indicators */}
        <span className="absolute top-1 left-2 font-mono text-[8px] text-mocha/70">100</span>
        <span className="absolute bottom-1 left-2 font-mono text-[8px] text-mocha/70">0</span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8772F" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#B8772F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <polygon
            points={`0,40 ${svgPoints} 100,40`}
            fill="url(#sparklineGrad)"
          />

          {/* Main Stroke */}
          <polyline
            fill="none"
            stroke="#B8772F"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={svgPoints}
          />

          {/* Pulsing Endpoint Indicator */}
          <circle
            cx="100"
            cy={lastY}
            r="2.5"
            fill="#B8772F"
            stroke="#1C1310"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between font-mono text-[9px] text-mocha">
        <span>T - 15 MIN</span>
        <span className="text-latte">ROLLING ATELIER SAMPLE</span>
        <span>NOW</span>
      </div>
    </div>
  );
}
