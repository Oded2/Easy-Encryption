import type { Config } from 'tailwindcss';
import daisyui from "daisyui"
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        quicksand: ['"Quicksand"', ...defaultTheme.fontFamily.sans]
      }
    }
  },

  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "corporate"], // Add desired themes here
    base: true, // Include base styles
    styled: true, // Include component styles
    utils: true, // Include utility classes
    logs: true, // Show logs in the console
    rtl: false, // Disable right-to-left support
    darkTheme: "dark", // Default dark theme
  },
} satisfies Config;
