/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          500: '#ffd700',
          600: '#ca8a04',
          700: '#a16207',
          900: '#713f12',
        },
        gold: {
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        mystical: {
          dark: '#0f0f1e',
          purple: '#1a1a2e',
          blue: '#16213e',
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        float: 'float 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700' },
          '100%': { boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}