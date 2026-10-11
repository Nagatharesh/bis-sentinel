/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#1E1B4B',
          900: '#312E81',
          800: '#3730A3',
          700: '#4338CA',
          600: '#4F46E5',
          500: '#6366F1',
          100: '#E0E7FF',
          50: '#EEF2FF',
        },
        surface: {
          50: '#FBFBFA',
          100: '#F5F5F3',
          200: '#EAEAE7',
          300: '#D5D5D0',
        },
        supported: {
          DEFAULT: '#0D9488',
          light: '#F0FDFA',
          border: '#99F6E4',
          dark: '#115E59',
        },
        review: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
          border: '#FDE68A',
          dark: '#92400E',
        },
        unknown: {
          DEFAULT: '#64748B',
          light: '#F8FAFC',
          border: '#CBD5E1',
          dark: '#334155',
        },
        contradiction: {
          DEFAULT: '#E11D48',
          light: '#FFF1F2',
          border: '#FECDD3',
          dark: '#9F1239',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        float: '0 20px 25px -5px rgba(49, 46, 129, 0.15), 0 8px 10px -6px rgba(49, 46, 129, 0.1)',
      },
    },
  },
  plugins: [],
};
