/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dark: '#363853',
        primary: '#0012FF',
        green: '#67D4CA',
        red: '#F28080',
        "dark-light": "#F8FAFB",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

