import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { API_BASE } from "../context/AuthContext";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { dark } = useTheme(); const tk = TK(dark);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true); setImgErr(false); setError("");
    fetch(`${API_BASE}/products/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProduct(d.product);
          // Fetch related (same category)
          fetch(`${API_BASE}/products?category=${encodeURIComponent(d.product.category)}`)
            .then(r2 => r2.json())
            .then(d2 => { if (d2.success) setRelated(d2.products.filter(p => p.id !== d.product.id).slice(0, 3)); });
        } else { setError("Product not found."); }
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const btn = (style) => ({ border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, ...style });

  if (loading) return (
    <div style={{ background: tk.bg, minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: tk.textLt }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🌿</div>
        <p>Loading product...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ background: tk.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h2 style={{ fontSize: 26, color: tk.text, marginBottom: 8 }}>Product Not Found</h2>
      <p style={{ color: tk.textLt, marginBottom: 24 }}>{error}</p>
      <button onClick={() => navigate("/catalog")} style={btn({ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", padding: "12px 26px", fontSize: 14 })}>Back to Catalog</button>
    </div>
  );

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px" }}>
        <button onClick={() => navigate("/catalog")} style={btn({ background: "transparent", border: `1.5px solid ${tk.green7}`, color: tk.green7, padding: "8px 18px", fontSize: 13, marginBottom: 24 })}>
          ← Back to Catalog
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 0, background: tk.bgCard, borderRadius: 20, overflow: "hidden", boxShadow: tk.shadowLg, border: `1px solid ${tk.border}`, marginBottom: 48 }}>
          {/* Image */}
          <div style={{ position: "relative", minHeight: 400, background: tk.bgMuted }}>
            {!imgErr
              ? <img src={product.img} alt={product.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 400 }} />
              : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, fontSize: 80 }}>🌿</div>
            }
            <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(27,67,50,0.85)", backdropFilter: "blur(4px)", color: "#74c69d", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
              {product.category}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "40px 36px" }}>
            <h1 style={{ fontSize: 34, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, margin: "0 0 12px" }}>{product.name}</h1>
            <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 14, color: tk.textLt, flexWrap: "wrap" }}>
              <span>🧑‍🌾 {product.farmerName}</span>
              <span>📍 {product.farmerLocation}</span>
            </div>

            <div style={{ fontSize: 46, fontWeight: 800, color: tk.green7, marginBottom: 4 }}>
              ₹{product.price}<span style={{ fontSize: 16, fontWeight: 400, color: tk.textLt }}>/kg</span>
            </div>

            <div style={{ fontSize: 14, color: product.qty < 20 ? "#e74c3c" : tk.textMid, marginBottom: 22, fontWeight: product.qty < 20 ? 700 : 400 }}>
              {product.qty < 20 ? `⚠ Only ${product.qty} kg left!` : `✅ ${product.qty} kg available in stock`}
            </div>

            <div style={{ background: tk.bgMuted, borderRadius: 14, padding: 20, marginBottom: 28, border: `1px solid ${tk.border}` }}>
              <div style={{ fontWeight: 700, color: tk.text, marginBottom: 8, fontSize: 14 }}>📋 About this product</div>
              <p style={{ color: tk.textMid, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{product.description}</p>
            </div>

            {/* Action buttons */}
            {product.qty === 0 ? (
              <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "14px 18px", color: "#856404", fontWeight: 600 }}>
                ⚠ Out of Stock — This product is currently unavailable.
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleAdd}
                  style={btn({ flex: 1, padding: 14, fontSize: 16, background: added ? "#27ae60" : "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", boxShadow: "0 4px 14px rgba(82,183,136,0.3)", transition: "background 0.3s" })}>
                  {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
                <button onClick={() => navigate("/cart")}
                  style={btn({ background: "transparent", border: `1.5px solid ${tk.green7}`, color: tk.green7, padding: "14px 20px", fontSize: 14 })}>
                  View Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <>
            <h2 style={{ fontSize: 24, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, marginBottom: 20 }}>
              More {product.category}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
              {related.map(p => (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
                  style={{ background: tk.bgCard, borderRadius: 14, overflow: "hidden", border: `1px solid ${tk.border}`, cursor: "pointer", boxShadow: tk.shadow, transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <div style={{ height: 160, overflow: "hidden", background: tk.bgMuted }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: tk.text, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: tk.textLt, marginBottom: 8 }}>🧑‍🌾 {p.farmerName}</div>
                    <div style={{ fontWeight: 800, color: tk.green7, fontSize: 18 }}>₹{p.price}<span style={{ fontSize: 11, fontWeight: 400, color: tk.textLt }}>/kg</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
