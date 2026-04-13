import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export function AgentNav() {
  const { dark } = useTheme(); const tk = TK(dark);
  const links = [["📊","Dashboard","/agent/dashboard"],["➕","Add Product","/agent/add-product"],["📦","Products","/agent/products"],["🛒","Orders","/agent/orders"],["🌾","Farmers","/agent/farmers"],["📬","Requests","/agent/requests"]];
  return (
    <div style={{ display:"flex", gap:6, marginBottom:28, flexWrap:"wrap", padding:8, borderRadius:16, background: dark?"rgba(12,22,15,0.7)":"rgba(240,248,255,0.8)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:`1px solid ${dark?"rgba(59,130,246,0.12)":"rgba(255,255,255,0.9)"}`, boxShadow: dark?"0 4px 20px rgba(0,0,0,0.3)":"0 4px 20px rgba(0,0,0,0.06)" }}>
      {links.map(([icon,lbl,to])=>(
        <NavLink key={to} to={to} style={({isActive})=>({ padding:"8px 14px", borderRadius:10, textDecoration:"none", fontWeight:600, fontSize:13, fontFamily:"'Inter',sans-serif", background: isActive?"rgba(59,130,246,0.28)":"transparent", color: isActive?"#fff":tk.textMid, boxShadow: isActive?"0 3px 12px rgba(59,130,246,0.3)":"none", border:"none", transition:"all 0.2s" })}>{icon} {lbl}</NavLink>
      ))}
    </div>
  );
}

function GlassBanner({ title, sub }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#030818,#0f1f5a,#1e3a8a)", padding:"clamp(26px,3.2vw,38px) var(--page-px,clamp(16px,3.2vw,36px))", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 25% 50%,rgba(59,130,246,0.15),transparent 55%),radial-gradient(circle at 75% 30%,rgba(99,102,241,0.1),transparent 50%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"-20%", right:"5%", width:250, height:250, borderRadius:"50%", background:"rgba(59,130,246,0.06)", pointerEvents:"none" }} />
      <div style={{ maxWidth:"var(--content-max,1680px)", margin:"0 auto", position:"relative", animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(59,130,246,0.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#60a5fa", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ color:"#93c5fd", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>🏢 Agent Dashboard</span>
        </div>
        <h1 style={{ color:"#fff", fontSize:"clamp(24px,4vw,34px)", fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 6px" }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13 }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [stats, setStats] = useState({ products:0, orders:0, farmers:0, revenue:0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingReqs, setPendingReqs] = useState([]);

  useEffect(() => {
    Promise.all([
      authFetch(`/products?agentId=${user?.id||user?._id}`),
      authFetch("/orders/agent/orders").catch(()=>({orders:[]})),
      authFetch("/partnerships/my-farmers"),
      authFetch("/partnerships/pending"),
    ]).then(([prods,ords,farmers,pending])=>{
      const orders = ords.orders||[];
      setStats({ products:(prods.products||[]).length, orders:orders.length, farmers:(farmers.farmers||[]).length, revenue:orders.reduce((s,o)=>s+(o.totalPrice||o.total||0),0) });
      setRecentOrders(orders.slice(0,5));
      setPendingReqs(pending.requests||[]);
    }).catch(()=>{});
  }, [user]); // eslint-disable-line

  const gc = { background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)", border:`1px solid ${dark?"rgba(59,130,246,0.12)":"rgba(255,255,255,0.9)"}`, boxShadow: dark?"0 4px 24px rgba(0,0,0,0.45)":"0 4px 24px rgba(0,0,0,0.08)" };

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <GlassBanner title={`Welcome, ${user?.fullName?.split(" ")[0]||user?.name?.split(" ")[0]} 👋`} sub={`${user?.email} · 📍 ${user?.location||user?.city}`} />
      <div style={{ maxWidth:"var(--content-max,1680px)", margin:"0 auto", padding:"clamp(18px,2.6vw,30px) var(--page-px,clamp(16px,3.2vw,36px)) 64px" }}>
        <AgentNav />

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:16 }}>
          {[
            { icon:"📦", val:stats.products, lbl:"Products", color:"#3b82f6", grad:"linear-gradient(135deg,#3b82f622,#1e40af11)", to:"/agent/products" },
            { icon:"🛒", val:stats.orders,   lbl:"Orders",   color:"#059669", grad:"linear-gradient(135deg,#05966922,#04785411)", to:"/agent/orders" },
            { icon:"🌾", val:stats.farmers,  lbl:"Farmers",  color:"#c8960c", grad:"linear-gradient(135deg,#c8960c22,#a3700911)", to:"/agent/farmers" },
            { icon:"💰", val:`₹${stats.revenue.toLocaleString("en-IN")}`, lbl:"Revenue", color:"#7c3aed", grad:"linear-gradient(135deg,#7c3aed22,#6d28d911)", to:"/agent/orders" },
          ].map(({icon,val,lbl,color,grad,to},i)=>(
            <div key={lbl} data-tilt onClick={()=>navigate(to)} style={{
              background: dark?`${grad},rgba(12,22,15,0.85)`:`${grad},rgba(255,255,255,0.85)`,
              backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
              border:`1px solid ${color}25`, borderRadius:16, padding:"14px 12px", minHeight:108, textAlign:"center", cursor:"pointer",
              boxShadow: dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)",
              transition:"all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              animation:`fadeUp 0.55s ease ${i*0.07}s both`, position:"relative", overflow:"hidden",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px) scale(1.01)"; e.currentTarget.style.boxShadow=`0 12px 32px ${color}25`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)";}}
            >
              <div style={{ position:"absolute", top:-10, right:-10, width:50, height:50, borderRadius:"50%", background:`${color}12`, pointerEvents:"none" }} />
              <div style={{ fontSize:24, marginBottom:4 }}>{icon}</div>
              <div className="num" style={{ fontSize:34, lineHeight:1, fontWeight:900, color, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"', marginBottom:3 }}>{val}</div>
              <div style={{ fontSize:10, color:tk.textLt, textTransform:"uppercase", letterSpacing:"1px", fontWeight:600 }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.52fr) minmax(280px,1fr)", gap:14, alignItems:"start" }}>
          {/* Recent orders */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:tk.text, margin:0 }}>Recent Orders</h2>
              <span onClick={()=>navigate("/agent/orders")} style={{ color:"#60a5fa", fontWeight:600, fontSize:13, cursor:"pointer" }}>View all →</span>
            </div>
            {recentOrders.length===0 ? (
              <div style={{ ...gc, borderRadius:20, padding:36, textAlign:"center" }}>
                <div style={{ fontSize:44, marginBottom:10, animation:"float 3s ease-in-out infinite" }}>🛒</div>
                <p style={{ color:tk.textLt, marginBottom:16 }}>No orders yet. Add products to start selling.</p>
                <button data-magnetic onClick={()=>navigate("/agent/add-product")} style={{ background:"rgba(59,130,246,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.28)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"11px 24px", borderRadius:50, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
                  Add First Product →
                </button>
              </div>
            ) : recentOrders.map((ord,i)=>(
              <div key={ord._id||ord.id} data-tilt style={{ ...gc, borderRadius:16, padding:14, marginBottom:8, transition:"all 0.2s", animation:`fadeUp 0.5s ease ${i*0.06}s both`, position:"relative", overflow:"hidden" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div>
                    <div style={{ fontWeight:700, color:tk.text, fontSize:13, fontFamily:"monospace" }}>#{(ord._id||ord.id)?.toString().slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize:11, color:tk.textLt, marginTop:2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ background:"rgba(16,185,129,0.15)", backdropFilter:"blur(8px)", color:"#10b981", border:"1px solid rgba(16,185,129,0.3)", borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>✓ {ord.status}</span>
                    <div style={{ color:"#60a5fa", fontWeight:900, fontSize:17, fontFamily:"'Inter',sans-serif", marginTop:3 }}>₹{ord.totalPrice||ord.total}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:tk.textMid }}>{(ord.items||[]).map(i=>`${i.name}×${i.quantity||i.qty}kg`).join(" · ")}</div>
              </div>
            ))}
          </div>

          {/* Pending requests */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:tk.text, margin:0 }}>Partnership Requests</h2>
              {pendingReqs.length>0 && <span style={{ background:"rgba(239,68,68,0.85)", backdropFilter:"blur(8px)", color:"#fff", borderRadius:"50%", width:20, height:20, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{pendingReqs.length}</span>}
            </div>
            {pendingReqs.length===0 ? (
              <div style={{ ...gc, borderRadius:18, padding:28, textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📬</div>
                <p style={{ color:tk.textLt, fontSize:14 }}>No pending requests</p>
              </div>
            ) : pendingReqs.slice(0,4).map(req=><RequestCard key={req._id} req={req} authFetch={authFetch} tk={tk} dark={dark} onDone={()=>window.location.reload()} />)}
            {pendingReqs.length>4 && <button data-magnetic onClick={()=>navigate("/agent/requests")} style={{ width:"100%", marginTop:8, padding:10, background:"rgba(59,130,246,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(59,130,246,0.2)", color:"#60a5fa", borderRadius:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>See all {pendingReqs.length} requests →</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ req, authFetch, tk, dark, onDone }) {
  const [loading, setLoading] = useState("");
  const farmer = req.farmerId||{};
  const respond = async (status) => {
    setLoading(status);
    await authFetch(`/partnerships/${req._id}/respond`,{method:"PUT",body:JSON.stringify({status})});
    setLoading(""); onDone();
  };
  return (
    <div style={{ background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:`1px solid ${dark?"rgba(59,130,246,0.12)":"rgba(255,255,255,0.9)"}`, borderRadius:16, padding:"16px 18px", marginBottom:10, boxShadow: dark?"0 4px 20px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.07)" }}>
      <div style={{ fontWeight:700, color:tk.text, fontSize:14, marginBottom:3 }}>{farmer.fullName||farmer.name}</div>
      <div style={{ fontSize:12, color:tk.textMid, marginBottom:12 }}>📍 {farmer.location||farmer.city} · 📞 {farmer.mobile||farmer.phone}</div>
      <div style={{ display:"flex", gap:8 }}>
        <button data-magnetic onClick={()=>respond("accepted")} disabled={!!loading} style={{ flex:1, padding:"8px", background:"rgba(5,150,105,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.12), 0 8px 28px rgba(0,0,0,0.22), 0 3px 10px rgba(5,150,105,0.3)", color:"#fff", border:"none", borderRadius:50, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif", opacity:loading?0.7:1, transition:"all 0.2s" }}>
          {loading==="accepted"?"...":"✓ Accept"}
        </button>
        <button data-magnetic onClick={()=>respond("rejected")} disabled={!!loading} style={{ flex:1, padding:"8px", background:"rgba(220,38,38,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(220,38,38,0.3)", color:"#ef4444", borderRadius:50, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}>
          {loading==="rejected"?"...":"✕ Reject"}
        </button>
      </div>
    </div>
  );
}
