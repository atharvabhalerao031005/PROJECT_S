import React from 'react';

/**
 * Attentive Gaze Eye Glyph
 */
export function GazeEyeGlyph({ className = "w-6 h-6", stroke = "#B8772F" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 2 12 C 5 6, 19 6, 22 12 C 19 18, 5 18, 2 12 Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.5" stroke={stroke} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.2" fill={stroke} />
    </svg>
  );
}

/**
 * Acoustic Wave Wisp Glyph
 */
export function AcousticWaveGlyph({ className = "w-6 h-6", stroke = "#D2AE82" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 3 12 Q 5 6, 7 12 T 11 12 T 15 12 T 19 12 T 21 12"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 5 12 Q 7 3, 9 12 T 13 12 T 17 12"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/**
 * Resting Croissant / Break Indicator Glyph
 */
export function RestingCroissantGlyph({ className = "w-6 h-6", stroke = "#B8772F" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 3 16 C 5 9, 11 6, 17 8 C 21 10, 22 15, 20 17 C 18 19, 14 18, 12 15 C 10 12, 6 12, 3 16 Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#3A2619"
        fillOpacity="0.4"
      />
      <path d="M 8 10 C 10 13, 13 14, 16 12" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Botanical Sprig Glyph
 */
export function BotanicalSprigGlyph({ className = "w-6 h-6", stroke = "#D2AE82" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 4 20 C 8 16, 14 10, 18 4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 9 15 C 7 13, 8 10, 11 11 C 12 12, 11 14, 9 15 Z" fill="#3A2619" stroke={stroke} strokeWidth="1.2" />
      <path d="M 13 11 C 12 8, 14 6, 16 8 C 17 9, 15 11, 13 11 Z" fill="#3A2619" stroke={stroke} strokeWidth="1.2" />
      <path d="M 16 6 C 16 4, 19 3, 20 5 C 20 7, 18 7, 16 6 Z" fill="#3A2619" stroke={stroke} strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Presence Verified Stamp / Seal Glyph
 */
export function PresenceSealGlyph({ className = "w-6 h-6", stroke = "#EBDCC2" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="6" stroke="#B8772F" strokeWidth="1.2" />
      <path d="M 9 12 L 11 14 L 15 10" stroke="#B8772F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
