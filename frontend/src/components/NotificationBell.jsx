import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const typeIcon = (type) => type === "placed" ? "🎉" : type === "delivery" ? "🚚" : "✅";
  const typeColor = (type) => type === "placed" ? "#52b788" : type === "delivery" ? "#3b82f6" : "#10b981";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s", position: "relative",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#ef4444", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: 10, fontWeight: 800, display: "flex",
            alignItems: "center", justifyContent: "center",
            border: "2px solid rgba(3,10,5,0.9)",
            fontFamily: "'Inter',sans-serif",
            animation: "pulse 2s infinite",
          }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="anim-slide-down" style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 340, maxHeight: 420, overflowY: "auto",
          background: "rgba(4,13,6,0.97)",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          borderRadius: 16,
          border: "1px solid rgba(82,183,136,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          zIndex: 3000,
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Inter',sans-serif" }}>Notifications</span>
            {notifications.length > 0 && (
              <button onClick={clearAll} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Clear all</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "'Inter',sans-serif" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
              No notifications yet
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id}
                onClick={() => { if (n.orderId) { navigate(`/orders/${n.orderId}/track`); setOpen(false); } }}
                style={{
                  padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: n.orderId ? "pointer" : "default",
                  background: n.read ? "transparent" : "rgba(82,183,136,0.05)",
                  transition: "background 0.2s",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgba(82,183,136,0.05)"}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${typeColor(n.type)}22`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>{typeIcon(n.type)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: typeColor(n.type), fontWeight: 700, fontSize: 12, marginBottom: 2, fontFamily: "'Inter',sans-serif" }}>{n.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.45, fontFamily: "'Inter',sans-serif" }}>{n.message}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 4, fontFamily: "'Inter',sans-serif" }}>
                    {n.time?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
