import { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const tk = TK(dark);

  // ── Mobile menu state (new) ──────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  const goTo = (path) => { setMenuOpen(false); navigate(path); };
  const mobileLogout = () => { setMenuOpen(false); logout(); navigate("/"); };
  // ────────────────────────────────────────────────────────────────────────

  // ── YOUR ORIGINAL CODE — not changed at all ──────────────────────────────
  const handleLogout = () => { logout(); navigate("/"); };

  const nb = (isActive, override = {}) => ({
    background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
    border: `1px solid rgba(255,255,255,${isActive ? "0.5" : "0.2"})`,
    color: "#fff", padding: "7px 13px", borderRadius: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 700,
    transition: "all 0.2s", fontFamily: "inherit",
    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
    ...override,
  });

  const dashPath = () => {
    if (!user) return "/";
    if (user.role === "farmer")   return "/farmer/dashboard";
    if (user.role === "agent")    return "/agent/dashboard";
    if (user.role === "customer") return "/customer/dashboard";
    if (user.role === "admin")    return "/admin/dashboard";
    return "/";
  };
  // ────────────────────────────────────────────────────────────────────────

  // Mobile dropdown link style
  const ml = (color = "#fff") => ({
    display: "block", width: "100%", padding: "13px 20px",
    color, fontSize: 15, fontWeight: 700, cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    textDecoration: "none", background: "transparent",
    border: "none",
    textAlign: "left", fontFamily: "inherit", boxSizing: "border-box",
  });

  return (
    <>
      {/* Responsive CSS — only thing added to make mobile work */}
      <style>{`
        .rps-nav   { display: flex !important; }
        .rps-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .rps-nav       { display: none  !important; }
          .rps-hamburger { display: flex  !important; }
        }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: tk.headerBg, height: 68,
        display: "flex", alignItems: "center",
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 20px", width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>

          {/* Logo — UNCHANGED */}
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }}
            onClick={() => navigate("/")}>
            <span style={{ fontSize: 26 }}>🌿</span>
            <div>
              <span style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:20 }}>RPS Fields</span>
              <span style={{ color:tk.green5, fontSize:9, display:"block", letterSpacing:"2px", textTransform:"uppercase", marginTop:-2 }}>Farm Fresh Direct</span>
            </div>
          </div>

          {/* ── Desktop Nav — YOUR ORIGINAL CODE, just hidden on mobile ── */}
          <nav className="rps-nav" style={{ alignItems:"center", gap:4, flexWrap:"wrap" }}>
            <NavLink to="/"        end style={({ isActive }) => nb(isActive)}>🏠 Home</NavLink>
            <NavLink to="/catalog"     style={({ isActive }) => nb(isActive)}>🛒 Catalog</NavLink>

            {user?.role === "farmer" && (<>
              <NavLink to="/farmer/dashboard"   style={({ isActive }) => nb(isActive, { background: isActive ? "rgba(212,160,23,0.4)" : "rgba(212,160,23,0.2)", border:"1px solid rgba(212,160,23,0.6)" })}>🌾 My Farm</NavLink>
              <NavLink to="/farmer/orders"      style={({ isActive }) => nb(isActive)}>📦 Orders</NavLink>
              <NavLink to="/farmer/find-agents" style={({ isActive }) => nb(isActive)}>🤝 Find Agents</NavLink>
            </>)}

            {user?.role === "agent" && (<>
              <NavLink to="/agent/dashboard" style={({ isActive }) => nb(isActive, { background: isActive ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.6)" })}>🏢 Agent Hub</NavLink>
              <NavLink to="/agent/products"  style={({ isActive }) => nb(isActive)}>📦 Products</NavLink>
              <NavLink to="/agent/orders"    style={({ isActive }) => nb(isActive)}>🛒 Orders</NavLink>
            </>)}

            {user?.role === "customer" && (<>
              <NavLink to="/customer/dashboard" style={({ isActive }) => nb(isActive)}>📊 Dashboard</NavLink>
              <NavLink to="/orders"             style={({ isActive }) => nb(isActive)}>📦 Orders</NavLink>
            </>)}

            {user?.role === "admin" && (
              <NavLink to="/admin/dashboard" style={({ isActive }) => nb(isActive, { background: isActive ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.6)" })}>🛡 Admin</NavLink>
            )}

            {!user ? (<>
              <NavLink to="/login"    style={({ isActive }) => nb(isActive)}>🔑 Login</NavLink>
              <NavLink to="/register" style={({ isActive }) => nb(isActive)}>📝 Register</NavLink>
            </>) : (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div onClick={() => navigate(dashPath())} style={{ color:"rgba(255,255,255,0.9)", fontSize:13, fontWeight:700, padding:"6px 11px", background:"rgba(255,255,255,0.1)", borderRadius:8, border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer" }}>
                  {user.role === "farmer" ? "🌾" : user.role === "agent" ? "🏢" : user.role === "admin" ? "🛡" : "👤"} {(user.fullName || user.name)?.split(" ")[0]}
                </div>
                <button onClick={handleLogout} style={nb(false, { background:"rgba(231,76,60,0.15)", border:"1px solid rgba(231,76,60,0.4)", color:"#ffaaaa" })}>
                  Logout
                </button>
              </div>
            )}

            {(!user || user.role === "customer") && (
              <button onClick={() => navigate("/cart")} style={nb(false, { background:tk.gold, border:`1px solid ${tk.gold}`, color:"#1b4332", fontWeight:800 })}>
                🛒 Cart
                {itemCount > 0 && <span style={{ background:"#1b4332", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, marginLeft:4 }}>{itemCount}</span>}
              </button>
            )}

            <button onClick={toggle} title={dark ? "Light mode" : "Dark mode"} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", flexShrink:0 }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </nav>

          {/* ── Mobile: Cart + Theme + Hamburger (only visible ≤768px) ── */}
          <div className="rps-hamburger" ref={menuRef}
            style={{ alignItems:"center", gap:8, position:"relative" }}>

            {/* Cart */}
            {(!user || user.role === "customer") && (
              <button onClick={() => goTo("/cart")}
                style={{ background:tk.gold, border:"none", color:"#1b4332", fontWeight:800, padding:"7px 10px", borderRadius:8, cursor:"pointer", fontSize:14, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}>
                🛒 {itemCount > 0 && <span style={{ background:"#1b4332", color:"#fff", borderRadius:"50%", width:17, height:17, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800 }}>{itemCount}</span>}
              </button>
            )}

            {/* Theme */}
            <button onClick={toggle}
              style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Hamburger ≡ / ✕ */}
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu"
              style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", width:40, height:40, borderRadius:8, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:0 }}>
              <span style={{ width:18, height:2, background:"#fff", borderRadius:2, transition:"all 0.25s", display:"block", transform: menuOpen ? "rotate(45deg) translate(5px,5px)"  : "none" }} />
              <span style={{ width:18, height:2, background:"#fff", borderRadius:2, transition:"all 0.25s", display:"block", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width:18, height:2, background:"#fff", borderRadius:2, transition:"all 0.25s", display:"block", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div style={{
                position:"absolute", top:"calc(100% + 10px)", right:0, width:255,
                background: dark ? "#0d1f13" : "#1b4332",
                borderRadius:14, overflow:"hidden",
                boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
                border:"1px solid rgba(255,255,255,0.12)", zIndex:2000,
              }}>
                {/* User info */}
                {user && (
                  <div style={{ padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.06)" }}>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>
                      {user.role==="farmer"?"🌾":user.role==="agent"?"🏢":user.role==="admin"?"🛡":"👤"} {user.fullName||user.name}
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2, textTransform:"capitalize" }}>{user.role}</div>
                  </div>
                )}

                <button onClick={() => goTo("/")}        style={ml()}>🏠 Home</button>
                <button onClick={() => goTo("/catalog")} style={ml()}>🛒 Catalog</button>

                {user?.role === "farmer" && (<>
                  <button onClick={() => goTo("/farmer/dashboard")}   style={ml("#fcd34d")}>🌾 My Farm</button>
                  <button onClick={() => goTo("/farmer/products")}    style={ml()}>📦 My Products</button>
                  <button onClick={() => goTo("/farmer/orders")}      style={ml()}>🛒 Orders</button>
                  <button onClick={() => goTo("/farmer/find-agents")} style={ml()}>🤝 Find Agents</button>
                  <button onClick={() => goTo("/farmer/my-agents")}   style={ml()}>🤝 My Agents</button>
                  <button onClick={() => goTo("/farmer/revenue")}     style={ml()}>💰 Revenue</button>
                </>)}

                {user?.role === "agent" && (<>
                  <button onClick={() => goTo("/agent/dashboard")}   style={ml("#93c5fd")}>🏢 Dashboard</button>
                  <button onClick={() => goTo("/agent/add-product")} style={ml()}>➕ Add Product</button>
                  <button onClick={() => goTo("/agent/products")}    style={ml()}>📦 My Products</button>
                  <button onClick={() => goTo("/agent/orders")}      style={ml()}>🛒 Orders</button>
                  <button onClick={() => goTo("/agent/farmers")}     style={ml()}>🌾 My Farmers</button>
                  <button onClick={() => goTo("/agent/requests")}    style={ml()}>📬 Requests</button>
                </>)}

                {user?.role === "customer" && (<>
                  <button onClick={() => goTo("/customer/dashboard")} style={ml()}>📊 Dashboard</button>
                  <button onClick={() => goTo("/orders")}             style={ml()}>📦 My Orders</button>
                  <button onClick={() => goTo("/profile")}            style={ml()}>👤 Profile</button>
                  <button onClick={() => goTo("/address")}            style={ml()}>📍 Addresses</button>
                </>)}

                {user?.role === "admin" && (
                  <button onClick={() => goTo("/admin/dashboard")} style={ml("#fca5a5")}>🛡 Admin Panel</button>
                )}

                {!user && (<>
                  <button onClick={() => goTo("/login")}    style={ml()}>🔑 Login</button>
                  <button onClick={() => goTo("/register")} style={ml()}>📝 Register</button>
                </>)}

                {user && (
                  <button onClick={mobileLogout} style={ml("#fca5a5")}>🚪 Logout</button>
                )}
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
}
