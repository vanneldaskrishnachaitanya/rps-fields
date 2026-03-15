import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const { itemCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/orders")
      .then(d => { if (d.success) setOrders(d.orders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentOrders = [...orders].reverse().slice(0, 3);
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  const card = (children, extra = {}) => ({
    background: tk.bgCard, borderRadius: 16, padding: 24,
    boxShadow: tk.shadow, border: `1px solid ${tk.border}`, ...extra,
  });

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "50px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "#74c69d", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>👤 Customer Dashboard</p>
          <h1 style={{ color: "#fff", fontSize: 32, fontFamily: "'Playfair Display',Georgia,serif", margin: "0 0 6px" }}>
            Welcome back, {user?.fullName?.split(" ")[0]}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: 0 }}>📍 {user?.city} · {user?.email}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            ["📦", orders.length, "Total Orders", "/orders"],
            ["💰", `₹${totalSpent}`, "Total Spent", "/orders"],
            ["🛒", itemCount, "Items in Cart", "/cart"],
            ["❤️", "0", "Saved Items", "/catalog"],
          ].map(([icon, val, lbl, to]) => (
            <div key={lbl} style={card({ cursor:"pointer", textAlign:"center" })} onClick={() => navigate(to)}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=tk.shadowLg}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=tk.shadow}>
              <div style={{ fontSize:30, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color:tk.green7 }}>{val}</div>
              <div style={{ fontSize:12, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.5px" }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          {/* Recent orders */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, margin:0 }}>Recent Orders</h2>
              <Link to="/orders" style={{ color:tk.green7, fontWeight:700, fontSize:13, textDecoration:"none" }}>View all →</Link>
            </div>
            {loading ? (
              <div style={{ textAlign:"center", padding:40, color:tk.textLt }}>Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div style={{ ...card(), textAlign:"center", padding:40 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
                <p style={{ color:tk.textLt, marginBottom:16 }}>No orders yet</p>
                <button onClick={() => navigate("/catalog")} style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", padding:"10px 22px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                  Start Shopping
                </button>
              </div>
            ) : (
              recentOrders.map(ord => (
                <div key={ord.id} style={{ ...card(), marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:800, color:tk.text, fontSize:14 }}>{ord.id}</div>
                      <div style={{ fontSize:12, color:tk.textLt, marginTop:2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ background:"#d4edda", color:"#155724", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>✓ {ord.status}</span>
                      <div style={{ color:tk.green7, fontWeight:800, fontSize:16, marginTop:3 }}>₹{ord.total}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:tk.textMid }}>{ord.items.map(i=>`${i.name} ×${i.qty}`).join(" · ")}</div>
                </div>
              ))
            )}
          </div>

          {/* Quick links */}
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, marginBottom:16 }}>Quick Actions</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                ["🛒", "Browse Catalog", "/catalog", true],
                ["📦", "My Orders", "/orders", false],
                ["👤", "My Profile", "/profile", false],
                ["📍", "Manage Addresses", "/address", false],
                ["🛒", "View Cart", "/cart", false],
              ].map(([icon, lbl, to, primary]) => (
                <button key={to} onClick={() => navigate(to)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 18px", borderRadius:12, cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:14, transition:"all 0.2s", background: primary ? "linear-gradient(135deg,#52b788,#40916c)" : tk.bgCard, color: primary ? "#fff" : tk.text, border:`1.5px solid ${primary ? "transparent" : tk.border}`, textAlign:"left" }}>
                  <span style={{ fontSize:20 }}>{icon}</span>
                  {lbl}
                  <span style={{ marginLeft:"auto", color: primary ? "rgba(255,255,255,0.7)" : tk.textLt }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
