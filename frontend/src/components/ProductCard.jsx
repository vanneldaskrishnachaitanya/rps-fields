import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { addToCart } = useCart();
  const [hovered,   setHovered]   = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added,     setAdded]     = useState(false);

  const farmerName = product.farmerName || product.farmer || "Farmer";
  const farmerLoc  = product.farmerLocation || product.location || "";
  const unit       = product.unit || "kg";
  const price      = product.price || product.pricePerKg || 0;
  const outOfStock = product.qty === 0 || product.quantity === 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // iOS glass button style
  const iosBtnBase = {
    flex: 1, padding: "11px 8px",
    borderRadius: 14, cursor: outOfStock ? "not-allowed" : "pointer",
    fontWeight: 700, fontSize: 13, fontFamily: "'Inter',sans-serif",
    border: "1px solid rgba(255,255,255,0.28)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
    boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 14px rgba(0,0,0,0.15)",
    position: "relative", overflow: "hidden",
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tk.bgCard, borderRadius: 20, overflow: "hidden",
        border: `1px solid ${hovered ? "#52b788" : tk.border}`,
        boxShadow: hovered ? "0 16px 48px rgba(27,67,50,0.18)" : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-7px)" : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        perspective: "1000px",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: tk.bgMuted, cursor: "pointer" }}
        onClick={() => navigate(`/product/${product.id || product._id}`)}>
        {!imgError ? (
          <>
            {!imgLoaded && (
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg,${tk.bgMuted} 25%,${tk.border} 50%,${tk.bgMuted} 75%)`, backgroundSize: "400px 100%", animation: "shimmer 1.4s ease infinite" }} />
            )}
            <img
              src={product.img || product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.55s ease", opacity: imgLoaded ? 1 : 0 }}
            />
          </>
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>🌿</div>
        )}

        {/* Category badge */}
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(27,67,50,0.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(82,183,136,0.3)", color: "#74c69d", borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 700 }}>
          {product.category}
        </div>

        {/* Location badge */}
        {farmerLoc && (
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.88)", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 600 }}>
            📍 {farmerLoc}
          </div>
        )}

        {(product.qty || product.quantity) < 10 && (product.qty || product.quantity) > 0 && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(220,38,38,0.88)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: 12, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>LOW STOCK</div>
        )}
        {outOfStock && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: 10 }}>OUT OF STOCK</span>
          </div>
        )}

        {/* Hover gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(27,67,50,0.4) 0%,transparent 55%)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }} />
      </div>

      {/* Body */}
      <div style={{ padding: "16px 16px 14px" }}>
        <div onClick={() => navigate(`/product/${product.id || product._id}`)} style={{ cursor: "pointer" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: tk.text, marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
          <div style={{ fontSize: 12, color: tk.textLt, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <span>🧑‍🌾</span>
            <span>{farmerName}</span>
          </div>

          {/* Price — Inter font, tabular numbers */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
            <span className="price-value" style={{ fontSize: 22, fontWeight: 900, color: tk.green5, fontFamily: "'Inter',sans-serif", fontFeatureSettings: '"tnum"', letterSpacing: "-0.5px" }}>
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 12, color: tk.textLt, fontFamily: "'Inter',sans-serif" }}>/{unit}</span>
          </div>

          {product.avgRating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 11, color: s <= Math.round(product.avgRating) ? "#d4a017" : tk.border }}>★</span>
              ))}
              <span style={{ fontSize: 11, color: tk.textLt, marginLeft: 2 }}>{product.avgRating.toFixed(1)} ({product.totalRatings})</span>
            </div>
          )}
        </div>

        {/* Dual buttons — iOS dock glass style */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* View Details */}
          <button
            onClick={() => navigate(`/product/${product.id || product._id}`)}
            style={{
              ...iosBtnBase,
              background: outOfStock ? "rgba(100,100,100,0.15)" : "rgba(82,183,136,0.26)",
              color: outOfStock ? tk.textLt : "#fff",
            }}
            onMouseEnter={e => { if (!outOfStock) { e.currentTarget.style.transform = "scale(1.05) translateY(-1px)"; e.currentTarget.style.background = "rgba(82,183,136,0.4)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = outOfStock ? "rgba(100,100,100,0.15)" : "rgba(82,183,136,0.26)"; }}
          >
            {outOfStock ? "Out of Stock" : "View Details"}
          </button>

          {/* Add to Cart */}
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              style={{
                ...iosBtnBase,
                background: added ? "rgba(16,185,129,0.35)" : "rgba(200,150,12,0.28)",
                color: "#fff",
                minWidth: 44,
                flex: added ? 1 : "0 0 44px",
                fontSize: added ? 12 : 18,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08) translateY(-1px)"; e.currentTarget.style.background = added ? "rgba(16,185,129,0.45)" : "rgba(200,150,12,0.42)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = added ? "rgba(16,185,129,0.35)" : "rgba(200,150,12,0.28)"; }}
              title="Add to Cart"
            >
              {added ? "✓ Added!" : "🛒"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
