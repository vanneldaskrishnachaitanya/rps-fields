import { useState, useEffect } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth, API_BASE } from "../context/AuthContext";
import RateProductModal from "./RateProductModal";

export default function RatingsSection({ productId, orderId, orderItem }) {
  const { dark } = useTheme(); const tk = TK(dark);
  const { user } = useAuth();
  const [ratings, setRatings]     = useState([]);
  const [avg, setAvg]             = useState(0);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    fetch(`${API_BASE}/ratings/product/${productId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setRatings(d.ratings || []);
          setAvg(d.avgRating || 0);
          setTotal(d.totalRatings || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const stars = n => "★".repeat(Math.max(0, n)) + "☆".repeat(Math.max(0, 5 - n));

  const alreadyRated = user && ratings.some(r =>
    (r.customerId?._id || r.customerId?.id || r.customerId?.toString()) === (user._id || user.id)
  );

  if (loading) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: tk.text, margin: 0 }}>
          Customer Reviews
          {total > 0 && <span style={{ fontSize: 14, color: tk.textMid, fontWeight: 400, marginLeft: 8 }}>({total})</span>}
        </h3>
        {/* Show rate button only if customer has ordered this product */}
        {user?.role === "customer" && orderId && !alreadyRated && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "8px 18px", background: "linear-gradient(135deg,#f59e0b,#d97706)",
              color: "#fff", border: "none", borderRadius: 10, cursor: "pointer",
              fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            }}
          >
            ⭐ Write a Review
          </button>
        )}
      </div>

      {/* Average rating summary */}
      {total > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
          padding: "16px 20px", background: tk.bgMuted, borderRadius: 12,
          border: `1px solid ${tk.border}`,
        }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#f59e0b" }}>{avg.toFixed(1)}</div>
          <div>
            <div style={{ fontSize: 22, color: "#f59e0b", letterSpacing: 2 }}>{stars(Math.round(avg))}</div>
            <div style={{ fontSize: 12, color: tk.textLt, marginTop: 2 }}>
              Average of {total} rating{total !== 1 ? "s" : ""}
            </div>
          </div>
          {/* Bar chart */}
          <div style={{ flex: 1, maxWidth: 200 }}>
            {[5, 4, 3, 2, 1].map(n => {
              const count = ratings.filter(r => r.stars === n).length;
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: tk.textLt, width: 8 }}>{n}</span>
                  <span style={{ color: "#f59e0b", fontSize: 11 }}>★</span>
                  <div style={{ flex: 1, background: tk.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "#f59e0b", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, color: tk.textLt, width: 24, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review list */}
      {ratings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px 20px", color: tk.textLt, fontSize: 14, background: tk.bgMuted, borderRadius: 12, border: `1px solid ${tk.border}` }}>
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        ratings.map(r => (
          <div key={r._id || r.id} style={{ background: tk.bgCard, borderRadius: 12, padding: 18, marginBottom: 12, border: `1px solid ${tk.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 700, color: tk.text, fontSize: 14 }}>
                  {r.customerId?.fullName || r.customerId?.name || "Customer"}
                </span>
                <span style={{ marginLeft: 10, color: "#f59e0b", letterSpacing: 1 }}>{stars(r.stars)}</span>
              </div>
              <span style={{ fontSize: 12, color: tk.textLt }}>
                {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            {r.review && (
              <p style={{ fontSize: 14, color: tk.textMid, margin: 0, lineHeight: 1.65 }}>{r.review}</p>
            )}
          </div>
        ))
      )}

      {/* Rate modal */}
      {showModal && orderItem && orderId && (
        <RateProductModal
          item={orderItem}
          orderId={orderId}
          onClose={() => setShowModal(false)}
          onDone={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}
