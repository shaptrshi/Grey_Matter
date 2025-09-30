/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "custom-green": "#3c8070",
        "custom-accent-green": "#9fc9c0",
        "custom-green-1": "#a9ded1",
        "custom-dark": "#121212",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
