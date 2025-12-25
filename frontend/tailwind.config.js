/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
        display: ['"Space Grotesk"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
