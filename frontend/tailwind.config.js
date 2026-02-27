/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // class-based dark mode (required for ThemeContext)
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        //colors for pages
        pageBg: {
          light: "#ffffff",
          dark: "#111111",
        },
        pageText: {
          light: "#111111",
          dark: "#f5f5f5",
        },
        cardBg: {
          light: "#f9f9f9",
          dark: "#1a1a1a",
        },
      },
    },
  },

  plugins: [
    require("@tailwindcss/line-clamp"), // for truncating text
    require("@tailwindcss/typography"), // for blog/prose content
    require("daisyui"), // DaisyUI plugin
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#7c3aed",
          secondary: "#f59e0b",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#7c3aed",
          secondary: "#f59e0b",
        },
      },
    ],
    darkTheme: "dark", // tells DaisyUI which theme is dark
  },
};
