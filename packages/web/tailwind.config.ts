import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../shared/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          bg: '#f5f2ed',
          surface: '#faf8f5',
          card: '#eeeae3',
          border: '#ddd8cd',
        },
        ink: '#2e2118',
        medium: '#7a6a5a',
        dim: '#b0a090',
        accent: '#d4621a',
        danger: '#c0392b',
      },
      fontFamily: {
        heading: ["'Times New Roman'", 'Times', 'serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'sans-serif'],
        number: ['Georgia', "'Times New Roman'", 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
