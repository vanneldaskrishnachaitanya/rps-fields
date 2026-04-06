import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

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

  const headerBg = dark
    ? (scrolled ? "rgba(3,10,5,0.92)" : "rgba(3,10,5,0.76)")
    : (scrolled ? "rgba(240,247,242,0.96)" : "rgba(240,247,242,0.88)");

  const headerStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    height: 64,
    background: headerBg,
    backdropFilter: "blur(28px) saturate(200%)",
    WebkitBackdropFilter: "blur(28px) saturate(200%)",
    borderBottom: `1px solid ${scrolled
      ? (dark ? "rgba(82,183,136,0.2)" : "rgba(82,183,136,0.25)")
      : (dark ? "rgba(255,255,255,0.07)" : "rgba(82,183,136,0.15)")}`,
    boxShadow: scrolled
      ? (dark ? "0 4px 30px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)" : "0 4px 30px rgba(27,67,50,0.12)")
      : "none",
    display: "flex", alignItems: "center",
    transition: "all 0.35s ease",
  };

  const navColor = dark ? "rgba(255,255,255,0.82)" : "rgba(15,30,15,0.85)";
  const navBorder = dark ? "rgba(255,255,255,0.14)" : "rgba(27,67,50,0.2)";

  const nbLight = (isActive, override = {}) => ({
    background: isActive ? (dark ? "rgba(82,183,136,0.22)" : "rgba(82,183,136,0.15)") : "transparent",
    border: `1px solid ${isActive ? "rgba(82,183,136,0.55)" : navBorder}`,
    color: isActive ? "#40916c" : navColor,
    padding: "6px 12px", borderRadius: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 600,
    fontFamily: "'Inter',sans-serif",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
    transition: "all 0.18s ease",
    ...override,
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
        .hnav:hover {
          background: ${dark ? "rgba(255,255,255,0.1)" : "rgba(82,183,136,0.12)"} !important;
          color: ${dark ? "#fff" : "#1b4332"} !important;
          border-color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(82,183,136,0.4)"} !important;
        }
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
              <div style={{ color: dark ? "#fff" : "#0a1a0c", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:18, letterSpacing:"-0.2px", lineHeight:1 }}>RPS Fields</div>
              <div style={{ color:"rgba(82,183,136,0.75)", fontSize:8, letterSpacing:"2.5px", textTransform:"uppercase", marginTop:1 }}>Farm Fresh Direct</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="rps-nav" style={{ alignItems:"center", gap:8, flexWrap:"nowrap" }}>
            <NavLink to="/" end className="hnav" style={({isActive})=>nbLight(isActive)}>🏠 Home</NavLink>
            <NavLink to="/catalog" className="hnav" style={({isActive})=>nbLight(isActive)}>🛒 Catalog</NavLink>
            <NavLink to="/weather" className="hnav" style={({isActive})=>nbLight(isActive)}>🌤 Weather</NavLink>

            {user?.role==="farmer" && (<>
              <NavLink to="/farmer/dashboard" className="hnav" style={({isActive})=>nbLight(isActive,{color:isActive?"#fcd34d":navColor})}>🌾 My Farm</NavLink>
              <NavLink to="/farmer/orders" className="hnav" style={({isActive})=>nbLight(isActive)}>📦 Orders</NavLink>
              <NavLink to="/farmer/find-agents" className="hnav" style={({isActive})=>nbLight(isActive)}>🤝 Agents</NavLink>
            </>)}
            {user?.role==="agent" && (<>
              <NavLink to="/agent/dashboard" className="hnav" style={({isActive})=>nbLight(isActive,{color:isActive?"#93c5fd":navColor})}>🏢 Hub</NavLink>
              <NavLink to="/agent/products" className="hnav" style={({isActive})=>nbLight(isActive)}>📦 Products</NavLink>
              <NavLink to="/agent/orders" className="hnav" style={({isActive})=>nbLight(isActive)}>🛒 Orders</NavLink>
            </>)}
            {user?.role==="customer" && (<>
              <NavLink to="/customer/dashboard" className="hnav" style={({isActive})=>nbLight(isActive)}>📊 Dashboard</NavLink>
              <NavLink to="/orders" className="hnav" style={({isActive})=>nbLight(isActive)}>📦 Orders</NavLink>
            </>)}
            {user?.role==="admin" && <NavLink to="/admin/dashboard" className="hnav" style={({isActive})=>nbLight(isActive,{color:isActive?"#fca5a5":navColor})}>🛡 Admin</NavLink>}

            <div style={{ width:1, height:20, background: dark ? "rgba(255,255,255,0.1)" : "rgba(27,67,50,0.15)", margin:"0 3px" }} />

            {!user ? (<>
              <NavLink to="/login" className="hnav" style={({isActive})=>nbLight(isActive)}>🔑 Login</NavLink>
              <NavLink to="/register" className="hnav" style={({isActive})=>nbLight(isActive,{background:isActive?"rgba(212,160,23,0.28)":"rgba(212,160,23,0.15)",borderColor:"rgba(212,160,23,0.45)",color:"#d4a017"})}>📝 Register</NavLink>
            </>) : (
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div onClick={()=>navigate(dashPath())} style={{ display:"flex", alignItems:"center", gap:7, color: dark ? "rgba(255,255,255,0.88)" : "#0a1a0c", fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif", padding:"5px 11px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(27,67,50,0.08)", borderRadius:20, border:`1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(27,67,50,0.2)"}`, cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background= dark ? "rgba(255,255,255,0.16)" : "rgba(27,67,50,0.14)"}
                  onMouseLeave={e=>e.currentTarget.style.background= dark ? "rgba(255,255,255,0.08)" : "rgba(27,67,50,0.08)"}
                >
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,rgba(82,183,136,0.4),#1b4332)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>
                    {user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"}
                  </div>
                  {(user.fullName||user.name)?.split(" ")[0]}
                </div>
                <button onClick={handleLogout} className="hnav" style={nbLight(false,{background:"rgba(220,38,38,0.1)",borderColor:"rgba(220,38,38,0.3)",color:"#fca5a5"})}>Logout</button>
              </div>
            )}

            {/* Notification Bell — customer only */}
            {user?.role === "customer" && <NotificationBell />}

            {(!user||user.role==="customer") && (
              <button onClick={()=>navigate("/cart")} style={{
                background:"linear-gradient(135deg,rgba(168,112,8,0.9),rgba(200,150,12,0.85))",
                border:"1px solid rgba(244,208,63,0.3)", color:"#fff", fontWeight:700,
                fontFamily:"'Inter',sans-serif", padding:"7px 14px", borderRadius:20,
                cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:5,
                boxShadow:"0 4px 14px rgba(200,150,12,0.35)", transition:"all 0.2s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(200,150,12,0.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 14px rgba(200,150,12,0.35)";}}
              >
                🛒 Cart {itemCount>0&&<span style={{background:"rgba(255,255,255,0.25)",borderRadius:"50%",width:17,height:17,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{itemCount}</span>}
              </button>
            )}

            <button onClick={toggle} style={{
              background: dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.1)",
              border:`1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(27,67,50,0.2)"}`,
              color: dark ? "#fff" : "#1b4332", width:32, height:32, borderRadius:"50%", cursor:"pointer",
              fontSize:14, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, transition:"all 0.2s",
            }}
              onMouseEnter={e=>e.currentTarget.style.background= dark ? "rgba(255,255,255,0.16)" : "rgba(27,67,50,0.18)"}
              onMouseLeave={e=>e.currentTarget.style.background= dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.1)"}
            >{dark?"☀️":"🌙"}</button>
          </nav>

          {/* Mobile */}
          <div className="rps-hamburger" ref={menuRef} style={{ alignItems:"center", gap:7, position:"relative" }}>
            {user?.role === "customer" && <NotificationBell />}
            {(!user||user.role==="customer") && (
              <button onClick={()=>goTo("/cart")} style={{ background:"linear-gradient(135deg,rgba(168,112,8,0.9),rgba(200,150,12,0.85))", border:"1px solid rgba(244,208,63,0.3)", color:"#fff", fontWeight:700, padding:"6px 10px", borderRadius:10, cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:3, boxShadow:"0 3px 10px rgba(200,150,12,0.3)" }}>
                🛒{itemCount>0&&<span style={{background:"rgba(0,0,0,0.3)",borderRadius:"50%",width:15,height:15,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{itemCount}</span>}
              </button>
            )}
            <button onClick={toggle} style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.1)", border:`1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(27,67,50,0.2)"}`, color: dark ? "#fff" : "#1b4332", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>{dark?"☀️":"🌙"}</button>
            <button onClick={()=>setMenuOpen(o=>!o)} style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(27,67,50,0.08)", border:`1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(27,67,50,0.15)"}`, width:38, height:38, borderRadius:9, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:0 }}>
              {[0,1,2].map(i=><span key={i} style={{ width:16, height:2, background: dark ? "#fff" : "#1b4332", borderRadius:2, display:"block", transition:"all 0.25s", transform: menuOpen?(i===0?"rotate(45deg) translate(4px,4px)":i===2?"rotate(-45deg) translate(4px,-4px)":"none"):"none", opacity:menuOpen&&i===1?0:1 }} />)}
            </button>

            {menuOpen && (
              <div className="anim-slide-down" style={{
                position:"absolute", top:"calc(100% + 10px)", right:0, width:265,
                background: dark ? "rgba(4,13,6,0.97)" : "rgba(240,247,242,0.97)",
                backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)",
                borderRadius:16, overflow:"hidden",
                boxShadow:"0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                border:`1px solid ${dark?"rgba(82,183,136,0.15)":"rgba(82,183,136,0.25)"}`, zIndex:2000,
              }}>
                {user && (
                  <div style={{ padding:"14px 18px", borderBottom:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(27,67,50,0.12)"}`, background: dark ? "rgba(82,183,136,0.08)" : "rgba(82,183,136,0.06)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,rgba(82,183,136,0.4),#1b4332)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"}</div>
                      <div>
                        <div style={{ color: dark ? "#fff" : "#0a1a0c", fontWeight:700, fontSize:13 }}>{user.fullName||user.name}</div>
                        <div style={{ color: dark ? "rgba(255,255,255,0.45)" : "#5a8a68", fontSize:11, textTransform:"capitalize" }}>{user.role}</div>
                      </div>
                    </div>
                  </div>
                )}
                {[["🏠","Home","/"],[" 🛒","Catalog","/catalog"],["🌤","Weather","/weather"]].map(([e,l,to])=>(
                  <button key={to} onClick={()=>goTo(to)} className="mlink" style={{ ...ml(), color: dark ? "rgba(255,255,255,0.85)" : "#0a1a0c" }}>{e} {l}</button>
                ))}
                {user?.role==="farmer"&&<><button onClick={()=>goTo("/farmer/dashboard")} className="mlink" style={ml("#fcd34d")}>🌾 My Farm</button><button onClick={()=>goTo("/farmer/orders")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>📦 Orders</button><button onClick={()=>goTo("/farmer/find-agents")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>🤝 Find Agents</button><button onClick={()=>goTo("/farmer/revenue")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>💰 Revenue</button></>}
                {user?.role==="agent"&&<><button onClick={()=>goTo("/agent/dashboard")} className="mlink" style={ml("#93c5fd")}>🏢 Dashboard</button><button onClick={()=>goTo("/agent/products")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>📦 Products</button><button onClick={()=>goTo("/agent/orders")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>🛒 Orders</button><button onClick={()=>goTo("/agent/requests")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>📬 Requests</button></>}
                {user?.role==="customer"&&<><button onClick={()=>goTo("/customer/dashboard")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>📊 Dashboard</button><button onClick={()=>goTo("/orders")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>📦 My Orders</button><button onClick={()=>goTo("/profile")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>👤 Profile</button></>}
                {user?.role==="admin"&&<button onClick={()=>goTo("/admin/dashboard")} className="mlink" style={ml("#fca5a5")}>🛡 Admin Panel</button>}
                {!user&&<><button onClick={()=>goTo("/login")} className="mlink" style={{ ...ml(), color: dark?"rgba(255,255,255,0.85)":"#0a1a0c" }}>🔑 Login</button><button onClick={()=>goTo("/register")} className="mlink" style={ml("#fbbf24")}>📝 Register</button></>}
                {user&&<button onClick={mobileLogout} className="mlink" style={{...ml("#fca5a5"),borderBottom:"none"}}>🚪 Logout</button>}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
