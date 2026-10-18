/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gl: {
          skyTop: '#4FB9EC',
          skyMid: '#7ED0F5',
          skyBottom: '#B3E5FB',
          navy: '#2B5FA8',
          navyDeep: '#1E4580',
          pink: '#FF87B2',
          pinkDark: '#E56593',
          pinkLight: '#FFB1CE',
          blue: '#74C9F0',
          blueDark: '#4AA0D0',
          blueLight: '#A8DEF8',
          yellow: '#FFE06B',
          yellowDark: '#E5B84B',
          green: '#95D97C',
          greenDark: '#63B34C',
          purple: '#B79AE0',
          purpleDark: '#8F6DC4',
          panel: '#C3E7FB',
          panel2: '#A5D8F4',
          face: '#EAF6FF',
        },
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
        display: ['"Fredoka"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        anime: ['"Fredoka"', '"Baloo 2"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cute': '0 8px 24px -4px rgba(255, 135, 178, 0.35), 0 4px 12px -2px rgba(74, 160, 208, 0.25)',
        'cute-lg': '0 12px 32px -4px rgba(255, 135, 178, 0.45), 0 6px 16px -2px rgba(74, 160, 208, 0.3)',
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
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(255, 135, 178, 0.6))' },
          '50%': { opacity: '.85', filter: 'drop-shadow(0 0 20px rgba(143, 109, 196, 0.8))' },
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
