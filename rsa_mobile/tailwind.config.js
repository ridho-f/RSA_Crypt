/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand_400Regular", "sans-serif"],
        script: ["DancingScript_700Bold", "cursive"],
        mono: ["JetBrainsMono_400Regular", "monospace"],
      },
      colors: {
        fem: {
          primary: "#f472b6",
          secondary: "#a78bfa",
          accent: "#fbcfe8",
          dark: "#831843",
          bg: "#fff1f2",
          glass: "rgba(255, 255, 255, 0.65)",
        },
        ios: {
            blue: "#007AFF",
            green: "#34C759",
            indigo: "#5856D6",
            orange: "#FF9500",
            pink: "#FF2D55",
            purple: "#AF52DE",
            red: "#FF3B30",
            teal: "#5AC8FA",
            yellow: "#FFCC00",
            gray: "#8E8E93",
            gray2: "#AEAEB2",
            gray3: "#C7C7CC",
            gray4: "#D1D1D6",
            gray5: "#E5E5EA",
            gray6: "#F2F2F7",
        }
      },
      boxShadow: {
        'ios': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'ios-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    }
  },
  plugins: [],
}
