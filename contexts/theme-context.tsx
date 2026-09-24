"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type ThemePreference = "system" | "dark" | "light";
type Theme = "dark" | "light";

interface ThemeContextValue {
  preference: ThemePreference;
  theme: Theme;
  setPreference: (p: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  theme: "dark",
  setPreference: () => {},
  toggle: () => {},
});

export function useTheme() { return useContext(ThemeContext); }

function getStored(): ThemePreference {
  if (typeof localStorage === "undefined") return "system";
  const s = localStorage.getItem("nx-storage-theme");
  if (s === "dark" || s === "light" || s === "system") return s;
  return "system";
}

function systemIsDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(pref: ThemePreference): Theme {
  if (pref === "system") return systemIsDark() ? "dark" : "light";
  return pref;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = getStored();
    setPreferenceState(stored);
    setTheme(resolve(stored));
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [theme]);

  function setPreference(p: ThemePreference) {
    setPreferenceState(p);
    const resolved = resolve(p);
    setTheme(resolved);
    localStorage.setItem("nx-storage-theme", p);
  }

  const toggle = () => setPreference(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ preference, theme, setPreference, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
