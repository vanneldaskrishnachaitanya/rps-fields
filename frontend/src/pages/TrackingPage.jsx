import { useParams, useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function TrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { authFetch } = useAuth();
  const tk = TK(dark);
  const A = { text: tk.text, textMid: tk.textMid, textLt: tk.textLt, bg: tk.bg, bgCard: tk.bgCard, border: tk.border, green: "#10b981", orange: "#f59e0b", red: "#ef4444" };

  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const formatDateTime = (value) => {
    if (!value) return "Pending";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Pending";
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const fetchTracking = useCallback(async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await authFetch(`/orders/${orderId}/track`);
      if (data.success) setTracking(data.tracking);
      else throw new Error(data.error || "Failed to fetch tracking");
    } catch (err) {
      setError(err.message);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, [authFetch, orderId]);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(() => fetchTracking(true), 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchTracking]);

  if (loading) return <div style={{ background: tk.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: tk.textMid }}>Loading tracking...</div>;

  if (error) return (
    <div style={{ background: tk.bg, minHeight: "100vh", padding: "20px", color: tk.text }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, background: tk.bgCard, borderRadius: 16, border: `1px solid ${A.red}` }}>
        <div style={{ color: A.red, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Error</div>
        <p style={{ color: tk.textMid }}>{error}</p>
        <button data-magnetic onClick={() => navigate("/orders")} style={{ marginTop: 16, padding: "10px 20px", background: tk.bgMuted, border: `1px solid ${tk.border}`, borderRadius: 8, cursor: "pointer", color: tk.text, fontFamily: "'Inter',sans-serif" }}>Back to Orders</button>
      </div>
    </div>
  );

  if (!tracking) return <div style={{ background: tk.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: tk.textMid }}>No tracking data</div>;

  const { timeline, progressPercentage, estimatedDeliveryTime, actualDeliveryTime, deliveryStatus, otpVerified } = tracking;
  const safeEstimatedDelivery = formatDateTime(estimatedDeliveryTime);

  return (
    <div style={{ background: tk.bg, minHeight: "100vh", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", justifyContent: "flex-start" }}>
        <button data-magnetic onClick={() => navigate("/orders")} style={{ padding: "10px 18px", background: "rgba(59,130,246,0.12)", border: `1px solid rgba(59,130,246,0.35)`, color: "#60a5fa", borderRadius: 12, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>← Back to Orders</button>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 800, margin: "0 auto", marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: tk.text, marginBottom: 8 }}>Order Tracking</h1>
        <p style={{ color: tk.textMid }}>Real-time delivery status for Order #{orderId?.slice(-8)}</p>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: 800, margin: "0 auto", marginBottom: 40, background: tk.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${tk.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, color: tk.textMid, marginBottom: 4 }}>Delivery Progress</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: tk.text }}>{Math.round(progressPercentage)}%</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: tk.textMid, marginBottom: 4 }}>Status</div>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 12px", background: deliveryStatus === "delivered" ? "rgba(16,185,129,0.1)" : deliveryStatus === "out_for_delivery" ? "rgba(59,130,246,0.1)" : "rgba(249,115,22,0.1)", borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: deliveryStatus === "delivered" ? A.green : deliveryStatus === "out_for_delivery" ? "#3b82f6" : A.orange, textTransform: "capitalize" }}>● {deliveryStatus?.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", height: 8, background: tk.bgMuted, borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ width: `${Math.min(100, progressPercentage)}%`, height: "100%", background: deliveryStatus === "delivered" ? A.green : deliveryStatus === "out_for_delivery" ? "#3b82f6" : A.orange, transition: "width 0.3s" }} />
        </div>

        {/* Estimated Delivery */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: tk.textMid, marginBottom: 4 }}>Estimated Delivery</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: tk.text }}>
              {safeEstimatedDelivery}
            </div>
          </div>
          {actualDeliveryTime && (
            <div>
              <div style={{ fontSize: 12, color: tk.textMid, marginBottom: 4 }}>Delivered At</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: A.green }}>
                {formatDateTime(actualDeliveryTime)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: tk.text, marginBottom: 24 }}>Delivery Timeline</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {timeline.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 16, marginBottom: idx === timeline.length - 1 ? 0 : 24, position: "relative" }}>
              {/* Vertical Line */}
              {idx < timeline.length - 1 && (
                <div style={{ position: "absolute", left: 20, top: 40, width: 2, height: 24, background: item.status === "completed" ? A.green : tk.bgMuted }} />
              )}

              {/* Circle */}
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: item.status === "completed" ? A.green : item.status === "pending" ? tk.bgMuted : A.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                <span style={{ color: item.status === "completed" ? "#fff" : item.status === "pending" ? tk.textMid : "#fff", fontSize: 20 }}>
                  {item.status === "completed" ? "✓" : item.step}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tk.text, marginBottom: 4 }}>{item.name}</div>
                {item.time && (
                  <div style={{ fontSize: 12, color: tk.textMid }}>
                    {formatDateTime(item.time)}
                  </div>
                )}
                <div style={{ fontSize: 12, color: item.status === "completed" ? A.green : item.status === "pending" ? tk.textMid : A.orange, fontWeight: 600, marginTop: 4, textTransform: "capitalize" }}>
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OTP Section */}
      {deliveryStatus === "out_for_delivery" && !otpVerified && (
        <div style={{ maxWidth: 800, margin: "40px auto 0", background: tk.bgCard, borderRadius: 16, padding: 24, border: `2px solid ${A.orange}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: tk.text, marginBottom: 12 }}>⚠️ Delivery OTP</div>
          <p style={{ color: tk.textMid, marginBottom: 16, fontSize: 13, lineHeight: 1.5 }}>
            Your delivery is on the way! Share your OTP with the delivery boy when they arrive. The delivery will be confirmed only after OTP verification.
          </p>
          <div style={{ background: tk.bgMuted, padding: 16, borderRadius: 12, textAlign: "center", border: `1px solid ${tk.border}` }}>
            <div style={{ fontSize: 12, color: tk.textMid, marginBottom: 8 }}>Your OTP</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: A.orange, letterSpacing: 4, fontFamily: "monospace" }}>
              {tracking.deliveryOTP ? tracking.deliveryOTP.toString().split("").join(" ") : "****"}
            </div>
            <div style={{ fontSize: 12, color: tk.textMid, marginTop: 12 }}>Do not share this with anyone else</div>
          </div>
        </div>
      )}

      {/* Delivered Badge */}
      {deliveryStatus === "delivered" && (
        <div style={{ maxWidth: 800, margin: "40px auto 0", background: "rgba(16,185,129,0.1)", borderRadius: 16, padding: 24, border: `2px solid ${A.green}`, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: A.green, marginBottom: 8 }}>Order Delivered!</div>
          <p style={{ color: tk.textMid }}>Thank you for your purchase. We hope you enjoy your fresh produce!</p>
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", textAlign: "center" }}>
        <button data-magnetic onClick={() => fetchTracking(true)} disabled={refreshing} style={{ padding: "10px 20px", background: "rgba(59,130,246,0.1)", border: `1px solid #3b82f6`, color: "#3b82f6", borderRadius: 8, cursor: refreshing ? "not-allowed" : "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, opacity: refreshing ? 0.7 : 1 }}>
          {refreshing ? "Refreshing..." : "🔄 Refresh Tracking"}
        </button>
      </div>
    </div>
  );
}
