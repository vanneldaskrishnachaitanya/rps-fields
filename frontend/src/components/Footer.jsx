import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { dark } = useTheme();
  return (
    <footer style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
      height: 48,
      background: "rgba(3,10,5,0.90)",
      backdropFilter: "blur(24px) saturate(200%)",
      WebkitBackdropFilter: "blur(24px) saturate(200%)",
      borderTop: "1px solid rgba(82,183,136,0.18)",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 22px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13 }}>🌿</span>
            <span style={{ color:"rgba(255,255,255,0.42)", fontSize:12, fontFamily:"'Inter',sans-serif", fontWeight:500 }}>© 2026 RPS Fields</span>
          </div>
          <span style={{ color:"rgba(255,255,255,0.25)", fontSize:11 }}>📞 +91-9876543210</span>
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          {[["Contact","/contact"],["FAQ","/faq"],["Privacy","/privacy"],["Terms","/terms"],["About","/about"]].map(([l,to])=>(
            <Link key={to} to={to} style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:500, textDecoration:"none", fontFamily:"'Inter',sans-serif", transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="#74c69d"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}
            >{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
