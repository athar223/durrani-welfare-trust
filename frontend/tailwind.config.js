/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dwt: {
          50: '#e8f5ee',
          100: '#c5e6d2',
          200: '#9cd5b4',
          300: '#6fc394',
          400: '#48b378',
          500: '#1a6b3c',
          600: '#155a32',
          700: '#114a29',
          800: '#0f3d22',
          900: '#0a2916',
        },
      },
      fontFamily: {
        heading: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        card: '0 10px 40px -10px rgba(26, 107, 60, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
