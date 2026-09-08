/** @type {import('tailwindcss').Config} */
import preset from '../../packages/tokens/tailwind-preset.js'

export default {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        petrol: '#0F2E2A',
        amber: {
          DEFAULT: '#FFB300',
          deep: '#B87E00',
          wash: '#FFF3D4',
        },
      },
      minHeight: {
        touch: '56px',
        'touch-lg': '88px',
      },
    },
  },
  plugins: [],
}
