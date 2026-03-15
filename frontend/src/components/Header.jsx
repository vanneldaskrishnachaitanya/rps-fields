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
    if (user.role === "farmer")  return "/farmer/dashboard";
    if (user.role === "agent")   return "/agent/dashboard";
    if (user.role === "customer") return "/customer/dashboard";
    if (user.role === "admin")   return "/admin/dashboard";
    return "/";
  };

  return (
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
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }}
          onClick={() => navigate("/")}>
          <span style={{ fontSize: 26 }}>🌿</span>
          <div>
            <span style={{ color:"#fff", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:700, fontSize:20 }}>RPS Fields</span>
            <span style={{ color:tk.green5, fontSize:9, display:"block", letterSpacing:"2px", textTransform:"uppercase", marginTop:-2 }}>Farm Fresh Direct</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
          <NavLink to="/"       end style={({ isActive }) => nb(isActive)}>🏠 Home</NavLink>
          <NavLink to="/catalog"    style={({ isActive }) => nb(isActive)}>🛒 Catalog</NavLink>

          {/* Role-specific nav */}
          {user?.role === "farmer" && (<>
            <NavLink to="/farmer/dashboard" style={({ isActive }) => nb(isActive, { background: isActive ? "rgba(212,160,23,0.4)" : "rgba(212,160,23,0.2)", border:"1px solid rgba(212,160,23,0.6)" })}>🌾 My Farm</NavLink>
            <NavLink to="/farmer/orders"    style={({ isActive }) => nb(isActive)}>📦 Orders</NavLink>
            <NavLink to="/farmer/find-agents" style={({ isActive }) => nb(isActive)}>🤝 Find Agents</NavLink>
          </>)}

          {user?.role === "agent" && (<>
            <NavLink to="/agent/dashboard"  style={({ isActive }) => nb(isActive, { background: isActive ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.2)", border:"1px solid rgba(59,130,246,0.6)" })}>🏢 Agent Hub</NavLink>
            <NavLink to="/agent/products"   style={({ isActive }) => nb(isActive)}>📦 Products</NavLink>
            <NavLink to="/agent/orders"     style={({ isActive }) => nb(isActive)}>🛒 Orders</NavLink>
          </>)}

          {user?.role === "customer" && (<>
            <NavLink to="/customer/dashboard" style={({ isActive }) => nb(isActive)}>📊 Dashboard</NavLink>
            <NavLink to="/orders"             style={({ isActive }) => nb(isActive)}>📦 Orders</NavLink>
          </>)}

          {user?.role === "admin" && (
            <NavLink to="/admin/dashboard" style={({ isActive }) => nb(isActive, { background: isActive ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.6)" })}>🛡 Admin</NavLink>
          )}

          {/* Auth */}
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

          {/* Cart — visible to customers and guests */}
          {(!user || user.role === "customer") && (
            <button onClick={() => navigate("/cart")} style={nb(false, { background:tk.gold, border:`1px solid ${tk.gold}`, color:"#1b4332", fontWeight:800 })}>
              🛒 Cart
              {itemCount > 0 && <span style={{ background:"#1b4332", color:"#fff", borderRadius:"50%", width:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, marginLeft:4 }}>{itemCount}</span>}
            </button>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} title={dark ? "Light mode" : "Dark mode"} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", flexShrink:0 }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
