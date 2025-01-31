import { transform } from 'typescript';

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Public Sans"', ...defaultTheme.fontFamily.sans
        ]
      },
      keyframes: {
        livestatus: {
        },
        textswipe: {
          "40%": { transform: 'translateX(0)' },
          "48%": { transform: 'translateX(-150%)', opacity: '1' },
          "49%": { opacity: '0' },
          "54%": { transform: 'translateX(150%)', opacity: '0' },
          "58%": { opacity: '1' },
          "65%": { transform: 'translateX(0)' }
        },
        endless: {
          "0%": { transform: 'translateX(var(--scroll-start, 0))' },
          "100%": { transform: 'translateX(var(--scroll-end, -100%))' }
        }
      },
      animation: {
        textswipe: 'textswipe 10s ease-in-out infinite',
        endless: 'endless var(--duration, 10s) linear infinite var(--play-state, running)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-gradient-mask-image")],
}
