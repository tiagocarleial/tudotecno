/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2859f1',
          cyan: '#4de7dc',
          dark: '#0f1117',
        },
        category: {
          tecnologia: '#2859f1',
          games:      '#9333ea',
          ciencia:    '#16a34a',
          internet:   '#0891b2',
          seguranca:  '#dc2626',
          mercado:    '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
