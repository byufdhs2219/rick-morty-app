import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors untuk tema Rick and Morty
        'rick-blue': '#00b5cc',
        'morty-yellow': '#f0e14a',
        'portal-green': '#97ce4c',
      },
    },
  },
  plugins: [],
}
export default config
