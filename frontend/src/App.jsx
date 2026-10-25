import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GrainOverlay from './components/GrainOverlay';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import AtelierDialogueGuide from './components/AtelierDialogueGuide';

import HeroSection from './sections/HeroSection';
import StoryPhilosophy from './sections/StoryPhilosophy';
import TheSignalPour from './sections/TheSignalPour';
import LiveTelemetryDesk from './sections/LiveTelemetryDesk';
import EngagementGallery from './sections/EngagementGallery';
import InlineConfigAndLogs from './sections/InlineConfigAndLogs';
import EditorialFooter from './sections/EditorialFooter';

import { useTelemetrySocket } from './hooks/useTelemetrySocket';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const telemetry = useTelemetrySocket();
  const lenisRef = useRef(null);
  const [navTheme, setNavTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [isGuideOpen, setIsGuideOpen] = useState(() => {
    try {
      return localStorage.getItem('atelier_dialogue_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const handleCloseGuide = () => {
    setIsGuideOpen(false);
    try {
      localStorage.setItem('atelier_dialogue_seen', 'true');
    } catch {}
  };

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    // 2. Sync Lenis with GSAP Ticker and ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 3. Dynamic Navbar Theming via ScrollTrigger tracking [data-theme="light"]
    // Uses 64px offset (exact height of the fixed navbar)
    const lightSections = document.querySelectorAll('[data-theme="light"]');
    lightSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 64px',
        end: 'bottom 64px',
        onEnter: () => setNavTheme('light'),
        onLeave: () => setNavTheme('dark'),
        onEnterBack: () => setNavTheme('light'),
        onLeaveBack: () => setNavTheme('dark'),
      });
    });

    // 4. Section active tracking for editorial index links
    const trackedSections = [
      { id: 'hero' },
      { id: 'philosophy' },
      { id: 'the-pour' },
      { id: 'live-desk' },
      { id: 'gallery' },
      { id: 'calibration' },
    ];

    trackedSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      }
    });

    // 5. Scroll-Driven Background Color Shift orchestrations
    const philosophyEl = document.getElementById('philosophy');
    const liveDeskEl = document.getElementById('live-desk');
    const calibrationEl = document.getElementById('calibration');

    // Transitions to Foam on Philosophy
    if (philosophyEl) {
      ScrollTrigger.create({
        trigger: philosophyEl,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          document.body.style.backgroundColor = 'var(--foam)';
          document.body.style.color = 'var(--espresso)';
        },
        onLeaveBack: () => {
          document.body.style.backgroundColor = 'var(--espresso)';
          document.body.style.color = 'var(--foam)';
        },
      });
    }

    // Transitions to Espresso on Live Desk
    if (liveDeskEl) {
      ScrollTrigger.create({
        trigger: liveDeskEl,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          document.body.style.backgroundColor = 'var(--espresso)';
          document.body.style.color = 'var(--foam)';
        },
        onLeaveBack: () => {
          document.body.style.backgroundColor = 'var(--roast)';
          document.body.style.color = 'var(--foam)';
        },
      });
    }

    // Transitions to Foam on Calibration
    if (calibrationEl) {
      ScrollTrigger.create({
        trigger: calibrationEl,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          document.body.style.backgroundColor = 'var(--foam)';
          document.body.style.color = 'var(--espresso)';
        },
        onLeaveBack: () => {
          document.body.style.backgroundColor = 'var(--espresso)';
          document.body.style.color = 'var(--foam)';
        },
      });
    }

    // 6. Debounced ScrollTrigger refresh on window resize & zoom (visualViewport support)
    let resizeTimer;
    const handleResizeOrZoom = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    };

    window.addEventListener('resize', handleResizeOrZoom);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResizeOrZoom);
    }

    return () => {
      window.removeEventListener('resize', handleResizeOrZoom);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResizeOrZoom);
      }
      clearTimeout(resizeTimer);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-espresso text-foam selection:bg-caramel selection:text-espresso">
      {/* Tactile 35mm Film Grain SVG Overlay */}
      <GrainOverlay />

      {/* Editorial Caramel Dot & Lagging Ring Cursor */}
      <CustomCursor />

      {/* Dynamic Theme Synchronized Navbar */}
      <Navbar
        navTheme={navTheme}
        activeSection={activeSection}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Flow */}
      <main className="relative w-full">
        {/* Section 1: Hero with 6-Layer Parallax */}
        <HeroSection
          onStartSession={telemetry.startHardwareStream}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Section 2: Pinned Italic Manifesto & Rotating Stamp */}
        <StoryPhilosophy />

        {/* Section 3: 300vh Pinned Multimodal Pipeline ("The Pour") */}
        <TheSignalPour />

        {/* Section 4: Live Telemetry Desk (Webcam + Simulation + Ledger + Agent) */}
        <LiveTelemetryDesk telemetry={telemetry} />

        {/* Section 5: Horizontal Pinned Collage of Session Trends */}
        <EngagementGallery />

        {/* Section 6: Typographic Timetable + Inline Calibration + SVG Campus Map */}
        <InlineConfigAndLogs />

        {/* Section 7: Editorial Footer with Cropped Wordmark & Rising Steam */}
        <EditorialFooter onOpenGuide={() => setIsGuideOpen(true)} />
      </main>

      {/* Floating Bespoke Atelier Concierge Dialogue Guide */}
      <AtelierDialogueGuide
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
        onOpen={() => setIsGuideOpen(true)}
      />
    </div>
  );
}
