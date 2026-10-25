import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor
 * Hyper-responsive tactile editorial drafting reticle:
 * - 0ms instant center pinpoint dot (true hardware mouse tracking, zero float)
 * - Snappy 100ms spring-damped outer drafting ring
 * - Architectural CAD drafting coordinates (X/Y) with live interactive state labels
 * - Magnetic snap & morph on interactive elements
 * - Tactile mousedown contract & release impulse
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const coordsRef = useRef(null);
  const [coordsText, setCoordsText] = useState('');

  useEffect(() => {
    // Only activate for non-touch fine pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const coords = coordsRef.current;
    if (!dot || !ring) return;

    // Fast spring damper for outer ring
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.10, ease: 'power2.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.10, ease: 'power2.out' });
    const coordsX = coords ? gsap.quickTo(coords, 'x', { duration: 0.12, ease: 'power2.out' }) : null;
    const coordsY = coords ? gsap.quickTo(coords, 'y', { duration: 0.12, ease: 'power2.out' }) : null;

    let isHoveringInteractive = false;
    let isMouseDown = false;
    let animFrame = null;

    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // 1. INSTANT 0ms ZERO-LAG TRACKING FOR CENTER DOT (NO INTERPOLATION)
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // 2. Snappy spring tracking for outer ring
      const target = e.target;
      const isLightSection = Boolean(
        target.closest('[data-theme="light"]') || 
        target.closest('[data-nav-theme="light"]') ||
        target.closest('#philosophy') ||
        target.closest('#calibration')
      );

      const interactiveEl = target.closest(
        'a, button, input, select, [role="button"], .interactive-hover, [data-magnetic], .cursor-pointer'
      );

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Subtle magnetic attraction (25% bias toward center of button)
        const snapX = mouseX + (centerX - mouseX) * 0.28;
        const snapY = mouseY + (centerY - mouseY) * 0.28;

        ringX(snapX);
        ringY(snapY);
        if (coordsX && coordsY) {
          coordsX(snapX + 20);
          coordsY(snapY + 16);
        }

        if (!isHoveringInteractive) {
          isHoveringInteractive = true;
          gsap.to(ring, {
            scale: 1.65,
            borderColor: 'var(--caramel)',
            backgroundColor: isLightSection ? 'rgba(184, 119, 47, 0.14)' : 'rgba(184, 119, 47, 0.10)',
            boxShadow: '0 0 16px rgba(184, 119, 47, 0.35)',
            duration: 0.18,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 0.6,
            backgroundColor: isLightSection ? 'var(--espresso)' : 'var(--foam)',
            duration: 0.15,
          });
          if (coords) {
            setCoordsText('[SNAP]');
            gsap.to(coords, { opacity: 0.9, duration: 0.15 });
          }
        }
      } else {
        ringX(mouseX);
        ringY(mouseY);
        if (coordsX && coordsY) {
          coordsX(mouseX + 16);
          coordsY(mouseY + 14);
        }

        if (isHoveringInteractive) {
          isHoveringInteractive = false;
          gsap.to(ring, {
            scale: 1.0,
            borderColor: isLightSection ? 'var(--mocha)' : 'var(--latte)',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            duration: 0.2,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 1.0,
            backgroundColor: 'var(--caramel)',
            duration: 0.15,
          });
          if (coords) {
            setCoordsText(`${Math.round(mouseX)},${Math.round(mouseY)}`);
            gsap.to(coords, { opacity: 0.45, duration: 0.2 });
          }
        } else {
          // Throttled coordinate display
          if (coords && Math.random() < 0.25) {
            setCoordsText(`${Math.round(mouseX)},${Math.round(mouseY)}`);
          }
        }
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      gsap.to(ring, { scale: 0.78, duration: 0.1, ease: 'power2.out' });
      gsap.to(dot, { scale: 1.7, duration: 0.1, ease: 'power2.out' });
    };

    const onMouseUp = (e) => {
      isMouseDown = false;
      const target = e.target;
      const isInteractive = Boolean(
        target.closest('a, button, input, select, [role="button"], .interactive-hover, [data-magnetic], .cursor-pointer')
      );
      gsap.to(ring, {
        scale: isInteractive ? 1.65 : 1.0,
        duration: 0.18,
        ease: 'back.out(2)',
      });
      gsap.to(dot, {
        scale: isInteractive ? 0.6 : 1.0,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const onMouseLeaveDoc = () => {
      gsap.to([dot, ring, coords], { opacity: 0, duration: 0.18 });
    };

    const onMouseEnterDoc = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.18 });
      if (coords) gsap.to(coords, { opacity: 0.45, duration: 0.18 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeaveDoc);
    document.documentElement.addEventListener('mouseenter', onMouseEnterDoc);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeaveDoc);
      document.documentElement.removeEventListener('mouseenter', onMouseEnterDoc);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      {/* 0ms INSTANT Hardware Pointer Dot (NO CSS transition-transform!) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{
          backgroundColor: 'var(--caramel)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 4px rgba(184, 119, 47, 0.6)',
        }}
      />

      {/* Snappy Spring Drafting Reticle Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform"
        style={{ borderColor: 'var(--latte)', opacity: 0.85 }}
      >
        {/* Cardinal Micro-ticks for authentic drafting aesthetic */}
        <span className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[1px] h-[3px] bg-caramel/70" />
        <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[1px] h-[3px] bg-caramel/70" />
        <span className="absolute left-[-3px] top-1/2 -translate-y-1/2 h-[1px] w-[3px] bg-caramel/70" />
        <span className="absolute right-[-3px] top-1/2 -translate-y-1/2 h-[1px] w-[3px] bg-caramel/70" />
      </div>

      {/* Tiny Precision Drafting Coordinates Tag */}
      <div
        ref={coordsRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block font-mono text-[8px] tracking-wider text-caramel uppercase opacity-40 select-none will-change-transform"
      >
        {coordsText}
      </div>
    </>
  );
}
