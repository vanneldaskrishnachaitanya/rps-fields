import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark((d) => !d);
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// ── Token generator — call TK(dark) anywhere to get themed CSS values ────────
export const TK = (dark) => ({
  bg:        dark ? "#0d1f13" : "#f5f9f5",
  bgCard:    dark ? "#162b1d" : "#ffffff",
  bgMuted:   dark ? "#1c3525" : "#f0f7f1",
  bgInput:   dark ? "#1a2e20" : "#f0f7f1",
  border:    dark ? "#2a4a35" : "#d4e8d8",
  text:      dark ? "#e8f5eb" : "#1a2e1e",
  textMid:   dark ? "#8dbf97" : "#3d6b4f",
  textLt:    dark ? "#5a8f6a" : "#6b8f71",
  green9:    "#1b4332",
  green7:    "#40916c",
  green6:    "#52b788",
  green5:    "#74c69d",
  gold:      "#d4a017",
  shadow:    dark ? "0 4px 24px rgba(0,0,0,0.45)" : "0 4px 20px rgba(27,67,50,0.10)",
  shadowLg:  dark ? "0 8px 40px rgba(0,0,0,0.55)" : "0 8px 36px rgba(27,67,50,0.16)",
  chartGrid: dark ? "#2a4a35" : "#d4e8d8",
  headerBg:  dark
    ? "linear-gradient(135deg,#0a1a0f,#142a1c)"
    : "linear-gradient(135deg,#1b4332,#2d6a4f)",
  footerBg:  dark ? "#0a1a0f" : "#1b4332",
});
