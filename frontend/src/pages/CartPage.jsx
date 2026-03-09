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
  const [checkoutForm, setCheckoutForm] = useState({ address:"", city:"", phone:"" });
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [apiError, setApiError] = useState("");

  const set = k => e => setCheckoutForm(f=>({...f,[k]:e.target.value}));

  const validateCheckout = () => {
    const errs = {};
    if (!checkoutForm.address) errs.address = "Delivery address required";
    if (!checkoutForm.city) errs.city = "City required";
    if (!checkoutForm.phone || !/^\d{10}$/.test(checkoutForm.phone)) errs.phone = "Valid 10-digit phone required";
    setCheckoutErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckout = async () => {
    if (!user) { navigate("/login"); return; }
    if (!validateCheckout()) return;
    setLoading(true); setApiError("");
    try {
      const data = await authFetch("/orders", {
        method:"POST",
        body: JSON.stringify({
          items: cart.map(i=>({ id:i.id, name:i.name, price:i.price, qty:i.qty, img:i.img })),
          ...checkoutForm,
        }),
      });
      if (!data.success) throw new Error(data.error);
      setOrder(data.order);
      clearCart();
    } catch(e) { setApiError(e.message); }
    finally { setLoading(false); }
  };

  const inp = (hasErr) => ({ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${hasErr?"#e74c3c":tk.border}`, background:hasErr?"#fff0f0":tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit" });

  // Order success screen
  if (order) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:16 }}>🎉</div>
      <h2 style={{ fontSize:30, color:tk.text, marginBottom:8 }}>Order Placed Successfully!</h2>
      <div style={{ background:tk.bgCard, borderRadius:16, padding:28, maxWidth:440, width:"100%", boxShadow:tk.shadowLg, border:`1px solid ${tk.border}`, marginBottom:24 }}>
        <div style={{ fontSize:14, color:tk.textMid, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span>Order ID</span><strong style={{ color:tk.text }}>{order.id}</strong>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span>Status</span><span style={{ color:"#27ae60", fontWeight:700 }}>✓ {order.status}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span>Total Paid</span><strong style={{ color:tk.green7, fontSize:18 }}>₹{order.total}</strong>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span>Delivery</span><span>~24 hours</span>
          </div>
        </div>
        <div style={{ background:tk.bgMuted, borderRadius:10, padding:"10px 14px", fontSize:13, color:tk.textMid }}>
          📦 Delivering to {order.city} · {order.phone}
        </div>
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <button onClick={()=>navigate("/catalog")} style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Continue Shopping</button>
        <button onClick={()=>navigate("/orders")} style={{ background:"transparent", border:`1.5px solid ${tk.green7}`, color:tk.green7, padding:"12px 24px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>View Orders</button>
      </div>
    </div>
  );

  if (!cart.length) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:80, marginBottom:16 }}>🛒</div>
      <h2 style={{ fontSize:26, color:tk.text, marginBottom:8 }}>Your cart is empty</h2>
      <p style={{ color:tk.textLt, marginBottom:24 }}>Browse our catalog and add fresh produce.</p>
      <button onClick={()=>navigate("/catalog")} style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", padding:"12px 26px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>Browse Catalog</button>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"40px 20px", textAlign:"center" }}>
        <h1 style={{ color:"#fff", fontSize:34, fontFamily:"'Playfair Display',Georgia,serif" }}>🛒 Your Cart</h1>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:28 }}>
          {/* Cart items */}
          <div>
            {cart.map(item=>(
              <div key={item.id} style={{ background:tk.bgCard, borderRadius:14, padding:18, marginBottom:14, boxShadow:tk.shadow, border:`1px solid ${tk.border}`, display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:78, height:78, borderRadius:10, overflow:"hidden", background:tk.bgMuted, flexShrink:0 }}>
                  <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:tk.text, marginBottom:3 }}>{item.name}</div>
                  <div style={{ fontSize:12, color:tk.textLt, marginBottom:4 }}>🧑‍🌾 {item.farmerName || item.farmer} · 📍 {item.farmerLocation || item.location}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:tk.green7 }}>₹{item.price}/kg</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  {[["−",-1],["+"  ,1]].map(([lbl,d],i)=>(
                    <button key={i} onClick={()=>updateQty(item.id,d)} style={{ width:30, height:30, borderRadius:"50%", border:`2px solid ${tk.green7}`, background:d>0?tk.green7:"transparent", color:d>0?"#fff":tk.green7, fontWeight:800, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>{lbl}</button>
                  ))}
                  <span style={{ fontWeight:800, fontSize:16, minWidth:22, textAlign:"center", color:tk.text }}>{item.qty}</span>
                </div>
                <div style={{ textAlign:"right", minWidth:80 }}>
                  <div style={{ fontWeight:800, fontSize:17, color:tk.text, marginBottom:6 }}>₹{item.price*item.qty}</div>
                  <button onClick={()=>removeFromCart(item.id)} style={{ background:"#e74c3c", color:"#fff", border:"none", padding:"6px 12px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary + checkout */}
          <div>
            <div style={{ background:tk.bgCard, borderRadius:16, padding:26, boxShadow:tk.shadow, border:`1px solid ${tk.border}`, position:"sticky", top:80 }}>
              <h3 style={{ fontSize:17, fontWeight:800, color:tk.text, marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${tk.border}` }}>Order Summary</h3>
              {cart.map(item=>(
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13, color:tk.textMid }}>
                  <span>{item.name} × {item.qty} kg</span><span>₹{item.price*item.qty}</span>
                </div>
              ))}
              <div style={{ borderTop:`2px solid ${tk.border}`, paddingTop:14, marginTop:8, marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:20, fontWeight:800, color:tk.text }}>
                  <span>Total</span><span style={{ color:tk.green7 }}>₹{total}</span>
                </div>
                <div style={{ fontSize:11, color:tk.textLt, marginTop:4 }}>Free delivery on orders above ₹500</div>
              </div>

              {!showCheckout ? (
                <>
                  {!user && <div style={{ background:"#fff3cd", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#856404", marginBottom:12 }}>⚠ Please login to checkout</div>}
                  <button onClick={()=>{ if(!user){navigate("/login");}else{setShowCheckout(true);} }}
                    style={{ background:"linear-gradient(135deg,#d4a017,#c49010)", color:"#1b4332", border:"none", width:"100%", padding:13, borderRadius:10, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit", boxShadow:"0 4px 14px rgba(212,160,23,0.4)" }}>
                    {user ? "Proceed to Checkout →" : "Login to Checkout →"}
                  </button>
                  <button onClick={()=>navigate("/catalog")} style={{ background:"transparent", border:`1.5px solid ${tk.green7}`, color:tk.green7, width:"100%", padding:11, borderRadius:10, cursor:"pointer", fontWeight:700, marginTop:10, fontFamily:"inherit", boxSizing:"border-box" }}>Continue Shopping</button>
                </>
              ) : (
                <div>
                  <h4 style={{ color:tk.text, fontWeight:800, marginBottom:12, fontSize:14 }}>📦 Delivery Details</h4>
                  {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:8, padding:"8px 12px", marginBottom:12, color:"#c0392b", fontSize:12 }}>⚠ {apiError}</div>}
                  {[["Delivery Address","address","text","Street, area..."],["City","city","text","Your city"],["Phone","phone","tel","10-digit phone"]].map(([lbl,k,t,ph])=>(
                    <div key={k} style={{ marginBottom:12 }}>
                      <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:4, textTransform:"uppercase" }}>{lbl}</label>
                      <input type={t} style={inp(!!checkoutErrors[k])} placeholder={ph} value={checkoutForm[k]} onChange={set(k)} />
                      {checkoutErrors[k] && <div style={{ color:"#e74c3c", fontSize:11, marginTop:2 }}>⚠ {checkoutErrors[k]}</div>}
                    </div>
                  ))}
                  <button onClick={handleCheckout} disabled={loading}
                    style={{ background:"linear-gradient(135deg,#d4a017,#c49010)", color:"#1b4332", border:"none", width:"100%", padding:13, borderRadius:10, cursor:loading?"not-allowed":"pointer", fontWeight:800, fontSize:15, fontFamily:"inherit", marginTop:4, opacity:loading?0.7:1 }}>
                    {loading ? "Placing Order..." : `✓ Place Order · ₹${total}`}
                  </button>
                  <button onClick={()=>setShowCheckout(false)} style={{ background:"transparent", border:`1px solid ${tk.border}`, color:tk.textMid, width:"100%", padding:9, borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"inherit", marginTop:8, boxSizing:"border-box" }}>← Back</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
