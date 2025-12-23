/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The vibrant green used for Buttons & Success states
        primary: {
          DEFAULT: '#22C55E', // Green-500
          hover: '#16A34A',   // Green-600
          light: '#4ADE80',   // Green-400
        },
        // The deep dark background (Main App Background)
        background: '#0B0E11', 
        
        // Slightly lighter dark for Cards, Modals, and Sidebars
        surface: {
          DEFAULT: '#18181B', // Zinc-900
          light: '#27272A',   // Zinc-800
        },
        
        // The Yellow/Orange used for Matatu Icons on the map
        accent: '#F59E0B', // Amber-500
        
        // Text Colors
        text: {
          main: '#FFFFFF',
          muted: '#9CA3AF', // Gray-400
        }
      },
      fontFamily: {
        // Ensure you use a clean sans-serif font like Inter
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(34, 197, 94, 0.5)', // Green glow for active states
      }
    },
  },
  plugins: [],
}