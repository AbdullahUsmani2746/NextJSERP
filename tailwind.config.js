/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
		primary: "#5A67D8",  // custom primary color
        secondary: "#ECC94B", // custom secondary color
        accent: "#F56565",    // custom accent color
        text: "#2D3748", // custom text color
        background: "#FFFFFF", // White background
        foreground: "#000000", // Black text color

        card: {
          DEFAULT: "#FFFFFF", // White card background
          foreground: "#000000", // Black text color for cards
        },

        popover: {
          DEFAULT: "#FFFFFF", // White popover background
          foreground: "#000000", // Black text color for popovers
        },

        primary: {
          DEFAULT: "#A40C0D", // Primary red color
          foreground: "#A40C0D", // White text on red buttons
        },

        secondary: {
          DEFAULT: "#A40C0D", // Secondary red for accents
          foreground: "#A40C0D", // White text color for secondary elements
        },

        muted: {
          DEFAULT: "#F0F0F0", // Light gray muted background
          foreground: "#A40C0D", // Red text for muted elements
        },

        accent: {
          DEFAULT: "#A40C0D", // Red accent color
          foreground: "#FFFFFF", // White text on red accents
        },

        destructive: {
          DEFAULT: "#A40C0D", // Red for destructive actions
          foreground: "#FFFFFF", // White text on destructive actions
        },

        border: "#D1D5DB", // Light gray border
        input: "#F3F4F6", // Light gray for input fields
        ring: "#A40C0D", // Red ring for focus
        chart: {
          1: "#A40C0D", // Chart red color
          2: "#F8D7DA", // Light red for charts
          3: "#A40C0D",
          4: "#F8D7DA",
          5: "#A40C0D",
        },

        sidebar: {
          DEFAULT: "#FFFFFF", // White sidebar background
          foreground: "#000000", // Black text color for sidebar
          primary: "#A40C0D", // Red sidebar primary
          "primary-foreground": "#FFFFFF", // White text on red sidebar primary
          accent: "#F0F0F0", // Light gray sidebar accent
          "accent-foreground": "#A40C0D", // Red text on accent elements
          border: "#D1D5DB", // Gray border for sidebar
          ring: "#A40C0D", // Red ring for sidebar
        },
      },

      borderRadius: {
        lg: "var(--radius)", // Use custom radius
        md: "calc(var(--radius) - 2px)", // Use custom radius
        sm: "calc(var(--radius) - 4px)", // Use custom radius
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
