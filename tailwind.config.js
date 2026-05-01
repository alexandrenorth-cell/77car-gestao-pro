/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'racing': { 'blue': '#1e3a8a', 'dark': '#0f172a', 'darker': '#020617', 'accent': '#3b82f6' },
        '77': { 'green': '#25d366', 'gold': '#f59e0b' }
      },
      fontFamily: { 'inter': ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
}