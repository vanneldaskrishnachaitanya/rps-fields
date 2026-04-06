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
    authFetch("/farmer/orders").then(d=>setOrders(d.orders||[])).finally(()=>setLoading(false));
  }, []); // eslint-disable-line

  const totalRevenue = orders.reduce((s,o)=>s+(o.totalPrice||o.total||0),0);
  const delivered    = orders.filter(o=>o.status==="delivered");
  const confirmed    = orders.filter(o=>o.status==="confirmed");

  const gc = { background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)", border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`, boxShadow: dark?"0 4px 24px rgba(0,0,0,0.45)":"0 4px 24px rgba(0,0,0,0.08)" };

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#040d06,#0d2b1a,#1b4332)", padding:"52px var(--page-px,clamp(16px,4vw,48px)) 44px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 80% 50%,rgba(139,92,246,0.1),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", animation:"fadeUp 0.5s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(139,92,246,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
            <span style={{ color:"#a78bfa", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>💰 Revenue Overview</span>
          </div>
          <h1 style={{ color:"#fff", fontSize:"clamp(24px,4vw,34px)", fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>Revenue Dashboard</h1>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px var(--page-px,clamp(16px,4vw,48px)) 100px" }}>
        <FarmerNav />

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {[
            { icon:"💰", val:`₹${totalRevenue.toLocaleString("en-IN")}`, lbl:"Total Revenue", color:"#7c3aed", grad:"linear-gradient(135deg,#7c3aed22,#6d28d911)" },
            { icon:"📦", val:orders.length, lbl:"Total Orders", color:"#2563eb", grad:"linear-gradient(135deg,#2563eb22,#1d4ed811)" },
            { icon:"✅", val:delivered.length, lbl:"Delivered", color:"#059669", grad:"linear-gradient(135deg,#05966922,#04785411)" },
            { icon:"📋", val:confirmed.length, lbl:"Confirmed", color:"#c8960c", grad:"linear-gradient(135deg,#c8960c22,#a3700911)" },
          ].map(({icon,val,lbl,color,grad},i)=>(
            <div key={lbl} style={{
              background: dark?`${grad},rgba(12,22,15,0.85)`:`${grad},rgba(255,255,255,0.85)`,
              backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
              border:`1px solid ${color}25`, borderRadius:20, padding:"22px 18px", textAlign:"center",
              boxShadow: dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)",
              transition:"all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              animation:`fadeUp 0.55s ease ${i*0.07}s both`, position:"relative", overflow:"hidden",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${color}25`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)";}}
            >
              <div style={{ position:"absolute", top:-10, right:-10, width:50, height:50, borderRadius:"50%", background:`${color}15`, pointerEvents:"none" }} />
              <div style={{ fontSize:26, marginBottom:10 }}>{icon}</div>
              <div style={{ fontSize:24, fontWeight:900, color, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"', marginBottom:4 }}>{val}</div>
              <div style={{ fontSize:10, color:tk.textLt, textTransform:"uppercase", letterSpacing:"1px", fontWeight:600 }}>{lbl}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:18, fontWeight:700, color:tk.text, marginBottom:16 }}>Order History</h2>
        {loading ? (
          [1,2,3].map(i=><div key={i} style={{ height:100, borderRadius:20, marginBottom:12, background: dark?"rgba(12,22,15,0.5)":"rgba(255,255,255,0.5)", backdropFilter:"blur(8px)", animation:"shimmer 1.5s ease infinite" }} />)
        ) : orders.length===0 ? (
          <div style={{ ...gc, borderRadius:22, padding:"44px var(--page-px,clamp(16px,4vw,48px))", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>💰</div>
            <p style={{ color:tk.textLt, fontSize:15 }}>No revenue yet. Connect with agents to start selling.</p>
          </div>
        ) : orders.map((ord,i)=>(
          <div key={ord._id||ord.id} style={{
            ...gc, borderRadius:20, padding:22, marginBottom:14,
            animation:`fadeUp 0.5s ease ${i*0.05}s both`, transition:"all 0.2s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";}}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, color:tk.text, fontSize:13, fontFamily:"monospace" }}>#{(ord._id||ord.id)?.toString().slice(-10).toUpperCase()}</div>
                <div style={{ fontSize:12, color:tk.textLt, marginTop:2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ background:ord.status==="delivered"?"rgba(16,185,129,0.15)":"rgba(59,130,246,0.15)", backdropFilter:"blur(8px)", color:ord.status==="delivered"?"#10b981":"#3b82f6", border:`1px solid ${ord.status==="delivered"?"rgba(16,185,129,0.3)":"rgba(59,130,246,0.3)"}`, borderRadius:20, padding:"3px 12px", fontWeight:700, fontSize:11 }}>● {ord.status}</span>
                <div style={{ fontSize:22, fontWeight:900, color:"#7c3aed", fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"', marginTop:4 }}>₹{ord.totalPrice||ord.total}</div>
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {(ord.items||[]).map((item,j)=>(
                <div key={j} style={{ background: dark?"rgba(82,183,136,0.08)":"rgba(82,183,136,0.06)", backdropFilter:"blur(8px)", border:`1px solid ${dark?"rgba(82,183,136,0.15)":"rgba(82,183,136,0.2)"}`, borderRadius:10, padding:"6px 12px", fontSize:12, color:tk.textMid }}>
                  {item.name} × {item.quantity||item.qty}kg = <strong style={{ color:tk.green4 }}>₹{item.totalPrice||(item.pricePerKg||item.price)*(item.quantity||item.qty)}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
