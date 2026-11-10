/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f2a3d',
        brand: {
          50: '#eef6fb',
          100: '#d6e9f5',
          200: '#b0d4ea',
          500: '#2b82b9',
          600: '#1f6b9f',
          700: '#18557f',
          800: '#134464',
        },
        due: { DEFAULT: '#b45309', tint: '#fef3e2' },
        repeat: { DEFAULT: '#be123c', tint: '#fde8ec' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,42,61,.06), 0 6px 20px rgba(15,42,61,.06)',
        lift: '0 10px 40px rgba(15,42,61,.18)',
      },
      fontFamily: {
        // System stacks only: the app must work offline and under a no-network CSP.
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', '"Noto Sans Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
