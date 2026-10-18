/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* === Tokens "Sakura Dawn" (tema actual) === */
        ink: {
          DEFAULT: '#4A3B52',
          soft: '#7D7189',
          faint: '#A99DB2',
        },
        rosa: {
          50: '#FFF6F9',
          100: '#FFECF2',
          200: '#FFD9E5',
          300: '#FFB9CD',
          400: '#FF9DB8',
          500: '#F97FA5',
          600: '#E75E8C',
          700: '#C94773',
        },
        lav: {
          50: '#F7F5FD',
          100: '#EFEBFA',
          200: '#E2DBF5',
          300: '#CFC4EE',
          400: '#B5A6E2',
          500: '#9D8BD0',
          600: '#7F6BB8',
        },
        line: {
          rose: '#F2DCE7',
          lav: '#E4DDF4',
        },
        panel: {
          white: '#FFFFFF',
          rose: '#FFF9FB',
          lav: '#FBFAFE',
        },
        mint: {
          soft: '#E8F7EC',
          mid: '#6FBF85',
          deep: '#3E8E52',
        },
        gold: {
          soft: '#FFF4E0',
          mid: '#F5B95A',
          deep: '#A97B2A',
        },

        /* === Paletas antiguas (compatibilidad) === */
        gl: {
          skyTop: '#FFE9F1',
          skyMid: '#F3EFFB',
          skyBottom: '#E9F3FB',
          navy: '#4A3B52',
          navyDeep: '#4A3B52',
          pink: '#F97FA5',
          pinkDark: '#E75E8C',
          pinkLight: '#FFB9CD',
          blue: '#B5A6E2',
          blueDark: '#9D8BD0',
          blueLight: '#CFC4EE',
          yellow: '#F5B95A',
          yellowDark: '#A97B2A',
          green: '#6FBF85',
          greenDark: '#3E8E52',
          purple: '#B5A6E2',
          purpleDark: '#9D8BD0',
          panel: '#FFF9FB',
          panel2: '#FBFAFE',
          face: '#F7F5FD',
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
          dark: '#4A3B52',
          softText: '#7D7189',
        },
      },
      fontFamily: {
        display: ['"Fredoka"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        anime: ['"Fredoka"', '"Baloo 2"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cute: '0 3px 10px rgba(160, 100, 150, 0.1)',
        'cute-lg': '0 16px 40px rgba(140, 90, 150, 0.18)',
        'inner-glow': 'inset 0 2px 8px rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2.4s ease-in-out infinite',
        'float': 'float 3.2s ease-in-out infinite',
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
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(255, 157, 184, 0.6))' },
          '50%': { opacity: '.85', filter: 'drop-shadow(0 0 20px rgba(181, 166, 226, 0.8))' },
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
