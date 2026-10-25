import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor
 * Tactile caramel dot with dual-layer lagging outer reticle ring and magnetic interactive physics.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reticleRef = useRef(null);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const reticle = reticleRef.current;
    if (!dot || !ring) return;

    // Instant tracking for primary center dot
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    // Smooth lagging tracking for outer editorial ring (layer 1)
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power3.out' });

    // Secondary lag for reticle brackets (layer 2)
    const reticleX = reticle ? gsap.quickTo(reticle, 'x', { duration: 0.45, ease: 'power4.out' }) : null;
    const reticleY = reticle ? gsap.quickTo(reticle, 'y', { duration: 0.45, ease: 'power4.out' }) : null;

    let isHoveringInteractive = false;

    const onMouseMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (reticleX && reticleY) {
        reticleX(e.clientX);
        reticleY(e.clientY);
      }

      // Check if hovering over clickable element
      const target = e.target;
      const isInteractive = Boolean(
        target.closest('a, button, input, select, [role="button"], .interactive-hover')
      );

      if (isInteractive && !isHoveringInteractive) {
        isHoveringInteractive = true;
        gsap.to(ring, {
          scale: 1.85,
          borderColor: 'var(--caramel)',
          backgroundColor: 'rgba(184, 119, 47, 0.09)',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0.45, backgroundColor: 'var(--foam)', duration: 0.2 });
        if (reticle) gsap.to(reticle, { opacity: 0.8, scale: 1.2, duration: 0.3 });
      } else if (!isInteractive && isHoveringInteractive) {
        isHoveringInteractive = false;
        gsap.to(ring, {
          scale: 1.0,
          borderColor: 'var(--latte)',
          backgroundColor: 'transparent',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 1.0, backgroundColor: 'var(--caramel)', duration: 0.2 });
        if (reticle) gsap.to(reticle, { opacity: 0, scale: 0.8, duration: 0.25 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Central Caramel Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ backgroundColor: 'var(--caramel)' }}
      />
      {/* Lagging Tactile Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 hidden md:block"
        style={{ borderColor: 'var(--latte)' }}
      />
      {/* Reticle Micro-Ticks (Active on Interactive Hover) */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center opacity-0"
      >
        <span className="absolute top-0 text-[8px] font-mono text-caramel leading-none">+</span>
        <span className="absolute bottom-0 text-[8px] font-mono text-caramel leading-none">+</span>
        <span className="absolute left-0 text-[8px] font-mono text-caramel leading-none">+</span>
        <span className="absolute right-0 text-[8px] font-mono text-caramel leading-none">+</span>
      </div>
    </>
  );
}
