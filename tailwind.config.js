/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        huntimob: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Cores personalizadas do HuntImob - Estilo Beet Money
        brand: {
          'navy-dark': '#0f172a',  // Azul escuro estilo Beet Money
          'navy': '#1e293b',       // Azul médio estilo Beet Money
          'navy-light': '#334155',  // Azul claro para elementos
          'gold': '#10b981',       // Verde-azulado para acentos (estilo Beet Money)
          'accent': '#06b6d4',     // Ciano para elementos interativos
        },
        // Cores da Landing Page Beet Money
        beet: {
          'dark': '#08042E',       // Azul Dark - seriedade
          'medium': '#0A0540',     // Azul Medium - clareza
          'gold': '#C3A54E',       // Dourado - riqueza e iluminação
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
