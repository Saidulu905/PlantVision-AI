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
        // Vibrant natural HSL tailored green-centric palettes
        nature: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // emerald-like primary accent
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        sage: {
          50: '#f4f6f4',
          100: '#e3e8e4',
          200: '#c7d1c9',
          300: '#a3b3a6',
          400: '#79917d',
          500: '#5e7562',
          600: '#485c4b',
          700: '#3a4a3c',
          800: '#303c32',
          900: '#28322a',
          950: '#141a15',
        },
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(15, 23, 42, 0.6)',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(16, 185, 129, 0.15)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
