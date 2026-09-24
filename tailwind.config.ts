import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#9b3dff",
          silver: "#C0C0C0",
          purple: "#6A0DAD",
        },
      },
      fontFamily: {
        sans: ["var(--font-pangram)", "var(--font-roobert)", "system-ui", "sans-serif"],
        heading: ["var(--font-roobert)", "var(--font-pangram)", "sans-serif"],
        mono: ["var(--font-roobert-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
