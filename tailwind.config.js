/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      /* =========================
         COLORS
      ========================= */
      colors: {
        primary: {
          DEFAULT: "#10B981", // Emerald 500
          hover: "#059669",   // Emerald 600
          light: "#34D399",   // Emerald 400
        },
        secondary: {
          DEFAULT: "#14B8A6", // Teal 500
          hover: "#0D9488",   // Teal 600
        },
        
        /* BACKGROUNDS */
        background: "#020617", // Slate 950 (Deep dark)
        surface: "#0F172A",    // Slate 900
        "surface-light": "#1E293B", // Slate 800
        
        /* TEXT */
        text: {
          main: "#F8FAFC",    // Slate 50
          muted: "#94A3B8",   // Slate 400
          inverse: "#000000",
        },

        /* STATUS */
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },

      /* =========================
         TYPOGRAPHY
      ========================= */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },

      /* =========================
         EFFECTS
      ========================= */
      boxShadow: {
        glow: "0 0 20px rgba(16, 185, 129, 0.35)",
        "glow-lg": "0 0 40px rgba(16, 185, 129, 0.25)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },

      /* =========================
         ANIMATIONS
      ========================= */
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.6s ease-out forwards",
        pulseSlow: "pulseSlow 3s infinite ease-in-out",
      },
    },
  },

  plugins: [],
};
