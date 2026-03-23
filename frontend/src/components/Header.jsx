import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { itemCount } = useCart();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const tk = TK(dark);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const goTo = path => { setMenuOpen(false); navigate(path); };
  const handleLogout = () => { logout(); navigate("/"); };
  const mobileLogout = () => { setMenuOpen(false); logout(); navigate("/"); };

  const dashPath = () => {
    if (!user) return "/";
    if (user.role === "farmer")   return "/farmer/dashboard";
    if (user.role === "agent")    return "/agent/dashboard";
    if (user.role === "customer") return "/customer/dashboard";
    if (user.role === "admin")    return "/admin/dashboard";
    return "/";
  };

  const nb = (isActive, override = {}) => ({
    background: isActive ? "rgba(82,183,136,0.2)" : "transparent",
    border: `1px solid ${isActive ? "rgba(82,183,136,0.6)" : "rgba(255,255,255,0.15)"}`,
    color: isActive ? "#74c69d" : "rgba(255,255,255,0.85)",
    padding: "7px 13px", borderRadius: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 700,
    transition: "all 0.2s", fontFamily: "inherit",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
    ...override,
  });

  const ml = (color = "rgba(255,255,255,0.88)") => ({
    display: "block", width: "100%", padding: "12px 20px",
    color, fontSize: 14, fontWeight: 700, cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    textDecoration: "none", background: "transparent", border: "none",
    textAlign: "left", fontFamily: "inherit", boxSizing: "border-box",
    transition: "background 0.15s",
  });

  return (
    <>
      <style>{`
        .rps-nav       { display: flex !important; }
        .rps-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .rps-nav       { display: none  !important; }
          .rps-hamburger { display: flex  !important; }
        }
        .nav-link:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
        .mobile-link:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 66,
        background: scrolled
          ? dark ? "rgba(6,15,9,0.97)" : "rgba(13,43,26,0.97)"
          : tk.headerBg,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.4)" : "0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center",
        borderBottom: scrolled ? "none" : "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 24px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0, userSelect:"none" }}
            onClick={() => navigate("/")}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#52b788,#2d6a4f)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 12px rgba(82,183,136,0.3)" }}>🌿</div>
            <div>
              <span style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:19, letterSpacing:"-0.3px" }}>RPS Fields</span>
              <span style={{ color:"#52b788", fontSize:8, display:"block", letterSpacing:"2.5px", textTransform:"uppercase", marginTop:-1, opacity:0.8 }}>Farm Fresh Direct</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="rps-nav" style={{ alignItems:"center", gap:3, flexWrap:"nowrap" }}>
            <NavLink to="/" end className="nav-link" style={({ isActive }) => nb(isActive)}>🏠 Home</NavLink>
            <NavLink to="/catalog" className="nav-link" style={({ isActive }) => nb(isActive)}>🛒 Catalog</NavLink>
            <NavLink to="/weather" className="nav-link" style={({ isActive }) => nb(isActive, { background: isActive?"rgba(116,198,157,0.2)":"transparent", borderColor: isActive?"rgba(116,198,157,0.5)":"rgba(255,255,255,0.15)" })}>🌤 Weather</NavLink>

            {user?.role === "farmer" && (<>
              <NavLink to="/farmer/dashboard"   className="nav-link" style={({ isActive }) => nb(isActive, { background:isActive?"rgba(212,160,23,0.25)":"transparent", borderColor:isActive?"rgba(212,160,23,0.6)":"rgba(255,255,255,0.15)", color:isActive?"#fcd34d":"rgba(255,255,255,0.85)" })}>🌾 My Farm</NavLink>
              <NavLink to="/farmer/orders"      className="nav-link" style={({ isActive }) => nb(isActive)}>📦 Orders</NavLink>
              <NavLink to="/farmer/find-agents" className="nav-link" style={({ isActive }) => nb(isActive)}>🤝 Agents</NavLink>
            </>)}

            {user?.role === "agent" && (<>
              <NavLink to="/agent/dashboard" className="nav-link" style={({ isActive }) => nb(isActive, { background:isActive?"rgba(59,130,246,0.25)":"transparent", borderColor:isActive?"rgba(59,130,246,0.6)":"rgba(255,255,255,0.15)", color:isActive?"#93c5fd":"rgba(255,255,255,0.85)" })}>🏢 Hub</NavLink>
              <NavLink to="/agent/products"  className="nav-link" style={({ isActive }) => nb(isActive)}>📦 Products</NavLink>
              <NavLink to="/agent/orders"    className="nav-link" style={({ isActive }) => nb(isActive)}>🛒 Orders</NavLink>
            </>)}

            {user?.role === "customer" && (<>
              <NavLink to="/customer/dashboard" className="nav-link" style={({ isActive }) => nb(isActive)}>📊 Dashboard</NavLink>
              <NavLink to="/orders"             className="nav-link" style={({ isActive }) => nb(isActive)}>📦 Orders</NavLink>
            </>)}

            {user?.role === "admin" && (
              <NavLink to="/admin/dashboard" className="nav-link" style={({ isActive }) => nb(isActive, { background:isActive?"rgba(239,68,68,0.25)":"transparent", borderColor:isActive?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.15)", color:isActive?"#fca5a5":"rgba(255,255,255,0.85)" })}>🛡 Admin</NavLink>
            )}

            <div style={{ width:1, height:22, background:"rgba(255,255,255,0.1)", margin:"0 4px" }} />

            {!user ? (<>
              <NavLink to="/login"    className="nav-link" style={({ isActive }) => nb(isActive)}>🔑 Login</NavLink>
              <NavLink to="/register" className="nav-link" style={({ isActive }) => nb(isActive, { background:isActive?"rgba(212,160,23,0.3)":"rgba(212,160,23,0.18)", borderColor:"rgba(212,160,23,0.5)", color:"#fcd34d" })}>📝 Register</NavLink>
            </>) : (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div onClick={() => navigate(dashPath())} style={{ display:"flex", alignItems:"center", gap:7, color:"rgba(255,255,255,0.9)", fontSize:13, fontWeight:700, padding:"6px 12px", background:"rgba(255,255,255,0.1)", borderRadius:20, border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                >
                  <span style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#52b788,#2d6a4f)", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>
                    {user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"}
                  </span>
                  {(user.fullName||user.name)?.split(" ")[0]}
                </div>
                <button onClick={handleLogout} className="nav-link" style={nb(false, { background:"rgba(239,68,68,0.12)", borderColor:"rgba(239,68,68,0.35)", color:"#fca5a5" })}>Logout</button>
              </div>
            )}

            {(!user || user.role === "customer") && (
              <button onClick={() => navigate("/cart")} style={{ background:"linear-gradient(135deg,#d4a017,#b8860b)", border:"none", color:"#1b2e10", fontWeight:800, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, boxShadow:"0 3px 12px rgba(212,160,23,0.35)", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(212,160,23,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 3px 12px rgba(212,160,23,0.35)"; }}
              >
                🛒 Cart
                {itemCount > 0 && <span style={{ background:"#1b2e10", color:"#d4a017", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900 }}>{itemCount}</span>}
              </button>
            )}

            <button onClick={toggle} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
            >{dark ? "☀️" : "🌙"}</button>
          </nav>

          {/* Mobile */}
          <div className="rps-hamburger" ref={menuRef} style={{ alignItems:"center", gap:8, position:"relative" }}>
            {(!user || user.role === "customer") && (
              <button onClick={() => goTo("/cart")} style={{ background:"linear-gradient(135deg,#d4a017,#b8860b)", border:"none", color:"#1b2e10", fontWeight:800, padding:"7px 10px", borderRadius:12, cursor:"pointer", fontSize:14, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
                🛒 {itemCount > 0 && <span style={{ background:"#1b2e10", color:"#d4a017", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900 }}>{itemCount}</span>}
              </button>
            )}
            <button onClick={toggle} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>{dark?"☀️":"🌙"}</button>
            <button onClick={() => setMenuOpen(o => !o)} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", width:40, height:40, borderRadius:10, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:0 }}>
              {[0,1,2].map(i => <span key={i} style={{ width:18, height:2, background:"#fff", borderRadius:2, display:"block", transition:"all 0.25s", transform: menuOpen ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"none") : "none", opacity: menuOpen && i===1 ? 0 : 1 }} />)}
            </button>

            {menuOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 12px)", right:0, width:270, background: dark?"rgba(8,15,9,0.98)":"rgba(13,43,26,0.98)", backdropFilter:"blur(20px)", borderRadius:18, overflow:"hidden", boxShadow:"0 12px 48px rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.1)", zIndex:2000, animation:"scaleIn 0.2s ease" }}>
                {user && (
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.1)", background:"rgba(82,183,136,0.1)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#52b788,#2d6a4f)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"}</div>
                      <div>
                        <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>{user.fullName||user.name}</div>
                        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, textTransform:"capitalize" }}>{user.role}</div>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={() => goTo("/")}        className="mobile-link" style={ml()}>🏠 Home</button>
                <button onClick={() => goTo("/catalog")} className="mobile-link" style={ml()}>🛒 Catalog</button>
                <button onClick={() => goTo("/weather")} className="mobile-link" style={ml()}>🌤 Weather</button>
                {user?.role==="farmer" && (<>
                  <button onClick={()=>goTo("/farmer/dashboard")}   className="mobile-link" style={ml("#fcd34d")}>🌾 My Farm</button>
                  <button onClick={()=>goTo("/farmer/products")}    className="mobile-link" style={ml()}>📦 My Products</button>
                  <button onClick={()=>goTo("/farmer/orders")}      className="mobile-link" style={ml()}>🛒 Orders</button>
                  <button onClick={()=>goTo("/farmer/find-agents")} className="mobile-link" style={ml()}>🤝 Find Agents</button>
                  <button onClick={()=>goTo("/farmer/revenue")}     className="mobile-link" style={ml()}>💰 Revenue</button>
                </>)}
                {user?.role==="agent" && (<>
                  <button onClick={()=>goTo("/agent/dashboard")}   className="mobile-link" style={ml("#93c5fd")}>🏢 Dashboard</button>
                  <button onClick={()=>goTo("/agent/add-product")} className="mobile-link" style={ml()}>➕ Add Product</button>
                  <button onClick={()=>goTo("/agent/products")}    className="mobile-link" style={ml()}>📦 My Products</button>
                  <button onClick={()=>goTo("/agent/orders")}      className="mobile-link" style={ml()}>🛒 Orders</button>
                  <button onClick={()=>goTo("/agent/farmers")}     className="mobile-link" style={ml()}>🌾 My Farmers</button>
                  <button onClick={()=>goTo("/agent/requests")}    className="mobile-link" style={ml()}>📬 Requests</button>
                </>)}
                {user?.role==="customer" && (<>
                  <button onClick={()=>goTo("/customer/dashboard")} className="mobile-link" style={ml()}>📊 Dashboard</button>
                  <button onClick={()=>goTo("/orders")}             className="mobile-link" style={ml()}>📦 My Orders</button>
                  <button onClick={()=>goTo("/profile")}            className="mobile-link" style={ml()}>👤 Profile</button>
                </>)}
                {user?.role==="admin" && <button onClick={()=>goTo("/admin/dashboard")} className="mobile-link" style={ml("#fca5a5")}>🛡 Admin Panel</button>}
                {!user && (<>
                  <button onClick={()=>goTo("/login")}    className="mobile-link" style={ml()}>🔑 Login</button>
                  <button onClick={()=>goTo("/register")} className="mobile-link" style={ml("#fcd34d")}>📝 Register</button>
                </>)}
                {user && <button onClick={mobileLogout} className="mobile-link" style={{ ...ml("#fca5a5"), borderBottom:"none" }}>🚪 Logout</button>}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
