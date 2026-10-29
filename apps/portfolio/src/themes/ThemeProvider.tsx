"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeName } from "./themes";

type ThemeContextValues = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

// 1. The "box" that components reach into. null = nobody wrapped the app yet.
const ThemeContext = createContext<ThemeContextValues | null>(null);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // 2. The actual theme state
  const [theme, setTheme] = useState<ThemeName>("default");

  // 3. Whenever theme changes, write it onto <html data-theme="...">
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // 4. Put { theme, setTheme } into the box for everything inside
  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

// 5. Shortcut components use: const { theme, setTheme } = useTheme();
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
