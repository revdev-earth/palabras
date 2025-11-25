import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f4f5fb",
          100: "#e7e8f5",
          200: "#cfd2ea",
          300: "#a9afd9",
          400: "#7b83c3",
          500: "#5961ab",
          600: "#43488d",
          700: "#383c73",
          800: "#30355f",
          900: "#292d4f",
        },
      },
      boxShadow: {
        soft: "0 10px 40px -16px rgba(45, 55, 75, 0.35)",
      },
    },
  },
  plugins: [],
}

export default config
