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
          blue:   "#9b3dff",
          silver: "#C0C0C0",
          purple: "#6A0DAD",
        },
        ds: {
          bg: {
            base:   "var(--ds-bg-base)",
            card:   "var(--ds-bg-card)",
            subtle: "var(--ds-bg-subtle)",
            hover:  "var(--ds-bg-hover)",
          },
          border: {
            DEFAULT: "var(--ds-border)",
            strong:  "var(--ds-border-strong)",
            brand:   "var(--ds-border-brand)",
          },
          text: {
            primary:   "var(--ds-text-primary)",
            secondary: "var(--ds-text-secondary)",
            tertiary:  "var(--ds-text-tertiary)",
            muted:     "var(--ds-text-muted)",
          },
          brand: {
            DEFAULT: "var(--ds-brand)",
            hover:   "var(--ds-brand-hover)",
            muted:   "var(--ds-brand-muted)",
          },
          success: "var(--ds-success)",
          error:   "var(--ds-error)",
          warning: "var(--ds-warning)",
          info:    "var(--ds-info)",
        },
      },
      fontFamily: {
        sans:    ["var(--font-pangram)", "var(--font-roobert)", "system-ui", "sans-serif"],
        heading: ["var(--font-roobert)", "var(--font-pangram)", "sans-serif"],
        mono:    ["var(--font-roobert-mono)", "monospace"],
      },
      borderRadius: {
        xs:  "6px",
        sm:  "8px",
        md:  "10px",
        lg:  "12px",
        xl:  "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        "ds-sm":  "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        "ds-md":  "0 4px 12px rgba(0,0,0,0.35)",
        "ds-lg":  "0 8px 32px rgba(0,0,0,0.4)",
        "ds-brand": "0 0 24px -6px rgba(155,61,255,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
