import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const farmerName = product.farmerName || product.farmer || "Farmer";
  const farmerLoc  = product.farmerLocation || product.location || "";

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
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 210, overflow: "hidden", background: tk.bgMuted }}>
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
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: hovered ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.55s ease",
                opacity: imgLoaded ? 1 : 0,
              }}
            />
          </>
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>🌿</div>
        )}

        {/* Category badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(27,67,50,0.85)", backdropFilter: "blur(6px)",
          color: "#74c69d", borderRadius: 20, padding: "3px 11px",
          fontSize: 11, fontWeight: 700,
          transform: hovered ? "translateY(-2px)" : "none",
          transition: "transform 0.3s ease",
        }}>
          {product.category}
        </div>

        {product.qty < 10 && product.qty > 0 && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(231,76,60,0.9)", color: "#fff", borderRadius: 12, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>
            LOW STOCK
          </div>
        )}
        {product.qty === 0 && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, background: "rgba(0,0,0,0.7)", padding: "8px 16px", borderRadius: 8 }}>OUT OF STOCK</span>
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top,rgba(27,67,50,0.5) 0%,transparent 60%)",
          opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: tk.text, marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ fontSize: 12, color: tk.textLt, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
          <span>🧑‍🌾</span>
          <span>{farmerName}</span>
          {farmerLoc && <><span style={{ color: tk.border }}>·</span><span>📍 {farmerLoc}</span></>}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: tk.green7, fontFamily: "'Playfair Display',Georgia,serif" }}>₹{product.price || product.pricePerKg}</span>
          <span style={{ fontSize: 12, color: tk.textLt }}>/kg</span>
        </div>

        {product.avgRating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: 12, color: s <= Math.round(product.avgRating) ? "#d4a017" : tk.border }}>★</span>
            ))}
            <span style={{ fontSize: 11, color: tk.textLt, marginLeft: 2 }}>{product.avgRating.toFixed(1)} ({product.totalRatings})</span>
          </div>
        )}

        <button
          onClick={() => navigate(`/product/${product.id || product._id}`)}
          disabled={product.qty === 0}
          style={{
            width: "100%", padding: "11px",
            background: product.qty === 0 ? tk.bgMuted : `linear-gradient(135deg,${tk.green6},${tk.green7})`,
            color: product.qty === 0 ? tk.textLt : "#fff",
            border: "none", borderRadius: 12,
            cursor: product.qty === 0 ? "not-allowed" : "pointer",
            fontWeight: 800, fontSize: 14, fontFamily: "inherit",
            boxShadow: product.qty === 0 ? "none" : hovered ? "0 6px 20px rgba(82,183,136,0.4)" : "none",
            transition: "all 0.25s ease",
            transform: hovered && product.qty > 0 ? "scale(1.01)" : "none",
          }}
        >
          {product.qty === 0 ? "Out of Stock" : "View Details →"}
        </button>
      </div>
    </div>
  );
}
