/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0f0e13",
        "surface-container-lowest": "#0a090d",
        "surface-container-low": "#15131b",
        "surface-container": "#1b1924",
        "surface-container-high": "#242130",
        "surface-container-highest": "#2e2b3d",
        "on-surface": "#f3f4f6",
        "on-surface-variant": "#a19dae",
        "outline-variant": "#3d374d",
        primary: "#d4af37",
        "primary-container": "#e0a96d",
        "on-primary-container": "#201402",
        secondary: "#b392ac",
        tertiary: "#10b981",
        error: "#f43f5e",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};