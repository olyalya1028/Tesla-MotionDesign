import type { Config } from "tailwindcss";

// Every value here is a 1:1 mirror of the Figma variable collection that
// used to live in styles.css's :root token block (see legacy-static/styles.css
// §1). Change a design value only here — components consume it by name.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // The Figma file ships a single 1440 desktop frame — every breakpoint
      // here is a documented max-width adaptation going down from it, so we
      // mirror that with custom max-width screens rather than Tailwind's
      // default min-width ones. See legacy-static/styles.css §16.
      screens: {
        "max-1100": { max: "1100px" },
        "max-900": { max: "900px" },
        "max-767": { max: "767px" },
        "max-480": { max: "480px" },
      },
      colors: {
        "royal-blue": "#4e6cda",
        "neutral-darkest": "#020809",
        "scheme1-bg": "#ffffff",
        "scheme1-fg": "#f2f2f2",
        "scheme1-text": "#020809",
        "scheme1-border": "rgba(2, 8, 9, 0.15)",
        "scheme3-bg": "#f2f2f2",
        "scheme3-text": "#020809",
        "scheme3-border": "rgba(2, 8, 9, 0.15)",
        // UI-state colour, not in the Figma frame — only the contact form's
        // invalid-field border and message use it.
        "form-error": "#c02b2b",
      },
      fontFamily: {
        sans: [
          "var(--font-manrope)",
          "Segoe UI",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      // Fluid between a 480px and a 1440px viewport; the upper bound is the
      // exact Figma value, so at >= 1440px the page stays pixel-faithful.
      fontSize: {
        small: "14px",
        regular: "16px",
        medium: "clamp(16px, 15.00px + 0.208vw, 18px)",
        "heading-6": "clamp(18px, 16.00px + 0.417vw, 22px)",
        "heading-5": "clamp(22px, 19.00px + 0.625vw, 28px)",
        "heading-4": "clamp(26px, 21.00px + 1.042vw, 36px)",
        "heading-3": "clamp(30px, 23.00px + 1.458vw, 44px)",
        "heading-2": "clamp(32px, 22.00px + 2.083vw, 52px)",
        "heading-1": "clamp(40px, 24.00px + 3.333vw, 72px)",
      },
      lineHeight: {
        tight2: "1.2",
        snug2: "1.3",
        relaxed2: "1.4",
        body: "1.5",
      },
      letterSpacing: {
        heading: "-0.01em",
      },
      spacing: {
        page: "clamp(20px, -2.00px + 4.583vw, 64px)",
        "section-lg": "clamp(64px, 40.00px + 5.000vw, 112px)",
        "section-md": "clamp(48px, 32.00px + 3.333vw, 80px)",
        "slider-gap": "clamp(16px, 3.333vw, 48px)",
      },
      maxWidth: {
        container: "1280px",
        footer: "920px",
      },
      width: {
        slide: "84.375%", // 1080 / 1280 — leaves the designed peek
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
        arrow: "4px",
      },
      height: {
        hero: "clamp(560px, 62.5vw, 900px)", // 900 / 1440 = 62.5%
      },
    },
  },
  plugins: [],
};

export default config;
