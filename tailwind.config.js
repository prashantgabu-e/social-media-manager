/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        ink: "#111111",
        paper: "#f8f7f4",
        line: "#e7e2da",
        rosewood: "#8f3d46",
        moss: "#556b4b",
        gold: "#b08a45",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(17, 17, 17, 0.08)",
      },
    },
  },
  plugins: [],
};
