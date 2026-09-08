/**
 * ZaPost — preset do Tailwind.
 *
 * Espelha tokens.css. Use as classes utilitárias no app e as variáveis CSS
 * nos templates de render (Satori entende CSS, não Tailwind).
 *
 *   // tailwind.config.js
 *   module.exports = { presets: [require('@zapost/tokens/tailwind-preset')], ... }
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        petrol: '#0F2E2A',
        amber: {
          DEFAULT: '#FFB300',
          deep:    '#B87E00',
          wash:    '#FFF3D4',
        },
        n: {
          50:  '#F4F6F4',
          100: '#E7ECE9',
          200: '#CFD9D5',
          300: '#AFC0BA',
          400: '#859A93',
          500: '#5F776F',
          600: '#45605A',
          700: '#2A4F49',
          800: '#1A3D38',
          900: '#0F2E2A',
          950: '#08201D',
        },
        success: { DEFAULT: '#12B76A', wash: '#E3F9EE' },
        warning: { DEFAULT: '#B54708', wash: '#FDF0E3' },
        danger:  { DEFAULT: '#D92D20', wash: '#FCE9E7' },
      },

      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Trebuchet MS"', 'sans-serif'],
        sans:    ['Figtree', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'Consolas', 'monospace'],
      },

      fontSize: {
        xs:   ['12px', '1.4'],
        sm:   ['14px', '1.5'],
        base: ['16px', '1.6'],  // mínimo em qualquer <input>
        lg:   ['18px', '1.5'],
        xl:   ['21px', '1.35'],
        '2xl':['25px', '1.25'],
        '3xl':['31px', '1.15'],
        '4xl':['39px', '1.05'],
      },

      spacing: {
        touch:    '56px',  // alvo mínimo de toque
        'touch-lg': '88px', // botões principais
      },

      borderRadius: { DEFAULT: '10px', lg: '16px' },
      borderWidth:  { DEFAULT: '2px' },

      boxShadow: {
        DEFAULT: '0 1px 2px rgba(15,46,42,.08), 0 4px 12px rgba(15,46,42,.06)',
        hard:    '5px 5px 0 rgba(15,46,42,.18)',
      },
    },
  },
}
