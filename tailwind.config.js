/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chibi: {
          pink: '#FF9EAA',
          lightpink: '#FFF0F5',
          hotpink: '#FF6F91',
          lavender: '#E8EAFF',
          purple: '#9B72CF',
          deepPurple: '#5C3D8D',
          cream: '#FFF9F4',
          mint: '#D8F3DC',
          sky: '#E0F2FE',
          card: '#FFFFFF',
          dark: '#3D344B',
          softText: '#7A6E85',
        },
      },
      fontFamily: {
        anime: ['"Quicksand"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cute': '0 8px 24px -4px rgba(255, 158, 170, 0.25), 0 4px 12px -2px rgba(155, 114, 207, 0.15)',
        'cute-lg': '0 12px 32px -4px rgba(255, 158, 170, 0.35), 0 6px 16px -2px rgba(155, 114, 207, 0.2)',
        'inner-glow': 'inset 0 2px 8px rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(255, 111, 145, 0.6))' },
          '50%': { opacity: '.85', filter: 'drop-shadow(0 0 20px rgba(155, 114, 207, 0.8))' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(45deg)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
