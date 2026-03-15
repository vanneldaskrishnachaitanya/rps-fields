import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import RateProductModal from "../components/RateProductModal";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [rateModal, setRateModal] = useState(null); // { item, orderId }

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    authFetch("/orders")
      .then(d => { if (d.success) setOrders(d.orders || []); })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const statusColor = s => s==="delivered"?"#155724":s==="cancelled"?"#721c24":"#0c5460";
  const statusBg    = s => s==="delivered"?"#d4edda":s==="cancelled"?"#f8d7da":"#d1ecf1";

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "44px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 34, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 6 }}>📦 My Orders</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>Track your farm fresh orders</p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: tk.textLt }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div><p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: tk.bgCard, borderRadius: 20, border: `1px solid ${tk.border}` }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h2 style={{ color: tk.text, marginBottom: 8 }}>No orders yet</h2>
            <p style={{ color: tk.textLt, marginBottom: 24 }}>Browse the catalog to start shopping.</p>
            <button onClick={() => navigate("/catalog")} style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
              Browse Catalog
            </button>
          </div>
        ) : (
          orders.map(ord => {
            const ordId = ord._id || ord.id;
            return (
              <div key={ordId} style={{ background: tk.bgCard, borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: tk.shadow, border: `1px solid ${tk.border}` }}>
                {/* Order header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: tk.text, marginBottom: 4 }}>
                      Order #{ordId?.toString().slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: tk.textLt }}>
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ background: statusBg(ord.status), color: statusColor(ord.status), borderRadius: 20, padding: "4px 14px", fontWeight: 700, fontSize: 12, display: "block", marginBottom: 4 }}>
                      ✓ {ord.status}
                    </span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: tk.green7 }}>
                      ₹{ord.totalPrice || ord.total}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {(ord.items || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: tk.bgMuted, borderRadius: 10, border: `1px solid ${tk.border}` }}>
                      {(item.image || item.img) && (
                        <img src={item.image || item.img} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: tk.text, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: tk.textMid }}>
                          {item.quantity || item.qty} kg × ₹{item.pricePerKg || item.price} = ₹{item.totalPrice || (item.pricePerKg || item.price) * (item.quantity || item.qty)}
                        </div>
                      </div>
                      {/* Rate button — only for delivered orders */}
                      {ord.status === "delivered" && (
                        <button
                          onClick={() => setRateModal({ item: { ...item, productId: item.productId || item.id }, orderId: ordId })}
                          style={{ padding: "5px 12px", background: "transparent", border: "1px solid #f59e0b", color: "#d97706", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", flexShrink: 0 }}
                        >
                          ⭐ Rate
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Delivery info */}
                <div style={{ fontSize: 12, color: tk.textLt, paddingTop: 12, borderTop: `1px solid ${tk.border}` }}>
                  📍 {ord.deliveryAddress || ord.address}, {ord.city} · 📞 {ord.phone}
                  {ord.status === "confirmed" && (
                    <span style={{ marginLeft: 14, color: tk.green7 }}>🕐 Estimated delivery: ~24 hours</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rating modal */}
      {rateModal && (
        <RateProductModal
          item={rateModal.item}
          orderId={rateModal.orderId}
          onClose={() => setRateModal(null)}
          onDone={() => setRateModal(null)}
        />
      )}
    </div>
  );
}
