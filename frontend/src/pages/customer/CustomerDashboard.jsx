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
  const getUnitLabel = (unit) => {
    const u = String(unit || "kg").toLowerCase();
    if (["l", "lt", "ltr", "liter", "litre", "liters", "litres"].includes(u)) return "L";
    return "kg";
  };

  const StatCard = ({ icon, value, label, to, color="#52b788" }) => (
    <div data-tilt onClick={() => navigate(to)} style={{ background:tk.bgCard, borderRadius:16, padding:"14px 12px", border:`1px solid ${tk.border}`, cursor:"pointer", textAlign:"center", transition:"all 0.25s", position:"relative", overflow:"hidden", minHeight:108 }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=tk.shadowMd; e.currentTarget.style.borderColor=color+"66";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border;}}>
      <div style={{ position:"absolute", top:-16, right:-16, width:60, height:60, borderRadius:"50%", background:color+"15", pointerEvents:"none" }} />
      <div style={{ fontSize:24, marginBottom:4 }}>{icon}</div>
      <div className="num" style={{ fontSize:40, lineHeight:1, fontWeight:900, color, fontFamily:"'Inter',sans-serif", marginBottom:3 }}>{value}</div>
      <div style={{ fontSize:10, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.8px" }}>{label}</div>
    </div>
  );

  const QuickLink = ({ icon, label, to, primary }) => (
    <button data-magnetic onClick={()=>navigate(to)} style={{
      display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
      borderRadius:14, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:14,
      background: primary
        ? (dark
          ? "linear-gradient(135deg,rgba(93,198,150,0.94),rgba(47,131,94,0.96))"
          : "linear-gradient(135deg,rgba(78,176,133,0.96),rgba(43,120,86,0.98))")
        : tk.bgCard,
      color: primary ? "#ffffff" : tk.text,
      border: `1.5px solid ${primary ? "rgba(194,255,226,0.46)" : tk.border}`,
      boxShadow: primary
        ? "inset 0 1.5px 0 rgba(255,255,255,0.60), inset 0 -1px 0 rgba(0,0,0,0.16), 0 10px 24px rgba(28,120,86,0.42)"
        : "none",
      textShadow: primary ? "0 1px 4px rgba(0,0,0,0.28)" : "none",
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
      <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332,#2d6a4f)", padding:"clamp(26px,3.2vw,38px) var(--page-px,clamp(16px,3.2vw,36px))", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 80% 50%,rgba(82,183,136,0.12),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"var(--content-max,1680px)", margin:"0 auto", position:"relative" }}>
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

      <div style={{ maxWidth:"var(--content-max,1680px)", margin:"0 auto", padding:"clamp(18px,2.6vw,30px) var(--page-px,clamp(16px,3.2vw,36px)) 64px" }}>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:16 }}>
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

        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.52fr) minmax(280px,1fr)", gap:14, alignItems:"start" }}>
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
                <button data-magnetic onClick={()=>navigate("/catalog")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"12px 28px", borderRadius:50, cursor:"pointer", fontWeight:800, fontFamily:"'Inter',sans-serif" }}>
                  Browse Catalog →
                </button>
              </div>
            ) : recent.map((ord,i)=>(
              <div key={ord.id||ord._id} data-no-tilt style={{ background:tk.bgCard, borderRadius:16, padding:"12px 14px", marginBottom:8, border:`1px solid ${tk.border}`, animation:`fadeUp 0.5s ease ${i*0.08}s both`, transition:"all 0.2s", position:"relative", overflow:"hidden" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=tk.shadow; e.currentTarget.style.borderColor="#52b78833";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border;}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:800, color:tk.text, fontSize:13, fontFamily:"monospace" }}>{(ord.id||ord._id)?.toString().slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize:11, color:tk.textLt, marginTop:2 }}>{new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ background:"rgba(16,185,129,0.15)", color:"#10b981", border:"1px solid rgba(16,185,129,0.3)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, display:"block", marginBottom:4 }}>
                      ✓ {ord.status}
                    </span>
                    <div style={{ color: dark ? "#52b788" : "#2f8f69", fontWeight:900, fontSize:17 }}>₹{ord.total||ord.totalPrice}</div>
                  </div>
                </div>

                <div style={{ display:"grid", gap:6 }}>
                  {(ord.items||[]).slice(0,2).map((item, idx) => {
                    const imgSrc = item.img || item.image;
                    const unit = getUnitLabel(item.unit);
                    const itemQty = item.qty||item.quantity||1;
                    const itemTotal = item.totalPrice || (item.pricePerKg||item.price||0) * itemQty;
                    return (
                      <div key={`${ord.id||ord._id}-${idx}`} style={{ display:"flex", alignItems:"center", gap:12, background:tk.bgMuted, border:`1px solid ${tk.border}`, borderRadius:12, padding:"9px 10px" }}>
                        {imgSrc ? (
                          <img src={imgSrc} alt={item.name} style={{ width:72, height:72, objectFit:"cover", borderRadius:12, flexShrink:0, border:`1px solid ${tk.border}` }} onError={e=>{e.currentTarget.style.display="none";}} />
                        ) : (
                          <div style={{ width:72, height:72, borderRadius:12, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:dark?"rgba(82,183,136,0.12)":"rgba(82,183,136,0.10)", border:`1px solid ${tk.border}`, fontSize:24 }}>🌿</div>
                        )}
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ color: dark ? "#e9fff2" : "#123c2a", fontWeight:900, fontSize:20, lineHeight:1.2, textShadow: dark ? "0 1px 6px rgba(0,0,0,0.25)" : "none", whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden" }}>{item.name}</div>
                          <div style={{ marginTop:5, display:"inline-flex", alignItems:"center", gap:6, background:dark?"rgba(82,183,136,0.22)":"rgba(82,183,136,0.18)", border:"1px solid rgba(82,183,136,0.48)", borderRadius:999, padding:"3px 11px", color: dark ? "#74c69d" : "#1f6b4c", fontWeight:900, fontSize:13 }}>
                            Qty {itemQty}{unit}
                          </div>
                        </div>
                        <div style={{ textAlign:"right", minWidth:72 }}>
                          <div style={{ color: dark ? "#52b788" : "#2f8f69", fontWeight:900, fontSize:22, lineHeight:1 }}>₹{itemTotal}</div>
                        </div>
                      </div>
                    );
                  })}
                  {(ord.items||[]).length > 2 && (
                    <div style={{ fontSize:12, color:tk.textLt, fontWeight:600 }}>+ {(ord.items||[]).length - 2} more item(s)</div>
                  )}
                </div>
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
