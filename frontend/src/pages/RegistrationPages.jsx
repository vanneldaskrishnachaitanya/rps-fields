import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import { useForm } from "../hooks/useForm";

const INITIAL = {
  username: "", fullName: "", email: "", phone: "",
  password: "", confirmPassword: "", address: "", city: "",
};

function RegistrationForm({ type }) {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);
  const { register } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const form = useForm(INITIAL);
  const isFarmer = type === "farmer";

  const handleSubmit = async () => {
    if (!form.validate()) return;
    setLoading(true);
    setApiError("");
    try {
      await register({ ...form.values, role: type });
      setSuccess(true);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ background: tk.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>{isFarmer ? "🌾" : "🎉"}</div>
      <h2 style={{ fontSize: 28, color: tk.text, marginBottom: 8 }}>
        {isFarmer ? "Welcome, Farmer!" : "Welcome to RPS Fields!"}
      </h2>
      <p style={{ color: tk.textLt, marginBottom: 24 }}>
        {isFarmer ? "Your farmer account is ready. Start listing your produce!" : "Account created! Start shopping fresh produce."}
      </p>
      <button
        onClick={() => navigate(isFarmer ? "/farmer/dashboard" : "/catalog")}
        style={{ background: "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 15, fontFamily: "inherit" }}>
        {isFarmer ? "Go to Farm Dashboard →" : "Start Shopping →"}
      </button>
    </div>
  );

  return (
    <div style={{ background: tk.bg, minHeight: "100%", padding: "50px 20px" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", background: tk.bgCard, borderRadius: 20, padding: 40, boxShadow: tk.shadowLg, border: `${isFarmer ? "2px" : "1px"} solid ${isFarmer ? "#52b788" : tk.border}` }}>
        <div style={{ textAlign: "center", fontSize: 46, marginBottom: 12 }}>{isFarmer ? "🌾" : "🛒"}</div>
        <h2 style={{ fontSize: 24, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, textAlign: "center", marginBottom: 4 }}>
          {isFarmer ? "Farmer Registration" : "Customer Registration"}
        </h2>
        <p style={{ color: tk.textLt, textAlign: "center", marginBottom: 22, fontSize: 13 }}>
          {isFarmer ? "Join and sell directly to customers" : "Create your account to buy farm produce"}
        </p>

        {isFarmer && (
          <div style={{ background: tk.bgMuted, border: `1px solid ${tk.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: tk.green7 }}>
            🌱 List unlimited products and reach thousands of direct customers.
          </div>
        )}

        {apiError && (
          <div style={{ background: "#fff0f0", border: "1px solid #e74c3c", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#c0392b", fontSize: 13, fontWeight: 600 }}>
            ⚠ {apiError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
          <FormField label="Username" name="username" placeholder="min 6 chars" form={form} />
          <FormField label="Full Name" name="fullName" placeholder="Your full name" form={form} />
        </div>
        <FormField label="Email" name="email" type="email" placeholder="you@email.com" form={form} />
        <FormField label="Phone Number" name="phone" placeholder="10-digit number" form={form} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
          <FormField label="Password" name="password" type="password" placeholder="Min 6 chars" form={form} />
          <FormField label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat" form={form} />
        </div>
        <FormField label={isFarmer ? "Farm Address" : "Address"} name="address" placeholder={isFarmer ? "Village, district..." : "Street, locality..."} form={form} />
        <FormField label="City" name="city" placeholder="Your city" form={form} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: isFarmer ? "linear-gradient(135deg,#2d6a4f,#1b4332)" : "linear-gradient(135deg,#52b788,#40916c)", color: "#fff", border: "none", width: "100%", padding: 14, borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, marginTop: 6, fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Creating account..." : (isFarmer ? "Register as Farmer →" : "Create Account →")}
        </button>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: tk.textLt }}>
          {isFarmer ? "Customer? " : "Farmer? "}
          <span
            onClick={() => navigate(isFarmer ? "/register/customer" : "/register/farmer")}
            style={{ color: tk.green7, cursor: "pointer", fontWeight: 700 }}>
            {isFarmer ? "Register as Customer" : "Register as Farmer"}
          </span>
        </p>
      </div>
    </div>
  );
}

export function CustomerRegPage() { return <RegistrationForm type="customer" />; }
export function FarmerRegPage() { return <RegistrationForm type="farmer" />; }
