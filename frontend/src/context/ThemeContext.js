import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

export const TK = (dark) => ({
  bg:        dark ? "#080f09" : "#f4f9f5",
  bgCard:    dark ? "#101e14" : "#ffffff",
  bgMuted:   dark ? "#162b1d" : "#eef7f0",
  bgInput:   dark ? "#162b1d" : "#f0f7f1",
  border:    dark ? "#1e3a28" : "#cce5d4",
  text:      dark ? "#e8f5eb" : "#0f1e12",
  textMid:   dark ? "#7ab890" : "#2d5a3d",
  textLt:    dark ? "#4a7a5a" : "#6b9e78",
  green9:    "#0d2b1a",
  green8:    "#1b4332",
  green7:    "#2d6a4f",
  green6:    "#40916c",
  green5:    "#52b788",
  green4:    "#74c69d",
  green3:    "#95d5b2",
  gold:      "#d4a017",
  goldLt:    "#f4c842",
  red:       "#ef4444",
  blue:      "#3b82f6",
  purple:    "#8b5cf6",
  shadow:    dark ? "0 2px 20px rgba(0,0,0,0.5)" : "0 2px 16px rgba(15,30,18,0.08)",
  shadowMd:  dark ? "0 4px 30px rgba(0,0,0,0.55)" : "0 4px 24px rgba(15,30,18,0.12)",
  shadowLg:  dark ? "0 8px 48px rgba(0,0,0,0.6)"  : "0 8px 40px rgba(15,30,18,0.16)",
  chartGrid: dark ? "#1e3a28" : "#cce5d4",
  headerBg:  dark ? "linear-gradient(135deg,#060f09,#0f1e12)" : "linear-gradient(135deg,#0d2b1a,#1b4332)",
  footerBg:  dark ? "#060f09" : "#0d2b1a",
  radius:    "16px",
  radiusLg:  "22px",
  radiusPill:"50px",
});
