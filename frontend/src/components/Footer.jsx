import { Link, useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

export default function Footer() {
  const navigate = useNavigate();
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
        {/* Left: copyright + weather button */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: tk.green5, fontSize: 13, fontWeight: 600 }}>
            © 2025 RPS Fields
          </span>
          {/* WEATHER BUTTON — always in footer */}
          <button
            onClick={() => navigate("/weather")}
            style={{
              background: "rgba(116,198,157,0.18)", border: `1px solid ${tk.green6}`,
              color: tk.green5, borderRadius: 8, padding: "4px 13px",
              cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            🌤 Weather
          </button>
          <span style={{ color: tk.textLt, fontSize: 11 }}>📞 +91-9876543210</span>
          <span style={{ color: tk.textLt, fontSize: 11 }}>✉ hello@rpsfields.in</span>
        </div>

        {/* Right: links */}
        <div style={{ display: "flex", gap: 18 }}>
          {[
            ["Contact",  "/contact"],
            ["FAQ",      "/faq"],
            ["Privacy",  "/privacy"],
            ["Terms",    "/terms"],
            ["About",    "/about"],
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
