import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [data, setData] = useState({ products:[], orders:[], rating:{ avg:0, total:0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const uid = user.id || user._id;
    Promise.all([
      authFetch(`/products?farmerId=${uid}`),
      authFetch("/farmer/orders").catch(()=>({orders:[]})),
      authFetch(`/ratings/farmer/${uid}`).catch(()=>({avgRating:0,totalRatings:0})),
    ]).then(([prods, ords, rat]) => {
      setData({
        products: prods.products||[],
        orders:   ords.orders||[],
        rating: { avg: rat.avgRating||0, total: rat.totalRatings||0 },
      });
    }).finally(()=>setLoading(false));
  }, [user]);

  const totalRevenue  = data.orders.reduce((s,o)=>s+(o.totalPrice||o.total||0),0);
  const totalQty      = data.products.reduce((s,p)=>s+(p.quantity||p.qty||0),0);
  const ratingLabel   = (avg) => avg>=4?"⭐ Excellent":avg>=3?"👍 Average":avg>=2?"⚠ Warning":avg>0?"❌ Poor":"— No ratings";

  const card = { background:tk.bgCard, borderRadius:16, padding:24, boxShadow:tk.shadow, border:`1px solid ${tk.border}` };

  if (loading) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:tk.textLt }}><div style={{ fontSize:64, marginBottom:12 }}>🌿</div><p>Loading...</p></div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 6px" }}>🌾 FARMER DASHBOARD</p>
          <h1 style={{ color:"#fff", fontSize:30, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px" }}>
            Welcome, {user?.fullName?.split(" ")[0] || user?.name?.split(" ")[0]}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:0 }}>{user?.email} · {user?.city||user?.location}</p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
        {/* Sub-nav */}
        <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
          {[["📊 Dashboard","/farmer/dashboard"],["📦 Products","/farmer/products"],["🛒 Orders","/farmer/orders"],["🤝 Find Agents","/farmer/find-agents"],["🤝 My Agents","/farmer/my-agents"],["💰 Revenue","/farmer/revenue"]].map(([lbl,to])=>(
            <button key={to} onClick={()=>navigate(to)}
              style={{ padding:"9px 16px", borderRadius:8, border:`1.5px solid ${to==="/farmer/dashboard"?tk.green7:"rgba(64,145,108,0.3)"}`, background:to==="/farmer/dashboard"?tk.green7:"transparent", color:to==="/farmer/dashboard"?"#fff":tk.textMid, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
          {[
            ["📦", data.products.length, "Products",        tk.green7,  "/farmer/products"],
            ["🛒", data.orders.length,   "Total Orders",    "#3b82f6",  "/farmer/orders"],
            ["💰", `₹${totalRevenue}`,   "Revenue",        "#8b5cf6",  "/farmer/revenue"],
            ["📦", `${totalQty} kg`,     "Remaining Stock", "#f59e0b",  "/farmer/products"],
          ].map(([icon,val,lbl,color,to])=>(
            <div key={lbl} style={{ ...card, cursor:"pointer", textAlign:"center" }} onClick={()=>navigate(to)}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=tk.shadowLg}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=tk.shadow}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color }}>{val}</div>
              <div style={{ fontSize:12, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.5px" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Rating card */}
        <div style={{ ...card, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:13, color:tk.textMid, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>Your Quality Rating</div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ fontSize:42, fontWeight:800, color: data.rating.avg>=4?"#10b981":data.rating.avg>=3?tk.gold:data.rating.avg>=2?"#f97316":"#ef4444" }}>
                {data.rating.avg > 0 ? data.rating.avg.toFixed(1) : "—"}
              </div>
              <div>
                <div style={{ fontSize:16, color:tk.text, fontWeight:700 }}>{ratingLabel(data.rating.avg)}</div>
                <div style={{ fontSize:12, color:tk.textLt }}>Based on {data.rating.total} review{data.rating.total!==1?"s":""}</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>navigate("/farmer/find-agents")} style={{ padding:"10px 20px", background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
              🤝 Find Agents
            </button>
            <button onClick={()=>navigate("/farmer/my-agents")} style={{ padding:"10px 20px", background:"transparent", border:`1.5px solid ${tk.green7}`, color:tk.green7, borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
              My Agents
            </button>
          </div>
        </div>

        {/* Products table */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:tk.text, margin:0 }}>Products Listed by Agents</h2>
            <span onClick={()=>navigate("/farmer/products")} style={{ color:tk.green7, fontWeight:700, fontSize:13, cursor:"pointer" }}>View all →</span>
          </div>
          {data.products.length===0 ? (
            <div style={{ ...card, textAlign:"center", padding:36 }}>
              <div style={{ fontSize:44, marginBottom:10 }}>📦</div>
              <p style={{ color:tk.textLt }}>No products yet. Connect with an agent to start listing produce.</p>
              <button onClick={()=>navigate("/farmer/find-agents")} style={{ marginTop:12, background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", padding:"10px 22px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Find Agents</button>
            </div>
          ) : (
            <div style={{ background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}`, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${tk.border}` }}>
                    {["Product","Category","Price/kg","Stock","Rating","Agent"].map(h=>(
                      <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:tk.textLt, textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.products.slice(0,8).map(p=>(
                    <tr key={p._id||p.id} style={{ borderBottom:`1px solid ${tk.border}` }}>
                      <td style={{ padding:"12px 16px", fontWeight:700, color:tk.text }}>{p.name}</td>
                      <td style={{ padding:"12px 16px", color:tk.textMid, fontSize:13 }}>{p.category}</td>
                      <td style={{ padding:"12px 16px", color:tk.green7, fontWeight:700 }}>₹{p.pricePerKg||p.price}</td>
                      <td style={{ padding:"12px 16px", color:(p.quantity||p.qty)<20?"#ef4444":tk.textMid, fontSize:13 }}>{p.quantity||p.qty} kg</td>
                      <td style={{ padding:"12px 16px", color:tk.gold, fontSize:13 }}>{p.avgRating>0?`⭐ ${p.avgRating}`:"—"}</td>
                      <td style={{ padding:"12px 16px", color:tk.textMid, fontSize:13 }}>{p.agentName||p.agentId?.name||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
