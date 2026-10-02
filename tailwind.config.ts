import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { ink: '#101828', paper: '#F2F4F8', volt: '#3B2FE0', signal: '#FF6A1A' },
    fontFamily: { display: ['var(--font-sora)'], sans: ['var(--font-manrope)'] },
  } },
} satisfies Config
