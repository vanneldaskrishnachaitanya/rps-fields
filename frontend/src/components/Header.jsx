import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); };
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const goTo = p => { setMenuOpen(false); navigate(p); };
  const handleLogout = () => { logout(); navigate("/"); };
  const mobileLogout = () => { setMenuOpen(false); logout(); navigate("/"); };

  const dashPath = () => {
    if (!user) return "/";
    return { farmer:"/farmer/dashboard", agent:"/agent/dashboard", customer:"/customer/dashboard", admin:"/admin/dashboard" }[user.role] || "/";
  };

  // Nav button style
  const nb = (isActive, override = {}) => ({
    background: isActive ? "rgba(82,183,136,0.22)" : "transparent",
    border: `1px solid ${isActive ? "rgba(82,183,136,0.55)" : "rgba(255,255,255,0.14)"}`,
    color: isActive ? "#74c69d" : "rgba(255,255,255,0.82)",
    padding: "6px 12px", borderRadius: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
    transition: "all 0.18s ease",
    ...override,
  });

  const ml = (color = "rgba(255,255,255,0.85)") => ({
    display: "block", width: "100%", padding: "12px 20px",
    color, fontSize: 14, fontWeight: 600, cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    textDecoration: "none", background: "transparent", border: "none",
    textAlign: "left", fontFamily: "'Inter',sans-serif", boxSizing: "border-box",
    transition: "background 0.15s, color 0.15s",
  });

  // Liquid glass header
  const headerStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    height: 64,
    background: scrolled
      ? "rgba(3,10,5,0.88)"
      : "rgba(3,10,5,0.72)",
    backdropFilter: "blur(28px) saturate(200%)",
    WebkitBackdropFilter: "blur(28px) saturate(200%)",
    borderBottom: `1px solid ${scrolled ? "rgba(82,183,136,0.2)" : "rgba(255,255,255,0.07)"}`,
    boxShadow: scrolled
      ? "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
      : "inset 0 -1px 0 rgba(255,255,255,0.04)",
    display: "flex", alignItems: "center",
    transition: "all 0.35s ease",
  };

  return (
    <>
      <style>{`
        .rps-nav       { display: flex !important; }
        .rps-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .rps-nav       { display: none  !important; }
          .rps-hamburger { display: flex  !important; }
        }
        .hnav:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; border-color: rgba(255,255,255,0.25) !important; }
        .mlink:hover { background: rgba(82,183,136,0.12) !important; color: #74c69d !important; }
      `}</style>

      <header style={headerStyle}>
        <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 22px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }} onClick={() => navigate("/")}>
            <div style={{
              width:34, height:34, borderRadius:9,
              background: "linear-gradient(135deg,#52b788 0%,#1b4332 100%)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:17, boxShadow:"0 4px 14px rgba(82,183,136,0.35)",
              flexShrink:0,
            }}>🌿</div>
            <div>
              <div style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:18, letterSpacing:"-0.2px", lineHeight:1 }}>RPS Fields</div>
              <div style={{ color:"rgba(82,183,136,0.75)", fontSize:8, letterSpacing:"2.5px", textTransform:"uppercase", marginTop:1 }}>Farm Fresh Direct</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="rps-nav" style={{ alignItems:"center", gap:2, flexWrap:"nowrap" }}>
            <NavLink to="/" end className="hnav" style={({isActive})=>nb(isActive)}>🏠 Home</NavLink>
            <NavLink to="/catalog" className="hnav" style={({isActive})=>nb(isActive)}>🛒 Catalog</NavLink>
            <NavLink to="/weather" className="hnav" style={({isActive})=>nb(isActive,{background:isActive?"rgba(116,198,157,0.18)":"transparent",borderColor:isActive?"rgba(116,198,157,0.45)":"rgba(255,255,255,0.14)"})}>🌤 Weather</NavLink>

            {user?.role==="farmer" && (<>
              <NavLink to="/farmer/dashboard"   className="hnav" style={({isActive})=>nb(isActive,{background:isActive?"rgba(212,160,23,0.22)":"transparent",borderColor:isActive?"rgba(212,160,23,0.5)":"rgba(255,255,255,0.14)",color:isActive?"#fcd34d":"rgba(255,255,255,0.82)"})}>🌾 My Farm</NavLink>
              <NavLink to="/farmer/orders"      className="hnav" style={({isActive})=>nb(isActive)}>📦 Orders</NavLink>
              <NavLink to="/farmer/find-agents" className="hnav" style={({isActive})=>nb(isActive)}>🤝 Agents</NavLink>
            </>)}
            {user?.role==="agent" && (<>
              <NavLink to="/agent/dashboard" className="hnav" style={({isActive})=>nb(isActive,{background:isActive?"rgba(59,130,246,0.22)":"transparent",borderColor:isActive?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.14)",color:isActive?"#93c5fd":"rgba(255,255,255,0.82)"})}>🏢 Hub</NavLink>
              <NavLink to="/agent/products"  className="hnav" style={({isActive})=>nb(isActive)}>📦 Products</NavLink>
              <NavLink to="/agent/orders"    className="hnav" style={({isActive})=>nb(isActive)}>🛒 Orders</NavLink>
            </>)}
            {user?.role==="customer" && (<>
              <NavLink to="/customer/dashboard" className="hnav" style={({isActive})=>nb(isActive)}>📊 Dashboard</NavLink>
              <NavLink to="/orders"             className="hnav" style={({isActive})=>nb(isActive)}>📦 Orders</NavLink>
            </>)}
            {user?.role==="admin" && <NavLink to="/admin/dashboard" className="hnav" style={({isActive})=>nb(isActive,{background:isActive?"rgba(239,68,68,0.22)":"transparent",borderColor:isActive?"rgba(239,68,68,0.45)":"rgba(255,255,255,0.14)",color:isActive?"#fca5a5":"rgba(255,255,255,0.82)"})}>🛡 Admin</NavLink>}

            <div style={{ width:1, height:20, background:"rgba(255,255,255,0.1)", margin:"0 3px" }} />

            {!user ? (<>
              <NavLink to="/login"    className="hnav" style={({isActive})=>nb(isActive)}>🔑 Login</NavLink>
              <NavLink to="/register" className="hnav" style={({isActive})=>nb(isActive,{background:isActive?"rgba(212,160,23,0.28)":"rgba(212,160,23,0.15)",borderColor:"rgba(212,160,23,0.45)",color:"#fbbf24"})}>📝 Register</NavLink>
            </>) : (
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div onClick={()=>navigate(dashPath())} style={{ display:"flex", alignItems:"center", gap:7, color:"rgba(255,255,255,0.88)", fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif", padding:"5px 11px", background:"rgba(255,255,255,0.08)", borderRadius:20, border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.16)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
                >
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>
                    {user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"}
                  </div>
                  {(user.fullName||user.name)?.split(" ")[0]}
                </div>
                <button onClick={handleLogout} className="hnav" style={nb(false,{background:"rgba(220,38,38,0.1)",borderColor:"rgba(220,38,38,0.3)",color:"#fca5a5"})}>Logout</button>
              </div>
            )}

            {(!user||user.role==="customer") && (
              <button onClick={()=>navigate("/cart")} style={{
                background:"rgba(200,150,12,0.32)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)",
                border:"none", color:"#fff", fontWeight:700, fontFamily:"'Inter',sans-serif",
                padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:13,
                display:"flex", alignItems:"center", gap:5,
                boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)",
                transition:"all 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(200,150,12,0.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 3px 12px rgba(200,150,12,0.35)";}}
              >
                🛒 Cart {itemCount>0&&<span style={{background:"rgba(255,255,255,0.25)",borderRadius:"50%",width:17,height:17,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{itemCount}</span>}
              </button>
            )}

            <button onClick={toggle} style={{
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
              color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer",
              fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.16)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
            >{dark?"☀️":"🌙"}</button>
          </nav>

          {/* Mobile */}
          <div className="rps-hamburger" ref={menuRef} style={{ alignItems:"center", gap:7, position:"relative" }}>
            {(!user||user.role==="customer") && (
              <button onClick={()=>goTo("/cart")} style={{ background:"rgba(200,150,12,0.32)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", border:"none", color:"#fff", fontWeight:700, padding:"6px 10px", borderRadius:10, cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:3 }}>
                🛒{itemCount>0&&<span style={{background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:15,height:15,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{itemCount}</span>}
              </button>
            )}
            <button onClick={toggle} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>{dark?"☀️":"🌙"}</button>
            <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", width:38, height:38, borderRadius:9, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:0 }}>
              {[0,1,2].map(i=><span key={i} style={{ width:16, height:2, background:"#fff", borderRadius:2, display:"block", transition:"all 0.25s", transform: menuOpen?(i===0?"rotate(45deg) translate(4px,4px)":i===2?"rotate(-45deg) translate(4px,-4px)":"none"):"none", opacity:menuOpen&&i===1?0:1 }} />)}
            </button>

            {menuOpen && (
              <div className="anim-slide-down" style={{
                position:"absolute", top:"calc(100% + 10px)", right:0, width:265,
                background:"rgba(4,13,6,0.94)",
                backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)",
                borderRadius:16, overflow:"hidden",
                boxShadow:"0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                border:"1px solid rgba(82,183,136,0.15)", zIndex:2000,
              }}>
                {user && (
                  <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(82,183,136,0.08)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"}</div>
                      <div>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{user.fullName||user.name}</div>
                        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, textTransform:"capitalize" }}>{user.role}</div>
                      </div>
                    </div>
                  </div>
                )}
                {[["🏠","Home","/"],["🛒","Catalog","/catalog"],["🌤","Weather","/weather"]].map(([e,l,to])=>(
                  <button key={to} onClick={()=>goTo(to)} className="mlink" style={ml()}>{e} {l}</button>
                ))}
                {user?.role==="farmer"&&<><button onClick={()=>goTo("/farmer/dashboard")}   className="mlink" style={ml("#fcd34d")}>🌾 My Farm</button><button onClick={()=>goTo("/farmer/orders")} className="mlink" style={ml()}>📦 Orders</button><button onClick={()=>goTo("/farmer/find-agents")} className="mlink" style={ml()}>🤝 Find Agents</button><button onClick={()=>goTo("/farmer/revenue")} className="mlink" style={ml()}>💰 Revenue</button></>}
                {user?.role==="agent"&&<><button onClick={()=>goTo("/agent/dashboard")} className="mlink" style={ml("#93c5fd")}>🏢 Dashboard</button><button onClick={()=>goTo("/agent/products")} className="mlink" style={ml()}>📦 Products</button><button onClick={()=>goTo("/agent/orders")} className="mlink" style={ml()}>🛒 Orders</button><button onClick={()=>goTo("/agent/requests")} className="mlink" style={ml()}>📬 Requests</button></>}
                {user?.role==="customer"&&<><button onClick={()=>goTo("/customer/dashboard")} className="mlink" style={ml()}>📊 Dashboard</button><button onClick={()=>goTo("/orders")} className="mlink" style={ml()}>📦 My Orders</button><button onClick={()=>goTo("/profile")} className="mlink" style={ml()}>👤 Profile</button></>}
                {user?.role==="admin"&&<button onClick={()=>goTo("/admin/dashboard")} className="mlink" style={ml("#fca5a5")}>🛡 Admin Panel</button>}
                {!user&&<><button onClick={()=>goTo("/login")} className="mlink" style={ml()}>🔑 Login</button><button onClick={()=>goTo("/register")} className="mlink" style={ml("#fbbf24")}>📝 Register</button></>}
                {user&&<button onClick={mobileLogout} className="mlink" style={{...ml("#fca5a5"),borderBottom:"none"}}>🚪 Logout</button>}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
