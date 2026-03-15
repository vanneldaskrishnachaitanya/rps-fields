import { useNavigate } from 'react-router-dom';
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { API_BASE } from "../context/AuthContext";
import { CATEGORIES } from "../data/products";

export default function HomePage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(d => { if (d.success) setFeaturedProducts(d.products.slice(0, 6)); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: tk.bg }}>
      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg,#1b4332 0%,#2d6a4f 55%,#40916c 100%)",
          padding: "90px 20px 70px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 50%,rgba(116,198,157,0.18) 0%,transparent 55%)," +
              "radial-gradient(circle at 85% 25%,rgba(82,183,136,0.12) 0%,transparent 45%)",
            pointerEvents: "none",
          }} />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.1)",
              color: "#74c69d",
              border: "1px solid rgba(116,198,157,0.5)",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            🌱 100% Direct from Farms
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: 54,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              margin: "0 0 18px",
              lineHeight: 1.1,
            }}
          >
            From Field to<br />
            <span style={{ color: "#74c69d" }}>Your Table</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: 17,
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            RPS Fields connects you with verified farmers across India. Fresh produce,
            fair prices.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                background: "linear-gradient(135deg,#d4a017,#c49010)",
                color: "#1b4332",
                border: "none",
                padding: "13px 30px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 15,
                boxShadow: "0 4px 14px rgba(212,160,23,0.4)",
                fontFamily: "inherit",
              }}
            >
              🛒 Shop Now
            </button>
            <button
              onClick={() => navigate("/weather")}
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                padding: "13px 26px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 15,
                fontFamily: "inherit",
              }}
            >
              🌤 Check Weather
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div style={{ background: "#2d6a4f", padding: "18px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            ["50+", "Product Types"],
            ["24h", "Fresh Guarantee"],
          ].map(([n, l], i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "0 36px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 11, color: "#74c69d", textTransform: "uppercase", letterSpacing: "1px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section style={{ padding: "60px 0", background: tk.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: 34, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, textAlign: "center", marginBottom: 6 }}>
            Shop by Category
          </h2>
          <p style={{ color: tk.textLt, textAlign: "center", marginBottom: 36, fontSize: 15 }}>
            Explore fresh produce from farms across India
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate("/catalog")}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: tk.shadow,
                  transition: "transform 0.25s",
                  position: "relative",
                  height: 160,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top,rgba(0,0,0,0.68) 0%,transparent 60%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "14px 12px",
                  }}
                >
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{cat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: "20px 0 60px", background: tk.bgMuted }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: 32, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, textAlign: "center", marginBottom: 6 }}>
            Featured Products
          </h2>
          <p style={{ color: tk.textLt, textAlign: "center", marginBottom: 36, fontSize: 15 }}>
            Handpicked fresh arrivals this week
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24 }}>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                background: "linear-gradient(135deg,#52b788,#40916c)",
                color: "#fff",
                border: "none",
                padding: "13px 30px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 4px 15px rgba(82,183,136,0.35)",
                fontFamily: "inherit",
              }}
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* ── Why RPS ── */}
      <section style={{ padding: "56px 0", background: tk.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: 32, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, textAlign: "center", marginBottom: 36 }}>
            Why Choose RPS Fields?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 22 }}>
            {[
              ["🌿", "100% Organic", "Certified organic farms, no harmful chemicals."],
              ["🚚", "Same-Day Delivery", "Order by noon, receive the same evening."],
              ["💰", "Best Prices", "Direct sourcing = fair prices for everyone."],
              ["🔒", "Quality Guaranteed", "Every product quality-checked before dispatch."],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                style={{
                  background: tk.bgCard,
                  borderRadius: 16,
                  padding: 28,
                  boxShadow: tk.shadow,
                  border: `1px solid ${tk.border}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: tk.text, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: tk.textLt, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weather CTA ── */}
      <section
        style={{
          background: "linear-gradient(135deg,#40916c,#52b788)",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#fff", fontSize: 28, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 10 }}>
          Check Farm Weather Conditions
        </h2>
        <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: 24, fontSize: 15 }}>
          Know the weather before ordering seasonal produce
        </p>
        <button
          onClick={() => navigate("/weather")}
          style={{
            background: "linear-gradient(135deg,#d4a017,#c49010)",
            color: "#1b4332",
            border: "none",
            padding: "13px 30px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 15,
            boxShadow: "0 4px 14px rgba(212,160,23,0.4)",
            fontFamily: "inherit",
          }}
        >
          🌤 Open Weather Dashboard
        </button>
      </section>
    </div>
  );
}
