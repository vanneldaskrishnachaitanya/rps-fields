import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const ROLE_CONFIG = {
  customer: {
    icon: "🛒", title: "Customer Registration", color: "#40916c",
    dest: "/customer/dashboard",
    locationLabel: "City / Location",
    locationPlaceholder: "Your city",
    extraLabel: "Delivery Address (Optional)",
    extraPlaceholder: "House no, Street, Area...",
  },
  farmer: {
    icon: "🌾", title: "Farmer Registration", color: "#2d6a4f",
    dest: "/farmer/dashboard",
    locationLabel: "Village / District",
    locationPlaceholder: "e.g. Warangal, Telangana",
    extraLabel: "Type of Crops Grown (Optional)",
    extraPlaceholder: "e.g. Tomatoes, Rice, Vegetables",
  },
  agent: {
    icon: "🏢", title: "Agent Registration", color: "#1e40af",
    dest: "/agent/dashboard",
    locationLabel: "Operating District",
    locationPlaceholder: "e.g. Hyderabad, Telangana",
    extraLabel: "Agency / Shop Name (Optional)",
    extraPlaceholder: "Your shop or agency name",
  },
};

function RegistrationForm({ type }) {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { register } = useAuth();
  const cfg = ROLE_CONFIG[type] || ROLE_CONFIG.customer;

  const [form, setForm] = useState({
    fullName: "", username: "", email: "", mobile: "",
    password: "", confirmPassword: "", location: "", extra: "",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");
  const [success,  setSuccess]  = useState(false);

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => { const x = { ...er }; delete x[k]; return x; });
  };

  const validate = () => {
    const errs = {};

    if (!form.fullName.trim())
      errs.fullName = "Full name is required";
    else if (form.fullName.trim().length < 3)
      errs.fullName = "Name must be at least 3 characters";

    if (!form.username.trim())
      errs.username = "Username is required";
    else if (form.username.trim().length < 6)
      errs.username = "Username must be at least 6 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim()))
      errs.username = "Only letters, numbers and underscore allowed";

    if (!form.email.trim())
      errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Enter a valid email (e.g. name@email.com)";

    if (!form.mobile.trim())
      errs.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile.trim()))
      errs.mobile = "Mobile must be exactly 10 digits";

    if (!form.password)
      errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (!form.location.trim())
      errs.location = "Location is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name:            form.fullName.trim(),
        fullName:        form.fullName.trim(),
        username:        form.username.trim().toLowerCase(),
        email:           form.email.trim().toLowerCase(),
        mobile:          form.mobile.trim(),
        phone:           form.mobile.trim(),
        password:        form.password,
        confirmPassword: form.confirmPassword,
        location:        form.location.trim(),
        city:            form.location.trim(),
        address:         form.extra.trim() || form.location.trim(),
        role:            type,
      });
      setSuccess(true);
      setTimeout(() => navigate(cfg.dest), 1200);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = hasErr => ({
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${hasErr ? "#e74c3c" : tk.border}`,
    background: hasErr ? (dark ? "#2a1010" : "#fff0f0") : tk.bgInput,
    color: tk.text, fontSize: 14,
    boxSizing: "border-box", outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s",
  });

  const lbl = (text, required = true) => (
    <label style={{ display: "block", fontWeight: 700, fontSize: 11, color: tk.textMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" }}>
      {text}{required && <span style={{ color: "#e74c3c", marginLeft: 2 }}>*</span>}
    </label>
  );

  const errMsg = key => errors[key] && (
    <div style={{ color: "#e74c3c", fontSize: 11, marginTop: 3, fontWeight: 600 }}>⚠ {errors[key]}</div>
  );

  if (success) return (
    <div style={{ background: tk.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, color: tk.text, marginBottom: 8, fontFamily: "'Playfair Display',Georgia,serif" }}>Account Created!</h2>
      <p style={{ color: tk.textLt, marginBottom: 4 }}>Welcome, {form.fullName}!</p>
      <p style={{ color: tk.textLt, fontSize: 13 }}>Redirecting to your dashboard...</p>
    </div>
  );

  return (
    <div style={{ background: tk.bg, minHeight: "100%", padding: "50px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", background: tk.bgCard, borderRadius: 20, padding: "40px 40px 36px", boxShadow: tk.shadowLg, border: `2px solid ${cfg.color}40` }} data-tilt>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 46, marginBottom: 10 }}>{cfg.icon}</div>
          <h2 style={{ fontSize: 24, fontFamily: "'Playfair Display',Georgia,serif", color: tk.text, marginBottom: 6 }}>{cfg.title}</h2>
          <p style={{ color: tk.textLt, fontSize: 13 }}>Fill in all details to create your account</p>
        </div>

        {apiError && (
          <div style={{ background: dark ? "#2a1010" : "#fff0f0", border: "1px solid #e74c3c", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#c0392b", fontSize: 13, fontWeight: 600 }}>
            ⚠ {apiError}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>

          <div style={{ marginBottom: 14, gridColumn: "1 / -1" }}>
            {lbl("Full Name")}
            <input type="text" style={inp(!!errors.fullName)} placeholder="Your full name"
              value={form.fullName} onChange={set("fullName")} />
            {errMsg("fullName")}
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Username")}
            <input type="text" style={inp(!!errors.username)} placeholder="Min 6 characters"
              value={form.username} onChange={set("username")} />
            {errMsg("username")}
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Email")}
            <input type="email" style={inp(!!errors.email)} placeholder="you@email.com"
              value={form.email} onChange={set("email")} />
            {errMsg("email")}
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Mobile Number")}
            <input type="tel" style={inp(!!errors.mobile)} placeholder="10-digit number"
              maxLength={10}
              value={form.mobile}
              onChange={e => { if (/^\d*$/.test(e.target.value)) set("mobile")(e); }} />
            {errMsg("mobile")}
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl(cfg.locationLabel)}
            <input type="text" style={inp(!!errors.location)} placeholder={cfg.locationPlaceholder}
              value={form.location} onChange={set("location")} />
            {errMsg("location")}
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Password")}
            <input type="password" style={inp(!!errors.password)} placeholder="Min 6 characters"
              value={form.password} onChange={set("password")} />
            {errMsg("password")}
          </div>

          <div style={{ marginBottom: 14 }}>
            {lbl("Confirm Password")}
            <input type="password" style={inp(!!errors.confirmPassword)} placeholder="Repeat password"
              value={form.confirmPassword} onChange={set("confirmPassword")} />
            {errMsg("confirmPassword")}
          </div>

          <div style={{ marginBottom: 24, gridColumn: "1 / -1" }}>
            {lbl(cfg.extraLabel, false)}
            <input type="text" style={inp(false)} placeholder={cfg.extraPlaceholder}
              value={form.extra} onChange={set("extra")} />
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div style={{ background: dark ? "#2a1010" : "#fff5f5", border: "1px solid #e74c3c44", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e74c3c", marginBottom: 4 }}>Please fix the following:</div>
            {Object.values(errors).map((e, i) => <div key={i} style={{ fontSize: 12, color: "#c0392b" }}>• {e}</div>)}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{
            background: loading ? tk.border : `linear-gradient(135deg,${cfg.color},${cfg.color}bb)`,
            color: "#fff", border: "none", width: "100%", padding: 14, borderRadius: 12,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 800, fontSize: 15, fontFamily: "inherit",
            boxShadow: loading ? "none" : `0 4px 16px ${cfg.color}44`,
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? "Creating Account..." : `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Account →`}
        </button>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: tk.textLt }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color: tk.green7, cursor: "pointer", fontWeight: 700 }}>Login here</span>
        </p>

        <div style={{ marginTop: 16, padding: "12px 16px", background: tk.bgMuted, borderRadius: 10, border: `1px solid ${tk.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: tk.textMid, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Field Requirements</div>
          {[
            ["Username", "At least 6 characters, letters/numbers/underscore only"],
            ["Mobile",   "Exactly 10 digits"],
            ["Password", "At least 6 characters"],
            ["Email",    "Valid format e.g. name@email.com"],
          ].map(([field, rule]) => (
            <div key={field} style={{ display: "flex", gap: 6, marginBottom: 3, fontSize: 12, color: tk.textLt }}>
              <span style={{ color: tk.green7, fontWeight: 700, flexShrink: 0 }}>{field}:</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CustomerRegPage() { return <RegistrationForm type="customer" />; }
export function FarmerRegPage()   { return <RegistrationForm type="farmer"   />; }
export function AgentRegPage()    { return <RegistrationForm type="agent"    />; }
