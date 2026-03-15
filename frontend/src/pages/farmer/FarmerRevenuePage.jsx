import { useState, useEffect } from "react";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FarmerNav } from "./FarmerAgentPages";

export default function FarmerRevenuePage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/farmer/orders")
      .then(d => setOrders(d.orders||[]))
      .finally(()=>setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalRevenue = orders.reduce((s,o)=>s+(o.totalPrice||o.total||0),0);
  const delivered    = orders.filter(o=>o.status==="delivered");
  const confirmed    = orders.filter(o=>o.status==="confirmed");

  const card = { background:tk.bgCard, borderRadius:16, padding:24, boxShadow:tk.shadow, border:`1px solid ${tk.border}` };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 8px" }}>🌾 FARMER DASHBOARD</p>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>💰 Revenue Overview</h1>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 20px" }}>
        <FarmerNav active="/farmer/revenue" />

        {/* Revenue stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
          {[
            ["💰", `₹${totalRevenue}`,     "Total Revenue",     "#8b5cf6"],
            ["📦", orders.length,           "Total Orders",      "#3b82f6"],
            ["✅", delivered.length,        "Delivered",         "#10b981"],
            ["📋", confirmed.length,        "Confirmed",         "#f59e0b"],
          ].map(([icon,val,lbl,color])=>(
            <div key={lbl} style={{ ...card, textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color }}>{val}</div>
              <div style={{ fontSize:12, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.5px" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <h2 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:14 }}>Order History</h2>
        {loading ? <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>Loading...</div>
        : orders.length===0 ? (
          <div style={{ ...card, textAlign:"center", padding:40 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💰</div>
            <p style={{ color:tk.textLt }}>No revenue yet. Connect with agents to start selling.</p>
          </div>
        ) : orders.map(ord => (
          <div key={ord._id||ord.id} style={{ ...card, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontWeight:800, color:tk.text, fontSize:14 }}>{ord._id||ord.id}</div>
                <div style={{ fontSize:12, color:tk.textLt }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ background:ord.status==="delivered"?"#d4edda":"#d4e8ff", color:ord.status==="delivered"?"#155724":"#1a3a5c", borderRadius:16, padding:"3px 12px", fontWeight:700, fontSize:12 }}>
                  ✓ {ord.status}
                </span>
                <div style={{ fontSize:20, fontWeight:800, color:"#8b5cf6", marginTop:3 }}>₹{ord.totalPrice||ord.total}</div>
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {(ord.items||[]).map((item,i)=>(
                <div key={i} style={{ background:tk.bgMuted, borderRadius:8, padding:"6px 12px", fontSize:12, color:tk.textMid, border:`1px solid ${tk.border}` }}>
                  {item.name} × {item.quantity||item.qty}kg = ₹{item.totalPrice||(item.pricePerKg||item.price)*(item.quantity||item.qty)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
