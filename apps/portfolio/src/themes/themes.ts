export const themeStructure = {
  default: "classic",
} as const;

export type ThemeName = keyof typeof themeStructure; // "default"

export function isThemeName(value: string): value is ThemeName {
  return Object.hasOwn(themeStructure, value);
}
