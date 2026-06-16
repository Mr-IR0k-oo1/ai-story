import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      keyframes: {
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.3" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "bounce-dot": "bounce-dot 1.4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
      },
      colors: {
        surface: "#0a0a0f",
        card: "#111118",
        border: "#1e1e29",
        accent: {
          DEFAULT: "#f59e0b",
          muted: "#f59e0b66",
        },
      },
    },
  },
  plugins: [],
};

export default config;
