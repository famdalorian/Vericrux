/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'vericrux-black': '#000000',
        'vericrux-dark': '#0a0a0a',
        'vericrux-neon': '#dfff00',     // ← main neon yellow
        'vericrux-neon-dark': '#ccee00',
        'vericrux-grey': '#1a1a1a',
        'vericrux-light': '#e0e0e0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // or use something like 'Bebas Neue' for headings via Google Fonts
      },
    },
  },
  plugins: [],
}