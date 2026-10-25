import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar({ navTheme: propTheme, activeSection: propActiveSection }) {
  const navRef = useRef(null);
  const [internalTheme, setInternalTheme] = useState('dark');
  const [internalActiveSection, setInternalActiveSection] = useState('hero');

  // Prop takes precedence if provided, fallback to internal detection
  const currentTheme = propTheme || internalTheme;
  const currentActiveSection = propActiveSection || internalActiveSection;
  const isLight = currentTheme === 'light';

  useEffect(() => {
    let prevY = window.scrollY;

    const checkActiveSectionAndTheme = () => {
      const currentY = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;

      // 1. Hide on scroll down, reveal on scroll up
      if (currentY > 120 && currentY > prevY) {
        gsap.to(nav, { yPercent: -100, duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(nav, { yPercent: 0, duration: 0.35, ease: 'power2.out' });
      }
      prevY = currentY;

      // 2. Failsafe intersection detection if props aren't driven by parent ScrollTrigger
      if (!propTheme) {
        const navHeight = 64;
        const sections = [
          { id: 'hero', theme: 'dark' },
          { id: 'philosophy', theme: 'light' },
          { id: 'the-pour', theme: 'dark' },
          { id: 'live-desk', theme: 'dark' },
          { id: 'gallery', theme: 'dark' },
          { id: 'calibration', theme: 'light' },
        ];

        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= navHeight && rect.bottom > navHeight) {
              setInternalActiveSection(s.id);
              setInternalTheme(s.theme);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', checkActiveSectionAndTheme, { passive: true });
    checkActiveSectionAndTheme();

    return () => window.removeEventListener('scroll', checkActiveSectionAndTheme);
  }, [propTheme]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'philosophy', label: '01. Philosophy' },
    { id: 'the-pour', label: '02. The Pour' },
    { id: 'live-desk', label: '03. Live Desk' },
    { id: 'gallery', label: '04. Dynamics' },
    { id: 'calibration', label: '05. Calibration' },
  ];

  return (
    <header
      ref={navRef}
      data-nav-theme={isLight ? 'light' : 'dark'}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b select-none ${
        isLight
          ? 'bg-[#F7F0E3]/92 border-[#6B4630]/25 text-espresso shadow-[0_4px_24px_-2px_rgba(58,38,25,0.08)] backdrop-blur-md'
          : 'bg-[#1C1310]/88 border-[#3A2619]/60 text-foam backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: Serif Wordmark with dynamic contrast */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className={`group flex items-center space-x-3 no-underline cursor-pointer transition-colors duration-200 ${
            isLight ? 'text-espresso' : 'text-foam'
          }`}
        >
          <span className="font-display text-lg tracking-tight font-medium group-hover:text-caramel transition-colors duration-200">
            ATELIER // PRESENCE
          </span>
          <span className="w-2 h-2 rounded-full bg-caramel inline-block animate-incandescent" />
        </a>

        {/* Right: Editorial Links with Dynamic Contrast */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.map((item) => {
            const isActive = currentActiveSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-mono text-xs tracking-micro transition-colors cursor-pointer bg-transparent border-0 py-1 ${
                  isActive
                    ? 'text-caramel font-semibold border-b border-caramel'
                    : isLight
                    ? 'text-roast/80 hover:text-caramel font-medium'
                    : 'text-latte/80 hover:text-caramel font-normal'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Start Session CTA Button */}
          <button
            onClick={() => scrollToSection('live-desk')}
            className={`font-mono text-xs tracking-wider uppercase border-b pb-0.5 transition-all bg-transparent cursor-pointer font-semibold ${
              isLight
                ? 'text-caramel border-caramel hover:text-espresso hover:border-espresso'
                : 'text-caramel border-caramel hover:text-foam hover:border-foam'
            }`}
          >
            Start Session →
          </button>
        </nav>

        {/* Mobile View Compact Quick CTA */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            onClick={() => scrollToSection('live-desk')}
            className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1 border transition-colors ${
              isLight
                ? 'border-caramel text-caramel bg-caramel/10'
                : 'border-caramel text-caramel bg-espresso/80'
            }`}
          >
            Session →
          </button>
        </div>
      </div>
    </header>
  );
}
