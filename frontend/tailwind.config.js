/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        accent:     '#00FF41',
        gold:       '#F4D03F',
        panel:      '#1A1A1A',
        surface:    '#1F1F1F',
        muted:      '#888888',
        border:     'rgba(0,255,65,0.15)'
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body:    ['Open Sans', 'sans-serif']
      },
      boxShadow: {
        glow:      '0 0 24px rgba(0,255,65,0.30)',
        'glow-sm': '0 0 12px rgba(0,255,65,0.20)',
        'glow-lg': '0 0 40px rgba(0,255,65,0.40)',
        'gold':    '0 0 20px rgba(244,208,63,0.25)',
        'inset-green': 'inset 0 0 40px rgba(0,255,65,0.04)'
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite'
      }
    }
  },
  plugins: []
};
