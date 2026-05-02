/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0D7A5F',
        accent: '#4DFFC3',
        background: '#F4F6F9',
        card: '#FFFFFF',
        text: '#1C2833',
        textSecondary: '#7F8C8D',
        warning: '#F39C12',
        error: '#E74C3C',
        success: '#0D7A5F',
      },
    },
  },
  plugins: [],
}
