import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          400: "#ccc",
          500: "#aaa",
          900: "#333",
        },
        stone: {
          400: "#ddd",
          500: "#bbb",
          900: "#444",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "calc(var(--radius) - 1px)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        maxxlg: {
          max: "1400px",
        },
        maxlg: {
          max: "1200px",
        },
        maxmd: {
          max: "960px",
        },
        maxmdsm: {
          max: "700px",
        },
        maxsm: {
          max: "521px",
        },
        maxxsm: {
          max: "420px",
        },
        maxxxs: {
          max: "374px",
        },
        minxlg: {
          min: "1400px",
        },
        minlg: {
          min: "1200px",
        },
        minmd: {
          min: "960px",
        },
        minmdsm: {
          min: "700px",
        },
        minsm: {
          min: "521px",
        },
        minxsm: {
          min: "420px",
        },
        minxxs: {
          min: "374px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
