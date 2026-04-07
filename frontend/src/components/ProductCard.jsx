import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onQuickView, onToggleSave, onToggleCompare, onViewProduct, isSaved = false, isCompared = false }) {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { addToCart } = useCart();
  const [hovered,   setHovered]   = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added,     setAdded]     = useState(false);
  const cardRef = useRef(null);

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

  const handleOpenProduct = () => {
    if (onViewProduct) onViewProduct(product);
    navigate(`/product/${product.id || product._id}`);
  };

  // 3D Tilt handlers
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * -14;
    const ry = (x - 0.5) * 14;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    setHovered(false);
  }, []);

  const iosBtnBase = {
    flex: 1, padding: "10px 8px",
    borderRadius: 12, cursor: outOfStock ? "not-allowed" : "pointer",
    fontWeight: 700, fontSize: 12, fontFamily: "'Inter',sans-serif",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: 40, height: 40, lineHeight: 1, whiteSpace: "nowrap", textAlign: "center",
    border: "1px solid rgba(255,255,255,0.45)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
    boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.58), inset 0 -1px 0 rgba(0,0,0,0.1), 0 6px 16px rgba(0,0,0,0.2)",
    position: "relative", overflow: "hidden",
  };

  const quickActionBase = {
    border: "1px solid rgba(255,255,255,0.22)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24), 0 8px 20px rgba(0,0,0,0.18)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: tk.bgCard, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${hovered ? (dark ? "#52b788" : "#2d6a4f") : tk.border}`,
        boxShadow: hovered
          ? (dark ? "0 20px 60px rgba(27,67,50,0.35), 0 0 0 1px rgba(82,183,136,0.2)" : "0 20px 60px rgba(27,67,50,0.2)")
          : tk.shadow,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", background: tk.bgMuted, cursor: "pointer" }}
        onClick={handleOpenProduct}>
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

        <div style={{ position: "absolute", top: 12, right: 12, background: dark ? "rgba(27,67,50,0.88)" : "rgba(27,67,50,0.82)", backdropFilter: "blur(8px)", border: "1px solid rgba(82,183,136,0.3)", color: "#74c69d", borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 700 }}>
          {product.category}
        </div>

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

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(27,67,50,0.4) 0%,transparent 55%)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }} />

        <div className={`product-quick-actions ${hovered ? "is-visible" : ""}`}>
          <button
            type="button"
            data-magnetic
            onClick={(e) => { e.stopPropagation(); onQuickView ? onQuickView(product) : handleOpenProduct(); }}
            className="product-quick-btn product-quick-btn-primary"
          >
            Quick View
          </button>
          <button
            type="button"
            data-magnetic
            onClick={(e) => { e.stopPropagation(); onToggleCompare && onToggleCompare(product); }}
            className={`product-quick-btn ${isCompared ? "is-active" : ""}`}
            style={{ ...quickActionBase, background: isCompared ? "linear-gradient(135deg,rgba(37,99,235,0.88),rgba(29,78,216,0.92))" : "rgba(6,18,11,0.62)", color: "#fff" }}
          >
            {isCompared ? "Compared" : "Compare"}
          </button>
          <button
            type="button"
            data-magnetic
            onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(product); }}
            className={`product-quick-btn ${isSaved ? "is-active" : ""}`}
            style={{ ...quickActionBase, background: isSaved ? "linear-gradient(135deg,rgba(249,115,22,0.9),rgba(194,65,12,0.92))" : "rgba(6,18,11,0.62)", color: "#fff" }}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 12px 10px" }}>
        <div onClick={handleOpenProduct} style={{ cursor: "pointer" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: tk.text, marginBottom: 3, lineHeight: 1.25 }}>{product.name}</div>
          <div style={{ fontSize: 12, color: tk.textLt, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <span>🧑‍🌾</span>
            <span>{farmerName}</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
            <span className="price-value" style={{ fontSize: 18, fontWeight: 900, color: tk.green5, fontFamily: "'Inter',sans-serif", fontFeatureSettings: '"tnum"', letterSpacing: "-0.5px" }}>
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 12, color: tk.textLt, fontFamily: "'Inter',sans-serif" }}>/{unit}</span>
          </div>

          {/* Rating shown statically — no live count */}
          {product.avgRating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 11, color: s <= Math.round(product.avgRating) ? "#d4a017" : tk.border }}>★</span>
              ))}
              <span style={{ fontSize: 11, color: tk.textLt, marginLeft: 2 }}>{product.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <button
            onClick={handleOpenProduct}
            style={{
              ...iosBtnBase,
              width: "100%",
              background: outOfStock
                ? (dark ? "rgba(120,120,120,0.25)" : "rgba(170,170,170,0.26)")
                : (dark ? "linear-gradient(135deg,rgba(116,198,157,0.48),rgba(45,106,79,0.62))" : "linear-gradient(135deg,rgba(82,183,136,0.28),rgba(45,106,79,0.34))"),
              color: outOfStock ? "rgba(240,240,240,0.82)" : "#ffffff",
            }}
            onMouseEnter={e => {
              if (!outOfStock) {
                e.currentTarget.style.transform = "scale(1.03) translateY(-1px)";
                e.currentTarget.style.filter = "brightness(1.08)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.filter = "none";
            }}
          >
            {outOfStock ? "Out of Stock" : "View Details"}
          </button>

          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              style={{
                ...iosBtnBase,
                background: added
                  ? (dark ? "linear-gradient(135deg,rgba(16,185,129,0.55),rgba(5,150,105,0.7))" : "linear-gradient(135deg,rgba(16,185,129,0.36),rgba(5,150,105,0.42))")
                  : "linear-gradient(135deg,rgba(244,197,66,0.88),rgba(200,148,6,0.88))",
                color: added ? "#ffffff" : "#2f2300",
                minWidth: 40,
                flex: added ? 1 : "0 0 40px",
                fontSize: added ? 12 : 18,
                borderColor: "rgba(255,240,178,0.75)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05) translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "none"; }}
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
