/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: 'var(--espresso)',
        roast: 'var(--roast)',
        mocha: 'var(--mocha)',
        caramel: 'var(--caramel)',
        latte: 'var(--latte)',
        crema: 'var(--crema)',
        foam: 'var(--foam)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Instrument Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        micro: '0.18em',
      },
    },
  },
  plugins: [],
}
