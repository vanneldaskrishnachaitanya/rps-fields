import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { cart, total, clearCart } = useCart();
  const { user, authFetch } = useAuth();

  const [form, setForm] = useState({ address: user?.address || "", city: user?.city || "", phone: user?.phone || "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [order, setOrder] = useState(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.address) errs.address = "Delivery address required";
    if (!form.city) errs.city = "City required";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) errs.phone = "Valid 10-digit phone required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlace = async () => {
    if (!validate()) return;
    setLoading(true); setApiError("");
    try {
      const data = await authFetch("/orders", {
        method: "POST",
        body: JSON.stringify({ items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, img: i.img })), ...form }),
      });
      if (!data.success) throw new Error(data.error);
      clearCart();
      setOrder(data.order);
    } catch (e) { setApiError(e.message); }
    finally { setLoading(false); }
  };

  const inp = hasErr => ({ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${hasErr?"#e74c3c":tk.border}`, background:hasErr?"#fff0f0":tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"'Inter',sans-serif" });
  const lbl = text => <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.4px" }}>{text}</label>;

  if (!cart.length && !order) {
    return (
      <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px" }}>
        <div style={{ fontSize:72, marginBottom:16 }}>🛒</div>
        <h2 style={{ color:tk.text, marginBottom:8 }}>Your cart is empty</h2>
        <button onClick={() => navigate("/catalog")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"12px 26px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Browse Catalog</button>
      </div>
    );
  }

  if (order) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 20px", textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:16 }}>🎉</div>
      <h2 style={{ fontSize:30, color:tk.text, marginBottom:8 }}>Order Placed!</h2>
      <div style={{ background:tk.bgCard, borderRadius:16, padding:28, maxWidth:440, width:"100%", boxShadow:tk.shadowLg, border:`1px solid ${tk.border}`, marginBottom:24 }}>
        {[["Order ID", order.id],["Status", "✓ "+order.status],["Total", "₹"+order.total],["Delivery", "~24 hours"]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14, color:tk.textMid }}>
            <span>{k}</span><strong style={{ color:tk.text }}>{v}</strong>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12 }}>
        <button onClick={() => navigate("/orders")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>View Orders</button>
        <button onClick={() => navigate("/catalog")} style={{ background:"transparent", border:`1.5px solid ${tk.green7}`, color:tk.green7, padding:"12px 24px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"44px 20px", textAlign:"center" }}>
        <h1 style={{ color:"#fff", fontSize:34, fontFamily:"'Playfair Display',Georgia,serif" }}>🧾 Checkout</h1>
      </div>
      <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 20px" }}>
        <div className="checkout-grid" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:28 }}>
          {/* Delivery form */}
          <div style={{ background:tk.bgCard, borderRadius:20, padding:32, boxShadow:tk.shadow, border:`1px solid ${tk.border}` }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:22 }}>📦 Delivery Details</h2>
            {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#c0392b", fontSize:13 }}>⚠ {apiError}</div>}
            {[["Delivery Address","address","text","Full address, landmark..."],["City","city","text","Your city"],["Phone Number","phone","tel","10-digit mobile"]].map(([label,k,t,ph])=>(
              <div key={k} style={{ marginBottom:16 }}>
                {lbl(label)}
                <input type={t} style={inp(!!errors[k])} placeholder={ph} value={form[k]} onChange={set(k)} />
                {errors[k] && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors[k]}</div>}
              </div>
            ))}
            <div style={{ background:tk.bgMuted, borderRadius:10, padding:"12px 16px", marginTop:8, fontSize:13, color:tk.textMid }}>
              🕐 Estimated delivery: within 24 hours of order confirmation
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div style={{ background:tk.bgCard, borderRadius:16, padding:24, boxShadow:tk.shadow, border:`1px solid ${tk.border}`, position:"sticky", top:80 }}>
              <h3 style={{ fontWeight:800, color:tk.text, marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${tk.border}`, fontSize:16 }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13, color:tk.textMid }}>
                  <span>{item.name} × {item.qty} kg</span><span>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div style={{ borderTop:`2px solid ${tk.border}`, paddingTop:14, marginTop:8, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:20, fontWeight:800, color:tk.text }}>
                  <span>Total</span><span style={{ color:tk.green7 }}>₹{total}</span>
                </div>
                <div style={{ fontSize:11, color:tk.textLt, marginTop:4 }}>
                  {total >= 500 ? "✅ Free delivery" : `Add ₹${500-total} more for free delivery`}
                </div>
              </div>
              <button onClick={handlePlace} disabled={loading}
                style={{ background:"rgba(200,150,12,0.32)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", border:"none", width:"100%", padding:14, borderRadius:10, cursor:loading?"not-allowed":"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", opacity:loading?0.7:1 }}>
                {loading ? "Placing Order..." : `✓ Place Order · ₹${total}`}
              </button>
              <button onClick={() => navigate("/cart")} style={{ background:"transparent", border:`1px solid ${tk.border}`, color:tk.textMid, width:"100%", padding:9, borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"'Inter',sans-serif", marginTop:10, boxSizing:"border-box" }}>
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
