import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

/* ─── tiny helper: inject CSS once ─────────────────────────────────── */
const STYLE_ID = "rps-payment-styles";
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700&display=swap');

    @keyframes pay-fade-up {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pay-glow-pulse {
      0%,100% { box-shadow: 0 0 18px rgba(82,183,136,0.35), 0 0 48px rgba(82,183,136,0.12); }
      50%      { box-shadow: 0 0 36px rgba(82,183,136,0.6),  0 0 80px rgba(82,183,136,0.22); }
    }
    @keyframes pay-shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes pay-slide-in {
      from { opacity:0; transform:translateX(-18px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes pay-tab-appear {
      from { opacity:0; transform:translateY(10px) scale(0.97); }
      to   { opacity:1; transform:translateY(0)    scale(1); }
    }
    @keyframes pay-ripple {
      0%   { transform:scale(0);   opacity:0.5; }
      100% { transform:scale(4);   opacity:0; }
    }
    @keyframes pay-success-pop {
      0%   { transform:scale(0.5)  rotate(-15deg); opacity:0; }
      60%  { transform:scale(1.15) rotate(4deg);   opacity:1; }
      100% { transform:scale(1)    rotate(0deg);   opacity:1; }
    }
    @keyframes pay-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pay-card-flip {
      0%   { transform: rotateY(0deg); }
      100% { transform: rotateY(180deg); }
    }
    @keyframes float-slow {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-8px); }
    }
    @keyframes pay-border-march {
      to { background-position: 100% 0, 0 100%, 0 0, 100% 100%; }
    }

    .pay-method-btn {
      position: relative; overflow: hidden;
      cursor: pointer; user-select: none;
      border-radius: 16px;
      transition: transform 0.18s cubic-bezier(.34,1.56,.64,1),
                  box-shadow 0.18s ease, opacity 0.18s ease;
    }
    .pay-method-btn:hover { transform: translateY(-3px) scale(1.025); }
    .pay-method-btn:active { transform: scale(0.97); }

    .pay-input {
      width: 100%;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: border 0.2s, box-shadow 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .pay-input:focus {
      border-color: #52b788 !important;
      box-shadow: 0 0 0 3px rgba(82,183,136,0.2) !important;
    }
    .pay-input.error:focus {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.2) !important;
    }

    .pay-cta-btn {
      position: relative; overflow: hidden;
      border: none; cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-weight: 900; letter-spacing: 0.5px;
      border-radius: 16px;
      transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
    }
    .pay-cta-btn:hover:not(:disabled) { transform: translateY(-3px); }
    .pay-cta-btn:active:not(:disabled) { transform: scale(0.97); }
    .pay-cta-btn .ripple {
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.35);
      animation: pay-ripple 0.7s ease-out forwards;
      pointer-events:none;
    }

    .pay-card-visual {
      background: linear-gradient(135deg,#1b4332,#40916c,#52b788);
      border-radius: 20px;
      padding: 28px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
      transition: transform 0.6s ease;
      transform-style: preserve-3d;
    }
    .pay-card-visual::before {
      content:'';
      position:absolute; inset:0;
      background: radial-gradient(circle at 75% 20%,rgba(255,255,255,0.12),transparent 55%);
    }
    .pay-card-visual .chip {
      width:42px; height:32px; border-radius:6px;
      background:linear-gradient(135deg,#d4a017,#f4c430);
      margin-bottom:24px;
      box-shadow:inset 0 0 0 1px rgba(0,0,0,0.2);
    }
    .pay-upi-logo {
      font-size: 36px; font-weight: 900;
      background: linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .method-tab-content {
      animation: pay-tab-appear 0.3s ease both;
    }
    .pay-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 6px;
    }
    .pay-error-msg {
      font-size: 11px;
      color: #ef4444;
      margin-top: 4px;
      font-weight: 600;
      animation: pay-slide-in 0.2s ease;
    }
    .pay-secure-badge {
      display:inline-flex; align-items:center; gap:5px;
      font-size:11px; font-weight:700; letter-spacing:0.4px;
      padding: 5px 10px; border-radius:20px;
    }
    .bank-select-item {
      display:flex; align-items:center; gap:12px;
      padding:14px 16px; border-radius:12px;
      cursor:pointer; margin-bottom:8px;
      transition: all 0.18s ease;
      border: 2px solid transparent;
    }
    .bank-select-item:hover { transform:translateX(4px); }
    .progress-step {
      display:flex; align-items:center; gap:8px;
      font-size:12px; font-weight:700;
    }
    .progress-step .dot {
      width:28px; height:28px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:12px; font-weight:800;
      flex-shrink:0;
    }
  `;
  document.head.appendChild(el);
}

/* ── payment methods config ─────────────────────────────────────────── */
const METHODS = [
  { id:"card",       icon:"💳", label:"Credit / Debit Card",   color:"#52b788" },
  { id:"upi",        icon:"⚡", label:"UPI",                    color:"#6366f1" },
  { id:"netbanking", icon:"🏦", label:"Net Banking",            color:"#0ea5e9" },
  { id:"cod",        icon:"🏠", label:"Cash on Delivery",       color:"#d97706" },
];

const BANKS = [
  { id:"sbi", name:"State Bank of India (SBI)", icon:"🏦" },
  { id:"hdfc", name:"HDFC Bank",                icon:"🔵" },
  { id:"icici", name:"ICICI Bank",              icon:"🟠" },
  { id:"axis", name:"Axis Bank",                icon:"🔴" },
  { id:"kotak", name:"Kotak Mahindra Bank",     icon:"⚡" },
  { id:"yes", name:"Yes Bank",                  icon:"🟢" },
];

/* ── card number formatter ──────────────────────────────────────────── */
function fmtCard(v) {
  return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
}
function fmtExpiry(v) {
  let d = v.replace(/\D/g,"").slice(0,4);
  if (d.length > 2) d = d.slice(0,2) + "/" + d.slice(2);
  return d;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme(); const tk = TK(dark);
  const { cart, total, clearCart } = useCart();
  const { authFetch } = useAuth();

  /* State passed from CheckoutPage */
  const deliveryInfo  = location.state?.delivery  || {};
  const orderTotal    = location.state?.total      || total;

  const [method, setMethod] = useState("card");
  const [step,   setStep]   = useState(1); // 1=payment 2=processing 3=success
  const [order,  setOrder]  = useState(null);

  /* Card form */
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"", showCvv:false });
  const [cardErr, setCardErr] = useState({});

  /* UPI form */
  const [upi, setUpi]     = useState({ id:"" });
  const [upiErr, setUpiErr] = useState({});

  /* Net banking */
  const [bank, setBank]   = useState("");
  const [bankErr, setBankErr] = useState("");

  /* Loading */
  const [paying, setPaying] = useState(false);

  const ctaBtnRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  /* Redirect if no delivery info */
  useEffect(() => {
    if (!deliveryInfo.address && !cart.length && !order) {
      navigate("/checkout");
    }
  }, []); // eslint-disable-line

  /* ── Ripple effect on CTA button ─────────── */
  function addRipple(e) {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 700);
  }

  /* ── Validators ──────────────────────────── */
  function validateCard() {
    const e = {};
    const num = card.number.replace(/\s/g,"");
    if (!num || num.length < 16)           e.number = "Enter valid 16-digit card number";
    if (!card.name.trim())                 e.name   = "Name on card is required";
    if (!card.expiry || card.expiry.length < 5) e.expiry = "Enter valid expiry (MM/YY)";
    else {
      const [mm,yy] = card.expiry.split("/");
      const now = new Date();
      const exp = new Date(2000 + +yy, +mm - 1);
      if (exp < now) e.expiry = "Card has expired";
    }
    if (!card.cvv || card.cvv.length < 3)  e.cvv   = "Enter valid CVV";
    setCardErr(e);
    return Object.keys(e).length === 0;
  }

  function validateUpi() {
    const e = {};
    if (!upi.id.trim() || !upi.id.includes("@"))
      e.id = "Enter a valid UPI ID (e.g. name@upi)";
    setUpiErr(e);
    return Object.keys(e).length === 0;
  }

  function validateBank() {
    if (!bank) { setBankErr("Please select your bank"); return false; }
    setBankErr("");
    return true;
  }

  /* ── Place order after simulated payment ── */
  async function placeOrderOnServer() {
    const data = await authFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map(i => ({ id:i.id, name:i.name, price:i.price, qty:i.qty, img:i.img })),
        ...deliveryInfo,
        paymentMethod: method,
      }),
    });
    if (!data.success) throw new Error(data.error || "Order failed");
    return data.order;
  }

  /* ── Handle pay click ────────────────────── */
  async function handlePay(e) {
    addRipple(e);
    let valid = false;
    if (method === "card")       valid = validateCard();
    else if (method === "upi")   valid = validateUpi();
    else if (method === "netbanking") valid = validateBank();
    else if (method === "cod")   valid = true;

    if (!valid) return;

    setPaying(true);
    setStep(2); // processing screen

    try {
      /* Simulate payment gateway delay */
      await new Promise(r => setTimeout(r, 2200));

      const placed = await placeOrderOnServer();
      clearCart();
      setOrder(placed);
      setStep(3); // success
    } catch (err) {
      setStep(1);
      alert("Payment failed: " + err.message);
    } finally {
      setPaying(false);
    }
  }

  /* ───────────────────── DERIVED STYLES ───────────────────── */
  const inputStyle = (hasErr) => ({
    border: `1.5px solid ${hasErr ? "#ef4444" : tk.border}`,
    background: hasErr ? (dark?"rgba(239,68,68,0.08)":"#fff5f5") : tk.bgInput,
    color: tk.text,
  });

  /* ─────────────────────────────────────────────────────────── */
  /* STEP 2: PROCESSING SCREEN                                    */
  /* ─────────────────────────────────────────────────────────── */
  if (step === 2) return (
    <div style={{ minHeight:"100vh", background: dark ? "#0a1210" : "#f0faf5", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ textAlign:"center", animation:"pay-fade-up 0.5s ease" }}>
        {/* Spinner */}
        <div style={{ width:80, height:80, borderRadius:"50%", border:"4px solid transparent", borderTop:"4px solid #52b788", borderRight:"4px solid #40916c", margin:"0 auto 24px", animation:"pay-spin 0.9s linear infinite" }} />
        <div style={{ fontSize:22, fontWeight:800, color:tk.text, marginBottom:8 }}>
          Processing Payment...
        </div>
        <div style={{ color:tk.textLt, fontSize:14 }}>
          Please do not close this window
        </div>
        <div style={{ marginTop:24, display:"flex", gap:8, justifyContent:"center" }}>
          {["Verifying","Authorizing","Confirming"].map((t,i)=>(
            <div key={t} style={{ fontSize:11, fontWeight:700, color:"#52b788", animation:`pay-fade-up 0.5s ease ${i*0.3+0.3}s both`, padding:"4px 10px", borderRadius:20, background:"rgba(82,183,136,0.1)", border:"1px solid rgba(82,183,136,0.25)" }}>
              {t}...
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────── */
  /* STEP 3: SUCCESS SCREEN                                        */
  /* ─────────────────────────────────────────────────────────── */
  if (step === 3 && order) return (
    <div style={{ minHeight:"100vh", background: dark ? "radial-gradient(ellipse at 50% 0%, rgba(82,183,136,0.08) 0%, #0a1210 60%)" : "radial-gradient(ellipse at 50% 0%, rgba(82,183,136,0.12) 0%, #f0faf5 60%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 16px", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center", animation:"pay-fade-up 0.6s ease" }}>
        {/* Success icon */}
        <div style={{ fontSize:80, marginBottom:8, animation:"pay-success-pop 0.6s cubic-bezier(.34,1.56,.64,1)" }}>🎉</div>
        <h1 style={{ fontSize:32, fontWeight:900, color:tk.text, marginBottom:4, fontFamily:"'Playfair Display',Georgia,serif" }}>
          Payment Successful!
        </h1>
        <p style={{ color:tk.textLt, fontSize:15, marginBottom:28 }}>
          Your fresh produce is confirmed &amp; on its way 🌿
        </p>

        {/* Order card */}
        <div style={{ background:tk.bgCard, borderRadius:24, padding:28, border:`1px solid ${tk.border}`, boxShadow:tk.shadowLg, marginBottom:28, textAlign:"left", animation:"pay-glow-pulse 3s ease infinite" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, paddingBottom:16, borderBottom:`1px solid ${tk.border}` }}>
            <span style={{ fontSize:13, fontWeight:700, color:tk.textLt }}>PAYMENT RECEIPT</span>
            <span style={{ fontSize:12, fontWeight:700, color:"#52b788", background:"rgba(82,183,136,0.12)", padding:"4px 10px", borderRadius:20, border:"1px solid rgba(82,183,136,0.3)" }}>
              ✓ PAID
            </span>
          </div>
          {[
            ["Order ID", "#" + order.id?.slice(-8)?.toUpperCase()],
            ["Payment Method", METHODS.find(m=>m.id===method)?.label],
            ["Amount Paid", `₹${orderTotal}`],
            ["Delivery To", deliveryInfo.city],
            ["Status", "✓ " + (order.status || "Confirmed")],
            ["Est. Delivery", "~24 hours"],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${tk.border}`, fontSize:13 }}>
              <span style={{ color:tk.textLt }}>{k}</span>
              <strong style={{ color:k==="Amount Paid"?"#52b788":tk.text }}>{v}</strong>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
          <button data-magnetic onClick={()=>navigate("/orders")}
            style={{ background:"linear-gradient(135deg,#40916c,#52b788)", color:"#fff", border:"none", padding:"14px 28px", borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:"0 10px 28px rgba(64,145,108,0.45)", transition:"all 0.2s" }}
            onMouseEnter={e=>e.target.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.target.style.transform="none"}
          >
            View My Orders →
          </button>
          <button data-magnetic onClick={()=>navigate("/catalog")}
            style={{ background:"transparent", border:`2px solid ${tk.green5}`, color:tk.green5, padding:"14px 28px", borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
            onMouseEnter={e=>e.target.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.target.style.transform="none"}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────── */
  /* STEP 1:  MAIN PAYMENT PAGE                                   */
  /* ─────────────────────────────────────────────────────────── */
  return (
    <div style={{ background: dark ? "#0a1210" : "#f0faf5", minHeight:"100vh", fontFamily:"'Inter',sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div style={{ background:"linear-gradient(135deg,#0d2b1a 0%,#1b4332 60%,#2d6a4f 100%)", padding:"48px var(--page-px,clamp(16px,4vw,48px)) 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 60%,rgba(82,183,136,0.15),transparent 50%),radial-gradient(circle at 80% 20%,rgba(212,160,23,0.1),transparent 45%)", pointerEvents:"none" }} />
        {/* Animated orbs */}
        <div style={{ position:"absolute", top:"-10%", right:"8%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(82,183,136,0.12),transparent 65%)", animation:"float-slow 4s ease-in-out infinite", pointerEvents:"none" }} />

        <div style={{ maxWidth:960, margin:"0 auto", position:"relative", textAlign:"center" }}>
          {/* Progress */}
          <div style={{ display:"flex", justifyContent:"center", gap:0, marginBottom:28 }}>
            {[["1","Delivery","✓"],["→",null,null],["2","Payment","●"],["→",null,null],["3","Done","○"]].map(([n,label,icon],i)=>(
              label ? (
                <div key={i} className="progress-step">
                  <div className="dot" style={{
                    background: n==="1" ? "#52b788" : n==="2" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)",
                    color: n==="2" ? "#1b4332" : "#fff",
                    boxShadow: n==="2" ? "0 0 0 4px rgba(255,255,255,0.25)" : "none",
                  }}>
                    {n==="1" ? "✓" : n}
                  </div>
                  <span style={{ color: n==="2" ? "#fff" : "rgba(255,255,255,0.55)", fontSize:12, fontWeight: n==="2"?"800":"600" }}>{label}</span>
                </div>
              ) : (
                <div key={i} style={{ color:"rgba(255,255,255,0.3)", margin:"0 8px", display:"flex", alignItems:"center", fontSize:16 }}>→</div>
              )
            ))}
          </div>

          <h1 style={{ color:"#fff", fontSize:36, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:6, letterSpacing:"-0.5px" }}>
            🔒 Secure Payment
          </h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>
            All transactions are encrypted using 256-bit SSL
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"36px var(--page-px,clamp(16px,4vw,48px)) 80px", display:"grid", gridTemplateColumns:"1fr 320px", gap:28, animation:"pay-fade-up 0.5s ease" }}
        className="payment-grid">

        {/* LEFT: PAYMENT FORM */}
        <div>
          {/* Method selection */}
          <div style={{ background:tk.bgCard, borderRadius:20, padding:24, border:`1px solid ${tk.border}`, boxShadow:tk.shadow, marginBottom:20 }}>
            <h2 style={{ fontSize:16, fontWeight:800, color:tk.text, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#40916c,#52b788)", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900 }}>1</span>
              Choose Payment Method
            </h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {METHODS.map(m=>(
                <button key={m.id} className="pay-method-btn"
                  onClick={()=>setMethod(m.id)}
                  style={{
                    padding:"16px 14px", textAlign:"center", border:"none",
                    background: method===m.id
                      ? `linear-gradient(135deg,${m.color}22,${m.color}11)`
                      : dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    outline: method===m.id ? `2px solid ${m.color}` : `1.5px solid ${tk.border}`,
                    outlineOffset:0, color:tk.text,
                    boxShadow: method===m.id ? `0 0 24px ${m.color}33` : "none",
                  }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{m.icon}</div>
                  <div style={{ fontSize:12, fontWeight:800, color: method===m.id ? m.color : tk.text }}>
                    {m.label}
                  </div>
                  {method===m.id && (
                    <div style={{ width:6, height:6, borderRadius:"50%", background:m.color, margin:"6px auto 0", boxShadow:`0 0 8px ${m.color}` }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment details panel */}
          <div style={{ background:tk.bgCard, borderRadius:20, padding:28, border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
            <h2 style={{ fontSize:16, fontWeight:800, color:tk.text, marginBottom:22, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#40916c,#52b788)", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900 }}>2</span>
              Enter Payment Details
            </h2>

            {/* ── CARD FORM ── */}
            {method === "card" && (
              <div className="method-tab-content">
                {/* Live Card Visual */}
                <div className="pay-card-visual" style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <div className="chip" />
                    <div style={{ fontSize:13, fontWeight:700, opacity:0.7, letterSpacing:1 }}>RPS PAY</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:800, letterSpacing:"0.15em", marginBottom:14, textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
                    {card.number || "•••• •••• •••• ••••"}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                    <div>
                      <div style={{ fontSize:9, opacity:0.6, marginBottom:2, letterSpacing:1 }}>CARD HOLDER</div>
                      <div style={{ fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{card.name || "YOUR NAME"}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:9, opacity:0.6, marginBottom:2, letterSpacing:1 }}>EXPIRES</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>{card.expiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                {/* Card number */}
                <div style={{ marginBottom:16 }}>
                  <label className="pay-label" style={{ color:tk.textMid }}>Card Number</label>
                  <input className={`pay-input${cardErr.number?" error":""}`} style={inputStyle(!!cardErr.number)}
                    placeholder="1234 5678 9012 3456" value={card.number} maxLength={19}
                    onChange={e=>setCard(c=>({...c,number:fmtCard(e.target.value)}))} />
                  {cardErr.number && <div className="pay-error-msg">⚠ {cardErr.number}</div>}
                </div>

                {/* Name on card */}
                <div style={{ marginBottom:16 }}>
                  <label className="pay-label" style={{ color:tk.textMid }}>Name on Card</label>
                  <input className={`pay-input${cardErr.name?" error":""}`} style={inputStyle(!!cardErr.name)}
                    placeholder="Full name as on card" value={card.name}
                    onChange={e=>setCard(c=>({...c,name:e.target.value}))} />
                  {cardErr.name && <div className="pay-error-msg">⚠ {cardErr.name}</div>}
                </div>

                {/* Expiry + CVV */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label className="pay-label" style={{ color:tk.textMid }}>Expiry Date</label>
                    <input className={`pay-input${cardErr.expiry?" error":""}`} style={inputStyle(!!cardErr.expiry)}
                      placeholder="MM/YY" value={card.expiry} maxLength={5}
                      onChange={e=>setCard(c=>({...c,expiry:fmtExpiry(e.target.value)}))} />
                    {cardErr.expiry && <div className="pay-error-msg">⚠ {cardErr.expiry}</div>}
                  </div>
                  <div>
                    <label className="pay-label" style={{ color:tk.textMid }}>CVV</label>
                    <div style={{ position:"relative" }}>
                      <input className={`pay-input${cardErr.cvv?" error":""}`} style={{ ...inputStyle(!!cardErr.cvv), paddingRight:44 }}
                        type={card.showCvv?"text":"password"} placeholder="•••" maxLength={4} value={card.cvv}
                        onChange={e=>setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))} />
                      <button onClick={()=>setCard(c=>({...c,showCvv:!c.showCvv}))}
                        style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:tk.textLt }}>
                        {card.showCvv?"🙈":"👁"}
                      </button>
                    </div>
                    {cardErr.cvv && <div className="pay-error-msg">⚠ {cardErr.cvv}</div>}
                  </div>
                </div>

                {/* Accepted cards */}
                <div style={{ marginTop:18, display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:tk.textLt, fontWeight:600 }}>Accepted:</span>
                  {["💳 Visa","💳 Mastercard","💳 RuPay","💳 Amex"].map(c=>(
                    <span key={c} style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:8, background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:tk.textMid }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── UPI FORM ── */}
            {method === "upi" && (
              <div className="method-tab-content">
                {/* UPI illustration */}
                <div style={{ textAlign:"center", padding:"20px 0 28px", background: dark?"rgba(99,102,241,0.06)":"rgba(99,102,241,0.04)", borderRadius:16, marginBottom:24, border:`1px solid ${dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)"}` }}>
                  <div className="pay-upi-logo">UPI</div>
                  <div style={{ fontSize:12, color:tk.textLt, fontWeight:600, marginTop:4 }}>Instant | Secure | Zero Extra Charges</div>
                </div>

                <div style={{ marginBottom:18 }}>
                  <label className="pay-label" style={{ color:tk.textMid }}>Enter Your UPI ID</label>
                  <input className={`pay-input${upiErr.id?" error":""}`} style={inputStyle(!!upiErr.id)}
                    placeholder="yourname@upi" value={upi.id}
                    onChange={e=>setUpi({id:e.target.value})} />
                  {upiErr.id && <div className="pay-error-msg">⚠ {upiErr.id}</div>}
                  <div style={{ fontSize:11, color:tk.textLt, marginTop:6, fontWeight:600 }}>
                    Supported: @paytm · @ybl · @okaxis · @oksbi · @gpay · @ibl
                  </div>
                </div>

                {/* OR QR section */}
                <div style={{ textAlign:"center", padding:"16px", background: dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)", borderRadius:12, border:`1px dashed ${tk.border}` }}>
                  <div style={{ fontSize:48 }}>📲</div>
                  <div style={{ fontSize:12, color:tk.textLt, fontWeight:600, marginTop:4 }}>Scan & Pay via any UPI App</div>
                </div>
              </div>
            )}

            {/* ── NET BANKING FORM ── */}
            {method === "netbanking" && (
              <div className="method-tab-content">
                <div style={{ marginBottom:8 }}>
                  <label className="pay-label" style={{ color:tk.textMid }}>Select Your Bank</label>
                  {bankErr && <div className="pay-error-msg" style={{ marginBottom:8 }}>⚠ {bankErr}</div>}
                  {BANKS.map(b=>(
                    <div key={b.id} className="bank-select-item"
                      onClick={()=>setBank(b.id)}
                      style={{
                        background: bank===b.id
                          ? (dark?"rgba(14,165,233,0.1)":"rgba(14,165,233,0.06)")
                          : (dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"),
                        border: bank===b.id ? "2px solid #0ea5e9" : `2px solid ${tk.border}`,
                        color: tk.text,
                        boxShadow: bank===b.id ? "0 0 20px rgba(14,165,233,0.15)" : "none",
                      }}>
                      <span style={{ fontSize:22 }}>{b.icon}</span>
                      <span style={{ fontWeight: bank===b.id ? 800 : 600, fontSize:13 }}>{b.name}</span>
                      {bank===b.id && <span style={{ marginLeft:"auto", color:"#0ea5e9", fontWeight:900, fontSize:18 }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CASH ON DELIVERY ── */}
            {method === "cod" && (
              <div className="method-tab-content">
                <div style={{ textAlign:"center", padding:"40px 24px", background: dark?"rgba(217,119,6,0.06)":"rgba(217,119,6,0.04)", borderRadius:20, border:`2px dashed ${dark?"rgba(217,119,6,0.25)":"rgba(217,119,6,0.2)"}` }}>
                  <div style={{ fontSize:60, marginBottom:14, animation:"float-slow 3s ease-in-out infinite" }}>🏠</div>
                  <div style={{ fontSize:20, fontWeight:800, color:tk.text, marginBottom:8 }}>Cash on Delivery</div>
                  <div style={{ fontSize:13, color:tk.textLt, marginBottom:16, lineHeight:1.6 }}>
                    Pay in cash when your order arrives at your doorstep. No extra charges!
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, textAlign:"left", maxWidth:260, margin:"0 auto" }}>
                    {["✅ No online payment required","✅ Pay only upon delivery","✅ Inspect before paying","⚠  Exact change preferred"].map(t=>(
                      <div key={t} style={{ fontSize:13, color:tk.textMid, fontWeight:600 }}>{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div>
          <div style={{ background:tk.bgCard, borderRadius:20, padding:24, border:`1px solid ${tk.border}`, boxShadow:tk.shadowMd, position:"sticky", top:84 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:tk.text, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${tk.border}` }}>
              Order Summary
            </h3>

            {/* Items */}
            {cart.map(item=>(
              <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, fontSize:12, color:tk.textMid }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <img src={item.img} alt={item.name}
                    onError={e=>e.target.style.display="none"}
                    style={{ width:32, height:32, borderRadius:8, objectFit:"cover", background:tk.bgMuted }} />
                  <span style={{ fontWeight:600 }}>{item.name} × {item.qty}</span>
                </div>
                <span style={{ fontWeight:700, color:tk.text }}>₹{item.price*item.qty}</span>
              </div>
            ))}

            {/* Subtotal, delivery, total */}
            <div style={{ borderTop:`1px solid ${tk.border}`, paddingTop:12, marginTop:8 }}>
              {[[`Subtotal`, `₹${orderTotal}`],[`Delivery`, orderTotal>=500?"Free":"₹50"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:tk.textMid, marginBottom:6, fontWeight:600 }}>
                  <span>{k}</span><span style={{ color:k==="Delivery"&&v==="Free"?"#52b788":tk.textMid }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:20, fontWeight:900, marginTop:12, paddingTop:12, borderTop:`2px solid ${tk.border}` }}>
                <span style={{ color:tk.text }}>Total</span>
                <span style={{ color:"#52b788" }}>₹{orderTotal>=500?orderTotal:orderTotal+50}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div style={{ marginTop:16, padding:"12px 14px", background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.03)", borderRadius:12, border:`1px solid ${tk.border}`, fontSize:12, color:tk.textMid }}>
              <div style={{ fontWeight:700, color:tk.text, marginBottom:6 }}>📦 Deliver to:</div>
              <div>{deliveryInfo.address}</div>
              <div>{deliveryInfo.city} · 📞 {deliveryInfo.phone}</div>
              <div style={{ marginTop:6, fontSize:11, color:tk.textLt }}>🕐 Estimated: within 24 hours</div>
            </div>

            {/* PAY BUTTON */}
            <button ref={ctaBtnRef} className="pay-cta-btn" onClick={handlePay} disabled={paying}
              style={{
                width:"100%", marginTop:20, padding:"17px 0", fontSize:17,
                background: method==="cod"
                  ? "linear-gradient(135deg,#d97706,#f59e0b)"
                  : "linear-gradient(135deg,#2d6a4f,#40916c,#52b788)",
                color:"#fff",
                textShadow:"0 1px 4px rgba(0,0,0,0.3)",
                boxShadow: method==="cod"
                  ? "inset 0 1.5px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(217,119,6,0.45)"
                  : "inset 0 1.5px 0 rgba(255,255,255,0.45), 0 12px 32px rgba(64,145,108,0.5)",
                opacity: paying ? 0.75 : 1,
                cursor: paying ? "not-allowed" : "pointer",
                animation: !paying ? "pay-glow-pulse 3s ease infinite" : "none",
              }}>
              {method==="cod" ? "🏠 Place COD Order" : `🔒 Pay ₹${orderTotal>=500?orderTotal:orderTotal+50}`}
            </button>

            {/* Secure badges */}
            <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:14, flexWrap:"wrap" }}>
              {["🔒 SSL Encrypted","✓ RPS Secured","🛡 Safe Checkout"].map(b=>(
                <span key={b} className="pay-secure-badge"
                  style={{ background:dark?"rgba(82,183,136,0.08)":"rgba(82,183,136,0.06)", color:tk.textLt, border:`1px solid ${tk.border}` }}>
                  {b}
                </span>
              ))}
            </div>

            {/* Back link */}
            <button onClick={()=>navigate("/checkout")}
              style={{ background:"none", border:"none", color:tk.textLt, cursor:"pointer", fontSize:12, fontWeight:700, marginTop:14, width:"100%", fontFamily:"'Inter',sans-serif" }}>
              ← Back to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Responsive grid CSS */}
      <style>{`
        @media (max-width: 700px) {
          .payment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
