import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product, onQuickView, onViewProduct }) {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [hovered,   setHovered]   = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added,     setAdded]     = useState(false);

  const farmerName = product.farmerName || product.farmer || "Farmer";
  const farmerLoc  = product.farmerLocation || product.location || "";
  const unit       = product.unit || "kg";
  const price      = product.price || product.pricePerKg || 0;
  const ratingValue = Number(product.avgRating || 0);
  const filledStars = Math.round(ratingValue);
  const ratingStars = [1, 2, 3, 4, 5];
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

  const iosBtnBase = {
    flex: 1, padding: "10px 8px",
    borderRadius: 12, cursor: outOfStock ? "not-allowed" : "pointer",
    fontWeight: 700, fontSize: 12, fontFamily: "'Inter',sans-serif",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minHeight: 40, height: 40, lineHeight: 1, whiteSpace: "nowrap", textAlign: "center",
    border: "1px solid rgba(255,255,255,0.58)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
    boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.14), 0 8px 20px rgba(0,0,0,0.26)",
    textShadow: "0 1px 4px rgba(0,0,0,0.30)",
    position: "relative", overflow: "hidden",
  };

  return (
    <div
      data-no-tilt
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tk.bgCard, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${hovered ? (dark ? "#52b788" : "#2d6a4f") : tk.border}`,
        boxShadow: hovered
          ? (dark ? "0 20px 60px rgba(27,67,50,0.35), 0 0 0 1px rgba(82,183,136,0.2)" : "0 20px 60px rgba(27,67,50,0.2)")
          : tk.shadow,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Image */}
      <div className="product-card-image" style={{ position: "relative", height: 160, overflow: "hidden", background: tk.bgMuted, cursor: "pointer" }}
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
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body" style={{ padding: "12px 12px 10px" }}>
        <div className="product-card-info" onClick={handleOpenProduct} style={{ cursor: "pointer" }}>
          <div className="product-card-title" style={{ fontWeight: 800, fontSize: 16, color: tk.text, marginBottom: 4, lineHeight: 1.25 }}>{product.name}</div>
          <div className="product-card-farmer" style={{ fontSize: 13, color: tk.textLt, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <span>🧑‍🌾</span>
            <span>{farmerName}</span>
          </div>

          <div className="product-card-price-row" style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
            <span className="price-value" style={{ fontSize: 24, fontWeight: 900, color: tk.green5, fontFamily: "'Inter',sans-serif", fontFeatureSettings: '"tnum"', letterSpacing: "-0.5px" }}>
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 14, color: tk.textLt, fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>/{unit}</span>
          </div>

          <div className="product-card-rating-row" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
            {/* Rating shown statically — no live count */}
            {ratingValue > 0 ? (
              ratingStars.map((star) => (
                <span key={star} style={{ fontSize: 12, color: star <= filledStars ? "#d4a017" : tk.border }}>★</span>
                  ))
            ) : (
              <span className="product-card-rating-placeholder" aria-hidden="true">.</span>
            )}
            {ratingValue > 0 && <span style={{ fontSize: 12, color: tk.textLt, marginLeft: 2, fontWeight: 600 }}>{ratingValue.toFixed(1)}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="product-card-actions" style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <button
            className="product-card-action-btn product-card-action-btn-details"
            onClick={handleOpenProduct}
            style={{
              ...iosBtnBase,
              width: "100%",
              background: outOfStock
                ? (dark ? "rgba(120,120,120,0.25)" : "rgba(170,170,170,0.26)")
                : (dark ? "linear-gradient(135deg,rgba(118,208,165,0.90),rgba(42,118,84,0.96))" : "linear-gradient(135deg,rgba(93,198,150,0.96),rgba(47,131,94,0.98))"),
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

          {!outOfStock && user?.role !== 'admin' && (
            <button
              className="product-card-action-btn product-card-action-btn-cart"
              onClick={handleAddToCart}
              style={{
                ...iosBtnBase,
                background: added
                  ? (dark ? "linear-gradient(135deg,rgba(34,197,140,0.90),rgba(4,155,108,0.96))" : "linear-gradient(135deg,rgba(34,197,140,0.94),rgba(4,155,108,0.98))")
                  : "linear-gradient(135deg,rgba(248,201,72,0.98),rgba(204,147,8,1))",
                color: "#ffffff",
                minWidth: 40,
                flex: added ? 1 : "0 0 40px",
                fontSize: added ? 12 : 18,
                borderColor: added ? "rgba(180,255,228,0.70)" : "rgba(255,236,163,0.82)",
                boxShadow: added
                  ? "inset 0 1.5px 0 rgba(255,255,255,0.56), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 24px rgba(5,150,105,0.45), 0 2px 8px rgba(0,0,0,0.16)"
                  : "inset 0 1.5px 0 rgba(255,245,205,0.65), inset 0 -1px 0 rgba(0,0,0,0.16), 0 10px 24px rgba(204,147,8,0.45), 0 2px 8px rgba(0,0,0,0.16)",
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
