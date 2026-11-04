export const themeStructure = {
  default: "classic",
} as const;

export type ThemeName = keyof typeof themeStructure; // "default"

export function isThemeName(value: string): value is ThemeName {
  return Object.hasOwn(themeStructure, value);
}

export const modes = ["light", "dark"] as const;

export type Mode = (typeof modes)[number];

export function isModeName(value: string): value is Mode {
  return (modes as readonly string[]).includes(value);
}
