"use client";

import { useTheme } from "@/contexts/theme-context";

const Moon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Sun = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

interface Props {
  inline?: boolean;
}

export function ThemeToggle({ inline = false }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      style={{
        ...(inline ? {} : {
          position: "fixed",
          bottom: 72,
          right: 20,
          zIndex: 9999,
        }),
        width: 52,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)"}`,
        background: isDark ? "#1a1a2a" : "#ffffff",
        color: isDark ? "rgba(255,255,255,0.65)" : "#444455",
        cursor: "pointer",
        flexShrink: 0,
        transition: "color 0.15s, border-color 0.15s",
        fontFamily: "inherit",
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = isDark ? "#ffffff" : "#0f0f14";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.65)" : "#444455";
      }}
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}
