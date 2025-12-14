/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
    './utils/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#04668D',
        secondary: '#01C49A',
      },
    },
  },
  plugins: [],
};
