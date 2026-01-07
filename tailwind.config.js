/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* BRAND */
        primary: {
          DEFAULT: "#22C55E", // Green (actions, money)
          hover: "#16A34A",
          light: "#4ADE80",
        },

        secondary: {
          DEFAULT: "#2563EB", // Blue (navigation, trust)
          hover: "#1D4ED8",
          light: "#DBEAFE",
        },

        /* BACKGROUNDS */
        background: "#ffffff",
        surface: "#F8FAFC",
        "surface-dark": "#0B0E11",

        /* TEXT */
        text: {
          main: "#0F172A",
          muted: "#64748B",
          inverse: "#FFFFFF",
        },

        /* STATUS */
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 15px rgba(34, 197, 94, 0.4)",
      },
    },
  },
  plugins: [],
};
