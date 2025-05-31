// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C158',
          dark: '#B89225',
        },
        brown: {
          dark: '#1A120B',
          medium: '#2D1F11',
          light: '#3C291A',
        },
        // Keep original theme colors as fallbacks
        appBg: '#0a0a0a',  // Dark background from landing page
        cardBg: '#1A120B', // Dark brown from landing page
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(145deg, #1A120B 0%, #0a0a0a 100%)',
      },
    },
  },
  plugins: [],
}