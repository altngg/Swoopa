/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        galindo: ['Galindo'],
        inter: ['Inter']
      },
      colors: {
        gray: {
          600: '#666666', // Цвет текста (серый)
        }
      },
      fontSize: {
        'base': '1rem', // 16px
      },
      spacing: {
        '2': '0.5rem', // 8px
        '4': '1rem',   // 16px
      }
    },
  },
  plugins: [],
}

