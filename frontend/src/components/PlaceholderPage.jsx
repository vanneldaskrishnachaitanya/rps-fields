import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

/**
 * PlaceholderPage — reusable stub used for pages still under construction.
 * Props:
 *   emoji       string   Large icon shown at top
 *   title       string   Page heading
 *   subtitle    string   Subheading / description
 *   badge       string   Optional badge label (e.g. "Customer Area")
 *   badgeColor  string   Badge bg color
 *   links       Array    [{ label, to, primary? }]  quick-nav buttons
 *   children    node     Optional extra content rendered below links
 */
export default function PlaceholderPage({
  emoji = "🚧",
  title = "Coming Soon",
  subtitle = "This page is under construction.",
  badge,
  badgeColor = "#40916c",
  links = [],
  children,
}) {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);

  return (
    <div style={{ background: tk.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" }}>

      {badge && (
        <span style={{ background: badgeColor, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20, display: "inline-block" }}>
          {badge}
        </span>
      )}

      <div style={{ fontSize: 72, marginBottom: 16 }}>{emoji}</div>

      <h1 style={{ fontSize: 30, fontFamily: "'Playfair Display', Georgia, serif", color: tk.text, marginBottom: 10 }}>
        {title}
      </h1>
      <p style={{ color: tk.textLt, fontSize: 15, maxWidth: 440, lineHeight: 1.7, marginBottom: 32 }}>
        {subtitle}
      </p>

      {links.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
          {links.map(({ label, to, primary }) => (
            <button key={to} onClick={() => navigate(to)}
              style={{
                background: primary ? "linear-gradient(135deg,#52b788,#40916c)" : "transparent",
                border: `1.5px solid ${primary ? "transparent" : tk.green7}`,
                color: primary ? "#fff" : tk.green7,
                padding: "10px 22px", borderRadius: 10,
                cursor: "pointer", fontWeight: 700, fontSize: 14,
                fontFamily: "inherit",
                boxShadow: primary ? "0 4px 14px rgba(82,183,136,0.3)" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {children && (
        <div style={{ background: tk.bgCard, border: `1px solid ${tk.border}`, borderRadius: 16, padding: "24px 32px", maxWidth: 480, width: "100%", boxShadow: tk.shadow }}>
          {children}
        </div>
      )}
    </div>
  );
}
