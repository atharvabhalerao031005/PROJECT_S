import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;

      if (currentY > 120 && currentY > prevY) {
        // Scrolling down -> hide
        gsap.to(nav, { yPercent: -100, duration: 0.35, ease: 'power2.out' });
      } else {
        // Scrolling up -> reveal
        gsap.to(nav, { yPercent: 0, duration: 0.35, ease: 'power2.out' });
      }
      prevY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 border-b border-roast/50 bg-espresso/85 backdrop-blur-md select-none"
      style={{ borderBottomColor: 'var(--roast)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: Serif Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="group flex items-center space-x-3 text-foam no-underline cursor-pointer"
        >
          <span className="font-display text-lg tracking-tight font-medium group-hover:text-caramel transition-colors duration-200">
            ATELIER // PRESENCE
          </span>
          <span className="w-2 h-2 rounded-full bg-caramel inline-block animate-incandescent" />
        </a>

        {/* Right: Quiet Editorial Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('philosophy')}
            className="micro-label tracking-micro hover:text-caramel transition-colors text-latte bg-transparent border-0 cursor-pointer"
          >
            01. Philosophy
          </button>
          <button
            onClick={() => scrollToSection('the-pour')}
            className="micro-label tracking-micro hover:text-caramel transition-colors text-latte bg-transparent border-0 cursor-pointer"
          >
            02. The Pour
          </button>
          <button
            onClick={() => scrollToSection('live-desk')}
            className="micro-label tracking-micro hover:text-caramel transition-colors text-latte bg-transparent border-0 cursor-pointer"
          >
            03. Live Desk
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="micro-label tracking-micro hover:text-caramel transition-colors text-latte bg-transparent border-0 cursor-pointer"
          >
            04. Dynamics
          </button>
          <button
            onClick={() => scrollToSection('calibration')}
            className="micro-label tracking-micro hover:text-caramel transition-colors text-latte bg-transparent border-0 cursor-pointer"
          >
            05. Calibration
          </button>

          {/* Underlined Start Session CTA */}
          <button
            onClick={() => scrollToSection('live-desk')}
            className="font-mono text-xs text-caramel tracking-wider uppercase border-b border-caramel pb-0.5 hover:text-foam hover:border-foam transition-colors bg-transparent cursor-pointer font-medium"
          >
            Start Session →
          </button>
        </nav>
      </div>
    </header>
  );
}
