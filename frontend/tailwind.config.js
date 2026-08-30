import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    // One bespoke theme, applied via data-theme on <html>. Every surface in the
    // app reads from these tokens, so the palette lives here and nowhere else.
    themes: [
      {
        chattrix: {
          "color-scheme": "dark",

          // Crimson through to a deep burgundy: the `from-primary to-secondary`
          // gradients (logo mark, send button) resolve to an ember, not a bruise.
          primary: "#d8253f",
          "primary-content": "#fff4f5",
          secondary: "#7d1225",
          "secondary-content": "#ffe9ec",
          accent: "#a8182f",
          "accent-content": "#ffeef0",

          neutral: "#221a1c",
          "neutral-content": "#e9dfe1",

          // Near-black warmed by a trace of red so it sits with the primary
          // instead of fighting it.
          "base-100": "#141011",
          "base-200": "#1c1618",
          "base-300": "#2b2225",
          "base-content": "#f2eaeb",

          info: "#5aa9d6",
          success: "#3fb27f",
          warning: "#d99a2b",
          // Kept orange-leaning so destructive affordances (logout hover) stay
          // legible against a primary that is itself red.
          error: "#ff6b5f",
        },
      },
    ],
    darkTheme: "chattrix",
  },
}
