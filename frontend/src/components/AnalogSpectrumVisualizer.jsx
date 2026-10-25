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
}) {
  const [hoveredBand, setHoveredBand] = useState(null);
  const [meterMode, setMeterMode] = useState('VU'); // 'VU' | 'PEAK' | 'TAPE'
  const [animatedBins, setAnimatedBins] = useState(
    Array.from({ length: 16 }, (_, i) => 0.15 + 0.5 * Math.sin((i / 15) * Math.PI))
  );
  const peakHoldsRef = useRef(Array(16).fill(0.2));
  const peakDecayTimersRef = useRef(Array(16).fill(0));
  const rafRef = useRef(null);

  // Smooth fallback animation & peak decay loop
  useEffect(() => {
    let phase = 0;
    const updatePhysics = () => {
      phase += 0.06;

      const hasLiveBins = Array.isArray(spectralBins) && spectralBins.length === 16;
      const targetBins = hasLiveBins
        ? spectralBins
        : Array.from({ length: 16 }, (_, i) => {
            // Natural bell curve centered on voice band (~1kHz, bins 5-8)
            const center = isSpeechActive ? 6.5 : 4.0;
            const dist = Math.abs(i - center);
            const bell = Math.exp(-0.5 * (dist / 2.2) ** 2);
            const wobble = Math.sin(phase * 1.5 + i * 0.45) * 0.12 + Math.cos(phase * 0.8 - i * 0.3) * 0.08;
            const speechBoost = isSpeechActive ? 0.35 : 0.08;
            return Math.min(0.96, Math.max(0.06, (bell * 0.65 + speechBoost + wobble) * (isStreaming ? 1.0 : 0.25)));
          });

      // Update peak holds with ballistics
      const newPeaks = [...peakHoldsRef.current];
      const newDecays = [...peakDecayTimersRef.current];

      for (let i = 0; i < 16; i++) {
        const currentVal = targetBins[i] || 0.05;
        if (currentVal >= newPeaks[i]) {
          newPeaks[i] = currentVal;
          newDecays[i] = 18; // Hold peak for ~18 frames
        } else {
          if (newDecays[i] > 0) {
            newDecays[i] -= 1;
          } else {
            // Analog ballistic gravity fall
            newPeaks[i] = Math.max(currentVal, newPeaks[i] - 0.022);
          }
        }
      }

      peakHoldsRef.current = newPeaks;
      peakDecayTimersRef.current = newDecays;
      setAnimatedBins(targetBins);

      rafRef.current = requestAnimationFrame(updatePhysics);
    };

    rafRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spectralBins, isSpeechActive, isStreaming]);

  const activeBandData = hoveredBand !== null ? FREQUENCY_BANDS[hoveredBand] : null;
  const activeBandValue = hoveredBand !== null ? animatedBins[hoveredBand] : null;
  const activeBandDb = activeBandValue
    ? (-48 + activeBandValue * 51).toFixed(1)
    : audioDb.toFixed(1);

  return (
    <div className="relative border border-roast bg-espresso/95 p-6 md:p-8 space-y-6 shadow-2xl select-none">
      {/* Top Console Branding & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-roast/80 pb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-caramel animate-incandescent" />
            <span className="font-mono text-xs uppercase tracking-micro text-latte font-medium">
              REVOX A77 // STUDIO ACOUSTIC EQUALIZER
            </span>
          </div>
          <span className="font-mono text-[10px] text-mocha tracking-wider block">
            16-BAND PARALLEL NYQUIST FILTER BANK • 16.0 kHz PCM BUFFER
          </span>
        </div>

        {/* Console Controls / Mode Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex border border-mocha/50 bg-roast/40 p-0.5">
            {['VU', 'PEAK', 'TAPE'].map((mode) => (
              <button
                key={mode}
                onClick={() => setMeterMode(mode)}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                  meterMode === mode
                    ? 'bg-caramel text-espresso font-bold'
                    : 'text-mocha hover:text-latte'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="font-mono text-[11px] text-caramel border border-mocha/40 bg-roast/30 px-3 py-1">
            RMS {audioDb ? `${audioDb.toFixed(1)} dB` : '-18.4 dB'}
          </div>
        </div>
      </div>

      {/* Main 16-Bar Equalizer Rack Display */}
      <div className="relative pt-4 pb-2">
        {/* Subtle Background Calibration Grid Lines */}
        <div className="absolute inset-0 top-4 bottom-10 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-latte w-full" />
          <div className="border-b border-mocha w-full" />
          <div className="border-b border-mocha w-full" />
          <div className="border-b border-mocha w-full" />
        </div>

        {/* Decibel Reference Axis Markers (Left side) */}
        <div className="flex items-stretch gap-1.5 md:gap-2.5 h-48 md:h-56">
          <div className="flex flex-col justify-between font-mono text-[9px] text-mocha/80 pr-1 py-1 text-right select-none w-6">
            <span className="text-caramel">+3dB</span>
            <span className="text-latte">0dB</span>
            <span>-6dB</span>
            <span>-12dB</span>
            <span>-24dB</span>
            <span>-40dB</span>
          </div>

          {/* 16 Frequency Bars */}
          <div className="flex-1 grid grid-cols-16 gap-1 md:gap-2 h-full items-end">
            {animatedBins.map((binVal, idx) => {
              const peakVal = peakHoldsRef.current[idx] || binVal;
              const activeSegments = Math.round(binVal * TOTAL_SEGMENTS);
              const peakSegmentIndex = Math.min(TOTAL_SEGMENTS - 1, Math.floor(peakVal * TOTAL_SEGMENTS));
              const isHovered = hoveredBand === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBand(idx)}
                  onMouseLeave={() => setHoveredBand(null)}
                  className={`group relative flex flex-col justify-end h-full cursor-pointer transition-transform duration-150 ${
                    isHovered ? 'scale-105' : ''
                  }`}
                >
                  {/* Segmented LED Bar Column */}
                  <div className="flex flex-col-reverse gap-[2px] md:gap-[3px] h-full w-full py-1">
                    {Array.from({ length: TOTAL_SEGMENTS }, (_, segIdx) => {
                      const isLit = segIdx < activeSegments;
                      const isPeak = segIdx === peakSegmentIndex;

                      // Color coding according to studio standards:
                      // Top 2: Overload / Peak warning (Amber-Red #D94E34)
                      // Next 3: Upper headroom (#B8772F caramel)
                      // Next 4: Optimal dialogue (#D2AE82 warm latte)
                      // Lower: Ambient floor (#6B4630 mocha)
                      let litColor = '#6B4630';
                      let glowStyle = 'none';

                      if (segIdx >= TOTAL_SEGMENTS - 2) {
                        litColor = '#D94E34'; // Peak Clip
                        if (isLit) glowStyle = '0 0 6px rgba(217, 78, 52, 0.8)';
                      } else if (segIdx >= TOTAL_SEGMENTS - 5) {
                        litColor = '#B8772F'; // Caramel Accent
                        if (isLit) glowStyle = '0 0 5px rgba(184, 119, 47, 0.7)';
                      } else if (segIdx >= TOTAL_SEGMENTS - 9) {
                        litColor = '#D2AE82'; // Latte Mid
                        if (isLit) glowStyle = '0 0 3px rgba(210, 174, 130, 0.4)';
                      }

                      return (
                        <div
                          key={segIdx}
                          className="h-full w-full rounded-[1px] transition-all duration-75 relative"
                          style={{
                            backgroundColor: isLit
                              ? litColor
                              : isPeak
                              ? '#B8772F'
                              : 'rgba(58, 38, 25, 0.45)',
                            boxShadow: isLit ? glowStyle : isPeak ? '0 0 4px #B8772F' : 'none',
                            opacity: isLit || isPeak ? 1 : 0.35,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Frequency Label Underneath */}
                  <div className="pt-2 text-center">
                    <span
                      className={`font-mono text-[9px] md:text-[10px] block transition-colors ${
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
          <div className="flex flex-col justify-between font-mono text-[9px] text-mocha/80 pl-1 py-1 text-left select-none w-6">
            <span className="text-caramel">+3</span>
            <span className="text-latte">0</span>
            <span>-6</span>
            <span>-12</span>
            <span>-24</span>
            <span>-40</span>
          </div>
        </div>
      </div>

      {/* Dynamic Hover Details & Tape Saturation Indicator */}
      <div className="pt-3 border-t border-roast/60 flex flex-col md:flex-row md:items-center justify-between text-xs font-mono gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-mocha uppercase text-[10px]">INSPECTED OCTAVE:</span>
          {activeBandData ? (
            <span className="text-crema">
              <span className="text-caramel font-semibold">{activeBandData.hz}</span> —{' '}
              <span className="text-latte">{activeBandData.name}</span>{' '}
              <span className="text-mocha">({activeBandDb} dB)</span>
            </span>
          ) : (
            <span className="text-mocha italic">
              Hover across frequency bands to analyze acoustic formant resonance
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4 text-[10px] text-mocha">
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
          <span className="text-mocha/50">|</span>
          <span className="text-latte">CALIBRATION: 44.1kHz • 32-BIT FLOAT</span>
        </div>
      </div>
    </div>
  );
}
