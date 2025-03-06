/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E94560',
          light: '#F47890',
          dark: '#D32040',
        },
        secondary: {
          DEFAULT: '#0F3460',
          light: '#1A4980',
          dark: '#082040',
        },
        background: {
          DEFAULT: '#1A1A2E',
          light: '#2A2A4E',
          dark: '#10101E',
        },
        accent: {
          DEFAULT: '#16213E',
          light: '#263A6E',
          dark: '#0A1020',
        },
        text: {
          DEFAULT: '#F5F5F5',
          muted: '#D1D5DB',
        }
      }
    },
  },
  plugins: [],
}
