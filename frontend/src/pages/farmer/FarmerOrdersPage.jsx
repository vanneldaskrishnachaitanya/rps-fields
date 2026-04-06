import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FarmerNav } from "./FarmerAgentPages";

const STATUS = {
  delivered:{ bg:"rgba(16,185,129,0.15)", color:"#10b981", border:"rgba(16,185,129,0.3)" },
  confirmed:{ bg:"rgba(59,130,246,0.15)", color:"#3b82f6", border:"rgba(59,130,246,0.3)" },
  pending:  { bg:"rgba(245,158,11,0.15)", color:"#f59e0b", border:"rgba(245,158,11,0.3)" },
  cancelled:{ bg:"rgba(239,68,68,0.15)",  color:"#ef4444", border:"rgba(239,68,68,0.3)"  },
};

function GlassBanner({ title, sub }) {
  return (
    <div style={{ background:"linear-gradient(135deg,#040d06,#0d2b1a,#1b4332)", padding:"52px var(--page-px,clamp(16px,4vw,48px)) 44px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 70% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents:"none" }} />
      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.25)", borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ color:"#74c69d", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>🌾 Farmer Dashboard</span>
        </div>
        <h1 style={{ color:"#fff", fontSize:"clamp(24px,4vw,34px)", fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 6px" }}>{title}</h1>
        {sub && <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13 }}>{sub}</p>}
      </div>
    </div>
  );
}

export function FarmerOrdersPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/farmer/orders").then(d=>{ if(d.success) setOrders(d.orders||[]); }).finally(()=>setLoading(false));
  }, []); // eslint-disable-line

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <GlassBanner title="📦 Orders Received" sub={`${orders.length} order${orders.length!==1?"s":""} from customers`} />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px var(--page-px,clamp(16px,4vw,48px)) 100px" }}>
        <FarmerNav />
        {loading ? (
          [1,2,3].map(i=><div key={i} style={{ height:120, borderRadius:20, marginBottom:14, background: dark?"rgba(12,22,15,0.5)":"rgba(255,255,255,0.5)", backdropFilter:"blur(8px)", animation:"shimmer 1.5s ease infinite" }} />)
        ) : orders.length===0 ? (
          <div style={{ background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`, borderRadius:24, padding:"60px var(--page-px,clamp(16px,4vw,48px))", textAlign:"center", boxShadow: dark?"0 4px 24px rgba(0,0,0,0.45)":"0 4px 24px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize:60, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🛒</div>
            <h3 style={{ color:tk.text, fontSize:22, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>No orders yet</h3>
            <p style={{ color:tk.textLt, fontSize:15 }}>Orders appear here when customers buy your products.</p>
          </div>
        ) : orders.map((ord,i) => {
          const ss = STATUS[ord.status]||STATUS.pending;
          return (
            <div key={ord.id||ord._id} style={{
              background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)",
              backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
              border:`1px solid ${dark?"rgba(82,183,136,0.1)":"rgba(255,255,255,0.9)"}`,
              boxShadow: dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)",
              borderRadius:20, padding:24, marginBottom:16,
              animation:`fadeUp 0.5s ease ${i*0.06}s both`,
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=dark?"0 8px 36px rgba(0,0,0,0.5)":"0 8px 36px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 24px rgba(0,0,0,0.07)"; e.currentTarget.style.transform="none";}}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:tk.text, fontFamily:"monospace", marginBottom:4 }}>#{(ord.id||ord._id)?.toString().slice(-10).toUpperCase()}</div>
                  <div style={{ fontSize:12, color:tk.textLt }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                  <span style={{ background:ss.bg, backdropFilter:"blur(8px)", color:ss.color, border:`1px solid ${ss.border}`, borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:11 }}>● {ord.status}</span>
                  <div style={{ fontSize:22, fontWeight:900, color:tk.green4, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"' }}>₹{ord.total||ord.totalPrice}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                {(ord.items||[]).map((item,j)=>(
                  <div key={j} style={{ background: dark?"rgba(82,183,136,0.08)":"rgba(82,183,136,0.06)", backdropFilter:"blur(8px)", border:`1px solid ${dark?"rgba(82,183,136,0.15)":"rgba(82,183,136,0.2)"}`, borderRadius:10, padding:"7px 12px", fontSize:13, color:tk.textMid }}>
                    <strong style={{ color:tk.text }}>{item.name}</strong> × {item.qty||item.quantity}kg
                    <span style={{ color:tk.green4, fontWeight:700, marginLeft:6 }}>₹{item.price*(item.qty||item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:12, color:tk.textLt, paddingTop:12, borderTop:`1px solid ${dark?"rgba(82,183,136,0.08)":"rgba(0,0,0,0.05)"}` }}>
                📦 {ord.city} · 📞 {ord.phone}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FarmerProfilePage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, logout } = useAuth();

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#040d06,#0d2b1a,#1b4332)", padding:"60px var(--page-px,clamp(16px,4vw,48px))", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 50% 80%,rgba(82,183,136,0.12),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", animation:"fadeUp 0.5s ease both" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, margin:"0 auto 16px", boxShadow:"0 12px 36px rgba(82,183,136,0.35)" }}>🌾</div>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 6px" }}>{user?.fullName}</h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:14 }}>Verified Farmer · {user?.city}</p>
        </div>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"28px var(--page-px,clamp(16px,4vw,48px)) 100px" }}>
        <FarmerNav />
        <div style={{ background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)", border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`, borderRadius:22, padding:"6px 24px 20px", boxShadow: dark?"0 4px 24px rgba(0,0,0,0.45)":"0 4px 24px rgba(0,0,0,0.08)", marginBottom:20 }}>
          {[["👤","Full Name",user?.fullName],["🆔","Username",user?.username],["📧","Email",user?.email],["📞","Phone",user?.phone||user?.mobile],["🏡","Address",user?.address],["🏙","City",user?.city]].map(([icon,label,value])=>(
            <div key={label} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px 0", borderBottom:`1px solid ${dark?"rgba(82,183,136,0.08)":"rgba(0,0,0,0.05)"}` }}>
              <div style={{ width:36, height:36, borderRadius:10, background: dark?"rgba(82,183,136,0.12)":"rgba(82,183,136,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{icon}</div>
              <div>
                <div style={{ fontSize:10, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:15, color: value?tk.text:tk.textLt, fontWeight: value?600:400, fontStyle: value?"normal":"italic" }}>{value||"Not set"}</div>
              </div>
            </div>
          ))}
        </div>
        <button data-magnetic onClick={()=>{logout();navigate("/");}} style={{ width:"100%", padding:14, background:"rgba(220,38,38,0.1)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(220,38,38,0.3)", color:"#ef4444", borderRadius:14, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(220,38,38,0.2)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(220,38,38,0.1)"}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default FarmerOrdersPage;
