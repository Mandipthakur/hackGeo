/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9e7e5',
          100: '#f1c7c2',
          200: '#e6a49c',
          300: '#da8177',
          400: '#cf5d51',
          500: '#c33c2c',
          600: '#a93526',
          700: '#7B241C', // Primary color
          800: '#5d1c15',
          900: '#3f130e',
        },
        accent: {
          50: '#fffbe5',
          100: '#fff6cc',
          200: '#ffed99',
          300: '#ffe566',
          400: '#ffdc33',
          500: '#FFD700', // Gold accent
          600: '#e6c100',
          700: '#cc9900',
          800: '#997300',
          900: '#664d00',
        },
        stone: {
          50: '#f8f5f0',
          100: '#e9e5d8',
          200: '#d5cdb5',
          300: '#c2b592',
          400: '#ae9c6f',
          500: '#9a844d',
          600: '#7d6a3e',
          700: '#5f5030',
          800: '#413621',
          900: '#231d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};