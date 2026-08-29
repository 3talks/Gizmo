import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F5F8",
        surface: "#FFFFFF",
        ink: "#12141A",
        "ink-soft": "#63687A",
        "ink-faint": "#9BA0AE",
        accent: "#3355FF",
        "accent-deep": "#1E2E99",
        "accent-soft": "#E7ECFF",
        amber: "#FF9F1C",
        "amber-soft": "#FFF1DC",
        green: "#1FAA59",
        line: "#E5E7ED",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        s: "12px",
        m: "18px",
        l: "28px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(18,20,26,0.05), 0 1px 2px rgba(18,20,26,0.04)",
        pop: "0 12px 30px rgba(30,46,153,0.18)",
      },
      keyframes: {
        heartBurst: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.35)" },
          "60%": { transform: "scale(.9)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(-14px) scale(.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pageIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        heroFade: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        heartBurst: "heartBurst .45s ease",
        shimmer: "shimmer 1.4s infinite",
        marquee: "marquee 18s linear infinite",
        marqueeReverse: "marqueeReverse 24s linear infinite",
        toastIn: "toastIn .35s cubic-bezier(.2,.85,.3,1)",
        pageIn: "pageIn .35s cubic-bezier(.2,.8,.3,1)",
        heroFade: "heroFade .6s cubic-bezier(.2,.8,.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
