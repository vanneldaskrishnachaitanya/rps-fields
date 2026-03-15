import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

// ── About Page ────────────────────────────────────────────────────────────────
export function AboutPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 38, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 10 }}>
          About RPS Fields
        </h1>
        <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
          Bridging the gap between Indian farmers and consumers since 2023
        </p>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 20px" }}>
        <div style={{ background: tk.bgCard, borderRadius: 20, padding: 40, boxShadow: tk.shadow, border: `1px solid ${tk.border}`, marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, marginBottom: 14 }}>
            🌱 Our Mission
          </h2>
          <p style={{ color: tk.textMid, lineHeight: 1.85, fontSize: 15 }}>
            RPS Fields was created to eliminate the lengthy supply chain between Indian farmers and end consumers.
            By connecting them directly, we ensure farmers receive fairer prices while consumers get fresher,
            more nutritious produce at better rates — a genuine win for everyone in the chain.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          {[
            ["🌾", "For Farmers", ["List unlimited products", "Set your own prices", "Access thousands of customers", "Weekly payment settlements"]],
            ["🛒", "For Customers", ["Farm-fresh quality guaranteed", "Direct pricing, no markup", "Know your farmer personally", "Seasonal & organic options"]],
          ].map(([icon, title, points]) => (
            <div key={title} style={{ background: tk.bgCard, borderRadius: 16, padding: 26, boxShadow: tk.shadow, border: `1px solid ${tk.border}` }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: tk.text, marginBottom: 12 }}>{title}</h3>
              {points.map((pt) => (
                <div key={pt} style={{ fontSize: 13, color: tk.textMid, marginBottom: 8, display: "flex", gap: 8 }}>
                  <span style={{ color: "#52b788", flexShrink: 0 }}>✓</span>
                  {pt}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f)", borderRadius: 20, padding: 36, color: "#fff", textAlign: "center" }}>
          <h3 style={{ fontSize: 22, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 20 }}>Our Impact</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[["500+", "Farmers"], ["12k+", "Customers"], ["₹2Cr+", "Farmer Earnings"], ["15+", "States"]].map(([n, l]) => (
              <div key={l}><div style={{ fontSize: 26, fontWeight: 800 }}>{n}</div><div style={{ fontSize: 11, opacity: 0.75 }}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Contact Page ──────────────────────────────────────────────────────────────
export function ContactPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${tk.border}`, background: tk.bgInput, color: tk.text,
    fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 34, fontFamily: "'Playfair Display',Georgia,serif" }}>📬 Contact Us</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>We'd love to hear from you</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 36 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: tk.text, marginBottom: 20 }}>Get in Touch</h3>
            {[
              ["📧", "Email", "support@rpsfields.in"],
              ["📞", "Phone", "+91 98765 43210"],
              ["📍", "Address", "Pune, Maharashtra, India"],
              ["🕘", "Hours", "Mon–Sat, 9am–6pm IST"],
            ].map(([icon, label, value]) => (
              <div key={label} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: tk.text, marginBottom: 2 }}>{label}</div>
                  <div style={{ color: tk.textLt, fontSize: 14 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 64, marginBottom: 14 }}>✅</div>
              <h3 style={{ fontSize: 22, color: tk.text, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: tk.textLt, marginBottom: 20 }}>We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "11px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
                Send Another
              </button>
            </div>
          ) : (
            <div style={{ background: tk.bgCard, borderRadius: 20, padding: 32, boxShadow: tk.shadow, border: `1px solid ${tk.border}` }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: tk.text, marginBottom: 20 }}>Send a Message</h3>
              {[["name", "Name", "text", "Your full name"], ["email", "Email", "email", "you@email.com"], ["subject", "Subject", "text", "How can we help?"]].map(([k, l, t, ph]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: tk.textMid, marginBottom: 5, textTransform: "uppercase" }}>{l}</label>
                  <input type={t} style={inp} placeholder={ph} value={form[k]} onChange={set(k)} />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: tk.textMid, marginBottom: 5, textTransform: "uppercase" }}>Message</label>
                <textarea style={{ ...inp, minHeight: 110, resize: "vertical" }} placeholder="Your message..." value={form.message} onChange={set("message")} />
              </div>
              <button
                onClick={() => form.name && form.email && form.message && setSent(true)}
                style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", width: "100%", padding: 13, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15, fontFamily: "inherit" }}
              >
                Send Message →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Privacy Policy Page ───────────────────────────────────────────────────────
export function PrivacyPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  return (
    <StaticPage title="Privacy Policy" emoji="🔒" tk={tk}>
      <h3 style={{ color: tk.text, marginBottom: 10 }}>Last Updated: January 1, 2025</h3>
      <p style={{ marginBottom: 16 }}>RPS Fields ("we", "our", "us") is committed to protecting your personal information. This policy describes what data we collect and how we use it.</p>
      <h4 style={{ color: tk.text, marginBottom: 8, marginTop: 20 }}>Information We Collect</h4>
      <p style={{ marginBottom: 16 }}>We collect information you provide when creating an account, making purchases, or contacting us — including name, email, phone, and delivery address. We also collect usage data to improve our platform.</p>
      <h4 style={{ color: tk.text, marginBottom: 8, marginTop: 20 }}>How We Use It</h4>
      <p style={{ marginBottom: 16 }}>Your data is used to process orders, personalize your experience, and communicate about your account. We do not sell your personal data to third parties under any circumstances.</p>
      <h4 style={{ color: tk.text, marginBottom: 8, marginTop: 20 }}>Contact</h4>
      <p>For privacy concerns, email us at <strong>privacy@rpsfields.in</strong></p>
    </StaticPage>
  );
}

// ── Terms of Service Page ─────────────────────────────────────────────────────
export function TermsPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  return (
    <StaticPage title="Terms of Service" emoji="📄" tk={tk}>
      <h3 style={{ color: tk.text, marginBottom: 10 }}>Last Updated: January 1, 2025</h3>
      <p style={{ marginBottom: 16 }}>By using RPS Fields, you agree to these terms. Our platform connects farmers and customers for the direct purchase of agricultural products.</p>
      <h4 style={{ color: tk.text, marginBottom: 8, marginTop: 20 }}>User Responsibilities</h4>
      <p style={{ marginBottom: 16 }}>Users must provide accurate information, not misuse the platform, and comply with all applicable laws. Farmers are responsible for product quality and the accuracy of their listings.</p>
      <h4 style={{ color: tk.text, marginBottom: 8, marginTop: 20 }}>Payments & Refunds</h4>
      <p style={{ marginBottom: 16 }}>All transactions are handled securely. Refunds are processed within 5–7 business days for eligible claims under our freshness guarantee policy.</p>
      <h4 style={{ color: tk.text, marginBottom: 8, marginTop: 20 }}>Contact</h4>
      <p>Questions? Email <strong>legal@rpsfields.in</strong></p>
    </StaticPage>
  );
}

// ── Shared static page layout ─────────────────────────────────────────────────
function StaticPage({ title, emoji, children, tk }) {
  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 34, fontFamily: "'Playfair Display',Georgia,serif" }}>
          {emoji} {title}
        </h1>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "50px 20px" }}>
        <div style={{ background: tk.bgCard, borderRadius: 20, padding: 40, boxShadow: tk.shadow, border: `1px solid ${tk.border}`, color: tk.textMid, lineHeight: 1.9, fontSize: 15 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── 404 Not Found Page ────────────────────────────────────────────────────────
export function NotFoundPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  const navigate = useNavigate();
  return (
    <div style={{ background: tk.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", minHeight: "100%" }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🌿</div>
      <h2 style={{ fontSize: 30, color: tk.text, marginBottom: 8 }}>Page Not Found</h2>
      <p style={{ color: tk.textLt, marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "12px 26px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}
      >
        Back to Home
      </button>
    </div>
  );
}
