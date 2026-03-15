import { useState } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function RateProductModal({ item, orderId, onClose, onDone }) {
  const { dark } = useTheme(); const tk = TK(dark);
  const { authFetch } = useAuth();
  const [stars,  setStars]  = useState(0);
  const [hover,  setHover]  = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,  setError]  = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!stars) { setError("Please select a star rating."); return; }
    setLoading(true); setError("");
    try {
      const d = await authFetch("/ratings", {
        method: "POST",
        body: JSON.stringify({
          productId: item.productId || item.id,
          orderId,
          stars,
          review,
        }),
      });
      if (!d.success) throw new Error(d.error);
      setSuccess(true);
      setTimeout(() => { onDone?.(); onClose?.(); }, 1200);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"rgba(0,0,0,0.6)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20,
    }} onClick={e => { if(e.target===e.currentTarget) onClose?.(); }}>
      <div style={{ background:tk.bgCard, borderRadius:20, padding:36, maxWidth:440, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.5)", border:`1px solid ${tk.border}` }}>
        {success ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:60, marginBottom:12 }}>🎉</div>
            <h3 style={{ color:tk.text, fontSize:20 }}>Thank you for your review!</h3>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize:20, fontWeight:800, color:tk.text, marginBottom:4 }}>Rate this Product</h3>
            <p style={{ color:tk.textMid, fontSize:14, marginBottom:20 }}>{item.name}</p>

            {/* Star selector */}
            <div style={{ display:"flex", gap:8, marginBottom:20, justifyContent:"center" }}>
              {[1,2,3,4,5].map(n => (
                <span key={n}
                  onMouseEnter={()=>setHover(n)}
                  onMouseLeave={()=>setHover(0)}
                  onClick={()=>setStars(n)}
                  style={{ fontSize:36, cursor:"pointer", transition:"transform 0.1s", transform:(hover||stars)>=n?"scale(1.2)":"scale(1)", color:(hover||stars)>=n?"#f59e0b":"#d1d5db" }}>
                  ★
                </span>
              ))}
            </div>
            <div style={{ textAlign:"center", color:tk.textMid, fontSize:13, marginBottom:18 }}>
              {stars===0?"Click to rate":stars===1?"⭐ Poor":stars===2?"⭐⭐ Fair":stars===3?"⭐⭐⭐ Good":stars===4?"⭐⭐⭐⭐ Very Good":"⭐⭐⭐⭐⭐ Excellent"}
            </div>

            <textarea
              value={review} onChange={e=>setReview(e.target.value)}
              placeholder="Write a review (optional)..."
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit", minHeight:90, resize:"vertical", marginBottom:16 }}
            />

            {error && <div style={{ color:"#e74c3c", fontSize:13, marginBottom:12, fontWeight:600 }}>⚠ {error}</div>}

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex:1, padding:"12px", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#fff", border:"none", borderRadius:10, cursor:loading?"not-allowed":"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit", opacity:loading?0.7:1 }}>
                {loading ? "Submitting..." : "Submit Review ⭐"}
              </button>
              <button onClick={onClose}
                style={{ flex:1, padding:"12px", background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
