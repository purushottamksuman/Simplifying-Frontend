module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "app-muted": "var(--app-muted)",
        designresetcommanatee: "var(--designresetcommanatee)",
        "designresetcomoxford-blue": "var(--designresetcomoxford-blue)",
        "object-black-60": "var(--object-black-60)",
        "object-black-90": "var(--object-black-90)",
        "place-holder": "var(--place-holder)",
        primaryone: "var(--primaryone)",
        "river-bed": "var(--river-bed)",
        "wwwfigmacomathens-gray": "var(--wwwfigmacomathens-gray)",
        "wwwfigmacomblue-ribbon": "var(--wwwfigmacomblue-ribbon)",
        "wwwfigmacomcod-gray": "var(--wwwfigmacomcod-gray)",
        wwwfigmacomfeta: "var(--wwwfigmacomfeta)",
        "wwwfigmacomfun-green": "var(--wwwfigmacomfun-green)",
        "wwwfigmacomgreen-haze": "var(--wwwfigmacomgreen-haze)",
        "wwwfigmacomice-cold": "var(--wwwfigmacomice-cold)",
        wwwfigmacommirage: "var(--wwwfigmacommirage)",
        "wwwfigmacomriver-bed": "var(--wwwfigmacomriver-bed)",
        "wwwfigmacomselective-yellow": "var(--wwwfigmacomselective-yellow)",
        "wwwfigmacomstorm-gray": "var(--wwwfigmacomstorm-gray)",
        wwwfigmacomwhite: "var(--wwwfigmacomwhite)",
        wwwsimplilearncomblack: "var(--wwwsimplilearncomblack)",
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
      },
      fontFamily: {
        "www-figma-com-segoe-UI-bold":
          "var(--www-figma-com-segoe-UI-bold-font-family)",
        "www-figma-com-segoe-UI-emoji-regular":
          "var(--www-figma-com-segoe-UI-emoji-regular-font-family)",
        "www-figma-com-segoe-UI-regular":
          "var(--www-figma-com-segoe-UI-regular-font-family)",
        "www-figma-com-segoe-UI-semibold":
          "var(--www-figma-com-segoe-UI-semibold-font-family)",
        "www-figma-com-semantic-button":
          "var(--www-figma-com-semantic-button-font-family)",
        "www-figma-com-semantic-heading-3":
          "var(--www-figma-com-semantic-heading-3-font-family)",
        "www-figma-com-semantic-heading-4":
          "var(--www-figma-com-semantic-heading-4-font-family)",
        "www-figma-com-semantic-input":
          "var(--www-figma-com-semantic-input-font-family)",
        "www-figma-com-semantic-label":
          "var(--www-figma-com-semantic-label-font-family)",
        "www-figma-com-semantic-textarea":
          "var(--www-figma-com-semantic-textarea-font-family)",
        "www-simplilearn-com-semantic-heading-3-title":
          "var(--www-simplilearn-com-semantic-heading-3-title-font-family)",
        "www-simplilearn-com-semantic-label":
          "var(--www-simplilearn-com-semantic-label-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "cards-long-default": "var(--cards-long-default)",
        "images-medium": "var(--images-medium)",
      },
      borderRadius: {
        lg: "var(--radius)",
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
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
