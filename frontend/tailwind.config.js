module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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