/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#154212",
        "primary-container": "#2d5a27",
        "on-primary": "#ffffff",
        "secondary-container": "#bfedd1",
        surface: "#f9faf6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f0",
        "surface-container": "#edeeea",
        "surface-container-high": "#e7e9e5",
        "on-surface": "#1a1c1a",
        "on-surface-variant": "#42493e",
        "outline-variant": "#c2c9bb",
        tertiary: "#602900",
        "tertiary-container": "#ffdbca",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        secondary: "#386a4a",
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'lg': '2rem',
        'xl': '3rem',
      },
      boxShadow: {
        'bloom': '0 24px 48px -12px rgba(26, 28, 26, 0.06)',
      }
    },
  },
  plugins: [],
}
