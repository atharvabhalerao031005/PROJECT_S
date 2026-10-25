import React, { useState, useRef, useEffect } from 'react';

/**
 * AtelierSelect
 * Bespoke tactile editorial dropdown component matching the Slow Morning roastery aesthetic.
 * Replaces dated native browser <select> with a warm paper card, brass accents,
 * rotating chevron, and descriptive option rows.
 */
export default function AtelierSelect({
  value,
  onChange,
  options = [],
  label,
  theme = 'light',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => 
    typeof opt === 'object' ? opt.value === value : opt === value
  ) || options[0];

  const selectedLabel = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <div ref={containerRef} className="relative w-full select-none">
      {label && (
        <label className="font-mono text-xs text-mocha uppercase block tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-4 py-3 border text-left flex items-center justify-between transition-all cursor-pointer font-mono text-xs ${
          isDark
            ? 'bg-roast/50 border-mocha/50 text-foam hover:border-caramel focus:border-caramel'
            : 'bg-foam border-mocha/40 text-espresso hover:border-caramel focus:border-caramel shadow-sm'
        } ${isOpen ? 'border-caramel ring-1 ring-caramel/40' : ''}`}
      >
        <div className="flex items-center space-x-2.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-caramel inline-block shrink-0" />
          <span className="truncate font-medium">{selectedLabel}</span>
        </div>

        {/* Tactile Rotating Brass Chevron */}
        <div className="ml-2 shrink-0 flex items-center text-caramel transition-transform duration-200">
          <svg
            className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Popover Options Card */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 mt-1.5 z-50 border shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 ${
            isDark
              ? 'bg-[#1C1310]/98 border-roast/80 text-foam divide-y divide-roast/40'
              : 'bg-[#F7F0E3] border-mocha/40 text-espresso divide-y divide-mocha/20 shadow-[0_12px_36px_rgba(58,38,25,0.18)]'
          }`}
        >
          {options.map((opt, idx) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const optBadge = typeof opt === 'object' ? opt.badge : null;
            const optDesc = typeof opt === 'object' ? opt.description : null;
            const isSelected = optVal === value;

            return (
              <button
                key={idx}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(optVal)}
                className={`w-full px-4 py-3 text-left transition-colors flex flex-col gap-1 cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-roast/60 text-caramel font-semibold'
                      : 'bg-crema/60 text-caramel font-semibold'
                    : isDark
                    ? 'hover:bg-roast/40 text-foam/90'
                    : 'hover:bg-crema/30 text-espresso/90'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-caramel' : 'bg-mocha/40'
                      }`}
                    />
                    <span className="font-mono text-xs">{optLabel}</span>
                  </div>
                  {optBadge && (
                    <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-caramel/40 text-caramel">
                      {optBadge}
                    </span>
                  )}
                </div>
                {optDesc && (
                  <p className="font-sans text-[11px] text-mocha pl-3.5 leading-relaxed">
                    {optDesc}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
