/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f6f6f7',
          100: '#e8e9ec',
          200: '#cfd3d9',
          300: '#a8aebc',
          400: '#7d8597',
          500: '#5a6275',
          600: '#40485b',
          700: '#2c3242',
          800: '#1c1f2b',
          900: '#11131b'
        }
      },
      boxShadow: {
        glow: '0 12px 40px rgba(15, 15, 20, 0.15)'
      }
    }
  },
  plugins: []
}
