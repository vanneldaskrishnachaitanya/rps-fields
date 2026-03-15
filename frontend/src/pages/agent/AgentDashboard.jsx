import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

function AgentNav({ active }) {
  const { dark } = useTheme(); const tk = TK(dark);
  const links = [
    ["📊 Dashboard",         "/agent/dashboard"],
    ["➕ Add Product",       "/agent/add-product"],
    ["📦 My Products",       "/agent/products"],
    ["🛒 Orders",            "/agent/orders"],
    ["🌾 Partnered Farmers", "/agent/farmers"],
    ["📬 Requests",          "/agent/requests"],
  ];
  return (
    <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
      {links.map(([lbl, to]) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          padding:"9px 16px", borderRadius:8, textDecoration:"none",
          border:`1.5px solid ${isActive?"#3b82f6":"rgba(59,130,246,0.3)"}`,
          background:isActive?"#3b82f6":"transparent",
          color:isActive?"#fff":tk.textMid,
          fontWeight:700, fontSize:13,
        })}>{lbl}</NavLink>
      ))}
    </div>
  );
}

export { AgentNav };

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [stats, setStats] = useState({ products:0, orders:0, farmers:0, revenue:0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingReqs, setPendingReqs] = useState([]);

  useEffect(() => {
    Promise.all([
      authFetch(`/products?agentId=${user?.id || user?._id}`),
      authFetch("/orders/agent/orders").catch(()=>({orders:[]})),
      authFetch("/partnerships/my-farmers"),
      authFetch("/partnerships/pending"),
    ]).then(([prods, ords, farmers, pending]) => {
      const orders = ords.orders || [];
      const revenue = orders.reduce((s,o) => s + (o.totalPrice||o.total||0), 0);
      setStats({
        products: (prods.products||[]).length,
        orders:   orders.length,
        farmers:  (farmers.farmers||[]).length,
        revenue,
      });
      setRecentOrders(orders.slice(0,5));
      setPendingReqs(pending.requests||[]);
    }).catch(()=>{});
  }, [user]);

  const card = { background:tk.bgCard, borderRadius:16, padding:24, boxShadow:tk.shadow, border:`1px solid ${tk.border}` };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1e40af,#3b82f6)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 6px" }}>🏢 AGENT DASHBOARD</p>
          <h1 style={{ color:"#fff", fontSize:30, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px" }}>Welcome, {user?.fullName?.split(" ")[0] || user?.name?.split(" ")[0]}</h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:0 }}>{user?.email} · {user?.location || user?.city}</p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <AgentNav active="/agent/dashboard" />

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
          {[
            ["📦", stats.products, "Products Listed",  "#3b82f6", "/agent/products"],
            ["🛒", stats.orders,   "Total Orders",     "#10b981", "/agent/orders"],
            ["🌾", stats.farmers,  "Partnered Farmers","#f59e0b", "/agent/farmers"],
            ["💰", `₹${stats.revenue}`, "Revenue",    "#8b5cf6", "/agent/orders"],
          ].map(([icon, val, lbl, color, to]) => (
            <div key={lbl} style={{ ...card, cursor:"pointer", textAlign:"center" }} onClick={() => navigate(to)}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=tk.shadowLg}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=tk.shadow}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color }}>{val}</div>
              <div style={{ fontSize:12, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.5px" }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:22 }}>
          {/* Recent orders */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:tk.text, margin:0 }}>Recent Orders</h2>
              <span onClick={()=>navigate("/agent/orders")} style={{ color:"#3b82f6", fontWeight:700, fontSize:13, cursor:"pointer" }}>View all →</span>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ ...card, textAlign:"center", padding:36 }}>
                <div style={{ fontSize:44, marginBottom:10 }}>🛒</div>
                <p style={{ color:tk.textLt }}>No orders yet. Add products to start selling.</p>
                <button onClick={()=>navigate("/agent/add-product")} style={{ marginTop:12, background:"#3b82f6", color:"#fff", border:"none", padding:"10px 22px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Add First Product</button>
              </div>
            ) : recentOrders.map(ord => (
              <div key={ord._id||ord.id} style={{ ...card, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div>
                    <div style={{ fontWeight:800, color:tk.text, fontSize:14 }}>{ord._id||ord.id}</div>
                    <div style={{ fontSize:12, color:tk.textLt }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ background:"#d4edda", color:"#155724", borderRadius:16, padding:"2px 10px", fontSize:11, fontWeight:700 }}>✓ {ord.status}</span>
                    <div style={{ color:"#3b82f6", fontWeight:800, fontSize:16, marginTop:3 }}>₹{ord.totalPrice||ord.total}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:tk.textMid }}>{(ord.items||[]).map(i=>`${i.name}×${i.quantity||i.qty}`).join(" · ")}</div>
              </div>
            ))}
          </div>

          {/* Pending requests */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:tk.text, margin:0 }}>Partnership Requests</h2>
              {pendingReqs.length > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:"50%", width:20, height:20, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{pendingReqs.length}</span>}
            </div>
            {pendingReqs.length === 0 ? (
              <div style={{ ...card, textAlign:"center", padding:28, color:tk.textLt, fontSize:14 }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📬</div>
                No pending requests
              </div>
            ) : pendingReqs.slice(0,4).map(req => (
              <RequestCard key={req._id} req={req} authFetch={authFetch} tk={tk} onDone={()=>window.location.reload()} />
            ))}
            {pendingReqs.length > 4 && (
              <button onClick={()=>navigate("/agent/requests")} style={{ width:"100%", marginTop:8, padding:"9px", background:"transparent", border:`1px solid ${tk.border}`, color:tk.textMid, borderRadius:8, cursor:"pointer", fontFamily:"inherit" }}>
                See all {pendingReqs.length} requests →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ req, authFetch, tk, onDone }) {
  const [loading, setLoading] = useState("");
  const farmer = req.farmerId || {};

  const respond = async (status) => {
    setLoading(status);
    await authFetch(`/partnerships/${req._id}/respond`, { method:"PUT", body:JSON.stringify({ status }) });
    setLoading("");
    onDone();
  };

  return (
    <div style={{ background:tk.bgCard, border:`1px solid ${tk.border}`, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
      <div style={{ fontWeight:700, color:tk.text, fontSize:14, marginBottom:3 }}>{farmer.fullName||farmer.name}</div>
      <div style={{ fontSize:12, color:tk.textMid, marginBottom:10 }}>📍 {farmer.location||farmer.city} · 📞 {farmer.mobile||farmer.phone}</div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={()=>respond("accepted")} disabled={!!loading}
          style={{ flex:1, padding:"7px", background:"#10b981", color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", opacity:loading?"0.7":"1" }}>
          {loading==="accepted" ? "..." : "✓ Accept"}
        </button>
        <button onClick={()=>respond("rejected")} disabled={!!loading}
          style={{ flex:1, padding:"7px", background:"transparent", border:"1px solid #ef4444", color:"#ef4444", borderRadius:7, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
          {loading==="rejected" ? "..." : "✕ Reject"}
        </button>
      </div>
    </div>
  );
}
