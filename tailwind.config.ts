import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#cc684e',  // Logo turuncu rengi
        },
        secondary: {
          DEFAULT: '#20203f',  // Logo koyu lacivert
          light: '#fef6f1',    // Logo açık renk
        },
        // Dark mode temel renkleri
        slate: {
          100: '#e5e5e2',    // dark mode text için
          700: '#2C2D32',    // Input bg
          800: '#25262B',    // Card/Sidebar bg
          900: '#1A1B1E',    // Main bg
        },
        gray: {
          100: '#e5e5e2',    // dark mode text için
          700: '#2C2D32',  
          800: '#25262B',
          900: '#1A1B1E',
        },
        // İndigo paleti (badge'ler için)
        violet: {
          50: '#eef2ff',   // Light mode badge bg
          400: '#818cf8',  // Dark mode badge text
          500: '#6366f1',  // Light mode badge text
          600: '#4f46e5',  // Interactive elements
          900: '#312e81',  // Dark mode badge bg
        },
        // Yeşil ve mavi badge'ler için
        green: {
          400: '#4ade80',  // Dark mode badge
          500: '#22c55e',  // Light mode badge
          600: '#16a34a',  // Hover
        },
        blue: {
          400: '#60a5fa',  // Dark mode badge
          500: '#3b82f6',  // Light mode badge
          600: '#2563eb',  // Hover
        },
        white: {
          DEFAULT: '#ffffff',
          dark: '#e5e5e2',
        }
      },
      // Animasyon tanımları
      animation: {
        shine: "shine var(--duration) infinite linear",
      },
      keyframes: {
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          "100%": {
            "background-position": "0% 0%",
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class'
};

export default config;