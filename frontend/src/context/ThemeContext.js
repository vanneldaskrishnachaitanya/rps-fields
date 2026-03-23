import { createContext, useContext, useState } from "react";
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);

export const TK = (dark) => ({
  // ── Backgrounds
  bg:       dark ? "#040d06"  : "#f0f7f2",
  bgCard:   dark ? "#0c1a0f"  : "#ffffff",
  bgMuted:  dark ? "#111f14"  : "#e8f5eb",
  bgInput:  dark ? "#111f14"  : "#f0f7f2",
  // ── Borders
  border:   dark ? "#1a3320"  : "#c2dfc9",
  // ── Text — clear and readable in both modes
  text:     dark ? "#e8f5eb"  : "#0a1a0c",
  textMid:  dark ? "#74c69d"  : "#1a4a28",
  textLt:   dark ? "#3d6b4a"  : "#5a8a68",
  // ── Brand greens
  green9:   "#030d05",
  green8:   "#0d2b1a",
  green7:   "#1b4332",
  green6:   "#2d6a4f",
  green5:   "#40916c",
  green4:   "#52b788",
  green3:   "#74c69d",
  green2:   "#95d5b2",
  // ── Accents
  gold:     "#c8960c",
  goldBr:   "#d4a017",
  red:      "#dc2626",
  blue:     "#2563eb",
  purple:   "#7c3aed",
  orange:   "#d97706",
  // ── Shadows
  shadow:   dark ? "0 2px 16px rgba(0,0,0,0.5)"  : "0 2px 12px rgba(10,26,12,0.08)",
  shadowMd: dark ? "0 4px 28px rgba(0,0,0,0.55)" : "0 4px 20px rgba(10,26,12,0.12)",
  shadowLg: dark ? "0 8px 48px rgba(0,0,0,0.65)" : "0 8px 36px rgba(10,26,12,0.15)",
  // ── Header / Footer
  headerBg: dark ? "rgba(4,13,6,0.92)"  : "rgba(3,13,5,0.92)",
  footerBg: dark ? "rgba(4,13,6,0.95)"  : "rgba(3,13,5,0.95)",
  // ── Chart
  chartGrid: dark ? "#1a3320" : "#c2dfc9",
});
