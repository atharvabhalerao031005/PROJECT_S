import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar({ navTheme: propTheme, activeSection: propActiveSection }) {
  const navRef = useRef(null);
  const [internalTheme, setInternalTheme] = useState('dark');
  const [internalActiveSection, setInternalActiveSection] = useState('hero');

  // Pinned state: true = always sticky and visible; false = smart auto-hide with instant top-mouse reveal
  const [isPinned, setIsPinned] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_nav_pinned');
      return saved !== null ? saved === 'true' : true; // Default to TRUE (always sticky!)
    } catch {
      return true;
    }
  });

  const isPinnedRef = useRef(isPinned);
  const isHoveredRef = useRef(false);
  const isNearTopRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);

  // Prop takes precedence if provided, fallback to internal detection
  const currentTheme = propTheme || internalTheme;
  const currentActiveSection = propActiveSection || internalActiveSection;
  const isLight = currentTheme === 'light';

  const showNavbar = useCallback(() => {
    if (!navRef.current) return;
    isHiddenRef.current = false;
    gsap.to(navRef.current, {
      yPercent: 0,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const hideNavbar = useCallback(() => {
    if (!navRef.current) return;
    // Strictly guard against hiding if pinned, hovered, or cursor is near top
    if (isPinnedRef.current || isHoveredRef.current || isNearTopRef.current) return;
    if (window.scrollY < 100) return;

    isHiddenRef.current = true;
    gsap.to(navRef.current, {
      yPercent: -100,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  // Update pinned state and persist
  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      isPinnedRef.current = next;
      try {
        localStorage.setItem('atelier_nav_pinned', String(next));
      } catch {}
      if (next) {
        showNavbar();
      }
      return next;
    });
  };

  useEffect(() => {
    isPinnedRef.current = isPinned;
    if (isPinned) {
      showNavbar();
    }
  }, [isPinned, showNavbar]);

  // Global mouse position tracker: detects when cursor moves to top 75px of the viewport
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY <= 75) {
        isNearTopRef.current = true;
        showNavbar();
      } else {
        isNearTopRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showNavbar]);

  // Scroll listener with hysteresis and pinned check
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const prevY = lastScrollYRef.current;
      const delta = currentY - prevY;

      // 1. If at or near top of page, always show
      if (currentY <= 80) {
        showNavbar();
      }
      // 2. If pinned, never hide
      else if (isPinnedRef.current) {
        showNavbar();
      }
      // 3. If scrolling UP by more than 8px, show immediately
      else if (delta < -8) {
        showNavbar();
      }
      // 4. If scrolling DOWN and not hovering or near top, hide
      else if (delta > 20 && currentY > 140 && !isHoveredRef.current && !isNearTopRef.current) {
        hideNavbar();
      }

      lastScrollYRef.current = currentY;

      // Internal fallback theme detection if parent props not passed
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNavbar, hideNavbar, propTheme]);

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
    <>
      {/* Invisible 12px sensor zone at absolute top of viewport:
          Guarantees moving the cursor to the top edge immediately drops the navbar into view */}
      <div
        className="fixed top-0 left-0 right-0 h-3 z-40 pointer-events-auto"
        onMouseEnter={() => {
          isNearTopRef.current = true;
          showNavbar();
        }}
      />

      <header
        ref={navRef}
        data-nav-theme={isLight ? 'light' : 'dark'}
        onMouseEnter={() => {
          isHoveredRef.current = true;
          showNavbar();
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b select-none ${
          isLight
            ? 'bg-[#F7F0E3]/94 border-[#6B4630]/25 text-espresso shadow-[0_4px_24px_-2px_rgba(58,38,25,0.08)] backdrop-blur-md'
            : 'bg-[#1C1310]/92 border-[#3A2619]/60 text-foam backdrop-blur-md'
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

          {/* Right: Editorial Links + Controls with Dynamic Contrast */}
          <nav className="hidden md:flex items-center space-x-6">
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

            {/* Tactile Sticky Pin Toggle */}
            <button
              onClick={togglePin}
              title={
                isPinned
                  ? 'Navbar is pinned sticky (always visible). Click to enable auto-hide mode.'
                  : 'Navbar auto-hides on scroll down. Click to pin permanently.'
              }
              className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-all cursor-pointer flex items-center space-x-1.5 ${
                isPinned
                  ? isLight
                    ? 'border-caramel/60 text-caramel bg-caramel/10 shadow-sm'
                    : 'border-caramel/60 text-caramel bg-caramel/15 shadow-sm'
                  : isLight
                  ? 'border-mocha/25 text-mocha/60 hover:text-roast hover:border-mocha/50'
                  : 'border-mocha/40 text-mocha hover:text-latte hover:border-mocha/70'
              }`}
            >
              <svg
                className={`w-2.5 h-2.5 ${isPinned ? 'text-caramel' : 'opacity-40'}`}
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <circle cx="6" cy="3" r="2.5" />
                <rect x="5.25" y="4.5" width="1.5" height="6.5" rx="0.5" />
              </svg>
              <span>{isPinned ? 'STICKY' : 'AUTO-HIDE'}</span>
            </button>
          </nav>

          {/* Mobile View Compact Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={togglePin}
              className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 border transition-colors ${
                isPinned
                  ? 'border-caramel text-caramel bg-caramel/10'
                  : isLight
                  ? 'border-mocha/30 text-mocha/70'
                  : 'border-mocha/50 text-mocha'
              }`}
            >
              {isPinned ? 'STICKY' : 'HIDE'}
            </button>
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
    </>
  );
}
