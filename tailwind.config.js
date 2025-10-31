/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E6001B',
          50: '#FFE5E8',
          100: '#FFCCD2',
          200: '#FF99A5',
          300: '#FF6678',
          400: '#FF334B',
          500: '#E6001B',
          600: '#B30015',
          700: '#800010',
          800: '#4D000A',
          900: '#1A0003'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}