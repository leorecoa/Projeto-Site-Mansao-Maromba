/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.tsx",
    "./sections/**/*.tsx",
    "./context/**/*.tsx",
    "./pages/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        syncopate: ['Syncopate', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
