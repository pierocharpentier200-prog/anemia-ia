/** @type {import('tailwindcss').Config} */
export default {
  content: ["./Frontend/index.html", "./Frontend/src/**/*.{js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};