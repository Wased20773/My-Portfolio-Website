"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeName } from "./themes";

export type Mode = "light" | "dark";

type ThemeContextValues = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
};

// 1. The "box" that components reach into. null = nobody wrapped the app yet.
const ThemeContext = createContext<ThemeContextValues | null>(null);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // 2. The actual theme state
  const [theme, setTheme] = useState<ThemeName>("default");
  const [mode, setMode] = useState<Mode>("dark");

  // 3a. Whenever theme changes, write it onto <html data-theme="...">
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // 3b. Whenever mode changes, write it onto <html data-mode="...">
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  // 4. Put { theme, setTheme } into the box for everything inside
  return (
    <ThemeContext value={{ theme, setTheme, mode, setMode }}>
      {children}
    </ThemeContext>
  );
}

// 5. Shortcut components use: const { theme, setTheme } = useTheme();
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
