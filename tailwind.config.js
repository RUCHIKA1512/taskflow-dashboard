/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#18181b",
        primary: {
          DEFAULT: "#8b5cf6", // Purple
          dark: "#7c3aed",
        },
        secondary: {
          DEFAULT: "#3b82f6", // Blue
          dark: "#2563eb",
        }
      }
    },
  },
  plugins: [],
}
