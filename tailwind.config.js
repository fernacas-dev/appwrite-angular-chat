/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'blue-futuristic': '#0062FF',
        'gray-dark': '#1A1A1A',
        'gray-medium': '#2C2C2C',
        'gray-light': '#E0E0E0',
        'text-light': '#E0E0E0',
        'text-dark': '#1A1A1A',
        'bg-light': '#FFFFFF',
        'bg-dark': '#0A0A0A',
      },
    },
  },
  plugins: [],
}