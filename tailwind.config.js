/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pixel: {
          night: '#131428',
          navy: '#1b1e3f',
          darkPurple: '#2d2244',
          purple: '#513b6b',
          lavender: '#8a6b8f',
          duskRose: '#b85b64',
          sunsetOrange: '#e98550',
          goldenSun: '#f7cd79',
          oceanDeep: '#233d54',
          oceanMid: '#3a6970',
          sand: '#dfba91'
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace']
      }
    },
  },
  plugins: [],
}
