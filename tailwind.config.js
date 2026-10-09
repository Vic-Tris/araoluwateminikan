/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#070b17',
        starlight: '#e7d6a7',
        roseGold: '#f4c7a5',
        ember: '#fbbf24',
      },
      boxShadow: {
        glow: '0 0 30px rgba(251, 191, 36, 0.35)',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
