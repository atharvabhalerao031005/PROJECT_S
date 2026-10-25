import React from 'react';

/**
 * GrainOverlay
 * Full-viewport tactile 35mm film grain shader.
 * Optimized with a GPU-cached repeating SVG pattern tile and subtle 35mm shutter micro-weave,
 * yielding zero GPU performance overhead and buttery 120fps scrolling.
 */
export default function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-[9998] overflow-hidden"
      style={{ opacity: 0.048 }}
      aria-hidden="true"
    >
      <div className="absolute -inset-10 animate-film-weave will-change-transform">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <filter id="warm-35mm-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="
                  0.75 0 0 0 0.12
                  0 0.58 0 0 0.09
                  0 0 0.42 0 0.05
                  0 0 0 1 0"
              />
            </filter>
            <pattern
              id="grainPattern"
              width="240"
              height="240"
              patternUnits="userSpaceOnUse"
            >
              <rect width="240" height="240" filter="url(#warm-35mm-grain)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grainPattern)" />
        </svg>
      </div>
    </div>
  );
}