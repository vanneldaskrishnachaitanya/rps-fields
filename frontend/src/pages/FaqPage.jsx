import { useState } from "react";
import { useTheme, TK } from "../context/ThemeContext";

const FAQS = [
  { q: "How does RPS Fields work?", a: "RPS Fields connects verified farmers directly with customers. Farmers list their produce, customers browse and order, and products are delivered fresh within 24 hours — with no middlemen involved." },
  { q: "Are all farmers verified?", a: "Yes. Every farmer on the platform goes through a verification process including farm location, produce quality checks, and phone verification before their listings go live." },
  { q: "How fresh is the produce?", a: "All produce is harvested within 24–48 hours of your order. Farmers are notified immediately after you place an order and prepare your items fresh for dispatch." },
  { q: "What payment methods are accepted?", a: "We currently accept Cash on Delivery (COD). Online payment (UPI, cards, net banking) support is coming soon." },
  { q: "Can I return or get a refund?", a: "Yes. If you receive produce that doesn't meet our freshness guarantee, contact us within 24 hours of delivery. We offer full refunds or replacement for eligible claims." },
  { q: "How do I become a seller?", a: "Click 'Register' and choose 'I'm a Farmer'. Fill in your details and farm information. Our team reviews applications within 1–2 business days." },
  { q: "Is there a minimum order value?", a: "There's no minimum order value. However, orders above ₹500 qualify for free delivery." },
  { q: "Which cities do you deliver to?", a: "We currently deliver across major Indian cities. Enter your pincode during checkout to check availability in your area." },
  { q: "How do I track my order?", a: "After placing an order, visit My Orders under your account to see order status and estimated delivery time." },
  { q: "Can I cancel an order?", a: "Orders can be cancelled within 1 hour of placing them. After that, since produce is already being prepared, cancellations may not always be possible." },
];

export default function FaqPage() {
  const { dark } = useTheme();
  const tk = TK(dark);
  const [open, setOpen] = useState(null);

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#1b4332,#40916c)", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 38, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 10 }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
          Everything you need to know about RPS Fields
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 20px" }}>
        {FAQS.map((faq, i) => (
          <div key={i} onClick={() => setOpen(open === i ? null : i)}
            style={{ background: tk.bgCard, borderRadius: 14, padding: "20px 24px", marginBottom: 12, cursor: "pointer", border: `1px solid ${open === i ? tk.green6 : tk.border}`, boxShadow: open === i ? tk.shadow : "none", transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: tk.text }}>{faq.q}</span>
              <span style={{ fontSize: 20, color: tk.green7, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
            </div>
            {open === i && (
              <p style={{ color: tk.textMid, fontSize: 14, lineHeight: 1.75, margin: "14px 0 0", borderTop: `1px solid ${tk.border}`, paddingTop: 14 }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}

        {/* Still have questions */}
        <div style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f)", borderRadius: 20, padding: 36, textAlign: "center", marginTop: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
          <h3 style={{ color: "#fff", fontSize: 20, fontFamily: "'Playfair Display',Georgia,serif", marginBottom: 8 }}>
            Still have questions?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.72)", marginBottom: 20, fontSize: 14 }}>
            Our support team is available Mon–Sat, 9am–6pm IST
          </p>
          <a href="/contact" style={{ background: "linear-gradient(135deg,#d4a017,#c49010)", color: "#1b4332", padding: "12px 28px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", display: "inline-block" }}>
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}
