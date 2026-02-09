import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
