/** @type {import('tailwindcss').Config} */
module.exports = {
  // La parte más importante: le dice a Tailwind que busque clases en todos
  // los archivos .jsx, .js, etc., dentro de las carpetas 'pages' y 'components'.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-darkest': '#001233',
        'primary-dark': '#001845',
        'primary': '#002855',
        'primary-light': '#023e7d',
        'accent-light': '#0353a4',
        'accent': '#0466c8',
        'neutral-dark': '#33415c',
        'neutral': '#5c677d',
        'neutral-light': '#7d8597',
        'neutral-lighter': '#979dac',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
};