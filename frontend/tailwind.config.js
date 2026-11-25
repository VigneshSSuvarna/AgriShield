/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F6F2E9',
        'paper-alt': '#EFE9DC',
        card: '#FCFBF7',
        ink: '#1F2A1E',
        'ink-muted': '#4E5B4C',
        'ink-faint': '#6F7B6C',
        rule: '#D6CFC0',
        'rule-strong': '#B8AF9C',
        accent: '#B8502B',
        'accent-hover': '#9B4121',
        'accent-soft': '#F6E5DC',
        healthy: '#3B6E4C',
        'healthy-soft': '#E4EFE7',
        disease: '#A83B28',
        'disease-soft': '#F9E6E2',
        caution: '#9A6315',
        'caution-soft': '#F7EEDB',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}