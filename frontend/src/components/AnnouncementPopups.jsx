import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function AnnouncementPopups() {
  const { announcements, dismissAnnouncement } = useNotifications();
  const navigate = useNavigate();

  if (!announcements.length) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 12, maxWidth: 360,
    }}>
      {announcements.map(ann => (
        <div key={ann.id} className="anim-slide-right" style={{
          background: "rgba(10,20,15,0.96)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          border: `1.5px solid ${ann.color || "#52b788"}`,
          borderRadius: 18,
          padding: "18px 20px",
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), 0 0 30px ${ann.color || "#52b788"}33`,
          display: "flex", alignItems: "flex-start", gap: 14,
          cursor: ann.orderId ? "pointer" : "default",
        }}
          onClick={() => { if (ann.orderId) { navigate(`/orders/${ann.orderId}/track`); dismissAnnouncement(ann.id); } }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${ann.color || "#52b788"}22`,
            border: `1px solid ${ann.color || "#52b788"}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>
            {ann.type === "placed" ? "🎉" : ann.type === "delivery" ? "🚚" : "✅"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: ann.color || "#52b788", fontWeight: 800, fontSize: 14, marginBottom: 4, fontFamily: "'Inter',sans-serif" }}>
              {ann.title}
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.5, fontFamily: "'Inter',sans-serif" }}>
              {ann.message}
            </div>
            {ann.orderId && (
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 6, fontFamily: "'Inter',sans-serif" }}>
                Tap to track →
              </div>
            )}
          </div>
          <button onClick={e => { e.stopPropagation(); dismissAnnouncement(ann.id); }} style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)",
            width: 24, height: 24, borderRadius: "50%", cursor: "pointer", fontSize: 12, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
          }}>✕</button>
        </div>
      ))}
    </div>
  );
}
