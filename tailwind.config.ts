/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        mob: "460px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "bg-main": "#195250",
        "bg-main-2": "#2a726f",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "margin-up-md": {
          from: {
            margin: "0 0 0 0",
          },
          to: {
            margin: "-6rem 0 0 0",
          },
        },
        "margin-up-sm": {
          from: {
            margin: "0 0 0 0",
          },
          to: {
            margin: "-3.75rem 0 0 0",
          },
        },
        "margin-up": {
          from: {
            margin: "0 0 0 0",
          },
          to: {
            margin: "-2.25rem 0 0 0",
          },
        },
        reveal: {
          from: {
            opacity: "0.5",
            transform: "scale(0.7)",
          },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "margin-up": "margin-up 0.5s forwards",
        "margin-up-sm": "margin-up-sm 0.5s forwards",
        "margin-up-md": "margin-up-md 0.5s forwards",
        reveal: "auto linear reveal both",
      },
      screens: {
        xsm: "420px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
