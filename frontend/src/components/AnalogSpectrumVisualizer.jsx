import React, { useState, useEffect, useRef } from 'react';

const FREQUENCY_BANDS = [
  { label: '32', hz: '32 Hz', name: 'Sub-Bass Room Resonance' },
  { label: '64', hz: '64 Hz', name: 'Low Thump & HVAC Rumble' },
  { label: '125', hz: '125 Hz', name: 'Baritone Fundamental' },
  { label: '250', hz: '250 Hz', name: 'Vocal Body & Chest Tone' },
  { label: '500', hz: '500 Hz', name: 'Vocal Warmth & Room Ambience' },
  { label: '800', hz: '800 Hz', name: 'First Vowel Formant (F1)' },
  { label: '1k', hz: '1.0 kHz', name: 'Ear Canal Sensitivity Center' },
  { label: '1.6k', hz: '1.6 kHz', name: 'Second Vowel Formant (F2)' },
  { label: '2.5k', hz: '2.5 kHz', name: 'Consonant Articulation Band' },
  { label: '4k', hz: '4.0 kHz', name: 'Presence & Syllable Clarity' },
  { label: '6.3k', hz: '6.3 kHz', name: 'Sibilance & Fricatives' },
  { label: '8k', hz: '8.0 kHz', name: 'Breath & Acoustic Openness' },
  { label: '10k', hz: '10.0 kHz', name: 'Studio Air & Crystalline Rim' },
  { label: '12k', hz: '12.0 kHz', name: 'Upper Harmonic Sheen' },
  { label: '14k', hz: '14.0 kHz', name: 'High-Frequency Room Decay' },
  { label: '16k', hz: '16.0 kHz', name: 'Nyquist Acoustic Ceiling' },
];

const TOTAL_SEGMENTS = 14;

export default function AnalogSpectrumVisualizer({
  spectralBins,
  audioDb = -18.4,
  isSpeechActive = false,
  isStreaming = true,
  sourceLabel = '16-BAND PARALLEL NYQUIST FILTER BANK • 16.0 kHz PCM BUFFER • BALLISTIC DAMPED',
}) {
  const [hoveredBand, setHoveredBand] = useState(null);
  const [meterMode, setMeterMode] = useState('VU'); // 'VU' | 'PEAK' | 'TAPE'
  const [animatedBins, setAnimatedBins] = useState(
    Array.from({ length: 16 }, (_, i) => 0.15 + 0.5 * Math.sin((i / 15) * Math.PI))
  );

  // Ballistics state
  const vuAveragedBinsRef = useRef(Array(16).fill(0.15));
  const peakHoldsRef = useRef(Array(16).fill(0.2));
  const peakDecayTimersRef = useRef(Array(16).fill(0));
  const clipOverloadRef = useRef(0); // 0 to 1 brightness of master clip lamp
  const rafRef = useRef(null);

  useEffect(() => {
    let phase = 0;

    const updatePhysics = () => {
      phase += 0.05;

      const hasLiveBins = Array.isArray(spectralBins) && spectralBins.length === 16;
      const rawBins = hasLiveBins
        ? spectralBins
        : Array.from({ length: 16 }, (_, i) => {
            // Natural bell curve centered on voice band (~1kHz, bins 5-8)
            const center = isSpeechActive ? 6.5 : 4.0;
            const dist = Math.abs(i - center);
            const bell = Math.exp(-0.5 * (dist / 2.2) ** 2);
            const wobble =
              Math.sin(phase * 1.6 + i * 0.42) * 0.11 +
              Math.cos(phase * 0.85 - i * 0.28) * 0.07;
            const speechBoost = isSpeechActive ? 0.38 : 0.08;
            return Math.min(
              0.98,
              Math.max(0.05, (bell * 0.65 + speechBoost + wobble) * (isStreaming ? 1.0 : 0.25))
            );
          });

      // Apply Mode Physics:
      // - VU: 300ms ANSI integration ballistics (gentle smoothing, low overshoot)
      // - PEAK: Ultra-fast attack, long hold (~1.2s), logarithmic ballistic gravity fall
      // - TAPE: Soft-clip tape saturation compression curve
      const newVuBins = [...vuAveragedBinsRef.current];
      const newPeaks = [...peakHoldsRef.current];
      const newDecays = [...peakDecayTimersRef.current];
      let hasOverload = false;

      const processedBins = rawBins.map((rawVal, i) => {
        let val = rawVal;

        if (meterMode === 'TAPE') {
          // Warm tape saturation curve: soft non-linear compression
          val = Math.tanh(rawVal * 1.45);
        }

        // VU Ballistics (Integration time constant ~300ms)
        const vuSmoothing = meterMode === 'VU' ? 0.18 : 0.45;
        newVuBins[i] = newVuBins[i] + (val - newVuBins[i]) * vuSmoothing;

        const effectiveVal = meterMode === 'VU' ? newVuBins[i] : val;

        // Check for overload in top 2 segments
        if (effectiveVal > 0.86) hasOverload = true;

        // Peak Hold Ballistics with Logarithmic Fall
        if (effectiveVal >= newPeaks[i]) {
          newPeaks[i] = effectiveVal;
          // Hold peak: longer in PEAK mode (75 frames), shorter in VU mode (25 frames)
          newDecays[i] = meterMode === 'PEAK' ? 75 : 25;
        } else {
          if (newDecays[i] > 0) {
            newDecays[i] -= 1;
          } else {
            // Logarithmic ballistic decay: accelerates downward naturally like physical gravity
            const decayFactor = meterMode === 'PEAK' ? 0.955 : 0.92;
            newPeaks[i] = Math.max(effectiveVal, newPeaks[i] * decayFactor - 0.005);
          }
        }

        return effectiveVal;
      });

      // Master overload indicator incandescent decay
      if (hasOverload) {
        clipOverloadRef.current = 1.0;
      } else {
        clipOverloadRef.current = Math.max(0, clipOverloadRef.current - 0.035);
      }

      vuAveragedBinsRef.current = newVuBins;
      peakHoldsRef.current = newPeaks;
      peakDecayTimersRef.current = newDecays;
      setAnimatedBins(processedBins);

      rafRef.current = requestAnimationFrame(updatePhysics);
    };

    rafRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spectralBins, isSpeechActive, isStreaming, meterMode]);

  const activeBandData = hoveredBand !== null ? FREQUENCY_BANDS[hoveredBand] : null;
  const activeBandValue = hoveredBand !== null ? animatedBins[hoveredBand] : null;
  const activeBandDb = activeBandValue
    ? (-48 + activeBandValue * 51).toFixed(1)
    : (audioDb !== null && audioDb !== undefined ? Number(audioDb).toFixed(1) : '-18.4');

  return (
    <div className="relative border border-roast bg-espresso/95 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl select-none overflow-hidden">
      {/* Acrylic Glass Cover Sheen Glare across the Rack Bridge */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)',
        }}
      />

      {/* Top Console Branding & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-roast/80 pb-3 sm:pb-4 gap-2 sm:gap-3 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
            <span className="font-mono text-xs uppercase tracking-micro text-latte font-medium">
              REVOX A77 // STUDIO ACOUSTIC EQUALIZER
            </span>
            {/* Master Overload Peak Indicator Lamp */}
            <div className="flex items-center space-x-1.5 pl-2 border-l border-mocha/40">
              <span
                className="w-2 h-2 rounded-full transition-all duration-75"
                style={{
                  backgroundColor: clipOverloadRef.current > 0.05 ? '#D94E34' : '#3A2619',
                  boxShadow:
                    clipOverloadRef.current > 0.05
                      ? `0 0 ${8 * clipOverloadRef.current}px rgba(217, 78, 52, 0.9)`
                      : 'none',
                }}
              />
              <span
                className="font-mono text-[9px] uppercase tracking-wider transition-colors duration-150"
                style={{
                  color: clipOverloadRef.current > 0.05 ? '#D94E34' : 'var(--mocha)',
                  fontWeight: clipOverloadRef.current > 0.05 ? 600 : 400,
                }}
              >
                CLIP
              </span>
            </div>
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] text-latte/75 tracking-wider block">
            {sourceLabel}
          </span>
        </div>

        {/* Console Controls / Mode Selector */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="flex border border-mocha/50 bg-roast/40 p-0.5 shadow-inner">
            {[
              { id: 'VU', label: 'VU (AVG)' },
              { id: 'PEAK', label: 'PEAK HOLD' },
              { id: 'TAPE', label: 'TAPE SAT' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setMeterMode(id)}
                className={`px-2 sm:px-2.5 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  meterMode === id
                    ? 'bg-caramel text-espresso font-bold shadow-sm'
                    : 'text-mocha hover:text-latte'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="font-mono text-[10px] sm:text-[11px] text-caramel border border-mocha/40 bg-roast/30 px-2.5 sm:px-3 py-1 shadow-inner">
            RMS {audioDb ? `${audioDb.toFixed(1)} dB` : '-18.4 dB'}
          </div>
        </div>
      </div>

      {/* Main 16-Bar Laboratory Equalizer Rack Display */}
      <div className="relative pt-3 sm:pt-4 pb-2 z-10">
        {/* Calibrated Horizontal Reference Grid Lines */}
        <div className="absolute inset-0 top-4 bottom-10 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-caramel w-full" />
          <div className="border-b border-latte w-full" />
          <div className="border-b border-mocha w-full" />
          <div className="border-b border-mocha w-full" />
          <div className="border-b border-mocha w-full" />
        </div>

        {/* Decibel Reference Axis Markers (Left side) */}
        <div className="flex items-stretch gap-1 sm:gap-1.5 md:gap-2.5 h-44 sm:h-48 md:h-56">
          <div className="flex flex-col justify-between font-mono text-[8px] sm:text-[9px] text-mocha/80 pr-0.5 sm:pr-1 py-1 text-right select-none w-5 sm:w-6 shrink-0">
            <span className="text-[#D94E34] font-bold">+3dB</span>
            <span className="text-caramel font-semibold">0dB</span>
            <span className="text-latte">-3dB</span>
            <span>-6dB</span>
            <span>-12dB</span>
            <span>-24dB</span>
            <span>-40dB</span>
          </div>

          {/* 16 Frequency Bars with Laboratory LED Luminescence */}
          <div className="flex-1 grid grid-cols-16 gap-0.5 sm:gap-1 md:gap-2 h-full items-end min-w-0">
            {animatedBins.map((binVal, idx) => {
              const peakVal = peakHoldsRef.current[idx] || binVal;
              const activeSegments = Math.round(binVal * TOTAL_SEGMENTS);
              const peakSegmentIndex = Math.min(
                TOTAL_SEGMENTS - 1,
                Math.floor(peakVal * TOTAL_SEGMENTS)
              );
              const isHovered = hoveredBand === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBand(idx)}
                  onMouseLeave={() => setHoveredBand(null)}
                  className={`group relative flex flex-col justify-end h-full cursor-pointer transition-transform duration-200 ${
                    isHovered ? 'scale-105' : ''
                  }`}
                >
                  {/* Segmented LED Bar Column */}
                  <div className="flex flex-col-reverse gap-[2px] md:gap-[3px] h-full w-full py-1">
                    {Array.from({ length: TOTAL_SEGMENTS }, (_, segIdx) => {
                      const isLit = segIdx < activeSegments;
                      const isPeak = segIdx === peakSegmentIndex;

                      // Authentic Laboratory Color Hierarchy:
                      // Top 2: Overload Red (#D94E34)
                      // Next 3: Headroom Caramel (#B8772F)
                      // Next 4: Speech Clarity Latte (#D2AE82)
                      // Bottom 5: Room Ambient Mocha (#6B4630)
                      let litColor = '#6B4630';
                      let litGlow = 'none';
                      let phosphorCore = 'rgba(255, 255, 255, 0.2)';

                      if (segIdx >= TOTAL_SEGMENTS - 2) {
                        litColor = '#D94E34'; // Peak Clip Red
                        if (isLit) {
                          litGlow = '0 0 7px rgba(217, 78, 52, 0.85), 0 0 14px rgba(217, 78, 52, 0.35)';
                          phosphorCore = 'rgba(255, 200, 200, 0.4)';
                        }
                      } else if (segIdx >= TOTAL_SEGMENTS - 5) {
                        litColor = '#B8772F'; // Amber Caramel
                        if (isLit) {
                          litGlow = '0 0 6px rgba(184, 119, 47, 0.75), 0 0 12px rgba(184, 119, 47, 0.25)';
                          phosphorCore = 'rgba(255, 240, 220, 0.35)';
                        }
                      } else if (segIdx >= TOTAL_SEGMENTS - 9) {
                        litColor = '#D2AE82'; // Warm Latte
                        if (isLit) {
                          litGlow = '0 0 4px rgba(210, 174, 130, 0.55)';
                          phosphorCore = 'rgba(255, 255, 255, 0.25)';
                        }
                      } else {
                        litColor = '#8C6239'; // Ambient Foundation
                        if (isLit) {
                          litGlow = '0 0 3px rgba(140, 98, 57, 0.4)';
                          phosphorCore = 'rgba(255, 255, 255, 0.15)';
                        }
                      }

                      return (
                        <div
                          key={segIdx}
                          className="h-full w-full rounded-[1px] transition-all duration-75 relative overflow-hidden"
                          style={{
                            backgroundColor: isLit
                              ? litColor
                              : isPeak
                              ? '#FAF5EC'
                              : 'rgba(42, 26, 18, 0.45)',
                            boxShadow: isLit
                              ? litGlow
                              : isPeak
                              ? '0 0 6px #FAF5EC, 0 0 10px rgba(184, 119, 47, 0.6)'
                              : 'none',
                            opacity: isLit ? 1 : isPeak ? 0.95 : 0.3,
                            border: isLit
                              ? '1px solid rgba(255, 255, 255, 0.15)'
                              : '1px solid rgba(58, 38, 25, 0.5)',
                          }}
                        >
                          {/* Inner Diffuser Lens Highlight Core */}
                          {isLit && (
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: `linear-gradient(to bottom, ${phosphorCore} 0%, transparent 60%)`,
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Frequency Label Underneath */}
                  <div className="pt-2 text-center">
                    <span
                      className={`font-mono text-[8px] sm:text-[9px] md:text-[10px] block transition-colors duration-150 truncate ${
                        isHovered
                          ? 'text-caramel font-bold'
                          : 'text-mocha group-hover:text-latte'
                      }`}
                    >
                      {FREQUENCY_BANDS[idx].label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Reference Scale */}
          <div className="flex flex-col justify-between font-mono text-[8px] sm:text-[9px] text-mocha/80 pl-0.5 sm:pl-1 py-1 text-left select-none w-5 sm:w-6 shrink-0">
            <span className="text-[#D94E34] font-bold">+3</span>
            <span className="text-caramel font-semibold">0</span>
            <span className="text-latte">-3</span>
            <span>-6</span>
            <span>-12</span>
            <span>-24</span>
            <span>-40</span>
          </div>
        </div>
      </div>

      {/* Dynamic Hover Details & Tape Saturation Indicator */}
      <div className="pt-3 border-t border-roast/60 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono gap-2 sm:gap-3 relative z-10 overflow-hidden">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <span className="text-mocha uppercase text-[9px] sm:text-[10px] shrink-0">INSPECTED OCTAVE:</span>
          {activeBandData ? (
            <span className="text-crema truncate text-[11px] sm:text-xs">
              <span className="text-caramel font-semibold">{activeBandData.hz}</span> —{' '}
              <span className="text-latte">{activeBandData.name}</span>{' '}
              <span className="text-mocha">({activeBandDb} dB)</span>
            </span>
          ) : (
            <span className="text-mocha italic truncate text-[11px] sm:text-xs">
              Hover across frequency bands to analyze acoustic formant resonance
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 text-[9px] sm:text-[10px] text-mocha shrink-0">
          <span className="flex items-center space-x-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSpeechActive ? 'bg-caramel animate-pulse' : 'bg-mocha'
              }`}
            />
            <span className={isSpeechActive ? 'text-latte' : 'text-mocha'}>
              {isSpeechActive ? 'VOCAL ENERGY DETECTED' : 'ROOM FLOOR CONTEMPLATION'}
            </span>
          </span>
          <span className="text-mocha/50 hidden sm:inline">|</span>
          <span className="text-latte hidden sm:inline">CALIBRATION: 44.1kHz • 32-BIT FLOAT</span>
        </div>
      </div>
    </div>
  );
}
