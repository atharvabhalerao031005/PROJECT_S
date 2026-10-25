import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor
 * Tactile caramel dot with dual-layer lagging outer reticle ring,
 * precision architectural drafting crosshairs, and springy magnetic button snap.
 * Adapts dynamically between deep espresso (#1C1310) and warm foam paper (#F7F0E3).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const reticleRef = useRef(null);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const reticle = reticleRef.current;
    if (!dot || !ring) return;

    // Instant tracking for primary center pinpoint dot (snappy 40ms)
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.04, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.04, ease: 'power2.out' });

    // Smooth lagging tracking for outer editorial ring (layer 1)
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' });

    // Secondary lag for reticle drafting brackets (layer 2)
    const reticleX = reticle ? gsap.quickTo(reticle, 'x', { duration: 0.35, ease: 'power4.out' }) : null;
    const reticleY = reticle ? gsap.quickTo(reticle, 'y', { duration: 0.35, ease: 'power4.out' }) : null;

    let isHoveringInteractive = false;
    let magneticTarget = null;
    let isMouseDown = false;

    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      dotX(mouseX);
      dotY(mouseY);

      // Check if hovering over clickable / interactive element
      const target = e.target;
      const isLightSection = Boolean(target.closest('[data-theme="light"]') || target.closest('[data-nav-theme="light"]'));

      const interactiveEl = target.closest(
        'a, button, input, select, [role="button"], .interactive-hover, [data-magnetic]'
      );

      if (interactiveEl) {
        magneticTarget = interactiveEl;
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Magnetic Attraction: gently bias ring toward center of interactive target
        const magneticStrength = 0.42;
        const snapX = mouseX + (centerX - mouseX) * magneticStrength;
        const snapY = mouseY + (centerY - mouseY) * magneticStrength;

        ringX(snapX);
        ringY(snapY);

        if (reticleX && reticleY) {
          reticleX(snapX);
          reticleY(snapY);
        }

        if (!isHoveringInteractive) {
          isHoveringInteractive = true;
          gsap.to(ring, {
            scale: 1.85,
            borderColor: 'var(--caramel)',
            backgroundColor: isLightSection ? 'rgba(184, 119, 47, 0.12)' : 'rgba(184, 119, 47, 0.1)',
            boxShadow: '0 0 12px rgba(184, 119, 47, 0.25)',
            duration: 0.25,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 0.45,
            backgroundColor: isLightSection ? 'var(--espresso)' : 'var(--foam)',
            duration: 0.2,
          });
          if (reticle) {
            gsap.to(reticle, {
              opacity: 0.9,
              scale: 1.15,
              rotation: 45,
              duration: 0.3,
              ease: 'back.out(1.7)',
            });
          }
        }
      } else {
        magneticTarget = null;
        ringX(mouseX);
        ringY(mouseY);
        if (reticleX && reticleY) {
          reticleX(mouseX);
          reticleY(mouseY);
        }

        if (isHoveringInteractive) {
          isHoveringInteractive = false;
          gsap.to(ring, {
            scale: 1.0,
            borderColor: isLightSection ? 'var(--mocha)' : 'var(--latte)',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            duration: 0.28,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 1.0,
            backgroundColor: 'var(--caramel)',
            duration: 0.2,
          });
          if (reticle) {
            gsap.to(reticle, {
              opacity: 0,
              scale: 0.8,
              rotation: 0,
              duration: 0.25,
              ease: 'power2.in',
            });
          }
        }
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      gsap.to(ring, { scale: 0.85, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { scale: 1.5, duration: 0.15, ease: 'power2.out' });
    };

    const onMouseUp = (e) => {
      isMouseDown = false;
      const target = e.target;
      const isInteractive = Boolean(
        target.closest('a, button, input, select, [role="button"], .interactive-hover, [data-magnetic]')
      );
      gsap.to(ring, {
        scale: isInteractive ? 1.85 : 1.0,
        duration: 0.2,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        scale: isInteractive ? 0.45 : 1.0,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const onMouseLeaveDoc = () => {
      gsap.to([dot, ring, reticle], { opacity: 0, duration: 0.25 });
    };

    const onMouseEnterDoc = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
    };

    window.addEventListener('mousemove', onMouseMove);
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
    };
  }, []);

  return (
    <>
      {/* Central Snappy Caramel Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block transition-transform will-change-transform"
        style={{ backgroundColor: 'var(--caramel)' }}
      />

      {/* Lagging Tactile Outer Ring with Magnetic Halo */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform"
        style={{ borderColor: 'var(--latte)' }}
      />

      {/* Drafting Reticle Crosshairs with Micro-Ticks (Active on Interactive Hover) */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 w-14 h-14 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center opacity-0 will-change-transform"
      >
        {/* 4 Cardinal Drafting Crosshair Marks */}
        <span className="absolute top-0 text-[9px] font-mono text-caramel leading-none font-bold select-none">+</span>
        <span className="absolute bottom-0 text-[9px] font-mono text-caramel leading-none font-bold select-none">+</span>
        <span className="absolute left-0 text-[9px] font-mono text-caramel leading-none font-bold select-none">+</span>
        <span className="absolute right-0 text-[9px] font-mono text-caramel leading-none font-bold select-none">+</span>

        {/* Subtle Inner Drafting Dashed Circle */}
        <div className="w-10 h-10 rounded-full border border-dashed border-caramel/40" />
      </div>
    </>
  );
}
