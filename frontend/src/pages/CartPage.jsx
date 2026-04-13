import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user, authFetch } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ address:"", city:"", phone:"" });
  const [errs, setErrs]  = useState({});
  const [loading, setLoading] = useState(false);
  const [order,   setOrder]   = useState(null);
  const [apiErr,  setApiErr]  = useState("");

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const getUnitLabel = (unit) => {
    const u = String(unit || "kg").toLowerCase();
    if (["l", "lt", "ltr", "liter", "litre", "liters", "litres"].includes(u)) return "L";
    return "kg";
  };

  const validate = () => {
    const e = {};
    if (!form.address) e.address = "Delivery address required";
    if (!form.city)    e.city    = "City required";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = "Valid 10-digit phone required";
    setErrs(e); return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (!user) { navigate("/login"); return; }
    if (!validate()) return;
    setLoading(true); setApiErr("");
    try {
      const data = await authFetch("/orders", {
        method:"POST",
        body: JSON.stringify({ items: cart.map(i=>({ id:i.id, name:i.name, price:i.price, qty:i.qty, img:i.img })), ...form }),
      });
      if (!data.success) throw new Error(data.error);
      setOrder(data.order); clearCart();
    } catch(e) { setApiErr(e.message); }
    finally { setLoading(false); }
  };

  const inp = hasErr => ({
    width:"100%", padding:"12px 16px", borderRadius:12,
    border:`1.5px solid ${hasErr?"#ef4444":tk.border}`,
    background: hasErr ? (dark?"#2a1010":"#fff0f0") : tk.bgInput,
    color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"'Inter',sans-serif", transition:"all 0.2s",
  });

  if (order) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px var(--page-px,clamp(16px,4vw,48px))", animation:"scaleIn 0.5s ease" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:20, boxShadow:"0 12px 36px rgba(82,183,136,0.4)", animation:"bounce 0.6s ease" }}>🎉</div>
      <h2 style={{ fontSize:32, color:tk.text, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>Order Placed!</h2>
      <p style={{ color:tk.textLt, marginBottom:28, fontSize:15 }}>Your fresh produce is on its way 🌿</p>
      <div data-tilt style={{ background:tk.bgCard, borderRadius:20, padding:28, maxWidth:420, width:"100%", boxShadow:tk.shadowLg, border:`1px solid ${tk.border}`, marginBottom:28 }}>
        {[["Order ID", order.id],["Status","✓ " + order.status, "#52b788"],["Total","₹" + order.total, tk.green6],["Delivery","~24 hours",""]].map(([l,v,c])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${tk.border}`, fontSize:14 }}>
            <span style={{ color:tk.textLt }}>{l}</span>
            <strong style={{ color:c||tk.text }}>{v}</strong>
          </div>
        ))}
        <div style={{ paddingTop:14, fontSize:13, color:tk.textMid }}>📦 Delivering to {order.city} · 📞 {order.phone}</div>
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        <button data-magnetic onClick={()=>navigate("/catalog")} style={{ background:"linear-gradient(135deg,rgba(93,198,150,0.96),rgba(47,131,94,0.98))", backdropFilter:"blur(18px) saturate(170%)", WebkitBackdropFilter:"blur(18px) saturate(170%)", border:"1px solid rgba(194,255,226,0.44)", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.30)", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.62),inset 0 -1px 0 rgba(0,0,0,0.18),0 10px 30px rgba(28,120,86,0.45)", padding:"13px 28px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif" }}>
          Continue Shopping
        </button>
        <button data-magnetic onClick={()=>navigate("/orders")} style={{ background:"transparent", border:`2px solid ${tk.green6}`, color:tk.green6, padding:"13px 28px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif" }}>
          View Orders
        </button>
      </div>
    </div>
  );

  if (!cart.length) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px var(--page-px,clamp(16px,4vw,48px))", animation:"fadeIn 0.5s ease" }}>
      <div style={{ fontSize:80, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🛒</div>
      <h2 style={{ fontSize:28, color:tk.text, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>Your cart is empty</h2>
      <p style={{ color:tk.textLt, marginBottom:28, fontSize:15 }}>Browse our catalog and add fresh produce.</p>
      <button data-magnetic onClick={()=>navigate("/catalog")} style={{ background:"linear-gradient(135deg,rgba(93,198,150,0.96),rgba(47,131,94,0.98))", backdropFilter:"blur(18px) saturate(170%)", WebkitBackdropFilter:"blur(18px) saturate(170%)", border:"1px solid rgba(194,255,226,0.44)", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.30)", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.62),inset 0 -1px 0 rgba(0,0,0,0.18),0 10px 30px rgba(28,120,86,0.45)", padding:"14px 32px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif" }}>
        Browse Catalog →
      </button>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%", animation:"fadeIn 0.4s ease" }}>
      <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332)", padding:"44px var(--page-px,clamp(16px,4vw,48px))", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 30% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ textAlign:"center", position:"relative" }}>
          <h1 style={{ color:"#fff", fontSize:36, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:4 }}>🛒 Your Cart</h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>{cart.length} item{cart.length!==1?"s":""} · ₹{total} total</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px var(--page-px,clamp(16px,4vw,48px)) 100px" }}>
        <div className="cart-grid" style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:28 }}>
          {/* Items */}
          <div>
            {cart.map((item,i) => (
              <div className="cart-item-card" key={item.id} style={{ background:tk.bgCard, borderRadius:18, padding:20, marginBottom:14, border:`1px solid ${tk.border}`, display:"flex", gap:16, alignItems:"center", animation:`fadeUp 0.4s ease ${i*0.07}s both`, transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow=tk.shadowMd; e.currentTarget.style.borderColor="#52b788"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border; }}
              >
                <div style={{ width:82, height:82, borderRadius:14, overflow:"hidden", background:tk.bgMuted, flexShrink:0 }}>
                  <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
                    onMouseEnter={e=>e.target.style.transform="scale(1.08)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    onError={e=>e.target.style.display="none"}
                  />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:tk.text, marginBottom:3 }}>{item.name}</div>
                  <div style={{ fontSize:12, color:tk.textLt, marginBottom:6 }}>🧑‍🌾 {item.farmerName||item.farmer}{(item.farmerLocation||item.location) && ` · 📍 ${item.farmerLocation||item.location}`}</div>
                  <div style={{ fontSize:16, fontWeight:900, color:tk.green5 }}>₹{item.price}/{getUnitLabel(item.unit)}</div>
                </div>
                <div className="cart-item-qty" style={{ display:"flex", alignItems:"center", gap:0, border:`1.5px solid ${tk.border}`, borderRadius:12, overflow:"hidden" }}>
                  <button data-magnetic onClick={()=>updateQty(item.id,-1)} style={{ width:32, height:32, background:tk.bgMuted, border:"none", cursor:"pointer", fontSize:18, color:tk.text, fontFamily:"'Inter',sans-serif", transition:"background 0.2s" }}
                    onMouseEnter={e=>e.target.style.background=tk.border} onMouseLeave={e=>e.target.style.background=tk.bgMuted}>−</button>
                  <span style={{ width:36, textAlign:"center", fontWeight:800, fontSize:14, color:tk.text }}>{item.qty}</span>
                  <button data-magnetic onClick={()=>updateQty(item.id,1)} style={{ width:32, height:32, background:tk.bgMuted, border:"none", cursor:"pointer", fontSize:18, color:tk.text, fontFamily:"'Inter',sans-serif", transition:"background 0.2s" }}
                    onMouseEnter={e=>e.target.style.background=tk.border} onMouseLeave={e=>e.target.style.background=tk.bgMuted}>+</button>
                </div>
                <div className="cart-item-total" style={{ textAlign:"right", minWidth:88 }}>
                  <div style={{ fontWeight:900, fontSize:18, color:tk.text, marginBottom:8 }}>₹{item.price*item.qty}</div>
                  <button data-magnetic onClick={()=>removeFromCart(item.id)} style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.94),rgba(190,24,24,0.98))", border:"1px solid rgba(255,189,189,0.54)", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.25)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.18), 0 8px 20px rgba(185,28,28,0.35)", padding:"6px 12px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div data-tilt style={{ background:tk.bgCard, borderRadius:20, padding:26, border:`1px solid ${tk.border}`, position:"sticky", top:84, boxShadow:tk.shadowMd }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${tk.border}` }}>Order Summary</h3>
              {cart.map(item=>(
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13, color:tk.textMid }}>
                  <span>{item.name} × {item.qty}{getUnitLabel(item.unit)}</span><span style={{ fontWeight:700, color:tk.text }}>₹{item.price*item.qty}</span>
                </div>
              ))}
              <div style={{ borderTop:`2px solid ${tk.border}`, marginTop:14, paddingTop:16, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:22, fontWeight:900 }}>
                  <span style={{ color:tk.text }}>Total</span>
                  <span style={{ color:tk.green5 }}>₹{total}</span>
                </div>
                <div style={{ fontSize:12, color:tk.textLt, marginTop:4 }}>Free delivery on orders above ₹500</div>
              </div>

              {!showCheckout ? (
                <>
                  {!user && <div style={{ background: dark?"rgba(212,160,23,0.14)":"#fffbeb", border:"1px solid rgba(212,160,23,0.36)", borderRadius:10, padding:"10px 14px", fontSize:12, color: dark ? "#fcd34d" : "#92400e", marginBottom:14, fontWeight:700 }}>⚠ Please login to checkout</div>}
                  <button data-magnetic onClick={()=>{ if(!user) navigate("/login"); else setShowCheckout(true); }}
                    style={{ background:"linear-gradient(135deg,rgba(248,201,72,0.98),rgba(204,147,8,1))", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.32)", border:"1px solid rgba(255,236,163,0.82)", width:"100%", padding:14, borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:"inset 0 1.5px 0 rgba(255,245,205,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 28px rgba(212,160,23,0.52)", transition:"all 0.2s", marginBottom:10 }}
                    onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow="inset 0 1.5px 0 rgba(255,245,205,0.68), inset 0 -1px 0 rgba(0,0,0,0.18), 0 14px 34px rgba(212,160,23,0.62)";}}
                    onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow="inset 0 1.5px 0 rgba(255,245,205,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 28px rgba(212,160,23,0.52)";}}>
                    {user ? "Proceed to Checkout →" : "Login to Checkout →"}
                  </button>
                  <button data-magnetic onClick={()=>navigate("/catalog")} style={{ background: dark ? "linear-gradient(135deg,rgba(21,56,40,0.86),rgba(14,40,28,0.90))" : "linear-gradient(135deg,rgba(242,250,245,0.95),rgba(224,241,231,0.96))", border: dark ? "1px solid rgba(126,216,177,0.35)" : "1px solid rgba(45,106,79,0.35)", color: dark ? "#c2f2da" : "#1f573d", width:"100%", padding:12, borderRadius:14, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif", transition:"all 0.2s", boxSizing:"border-box", boxShadow: dark ? "inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 20px rgba(7,20,14,0.28)" : "inset 0 1px 0 rgba(255,255,255,0.75), 0 8px 20px rgba(24,79,54,0.22)" }}>
                    Continue Shopping
                  </button>
                </>
              ) : (
                <div>
                  <h4 style={{ color:tk.text, fontWeight:800, marginBottom:16, fontSize:14, textTransform:"uppercase", letterSpacing:"0.5px" }}>📦 Delivery Details</h4>
                  {apiErr && <div style={{ background:dark?"rgba(239,68,68,0.1)":"#fff0f0", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 14px", marginBottom:14, color:"#dc2626", fontSize:12, fontWeight:600 }}>⚠ {apiErr}</div>}
                  {[["Delivery Address","address","text","Street, area..."],["City","city","text","Your city"],["Phone","phone","tel","10-digit phone"]].map(([lbl,k,t,ph])=>(
                    <div key={k} style={{ marginBottom:12 }}>
                      <label style={{ display:"block", fontWeight:700, fontSize:10, color:tk.textMid, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.5px" }}>{lbl}</label>
                      <input type={t} style={inp(!!errs[k])} placeholder={ph} value={form[k]} onChange={set(k)} />
                      {errs[k] && <div style={{ color:"#ef4444", fontSize:11, marginTop:3 }}>⚠ {errs[k]}</div>}
                    </div>
                  ))}
                  <button data-magnetic onClick={handleCheckout} disabled={loading}
                    style={{ background:"linear-gradient(135deg,rgba(248,201,72,0.98),rgba(204,147,8,1))", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.32)", border:"1px solid rgba(255,236,163,0.82)", width:"100%", padding:14, borderRadius:14, cursor:loading?"not-allowed":"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", marginTop:8, opacity:loading?0.75:1, transition:"all 0.2s", boxShadow:"inset 0 1.5px 0 rgba(255,245,205,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 28px rgba(212,160,23,0.52)" }}>
                    {loading ? "Placing Order..." : `✓ Place Order · ₹${total}`}
                  </button>
                  <button data-magnetic onClick={()=>setShowCheckout(false)} style={{ background: dark ? "linear-gradient(135deg,rgba(21,56,40,0.86),rgba(14,40,28,0.90))" : "linear-gradient(135deg,rgba(242,250,245,0.95),rgba(224,241,231,0.96))", border: dark ? "1px solid rgba(126,216,177,0.35)" : "1px solid rgba(45,106,79,0.35)", color: dark ? "#c2f2da" : "#1f573d", width:"100%", padding:10, borderRadius:10, cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", marginTop:8, boxSizing:"border-box", boxShadow: dark ? "inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 20px rgba(7,20,14,0.28)" : "inset 0 1px 0 rgba(255,255,255,0.75), 0 8px 20px rgba(24,79,54,0.22)" }}>
                    ← Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
