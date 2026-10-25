/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: 'rgb(var(--espresso-rgb) / <alpha-value>)',
        roast: 'rgb(var(--roast-rgb) / <alpha-value>)',
        mocha: 'rgb(var(--mocha-rgb) / <alpha-value>)',
        caramel: 'rgb(var(--caramel-rgb) / <alpha-value>)',
        latte: 'rgb(var(--latte-rgb) / <alpha-value>)',
        crema: 'rgb(var(--crema-rgb) / <alpha-value>)',
        foam: 'rgb(var(--foam-rgb) / <alpha-value>)',
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
