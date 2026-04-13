import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  useTheme();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <footer className="rps-footer" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
      height: isMobile ? 56 : 48,
      background: "rgba(3,10,5,0.90)",
      backdropFilter: "blur(24px) saturate(200%)",
      WebkitBackdropFilter: "blur(24px) saturate(200%)",
      borderTop: "1px solid rgba(82,183,136,0.18)",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      display: "flex", alignItems: "center",
    }}>
      <style>{`
        @media (max-width: 768px) {
          .rps-footer-inner {
            padding: 0 14px !important;
          }
          .rps-footer-left {
            gap: 8px !important;
          }
          .rps-footer-copy {
            font-size: 11px !important;
          }
          .rps-footer-links {
            gap: 10px !important;
          }
          .rps-footer-link {
            font-size: 11px !important;
          }
        }
      `}</style>
      <div className="rps-footer-inner" style={{ maxWidth:1320, margin:"0 auto", padding:"0 22px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap: 8 }}>
        <div className="rps-footer-left" style={{ display:"flex", alignItems:"center", gap:14, minWidth: 0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13 }}>🌿</span>
            <span className="rps-footer-copy" style={{ color:"rgba(255,255,255,0.42)", fontSize:12, fontFamily:"'Inter',sans-serif", fontWeight:500, whiteSpace: "nowrap" }}>© 2026 RPS Fields</span>
          </div>
          {!isMobile && <span style={{ color:"rgba(255,255,255,0.25)", fontSize:11, whiteSpace: "nowrap" }}>📞 +91-9876543210</span>}
        </div>
        <div className="rps-footer-links" style={{ display:"flex", gap:16, alignItems:"center", minWidth: 0 }}>
          {(isMobile ? [["Contact","/contact"],["FAQ","/faq"],["About","/about"]] : [["Contact","/contact"],["FAQ","/faq"],["Privacy","/privacy"],["Terms","/terms"],["About","/about"]]).map(([l,to])=>(
            <Link className="rps-footer-link" key={to} to={to} style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:500, textDecoration:"none", fontFamily:"'Inter',sans-serif", transition:"color 0.2s", whiteSpace: "nowrap" }}
              onMouseEnter={e=>e.target.style.color="#74c69d"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}
            >{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
