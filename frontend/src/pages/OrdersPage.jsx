import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    authFetch("/orders")
      .then(d => { if (d.success) setOrders(d.orders); else setError(d.error); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "44px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 34, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 6 }}>📦 My Orders</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>Track all your farm fresh orders</p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px" }}>
        {error && <div style={{ background: "#fff0f0", border: "1px solid #e74c3c", borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#c0392b" }}>⚠ {error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: tk.textLt }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: tk.bgCard, borderRadius: 20, border: `1px solid ${tk.border}` }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h3 style={{ color: tk.text, marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: tk.textLt, marginBottom: 24 }}>Your orders will appear here after checkout.</p>
            <button onClick={() => navigate("/catalog")}
              style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "12px 26px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
              Browse Catalog
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[...orders].reverse().map(ord => (
              <div key={ord.id} style={{ background: tk.bgCard, borderRadius: 16, overflow: "hidden", boxShadow: tk.shadow, border: `1px solid ${tk.border}` }}>
                {/* Order header */}
                <div style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{ord.id}</div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>
                      Placed: {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ background: "#d4edda", color: "#155724", borderRadius: 20, padding: "5px 14px", fontWeight: 700, fontSize: 12, display: "inline-block", marginBottom: 4 }}>
                      ✓ {ord.status}
                    </span>
                    <div style={{ color: "#74c69d", fontWeight: 800, fontSize: 20 }}>₹{ord.total}</div>
                  </div>
                </div>

                {/* Order items */}
                <div style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                    {ord.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: tk.bgMuted, borderRadius: 10, padding: "8px 12px", border: `1px solid ${tk.border}` }}>
                        {item.img && (
                          <img src={item.img} alt={item.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} onError={e => e.target.style.display = "none"} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: tk.text }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: tk.textLt }}>{item.qty} kg × ₹{item.price} = <strong>₹{item.qty * item.price}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery info */}
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: tk.textMid, borderTop: `1px solid ${tk.border}`, paddingTop: 12, flexWrap: "wrap" }}>
                    <span>📍 {ord.address}, {ord.city}</span>
                    <span>📞 {ord.phone}</span>
                    <span>🚚 Est. Delivery: {new Date(ord.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
