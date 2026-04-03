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
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/orders").then(d=>{ if(d.success) setOrders(d.orders); }).catch(()=>{}).finally(()=>setLoading(false));
  }, []); // eslint-disable-line

  const recent     = [...orders].reverse().slice(0,3);
  const totalSpent = orders.reduce((s,o)=>s+(o.total||o.totalPrice||0),0);
  const delivered  = orders.filter(o=>o.status==="delivered").length;

  const StatCard = ({ icon, value, label, to, color="#52b788" }) => (
    <div data-tilt onClick={() => navigate(to)} style={{ background:tk.bgCard, borderRadius:20, padding:"22px 20px", border:`1px solid ${tk.border}`, cursor:"pointer", textAlign:"center", transition:"all 0.25s", position:"relative", overflow:"hidden" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=tk.shadowMd; e.currentTarget.style.borderColor=color+"66";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border;}}>
      <div style={{ position:"absolute", top:-16, right:-16, width:60, height:60, borderRadius:"50%", background:color+"15", pointerEvents:"none" }} />
      <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
      <div className="num" style={{ fontSize:28, fontWeight:900, color, fontFamily:"'Inter',sans-serif", marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.8px" }}>{label}</div>
    </div>
  );

  const QuickLink = ({ icon, label, to, primary }) => (
    <button onClick={()=>navigate(to)} style={{
      display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
      borderRadius:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:14,
      background: primary ? "rgba(82,183,136,0.28)" : tk.bgCard,
      color: primary ? "#fff" : tk.text,
      border: `1.5px solid ${primary?"transparent":tk.border}`,
      boxShadow: primary ? "0 4px 16px rgba(82,183,136,0.3)" : "none",
      transition:"all 0.2s", textAlign:"left", width:"100%",
    }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateX(3px)"; if(!primary) e.currentTarget.style.borderColor="#52b788";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none"; if(!primary) e.currentTarget.style.borderColor=tk.border;}}>
      <span style={{ fontSize:20 }}>{icon}</span>
      {label}
      <span style={{ marginLeft:"auto", opacity:0.5 }}>→</span>
    </button>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%", animation:"fadeIn 0.4s ease" }}>
      {/* Hero banner */}
      <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332,#2d6a4f)", padding:"52px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 80% 50%,rgba(82,183,136,0.12),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 8px 24px rgba(82,183,136,0.3)", flexShrink:0 }}>👤</div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:4 }}>Customer Dashboard</div>
              <h1 style={{ color:"#fff", fontSize:"clamp(22px,3.5vw,32px)", fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px" }}>
                Welcome back, {user?.fullName?.split(" ")[0]}! 👋
              </h1>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, margin:0 }}>{user?.email} · 📍 {user?.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 20px 100px" }}>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:36 }}>
          {[["📦", orders.length, "Total Orders", "/orders", "#3b82f6"],
            ["💰", `₹${totalSpent}`, "Total Spent", "/orders", "#8b5cf6"],
            ["✅", delivered, "Delivered", "/orders", "#10b981"],
            ["🛒", itemCount, "Cart Items", "/cart", "#d4a017"],
          ].map(([icon,val,lbl,to,color],i)=>(
            <div key={lbl} style={{ animation:`fadeUp 0.5s ease ${i*0.07}s both` }}>
              <StatCard icon={icon} value={val} label={lbl} to={to} color={color} />
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:28 }}>
          {/* Recent orders */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, margin:0 }}>Recent Orders</h2>
              <Link to="/orders" style={{ color:"#52b788", fontWeight:700, fontSize:13, textDecoration:"none" }}>View all →</Link>
            </div>
            {loading ? (
              [1,2,3].map(i=><div key={i} style={{ height:88, borderRadius:16, marginBottom:12, background:tk.bgMuted, animation:"shimmer 1.5s ease infinite" }} />)
            ) : recent.length===0 ? (
              <div style={{ background:tk.bgCard, borderRadius:20, padding:"40px", textAlign:"center", border:`1px solid ${tk.border}` }}>
                <div style={{ fontSize:48, marginBottom:14 }}>📦</div>
                <p style={{ color:tk.textLt, marginBottom:20, fontSize:15 }}>No orders yet. Start shopping!</p>
                <button onClick={()=>navigate("/catalog")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"12px 28px", borderRadius:50, cursor:"pointer", fontWeight:800, fontFamily:"'Inter',sans-serif" }}>
                  Browse Catalog →
                </button>
              </div>
            ) : recent.map((ord,i)=>(
              <div key={ord.id||ord._id} style={{ background:tk.bgCard, borderRadius:18, padding:"18px 22px", marginBottom:12, border:`1px solid ${tk.border}`, animation:`fadeUp 0.5s ease ${i*0.08}s both`, transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=tk.shadow; e.currentTarget.style.borderColor="#52b78833";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border;}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div>
                    <div style={{ fontWeight:800, color:tk.text, fontSize:13, fontFamily:"monospace" }}>{(ord.id||ord._id)?.toString().slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize:11, color:tk.textLt, marginTop:2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ background:"rgba(16,185,129,0.15)", color:"#10b981", border:"1px solid rgba(16,185,129,0.3)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, display:"block", marginBottom:4 }}>
                      ✓ {ord.status}
                    </span>
                    <div style={{ color:"#52b788", fontWeight:900, fontSize:17 }}>₹{ord.total||ord.totalPrice}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:tk.textMid }}>{(ord.items||[]).map(i=>`${i.name} ×${i.qty||i.quantity}kg`).join(" · ")}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, marginBottom:18 }}>Quick Actions</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[["🛒","Browse Catalog","/catalog",true],
                ["📦","My Orders","/orders",false],
                ["👤","My Profile","/profile",false],
                ["📍","Manage Addresses","/address",false],
                ["🛒","View Cart","/cart",false],
              ].map(([icon,lbl,to,primary],i)=>(
                <div key={to} style={{ animation:`fadeUp 0.5s ease ${i*0.07}s both` }}>
                  <QuickLink icon={icon} label={lbl} to={to} primary={primary} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
