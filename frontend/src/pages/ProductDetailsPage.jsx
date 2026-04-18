import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth, API_BASE } from "../context/AuthContext";
import RatingsSection from "../components/RatingsSection";
import ProductCard from "../components/ProductCard";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [added,   setAdded]     = useState(false);
  const [imgErr,  setImgErr]    = useState(false);
  const [error,   setError]     = useState("");
  const [qty,     setQty]       = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const unitLabel = (() => {
    const u = String(product?.unit || "kg").toLowerCase();
    return ["l", "lt", "ltr", "liter", "litre", "liters", "litres"].includes(u) ? "L" : "kg";
  })();

  useEffect(() => {
    setLoading(true); setImgErr(false); setError(""); setQty(1);
    fetch(`${API_BASE}/products/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProduct(d.product);
          fetch(`${API_BASE}/products?category=${encodeURIComponent(d.product.category)}`)
            .then(r2 => r2.json())
            .then(d2 => { if (d2.success) setRelated(d2.products.filter(p => p.id !== d.product.id).slice(0,3)); });
        } else setError("Product not found.");
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", animation:"fadeIn 0.5s ease" }}>
        <div style={{ fontSize:56, marginBottom:14, animation:"float 2s ease-in-out infinite" }}>🌿</div>
        <p style={{ color:tk.textLt, fontSize:15 }}>Loading product...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px var(--page-px,clamp(16px,4vw,48px))", animation:"fadeIn 0.5s ease" }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
      <h2 style={{ fontSize:26, color:tk.text, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>Product Not Found</h2>
      <p style={{ color:tk.textLt, marginBottom:28 }}>{error}</p>
      <button data-magnetic onClick={() => navigate("/catalog")} style={{ background:"rgba(82,183,136,0.28)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"13px 30px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif" }}>
        ← Back to Catalog
      </button>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
        <div style={{ maxWidth:1536, margin:"0 auto", padding:"36px var(--page-px,clamp(16px,4vw,48px)) 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, animation:"fadeUp 0.4s ease both", fontSize:13, color:tk.textLt }}>
          <span onClick={() => navigate("/")} style={{ cursor:"pointer", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="#52b788"} onMouseLeave={e=>e.target.style.color=tk.textLt}>Home</span>
          <span>›</span>
          <span onClick={() => navigate("/catalog")} style={{ cursor:"pointer", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="#52b788"} onMouseLeave={e=>e.target.style.color=tk.textLt}>Catalog</span>
          <span>›</span>
          <span style={{ color:tk.text, fontWeight:700 }}>{product.name}</span>
        </div>

        {/* Main product components */}
        <div data-tilt style={{
          display:"flex", flexWrap:"wrap", gap:24,
          marginBottom:52, animation:"fadeUp 0.5s ease 0.05s both",
        }}>
          {/* Card 1: Image */}
          <div style={{ flex:"1 1 360px", background:tk.bgCard, borderRadius:24, overflow:"hidden", boxShadow:tk.shadowLg, border:`1px solid ${tk.border}` }}>
            <div style={{ position:"relative", height:"100%", minHeight:440, background:tk.bgMuted, overflow:"hidden" }}>
              {!imgErr ? (
                <img src={product.img||product.image} alt={product.name} onError={() => setImgErr(true)}
                  style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:440, transition:"transform 0.6s ease" }}
                  onMouseEnter={e => e.target.style.transform="scale(1.04)"}
                  onMouseLeave={e => e.target.style.transform="scale(1)"}
                />
              ) : (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:440, fontSize:80 }}>🌿</div>
              )}
              {/* Badges */}
              <div style={{ position:"absolute", top:16, left:16, display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ background:"rgba(13,43,26,0.88)", backdropFilter:"blur(8px)", color:"#74c69d", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700, border:"1px solid rgba(82,183,136,0.3)" }}>
                  {product.category}
                </div>
                {product.qty < 20 && product.qty > 0 && (
                  <div style={{ background:"rgba(239,68,68,0.88)", backdropFilter:"blur(8px)", color:"#fff", borderRadius:20, padding:"4px 14px", fontSize:11, fontWeight:700 }}>
                    ⚠ Only {product.qty}kg left
                  </div>
                )}
              </div>
              {product.avgRating > 0 && (
                <div style={{ position:"absolute", top:16, right:16, background:"rgba(13,43,26,0.88)", backdropFilter:"blur(8px)", borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700, color:"#fcd34d", border:"1px solid rgba(212,160,23,0.3)" }}>
                  ⭐ {product.avgRating.toFixed(1)}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Details */}
          <div style={{ flex:"1.4 1 420px", padding:"38px 40px", background:tk.bgCard, borderRadius:24, boxShadow:tk.shadowLg, border:`1px solid ${tk.border}` }}>
            <h1 style={{ fontSize:"clamp(26px,3.5vw,38px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, margin:"0 0 14px", lineHeight:1.15 }}>{product.name}</h1>

            <div style={{ display:"flex", gap:16, marginBottom:22, flexWrap:"wrap" }}>
              <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:tk.textMid, background:tk.bgMuted, borderRadius:20, padding:"4px 12px", border:`1px solid ${tk.border}` }}>
                🧑‍🌾 {product.farmerName}
              </span>
              {product.farmerLocation && (
                <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:tk.textMid, background:tk.bgMuted, borderRadius:20, padding:"4px 12px", border:`1px solid ${tk.border}` }}>
                  📍 {product.farmerLocation}
                </span>
              )}
            </div>

            <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:8 }}>
              <span className="num" style={{ fontSize:48, fontWeight:900, color:tk.green6, fontFamily:"'Inter',sans-serif", lineHeight:1 }}>
                ₹{Number(product.price || product.pricePerKg || 0).toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize:16, color:tk.textLt, fontWeight:400 }}>per {unitLabel}</span>
            </div>

            {product.avgRating > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20 }}>
                <div style={{ display:"flex", gap:2 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:16, color: s <= Math.round(product.avgRating) ? "#d4a017" : tk.border }}>★</span>)}
                </div>
                <span style={{ fontSize:13, color:tk.textMid, fontWeight:700 }}>{product.avgRating.toFixed(1)}</span>
                <span style={{ fontSize:12, color:tk.textLt }}>({product.totalRatings} reviews)</span>
              </div>
            )}

            <div style={{ background:tk.bgMuted, borderRadius:16, padding:"18px 24px", marginBottom:0, border:`1px solid ${tk.border}` }}>
              <div style={{ fontWeight:800, color:tk.text, marginBottom:8, fontSize:13, textTransform:"uppercase", letterSpacing:"0.5px" }}>About this Product</div>
              <p style={{ color:tk.textMid, fontSize:14, lineHeight:1.8, margin:0 }}>{product.description}</p>
            </div>
          </div>

          {/* Card 3: Action */}
          <div style={{ flex:"1 1 320px", display:"flex", flexDirection:"column", background:tk.bgCard, borderRadius:24, padding:"38px 32px", boxShadow:tk.shadowLg, border:`1px solid ${tk.border}`, height:"max-content" }}>
            {/* Stock indicator */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: product.qty > 20 ? "#52b788" : product.qty > 0 ? "#f59e0b" : "#ef4444", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:13, fontWeight:700, color: product.qty > 20 ? "#52b788" : product.qty > 0 ? "#f59e0b" : "#ef4444" }}>
                {product.qty > 20 ? `In Stock · ${product.qty} ${unitLabel} available` : product.qty > 0 ? `Low Stock · Only ${product.qty} ${unitLabel} left` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity selector + CTA */}
            {product.qty > 0 ? (
              user?.role === 'admin' ? null : (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:tk.textMid }}>Quantity ({unitLabel}):</span>
                    <div style={{ display:"flex", alignItems:"center", gap:0, border:`1.5px solid ${tk.border}`, borderRadius:12, overflow:"hidden" }}>
                      <button data-magnetic onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:36, height:36, background:tk.bgMuted, border:"none", cursor:"pointer", fontSize:18, fontFamily:"'Inter',sans-serif", color:tk.text, transition:"background 0.2s" }}
                        onMouseEnter={e=>e.target.style.background=tk.border} onMouseLeave={e=>e.target.style.background=tk.bgMuted}>−</button>
                      <span style={{ width:40, textAlign:"center", fontWeight:800, fontSize:15, color:tk.text }}>{qty}</span>
                      <button data-magnetic onClick={() => setQty(q => Math.min(product.qty,q+1))} style={{ width:36, height:36, background:tk.bgMuted, border:"none", cursor:"pointer", fontSize:18, fontFamily:"'Inter',sans-serif", color:tk.text, transition:"background 0.2s" }}
                        onMouseEnter={e=>e.target.style.background=tk.border} onMouseLeave={e=>e.target.style.background=tk.bgMuted}>+</button>
                    </div>
                    <span className="num" style={{ fontSize:13, color:tk.textLt }}>
                      = ₹{Number((product.price || product.pricePerKg || 0) * qty).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <button data-magnetic onClick={handleAdd} style={{
                      width:"100%", padding:"15px", fontSize:16, fontWeight:800,
                      background: added
                        ? "linear-gradient(135deg,rgba(34,197,140,0.96),rgba(4,155,108,1))"
                        : "linear-gradient(135deg,rgba(93,198,150,0.96),rgba(47,131,94,0.98))",
                      color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.30)", border:"1px solid rgba(194,255,226,0.44)", borderRadius:14, cursor:"pointer", fontFamily:"'Inter',sans-serif",
                      boxShadow: added
                        ? "inset 0 1.5px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 12px 30px rgba(4,155,108,0.48)"
                        : "inset 0 1.5px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 12px 30px rgba(28,120,86,0.50)",
                      transition:"all 0.3s ease",
                      transform: added ? "scale(0.98)" : "scale(1)",
                    }}>
                      {added ? `✓ Added ${qty}${unitLabel} to Cart!` : `🛒 Add to Cart`}
                    </button>
                    <button
                      data-magnetic
                      onClick={() => navigate("/cart")}
                      style={{ width:"100%", padding:"15px", background:"linear-gradient(135deg,rgba(248,201,72,0.98),rgba(204,147,8,1))", border:"1px solid rgba(255,236,163,0.82)", color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.30)", borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", transition:"all 0.2s", boxShadow:"inset 0 1.5px 0 rgba(255,245,205,0.62), inset 0 -1px 0 rgba(0,0,0,0.18), 0 12px 30px rgba(212,160,23,0.52)" }}
                    >
                      View Cart →
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div style={{ background: dark?"rgba(239,68,68,0.1)":"#fff3f3", border:"1px solid rgba(239,68,68,0.3)", borderRadius:14, padding:"16px 24px", color:"#ef4444", fontWeight:700 }}>
                ⚠ Out of Stock — This product is currently unavailable.
              </div>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div style={{ marginBottom:48, animation:"fadeUp 0.5s ease 0.2s both" }}>
          <button data-magnetic onClick={() => setShowReviews(!showReviews)} style={{ padding:"12px 24px", background:tk.bgMuted, border:`1px solid ${tk.border}`, color:tk.text, borderRadius:12, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:8, width:"100%", justifyContent:"center" }}>
            <span>⭐</span> Customer Reviews {product.totalRatings > 0 ? `(${product.totalRatings})` : ""} {showReviews ? "▲" : "▼"}
          </button>
          <div style={{ 
            display:"grid",
            gridTemplateRows: showReviews ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s ease",
          }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ paddingTop: 24 }}>
                <RatingsSection productId={id} />
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ animation:"fadeUp 0.5s ease 0.3s both" }}>
            <h2 style={{ fontSize:26, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:24 }}>
              More {product.category}
            </h2>
            <div style={{ display:"flex", gap:16, overflowX:"auto", flexWrap:"nowrap", paddingBottom:6 }}>
              {related.map(p => (
                <div key={p.id} style={{ minWidth:240, flex:"0 0 240px" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
