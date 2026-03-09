import { Link } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

export default function Footer() {
  const { dark } = useTheme();
  const tk = TK(dark);

  const linkStyle = {
    color: tk.green5, fontSize: 12, cursor: "pointer",
    fontWeight: 600, textDecoration: "none", transition: "color 0.2s",
  };

  return (
    <footer style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: tk.footerBg, height: 52,
      display: "flex", alignItems: "center",
      borderTop: `2px solid ${tk.green7}`,
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 20px", width: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: tk.green5, fontSize: 13, fontWeight: 600 }}>
          © 2025 RPS Fields — Farm Fresh Direct
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            ["Contact",         "/contact"],
            ["FAQ",             "/faq"],
            ["Privacy Policy",  "/privacy"],
            ["Terms",           "/terms"],
            ["About",           "/about"],
          ].map(([label, to]) => (
            <Link key={to} to={to} style={linkStyle}
              onMouseEnter={e => (e.target.style.color = "#fff")}
              onMouseLeave={e => (e.target.style.color = tk.green5)}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
