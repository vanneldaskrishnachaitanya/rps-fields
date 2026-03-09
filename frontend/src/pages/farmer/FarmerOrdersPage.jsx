import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

// ── Shared farmer sub-nav ─────────────────────────────────────────────────────
function FarmerNav({ active }) {
  const { dark } = useTheme(); const tk = TK(dark);
  return (
    <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
      {[["📊 Dashboard","/farmer/dashboard"],["📦 Products","/farmer/products"],["🛒 Orders","/farmer/orders"],["👤 Profile","/farmer/profile"]].map(([lbl,to])=>(
        <Link key={to} to={to} style={{ padding:"9px 16px", borderRadius:8, border:`1.5px solid ${to===active?tk.green7:tk.border}`, background:to===active?tk.green7:"transparent", color:to===active?"#fff":tk.textMid, fontWeight:700, fontSize:13, textDecoration:"none" }}>{lbl}</Link>
      ))}
    </div>
  );
}

// ── Farmer Orders Page ────────────────────────────────────────────────────────
export function FarmerOrdersPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/farmer/orders")
      .then(d => { if (d.success) setOrders(d.orders); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ color:"#74c69d", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 6px" }}>🌾 Farmer Dashboard</p>
          <h1 style={{ color:"#fff", fontSize:30, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>Orders Received</h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:"4px 0 0" }}>{orders.length} order{orders.length!==1?"s":""}</p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 20px" }}>
        <FarmerNav active="/farmer/orders" />

        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:tk.textLt }}><div style={{ fontSize:48, marginBottom:12 }}>🌿</div><p>Loading...</p></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:56, marginBottom:14 }}>🛒</div>
            <h3 style={{ color:tk.text, marginBottom:8 }}>No orders yet</h3>
            <p style={{ color:tk.textLt }}>Orders appear here when customers buy your products.</p>
          </div>
        ) : (
          orders.map(ord => (
            <div key={ord.id} style={{ background:tk.bgCard, borderRadius:14, padding:22, marginBottom:14, boxShadow:tk.shadow, border:`1px solid ${tk.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:16, color:tk.text }}>{ord.id}</div>
                  <div style={{ fontSize:12, color:tk.textLt, marginTop:2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ background:"#d4edda", color:"#155724", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:12 }}>✓ {ord.status}</span>
                  <div style={{ fontSize:20, fontWeight:800, color:tk.green7, marginTop:4 }}>₹{ord.total}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
                {ord.items.map((item,i) => (
                  <div key={i} style={{ background:tk.bgMuted, borderRadius:8, padding:"8px 12px", fontSize:13, color:tk.textMid, border:`1px solid ${tk.border}` }}>
                    {item.name} × {item.qty} kg — <strong>₹{item.price*item.qty}</strong>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:12, color:tk.textLt }}>📦 Deliver to: {ord.city} · 📞 {ord.phone}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Farmer Profile Page ───────────────────────────────────────────────────────
export function FarmerProfilePage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, logout } = useAuth();

  const row = (icon, label, value) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 0", borderBottom:`1px solid ${tk.border}` }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <div>
        <div style={{ fontSize:11, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:15, color:tk.text, fontWeight:600 }}>{value || <span style={{ color:tk.textLt, fontStyle:"italic" }}>Not set</span>}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f)", padding:"50px 20px", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 14px" }}>🌾</div>
        <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px" }}>{user?.fullName}</h1>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14 }}>Verified Farmer · {user?.city}</p>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"36px 20px" }}>
        <FarmerNav active="/farmer/profile" />
        <div style={{ background:tk.bgCard, borderRadius:20, padding:"4px 24px 20px", boxShadow:tk.shadow, border:`1px solid ${tk.border}`, marginBottom:20 }}>
          {row("👤","Full Name", user?.fullName)}
          {row("🆔","Username", user?.username)}
          {row("📧","Email", user?.email)}
          {row("📞","Phone", user?.phone)}
          {row("🏡","Farm Address", user?.address)}
          {row("🏙","City", user?.city)}
          {row("📅","Member Since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"}) : null)}
        </div>
        <button onClick={logout} style={{ width:"100%", padding:13, background:"transparent", border:"1.5px solid #e74c3c", color:"#e74c3c", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default FarmerOrdersPage;
