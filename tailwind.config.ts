import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505", // Deep black/gray
        surface: "#0A0A0A", // Slightly lighter for cards
        "neon-green": "#00FF88",
        "neon-green-dim": "rgba(0, 255, 136, 0.1)",
        error: "#FF3333",
        warning: "#FFCC00",
        border: "#222222",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "neon": "0 0 10px rgba(0, 255, 136, 0.5)",
        "neon-sm": "0 0 5px rgba(0, 255, 136, 0.3)",
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
export default config;
