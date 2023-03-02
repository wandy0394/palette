/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage:{
        'gradient-radial':'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':'conic-gradient(var(--tw-gradient-stops))'
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require("daisyui")],
}
