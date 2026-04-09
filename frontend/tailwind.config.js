module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "login-shine": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "40%": { transform: "translateY(-10px)", opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.55s ease-out forwards",
        "login-shine": "login-shine 2.4s ease-in-out infinite",
        "dot-bounce": "dot-bounce 1.75s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};