import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: dark ? "rgba(6,15,9,0.97)" : "rgba(13,43,26,0.97)",
      backdropFilter: "blur(16px)",
      height: 50,
      display: "flex", alignItems: "center",
      borderTop: "1px solid rgba(82,183,136,0.25)",
    }}>
      <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 24px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:14 }}>🌿</span>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600 }}>© 2026 RPS Fields</span>
          </div>
          <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11 }}>📞 +91-9876543210</span>
          <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11, display:"none" }} className="hide-mobile">✉ hello@rpsfields.in</span>
        </div>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          {[["Contact","/contact"],["FAQ","/faq"],["Privacy","/privacy"],["Terms","/terms"],["About","/about"]].map(([l,to]) => (
            <Link key={to} to={to} style={{ color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:600, textDecoration:"none", transition:"color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#74c69d"}
              onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.4)"}
            >{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
