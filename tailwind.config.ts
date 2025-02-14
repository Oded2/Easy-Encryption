import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        quicksand: ['"Quicksand"', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
} satisfies Config;
