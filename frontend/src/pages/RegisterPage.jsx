import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

const OPTIONS = [
  {
    icon: "🛒",
    title: "I'm a Customer",
    desc: "Buy fresh produce directly from verified farmers. Get farm-fresh quality delivered to your door.",
    btn: "Register as Customer",
    path: "/register/customer",
    color: "#40916c",
    badge: null,
  },
  {
    icon: "🌾",
    title: "I'm a Farmer",
    desc: "List your produce and connect with thousands of customers. Sell directly, earn more, no middlemen.",
    btn: "Register as Farmer",
    path: "/register/farmer",
    color: "#2d6a4f",
    badge: null,
  },
  {
    icon: "🛡",
    title: "Admin Access",
    desc: "Manage users, products, and orders across the entire RPS Fields platform.",
    btn: "Go to Admin Login",
    path: "/admin/login",
    color: "#1a3a5c",
    badge: "Staff Only",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);

  return (
    <div style={{ background: tk.bg, minHeight: "100%", padding: "60px 20px", textAlign: "center" }}>
      {/* Header */}
      <div style={{ marginBottom: 52 }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🌿</div>
        <h1 style={{ fontSize: 36, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, marginBottom: 10 }}>
          Join RPS Fields
        </h1>
        <p style={{ color: tk.textLt, fontSize: 15, maxWidth: 420, margin: "0 auto" }}>
          Choose how you'd like to use the platform
        </p>
      </div>

      {/* Option cards */}
      <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", maxWidth: 1050, margin: "0 auto" }}>
        {OPTIONS.map((opt) => (
          <div
            key={opt.title}
            onClick={() => navigate(opt.path)}
            style={{
              background: tk.bgCard,
              borderRadius: 20,
              padding: "36px 32px",
              width: 290,
              boxShadow: tk.shadowLg,
              border: `2px solid ${opt.color}40`,
              transition: "transform 0.22s, box-shadow 0.22s",
              cursor: "pointer",
              position: "relative",
              textAlign: "center",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = `0 16px 40px ${opt.color}30`;
              e.currentTarget.style.borderColor = opt.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = tk.shadowLg;
              e.currentTarget.style.borderColor = `${opt.color}40`;
            }}
          >
            {/* Staff badge */}
            {opt.badge && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: "#1a3a5c", color: "#7eb8f7", borderRadius: 20,
                padding: "3px 14px", fontSize: 10, fontWeight: 800,
                letterSpacing: "1.5px", textTransform: "uppercase",
                border: "1px solid #2a5a8c",
              }}>
                {opt.badge}
              </div>
            )}

            {/* Icon */}
            <div style={{ fontSize: 58, marginBottom: 16 }}>{opt.icon}</div>

            {/* Title */}
            <h3 style={{ fontSize: 20, fontWeight: 800, color: tk.text, marginBottom: 10 }}>
              {opt.title}
            </h3>

            {/* Description */}
            <p style={{ color: tk.textLt, fontSize: 14, lineHeight: 1.7, marginBottom: 28, minHeight: 66 }}>
              {opt.desc}
            </p>

            {/* Button */}
            <button
              onClick={e => { e.stopPropagation(); navigate(opt.path); }}
              style={{
                background: `linear-gradient(135deg, ${opt.color}, ${opt.color}cc)`,
                color: "#fff",
                border: "none",
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "inherit",
                boxShadow: `0 4px 14px ${opt.color}40`,
                transition: "opacity 0.2s",
              }}
            >
              {opt.btn} →
            </button>
          </div>
        ))}
      </div>

      {/* Already have account */}
      <p style={{ marginTop: 44, fontSize: 14, color: tk.textLt }}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ color: tk.green7, cursor: "pointer", fontWeight: 700 }}>
          Login here
        </span>
      </p>
    </div>
  );
}
