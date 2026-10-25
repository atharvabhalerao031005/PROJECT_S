import React from 'react';

/**
 * GrainOverlay
 * Full-viewport tactile 35mm film grain filter using SVG feTurbulence
 */
export default function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-[9998] overflow-hidden"
      style={{ opacity: 0.055 }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="warm-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="
              0.72 0 0 0 0.11
              0 0.55 0 0 0.08
              0 0 0.42 0 0.06
              0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#warm-grain)" />
      </svg>
    </div>
  );
}
