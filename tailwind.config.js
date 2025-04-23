module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E88E5', // Modern blue for buttons and accents
          light: '#6AB7F5',
          dark: '#1565C0',
        },
        background: '#F9FAFB', // Light gray background
        text: {
          primary: '#111827', // Dark gray for main text
          secondary: '#6B7280', // Lighter gray for secondary text
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  safelist: ['rounded-md', 'shadow-sm', 'border-gray-200', 'bg-white', 'bg-gray-50', 'hover:bg-gray-100'],
  plugins: [require('tailwindcss-animate')],
};