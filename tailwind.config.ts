import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      maxWidth: {
        screen: "100vw",
      },
      fontFamily: {
        quicksand: ['"Quicksand"', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;
