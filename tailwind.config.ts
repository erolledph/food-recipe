import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      background: "var(--background)",
      foreground: "var(--foreground)",
      card: "var(--card)",
      "card-foreground": "var(--card-foreground)",
      popover: "var(--popover)",
      "popover-foreground": "var(--popover-foreground)",
      primary: "var(--primary)",
      "primary-foreground": "var(--primary-foreground)",
      secondary: "var(--secondary)",
      "secondary-foreground": "var(--secondary-foreground)",
      muted: "var(--muted)",
      "muted-foreground": "var(--muted-foreground)",
      accent: "var(--accent)",
      "accent-foreground": "var(--accent-foreground)",
      destructive: "var(--destructive)",
      "destructive-foreground": "var(--destructive-foreground)",
      border: "var(--border)",
      "shadow-gray": "var(--shadow-gray)",
      input: "var(--input)",
      ring: "var(--ring)",
      white: "#ffffff",
      black: "#000000",
      red: {
        600: "#dc3545",
      },
      green: {
        600: "#27ae60",
      },
      gray: {
        700: "#333333",
        800: "#1a1a1a",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  safelist: [
    "bg-primary",
    "text-primary",
    "border-primary",
    "border-shadow-gray",
    "text-shadow-gray",
    "bg-shadow-gray",
    "hover:bg-primary",
    "hover:text-primary",
    "focus:ring-primary",
  ],
  plugins: [],
}

export default config
