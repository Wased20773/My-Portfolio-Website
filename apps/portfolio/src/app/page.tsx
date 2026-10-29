"use client";

import { useTheme } from "@/themes/ThemeProvider";
import { useTerminal } from "@/lib/useTerminal";
import { themeStructure } from "@/themes/themes";
import { layouts } from "@/themes/structures";

export default function Home() {
  const terminal = useTerminal();
  const { theme } = useTheme();

  const Layout = layouts[themeStructure[theme]];
  return <Layout terminal={terminal} />; // HTML, swapped on theme change
}
