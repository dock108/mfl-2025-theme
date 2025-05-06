module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  safelist: [
    'bg-accent',
    'text-accent',
    'border-accent',
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    colors: {
      bg: "#22252b",
      card: "#2d3038",
      alt: "#2a2d35",
      accent: "#32e3c0",
      text: "#e3e7ee",
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
    },
    extend: {},
  },
  plugins: [],
} 