import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import RateProductModal from "../components/RateProductModal";

const STATUS_STYLE = {
  delivered: { bg:"rgba(16,185,129,0.15)", color:"#10b981", border:"rgba(16,185,129,0.3)" },
  confirmed: { bg:"rgba(59,130,246,0.15)", color:"#3b82f6", border:"rgba(59,130,246,0.3)" },
  pending:   { bg:"rgba(245,158,11,0.15)", color:"#f59e0b", border:"rgba(245,158,11,0.3)" },
  cancelled: { bg:"rgba(239,68,68,0.15)",  color:"#ef4444", border:"rgba(239,68,68,0.3)"  },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [rateModal, setRateModal] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    authFetch("/orders")
      .then(d => { if (d.success) setOrders(d.orders||[]); })
      .finally(() => setLoading(false));
  }, [user]); // eslint-disable-line

  if (!user) return null;

  return (
    <div style={{ background:tk.bg, minHeight:"100%", animation:"fadeIn 0.4s ease" }}>
      <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332,#2d6a4f)", padding:"52px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 70% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ textAlign:"center", position:"relative" }}>
          <h1 style={{ color:"#fff", fontSize:38, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:6 }}>📦 My Orders</h1>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14 }}>Track your farm fresh deliveries</p>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"36px 20px 100px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:tk.textLt }}>
            <div style={{ fontSize:48, marginBottom:14, animation:"float 2s ease-in-out infinite" }}>📦</div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"70px 40px", background:tk.bgCard, borderRadius:24, border:`1px solid ${tk.border}`, animation:"scaleIn 0.4s ease" }}>
            <div style={{ fontSize:64, marginBottom:18, animation:"float 3s ease-in-out infinite" }}>📦</div>
            <h2 style={{ color:tk.text, marginBottom:10, fontSize:24, fontFamily:"'Playfair Display',Georgia,serif" }}>No orders yet</h2>
            <p style={{ color:tk.textLt, marginBottom:28, fontSize:15 }}>Browse the catalog and make your first order!</p>
            <button onClick={()=>navigate("/catalog")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"14px 32px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif" }}>
              Browse Catalog →
            </button>
          </div>
        ) : orders.map((ord,i) => {
          const ordId = ord._id||ord.id;
          const ss = STATUS_STYLE[ord.status] || STATUS_STYLE.pending;
          return (
            <div key={ordId} data-tilt style={{ background:tk.bgCard, borderRadius:22, padding:28, marginBottom:18, border:`1px solid ${tk.border}`, animation:`fadeUp 0.5s ease ${i*0.07}s both`, transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=tk.shadowMd; e.currentTarget.style.borderColor="#52b78833";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border;}}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontWeight:900, fontSize:14, color:tk.text, marginBottom:4, fontFamily:"monospace", letterSpacing:"0.5px" }}>
                    #{ordId?.toString().slice(-10).toUpperCase()}
                  </div>
                  <div style={{ fontSize:12, color:tk.textLt }}>
                    {new Date(ord.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                  </div>
                </div>
                <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  <span style={{ background:ss.bg, color:ss.color, border:`1px solid ${ss.border}`, borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:12 }}>
                    ● {ord.status}
                  </span>
                  <div style={{ fontSize:26, fontWeight:900, color:tk.green5, fontFamily:"'Playfair Display',Georgia,serif" }}>
                    ₹{ord.totalPrice||ord.total}
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
                {(ord.items||[]).map((item,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:tk.bgMuted, borderRadius:14, border:`1px solid ${tk.border}` }}>
                    {(item.image||item.img) && (
                      <img src={item.image||item.img} alt={item.name} style={{ width:48, height:48, borderRadius:10, objectFit:"cover", flexShrink:0 }} onError={e=>e.target.style.display="none"} />
                    )}
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, color:tk.text, fontSize:14, marginBottom:2 }}>{item.name}</div>
                      <div style={{ fontSize:12, color:tk.textMid }}>
                        {item.quantity||item.qty}kg × ₹{item.pricePerKg||item.price} = <strong style={{ color:tk.green5 }}>₹{item.totalPrice||(item.pricePerKg||item.price)*(item.quantity||item.qty)}</strong>
                      </div>
                    </div>
                    {ord.status==="delivered" && (
                      <button onClick={()=>setRateModal({item:{...item,productId:item.productId||item.id},orderId:ordId})}
                        style={{ padding:"6px 14px", background:"rgba(212,160,23,0.15)", border:"1px solid rgba(212,160,23,0.4)", color:"#d4a017", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Inter',sans-serif", transition:"all 0.2s", flexShrink:0 }}
                        onMouseEnter={e=>{e.target.style.background="rgba(212,160,23,0.3)";}} onMouseLeave={e=>{e.target.style.background="rgba(212,160,23,0.15)";}}>
                        ⭐ Rate
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ fontSize:12, color:tk.textLt, paddingTop:14, borderTop:`1px solid ${tk.border}`, display:"flex", flexWrap:"wrap", gap:12 }}>
                <span>📍 {ord.deliveryAddress||ord.address}, {ord.city}</span>
                <span>📞 {ord.phone}</span>
                {ord.status==="confirmed" && <span style={{ color:tk.green5, fontWeight:700 }}>🕐 Est. delivery: ~24 hours</span>}
              </div>
            </div>
          );
        })}
      </div>

      {rateModal && <RateProductModal item={rateModal.item} orderId={rateModal.orderId} onClose={()=>setRateModal(null)} onDone={()=>setRateModal(null)} />}
    </div>
  );
}
