import { useState } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function DeliveryVerificationModal({ order, onClose, onSuccess }) {
  const { dark } = useTheme();
  const { authFetch } = useAuth();
  const tk = TK(dark);
  const A = { text: tk.text, textMid: tk.textMid, textLt: tk.textLt, green: "#10b981", red: "#ef4444", orange: "#f59e0b" };

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await authFetch(`/orders/${order.id}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otp.trim() }),
      });
      if (data.success) {
        onSuccess(data.order);
        onClose();
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: tk.bgCard, borderRadius: 20, padding: 32, maxWidth: 420, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: `1px solid ${tk.border}` }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: tk.text, margin: 0 }}>Verify Delivery OTP</h2>
          <button data-magnetic onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: tk.textMid, padding: 0 }}>×</button>
        </div>

        {/* Order Info */}
        <div style={{ background: tk.bgMuted, borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: tk.textMid, marginBottom: 4 }}>Order ID</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: tk.text }}>{order.id?.slice(-8)}</div>
          <div style={{ fontSize: 12, color: tk.textMid, marginTop: 12, marginBottom: 4 }}>Delivery Address</div>
          <div style={{ fontSize: 13, color: tk.text }}>{order.deliveryAddress}</div>
        </div>

        {/* Instructions */}
        <div style={{ background: "rgba(249,115,22,0.1)", borderRadius: 12, padding: 16, marginBottom: 24, border: `1px solid rgba(249,115,22,0.3)` }}>
          <div style={{ fontSize: 12, color: tk.textMid, lineHeight: 1.5 }}>
            📱 <strong>Ask the customer for their OTP</strong> and enter it below to complete delivery verification.
          </div>
        </div>

        {/* OTP Input */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: tk.text, marginBottom: 8 }}>Customer's OTP</label>
          <input
            type="text"
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
              if (error) setError("");
            }}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 4,
              textAlign: "center",
              fontFamily: "monospace",
              border: `2px solid ${tk.border}`,
              borderRadius: 10,
              background: tk.bg,
              color: tk.text,
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = tk.border)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${A.red}`, borderRadius: 8, padding: 12, marginBottom: 20, color: A.red, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button data-magnetic onClick={onClose} disabled={loading} style={{ flex: 1, padding: 12, background: "transparent", border: `1.5px solid ${tk.border}`, color: tk.textMid, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif", opacity: loading ? 0.5 : 1 }}>
            Cancel
          </button>
          <button data-magnetic onClick={handleVerify} disabled={loading || !otp} style={{ flex: 1, padding: 12, background: "rgba(16,185,129,0.28)", border: "1px solid rgba(16,185,129,0.5)", color: "#fff", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif", opacity: loading || !otp ? 0.6 : 1 }}>
            {loading ? "Verifying..." : "✓ Verify & Deliver"}
          </button>
        </div>
      </div>
    </div>
  );
}
