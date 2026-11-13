import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#244C38',
          dark: '#1A3829',
          light: '#2F6148',
        },
        sage: {
          DEFAULT: '#78916A',
          light: '#98AE8B',
          soft: '#E6ECE2',
        },
        ivory: {
          DEFAULT: '#F5F1E7',
          light: '#FAF8F3',
          dark: '#EAE3D2',
        },
        gold: {
          DEFAULT: '#D7B77C',
          dark: '#B89658',
        },
        terracotta: {
          DEFAULT: '#A66D52',
          dark: '#8A563E',
        },
        botanicalText: '#26352C',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        botanical: '0 10px 30px -10px rgba(36, 76, 56, 0.08)',
        cardHover: '0 20px 40px -15px rgba(36, 76, 56, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
