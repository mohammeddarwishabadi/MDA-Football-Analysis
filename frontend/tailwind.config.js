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
        background: '#0B0F14',
        accent: '#00FF9C',
        panel: '#121A23',
        muted: '#9FB0C3'
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px rgba(0,255,156,0.35)'
      }
    }
  },
  plugins: []
};
