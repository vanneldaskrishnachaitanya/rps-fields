import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [data, setData] = useState({ products:[], orders:[], rating:{ avg:0, total:0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Farmer Dashboard | RPS Fields";
    if (!user) return;

    const uid = user.id || user._id;
    Promise.all([
      authFetch(`/products?farmerId=${uid}`),
      authFetch("/farmer/orders").catch(()=>({orders:[]})),
      authFetch(`/ratings/farmer/${uid}`).catch(()=>({avgRating:0,totalRatings:0})),
    ]).then(([prods,ords,rat]) => {
      setData({ products:prods.products||[], orders:ords.orders||[], rating:{ avg:rat.avgRating||0, total:rat.totalRatings||0 } });
    }).finally(()=>setLoading(false));
  }, [user]); // eslint-disable-line

  const totalRevenue = data.orders.reduce((s,o)=>s+(o.totalPrice||o.total||0),0);
  const totalQty     = data.products.reduce((s,p)=>s+(p.quantity||p.qty||0),0);

  const ratingColor = (avg) => avg>=4?"#10b981":avg>=3?"#c8960c":avg>=2?"#f97316":"#dc2626";
  const ratingLabel = (avg) => avg>=4?"Excellent 🌟":avg>=3?"Good 👍":avg>=2?"Average ⚠":avg>0?"Needs Work ❌":"No ratings yet";

  const NAV = [["📊","Dashboard","/farmer/dashboard"],["📦","Products","/farmer/products"],["🛒","Orders","/farmer/orders"],["🤝","Find Agents","/farmer/find-agents"],["🤝","My Agents","/farmer/my-agents"],["💰","Revenue","/farmer/revenue"]];

  if (loading) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:60, marginBottom:14, animation:"float 2s ease-in-out infinite" }}>🌿</div>
        <p style={{ color:tk.textLt, fontSize:15 }}>Loading your farm data...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>

      {/* ── Hero Banner ── */}

      <div style={{
        background: "linear-gradient(135deg,#040d06 0%,#0d2b1a 40%,#1b4332 70%,#2d6a4f 100%)",
        padding:"52px var(--page-px,clamp(16px,4vw,48px)) 44px", position:"relative", overflow:"hidden",
      }}>
        {/* Decorative orbs */}
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(82,183,136,0.08)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-20, left:"30%", width:140, height:140, borderRadius:"50%", background:"rgba(116,198,157,0.06)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{
              width:58, height:58, borderRadius:16,
              background:"rgba(82,183,136,0.28)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, boxShadow:"0 8px 24px rgba(82,183,136,0.35)", flexShrink:0,
            }}>🌾</div>
            <div>
              <div style={{ color:"rgba(116,198,157,0.8)", fontSize:11, letterSpacing:"2.5px", textTransform:"uppercase", marginBottom:5, fontWeight:600 }}>Farmer Dashboard</div>
              <h1 style={{ color:"#fff", fontSize:"clamp(22px,3.5vw,32px)", fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px", fontWeight:700 }}>
                Welcome, {user?.fullName?.split(" ")[0] || user?.name?.split(" ")[0]}! 👋
              </h1>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{user?.email} · 📍 {user?.city||user?.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px var(--page-px,clamp(16px,4vw,48px)) 100px" }}>

        {/* ── Sub Nav ── */}
        <div style={{
          display:"flex", gap:6, marginBottom:28, flexWrap:"wrap",
          padding:"8px", borderRadius:14,
          background: dark?"rgba(17,31,20,0.8)":"rgba(232,245,235,0.8)",
          backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
          border:`1px solid ${tk.border}`,
        }}>
          {NAV.map(([icon,lbl,to])=>{
            const active = window.location.pathname===to;
            return (
              <button data-magnetic key={to} onClick={()=>navigate(to)} style={{
                padding:"8px 14px", borderRadius:10, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:13,
                background: active ? "rgba(82,183,136,0.28)" : "transparent",
                color: active ? "#fff" : tk.textMid,
                border: active ? "none" : "none",
                boxShadow: active ? "0 3px 12px rgba(64,145,108,0.3)" : "none",
                transition:"all 0.2s",
              }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background=dark?"rgba(64,145,108,0.15)":"rgba(64,145,108,0.1)"; e.currentTarget.style.color="#40916c"; }}}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=tk.textMid; }}}
              >{icon} {lbl}</button>
            );
          })}
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
          {[
            { icon:"📦", val: data.products.length, lbl:"Products", color:"#40916c", grad:"linear-gradient(135deg,#40916c22,#2d6a4f11)", to:"/farmer/products" },
            { icon:"🛒", val: data.orders.length,   lbl:"Orders",   color:"#2563eb", grad:"linear-gradient(135deg,#2563eb22,#1d4ed811)", to:"/farmer/orders" },
            { icon:"💰", val:`₹${totalRevenue.toLocaleString("en-IN")}`, lbl:"Revenue", color:"#7c3aed", grad:"linear-gradient(135deg,#7c3aed22,#6d28d911)", to:"/farmer/revenue" },
            { icon:"📊", val:`${totalQty.toLocaleString("en-IN")} kg`, lbl:"Stock",   color:"#c8960c", grad:"linear-gradient(135deg,#c8960c22,#a3700911)", to:"/farmer/products" },
          ].map(({ icon,val,lbl,color,grad,to },i)=>(
            <div key={lbl} data-tilt onClick={()=>navigate(to)} style={{
              background: dark ? `${grad}, rgba(12,26,15,0.95)` : `${grad}, rgba(255,255,255,0.95)`,
              borderRadius:18, padding:"22px var(--page-px,clamp(16px,4vw,48px))",
              border:`1px solid ${color}30`,
              cursor:"pointer", textAlign:"center",
              boxShadow: dark?"0 2px 16px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)",
              transition:"all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              animation:`fadeUp 0.55s ease ${i*0.07}s both`,
              position:"relative", overflow:"hidden",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow=`0 12px 32px ${color}25`; e.currentTarget.style.borderColor=color+"60"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=dark?"0 2px 16px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor=`${color}30`; }}
            >
              <div style={{ position:"absolute", top:-8, right:-8, width:50, height:50, borderRadius:"50%", background:`${color}12`, pointerEvents:"none" }} />
              <div style={{ fontSize:26, marginBottom:10 }}>{icon}</div>
              <div className="num" style={{ fontSize:26, fontWeight:900, color, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"', letterSpacing:"-0.5px", marginBottom:4 }}>{val}</div>
              <div style={{ fontSize:11, color:tk.textLt, textTransform:"uppercase", letterSpacing:"1px", fontWeight:600 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* ── Rating + Quick Actions row ── */}
        <div style={{ marginBottom:24 }}>

          {/* Rating card */}
          <div style={{
            background: dark?"rgba(12,26,15,0.95)":"#fff",
            borderRadius:18, padding:"22px 26px",
            border:`1px solid ${tk.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16,
            animation:"fadeUp 0.55s ease 0.28s both",
          }}>
            <div>
              <div style={{ fontSize:11, color:tk.textLt, textTransform:"uppercase", letterSpacing:"1.2px", fontWeight:600, marginBottom:10 }}>Your Quality Rating</div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{
                  width:64, height:64, borderRadius:"50%",
                  background: data.rating.avg>0 ? `conic-gradient(${ratingColor(data.rating.avg)} ${data.rating.avg/5*360}deg, ${dark?"#1a3320":"#e2f0e5"} 0deg)` : dark?"#1a3320":"#e2f0e5",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative",
                }}>
                  <div style={{ width:48, height:48, borderRadius:"50%", background: dark?"#0c1a0f":"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:18, fontWeight:900, color: data.rating.avg>0?ratingColor(data.rating.avg):tk.textLt, fontFamily:"'Inter',sans-serif" }}>
                      {data.rating.avg>0?data.rating.avg.toFixed(1):"—"}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:17, fontWeight:700, color:tk.text, marginBottom:3 }}>{ratingLabel(data.rating.avg)}</div>
                  <div style={{ fontSize:12, color:tk.textLt }}>Based on <strong style={{ color:tk.textMid }}>{data.rating.total}</strong> review{data.rating.total!==1?"s":""}</div>
                  {data.rating.avg > 0 && (
                    <div style={{ display:"flex", gap:2, marginTop:6 }}>
                      {[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:14, color: s<=Math.round(data.rating.avg)?"#c8960c":tk.border }}>★</span>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button data-magnetic onClick={()=>navigate("/farmer/find-agents")} style={{ padding:"10px 18px", background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", borderRadius:50, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif", fontSize:13, transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}
              >🤝 Find Agents</button>
              <button data-magnetic onClick={()=>navigate("/farmer/my-agents")} style={{ padding:"10px 18px", background:"transparent", border:`1.5px solid ${tk.green5}`, color:tk.green5, borderRadius:50, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif", fontSize:13, transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=tk.green5; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=tk.green5; }}
              >My Agents</button>

            </div>
          </div>
        </div>


        {/* ── Products Table ── */}
        <div style={{ animation:"fadeUp 0.55s ease 0.35s both" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:tk.text, margin:0, fontFamily:"'Inter',sans-serif" }}>
              Products Listed by Agents
              <span style={{ fontSize:12, color:tk.textLt, fontWeight:500, marginLeft:8 }}>({data.products.length} total)</span>
            </h2>
            <span onClick={()=>navigate("/farmer/products")} style={{ color:tk.green4, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="#74c69d"} onMouseLeave={e=>e.target.style.color=tk.green4}>View all →</span>
          </div>

          {data.products.length===0 ? (
            <div style={{ background: dark?"rgba(12,26,15,0.95)":"#fff", borderRadius:20, padding:"44px 32px", textAlign:"center", border:`1px solid ${tk.border}` }}>
              <div style={{ fontSize:52, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>📦</div>
              <h3 style={{ color:tk.text, marginBottom:8, fontSize:18, fontFamily:"'Playfair Display',Georgia,serif" }}>No products yet</h3>
              <p style={{ color:tk.textLt, marginBottom:22, fontSize:14 }}>Connect with an agent to start listing your produce.</p>
              <button data-magnetic onClick={()=>navigate("/farmer/find-agents")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"12px 28px", borderRadius:50, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
                Find Agents →
              </button>
            </div>
          ) : (
            <div style={{ background: dark?"rgba(12,26,15,0.95)":"#fff", borderRadius:18, border:`1px solid ${tk.border}`, overflow:"hidden", boxShadow: dark?"0 2px 16px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${tk.border}`, background: dark?"rgba(17,31,20,0.6)":"rgba(240,247,242,0.8)" }}>
                    {["Product","Category","Price/kg","Stock","Rating","Agent"].map(h=>(
                      <th key={h} style={{ padding:"13px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Inter',sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.products.slice(0,10).map((p,i)=>(
                    <tr key={p._id||p.id} style={{ borderBottom: i<data.products.slice(0,10).length-1?`1px solid ${tk.border}`:"none", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(64,145,108,0.06)":"rgba(232,245,235,0.7)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"13px 18px", fontWeight:700, color:tk.text, fontSize:14 }}>{p.name}</td>
                      <td style={{ padding:"13px 18px" }}>
                        <span style={{ background: dark?"rgba(64,145,108,0.15)":"rgba(64,145,108,0.1)", color:tk.green4, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{p.category}</span>
                      </td>
                      <td style={{ padding:"13px 18px", fontFamily:"'Inter',sans-serif", fontWeight:800, color:tk.green4, fontSize:15, fontFeatureSettings:'"tnum"' }}>₹{p.pricePerKg||p.price}</td>
                      <td style={{ padding:"13px 18px", fontFamily:"'Inter',sans-serif", fontWeight:600, color:(p.quantity||p.qty)<20?"#dc2626":tk.textMid, fontSize:13 }}>
                        {(p.quantity||p.qty)<20&&<span style={{ marginRight:4, animation:"pulse 2s infinite" }}>⚠</span>}
                        {p.quantity||p.qty} kg
                      </td>
                      <td style={{ padding:"13px 18px" }}>
                        {p.avgRating>0 ? (
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ color:"#c8960c", fontWeight:800, fontFamily:"'Inter',sans-serif" }}>{p.avgRating.toFixed(1)}</span>
                            <span style={{ color:"#c8960c", fontSize:12 }}>★</span>
                          </div>
                        ) : <span style={{ color:tk.textLt, fontSize:13 }}>—</span>}
                      </td>
                      <td style={{ padding:"13px 18px", color:tk.textMid, fontSize:13 }}>{p.agentName||p.agentId?.name||"—"}</td>
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
