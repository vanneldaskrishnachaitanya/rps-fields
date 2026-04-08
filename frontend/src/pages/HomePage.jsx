import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../context/AuthContext";
import { CATEGORIES } from "../data/products";

const HERO_CARDS = [
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=85",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=85",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=900&q=85",
  "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=900&q=85",
];

const pageShell = {
  minHeight: "100vh",
  padding: "24px clamp(12px, 2.8vw, 30px) 42px",
  background:
    "radial-gradient(circle at 20% -10%, rgba(0, 0, 0, 0.05), transparent 40%), radial-gradient(circle at 90% 10%, rgba(0, 0, 0, 0.04), transparent 35%), #ececec",
};

const roundedStage = {
  maxWidth: 1320,
  margin: "0 auto",
  borderRadius: 44,
  background: "linear-gradient(180deg, #f4f4f4 0%, #f0f0f0 100%)",
  border: "1px solid rgba(20, 20, 20, 0.08)",
  boxShadow:
    "0 28px 60px rgba(16, 16, 16, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.82)",
  overflow: "hidden",
};

const softButton = {
  border: "1px solid rgba(20, 20, 20, 0.14)",
  borderRadius: 14,
  padding: "11px 20px",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.1px",
  background: "#ffffff",
  color: "#1b1e21",
  cursor: "pointer",
};

const darkButton = {
  ...softButton,
  border: "1px solid rgba(0, 0, 0, 0.85)",
  background: "#1f2529",
  color: "#f8fafb",
};

function productImage(product) {
  if (typeof product?.image === "string" && product.image) return product.image;
  if (Array.isArray(product?.images) && product.images[0]) return product.images[0];
  return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80";
}

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.products)) {
          setProducts(d.products.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  const quickLinks = useMemo(
    () => ["Home", "News", "Farmers", "Pages", "Shop", "Contact"],
    []
  );

  return (
    <div style={pageShell}>
      <section style={roundedStage}>
        <div
          style={{
            padding: "20px clamp(16px, 2.8vw, 36px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            borderBottom: "1px solid rgba(20, 20, 20, 0.08)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              fontSize: 34,
              fontWeight: 800,
              color: "#1f2326",
              lineHeight: 1,
            }}
          >
            rps.
          </div>

          <div
            style={{
              display: "flex",
              gap: "clamp(8px, 1.8vw, 24px)",
              flexWrap: "wrap",
              justifyContent: "center",
              color: "#343b40",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            {quickLinks.map((label) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "Shop") navigate("/catalog");
                  if (label === "Contact") navigate("/contact");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: "4px 2px",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button style={softButton} onClick={() => navigate("/login")}>
              Log in
            </button>
            <button style={darkButton} onClick={() => navigate("/register")}>
              Join
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "clamp(30px, 4.6vw, 62px) clamp(16px, 4vw, 56px) clamp(26px, 4vw, 48px)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "0 auto",
              maxWidth: 900,
              fontSize: "clamp(34px, 6.8vw, 82px)",
              lineHeight: 1.03,
              fontWeight: 900,
              color: "#20262b",
              letterSpacing: "-1px",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
          >
            A clean place to discover
            <br />
            farm fresh produce
          </h1>

          <div
            style={{
              marginTop: "clamp(24px, 3.5vw, 38px)",
              display: "flex",
              justifyContent: "center",
              gap: "clamp(8px, 1.8vw, 16px)",
              flexWrap: "wrap",
            }}
          >
            {HERO_CARDS.map((img, i) => {
              const transforms = [
                "translateX(0px) rotate(-4deg)",
                "translateX(-8px) translateY(-8px) rotate(-1deg)",
                "translateX(-16px) translateY(-4px) rotate(2deg)",
                "translateX(-22px) translateY(6px) rotate(5deg)",
              ];

              return (
                <div
                  key={img}
                  style={{
                    width: "clamp(132px, 18vw, 220px)",
                    aspectRatio: "1 / 1",
                    borderRadius: 22,
                    overflow: "hidden",
                    transform: transforms[i],
                    boxShadow: "0 18px 26px rgba(0, 0, 0, 0.18)",
                    border: "1px solid rgba(255, 255, 255, 0.7)",
                    animation: `heroFloat 5s ease-in-out ${i * 0.18}s infinite`,
                    background: "#d7d7d7",
                  }}
                >
                  <img
                    src={img}
                    alt="Fresh produce showcase"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              );
            })}
          </div>

          <p
            style={{
              margin: "clamp(26px, 3vw, 34px) auto 0",
              maxWidth: 760,
              color: "#48535b",
              fontSize: "clamp(15px, 2.2vw, 25px)",
              lineHeight: 1.4,
            }}
          >
            Shop direct from trusted farmers, discover seasonal picks, and get produce delivered with transparent pricing.
          </p>

          <div
            style={{
              marginTop: 26,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button style={darkButton} onClick={() => navigate("/catalog")}>
              Shop Catalog
            </button>
            <button style={softButton} onClick={() => navigate("/register/farmer")}>
              Join as Farmer
            </button>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1320,
          margin: "22px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {CATEGORIES.slice(0, 6).map((cat) => (
          <article
            key={cat.name}
            onClick={() => navigate("/catalog")}
            style={{
              borderRadius: 24,
              background: "#f5f5f5",
              border: "1px solid rgba(20, 20, 20, 0.08)",
              boxShadow: "0 10px 22px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <img
              src={cat.img}
              alt={cat.name}
              style={{ width: "100%", height: 132, objectFit: "cover" }}
            />
            <div style={{ padding: "12px 14px 14px" }}>
              <h3 style={{ fontSize: 16, color: "#1f2529", marginBottom: 4 }}>{cat.name}</h3>
              <p style={{ color: "#5c676f", fontSize: 13 }}>Explore fresh options</p>
            </div>
          </article>
        ))}
      </section>

      <section
        style={{
          maxWidth: 1320,
          margin: "16px auto 0",
          borderRadius: 28,
          border: "1px solid rgba(20, 20, 20, 0.08)",
          background: "#f3f3f3",
          padding: "20px clamp(14px, 2.4vw, 26px) 26px",
          boxShadow: "0 14px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", color: "#1f2529", fontWeight: 800 }}>
            Fresh arrivals
          </h2>
          <button style={softButton} onClick={() => navigate("/catalog")}>
            View all products
          </button>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "#57616a", padding: "24px 2px" }}>Loading products...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {products.map((p) => (
              <article
                key={p._id || p.id}
                onClick={() => navigate(`/product/${p._id || p.id}`)}
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(20, 20, 20, 0.1)",
                  background: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <img
                  src={productImage(p)}
                  alt={p.name || "Product"}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
                <div style={{ padding: "12px" }}>
                  <h3
                    style={{
                      color: "#1f2529",
                      fontSize: 15,
                      fontWeight: 700,
                      marginBottom: 6,
                      minHeight: 36,
                    }}
                  >
                    {p.name || "Fresh Produce"}
                  </h3>
                  <div style={{ color: "#2f3a41", fontSize: 14, fontWeight: 700 }}>
                    Rs. {p.price ?? "--"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>
        {`
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-7px); }
          }
        `}
      </style>
    </div>
  );
}
