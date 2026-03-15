import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const ROLE_CONFIG = {
  customer: { icon:"🛒", title:"Customer Registration", color:"#40916c", dest:"/customer/dashboard" },
  farmer:   { icon:"🌾", title:"Farmer Registration",   color:"#2d6a4f", dest:"/farmer/dashboard"   },
  agent:    { icon:"🏢", title:"Agent Registration",    color:"#1e40af", dest:"/agent/dashboard"    },
};

function RegistrationForm({ type }) {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { register } = useAuth();
  const cfg = ROLE_CONFIG[type] || ROLE_CONFIG.customer;

  const [form, setForm] = useState({ name:"", email:"", mobile:"", password:"", confirmPassword:"", location:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = "Name required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errs.mobile = "10-digit mobile required";
    if (!form.password || form.password.length < 6) errs.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.location.trim()) errs.location = "Location required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true); setApiError("");
    try {
      await register({
        name: form.name, fullName: form.name,
        email: form.email,
        mobile: form.mobile, phone: form.mobile,
        password: form.password, confirmPassword: form.confirmPassword,
        location: form.location, city: form.location,
        role: type,
      });
      setSuccess(true);
      setTimeout(() => navigate(cfg.dest), 1200);
    } catch (e) { setApiError(e.message); }
    finally { setLoading(false); }
  };

  const inp = hasErr => ({
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${hasErr?"#e74c3c":tk.border}`,
    background:hasErr?"#fff0f0":tk.bgInput,
    color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit",
  });
  const lbl = t => <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.4px" }}>{t}</label>;

  if (success) return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px", textAlign:"center" }}>
      <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
      <h2 style={{ fontSize:28, color:tk.text, marginBottom:8 }}>Account Created!</h2>
      <p style={{ color:tk.textLt }}>Redirecting to your dashboard...</p>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%", padding:"50px 20px" }}>
      <div style={{ maxWidth:520, margin:"0 auto", background:tk.bgCard, borderRadius:20, padding:40, boxShadow:tk.shadowLg, border:`2px solid ${cfg.color}40` }}>
        <div style={{ textAlign:"center", fontSize:46, marginBottom:12 }}>{cfg.icon}</div>
        <h2 style={{ fontSize:24, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, textAlign:"center", marginBottom:24 }}>{cfg.title}</h2>

        {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#c0392b", fontSize:13, fontWeight:600 }}>⚠ {apiError}</div>}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
          <div style={{ marginBottom:14, gridColumn:"1/-1" }}>
            {lbl("Full Name *")}
            <input style={inp(!!errors.name)} placeholder="Your full name" value={form.name} onChange={set("name")} />
            {errors.name && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.name}</div>}
          </div>
          <div style={{ marginBottom:14 }}>
            {lbl("Email *")}
            <input type="email" style={inp(!!errors.email)} placeholder="you@email.com" value={form.email} onChange={set("email")} />
            {errors.email && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.email}</div>}
          </div>
          <div style={{ marginBottom:14 }}>
            {lbl("Mobile *")}
            <input type="tel" style={inp(!!errors.mobile)} placeholder="10-digit number" value={form.mobile} onChange={set("mobile")} />
            {errors.mobile && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.mobile}</div>}
          </div>
          <div style={{ marginBottom:14 }}>
            {lbl("Password *")}
            <input type="password" style={inp(!!errors.password)} placeholder="Min 6 chars" value={form.password} onChange={set("password")} />
            {errors.password && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.password}</div>}
          </div>
          <div style={{ marginBottom:14 }}>
            {lbl("Confirm Password *")}
            <input type="password" style={inp(!!errors.confirmPassword)} placeholder="Repeat" value={form.confirmPassword} onChange={set("confirmPassword")} />
            {errors.confirmPassword && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.confirmPassword}</div>}
          </div>
          <div style={{ marginBottom:20, gridColumn:"1/-1" }}>
            {lbl(type === "farmer" ? "Farm Location *" : "Location / City *")}
            <input style={inp(!!errors.location)} placeholder={type === "farmer" ? "Village, District, State" : "Your city"} value={form.location} onChange={set("location")} />
            {errors.location && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.location}</div>}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ background:`linear-gradient(135deg,${cfg.color},${cfg.color}cc)`, color:"#fff", border:"none", width:"100%", padding:14, borderRadius:10, cursor:loading?"not-allowed":"pointer", fontWeight:700, fontSize:15, fontFamily:"inherit", opacity:loading?0.7:1 }}>
          {loading ? "Creating account..." : `Create ${type.charAt(0).toUpperCase()+type.slice(1)} Account →`}
        </button>

        <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:tk.textLt }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color:tk.green7, cursor:"pointer", fontWeight:700 }}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export function CustomerRegPage() { return <RegistrationForm type="customer" />; }
export function FarmerRegPage()   { return <RegistrationForm type="farmer"   />; }
export function AgentRegPage()    { return <RegistrationForm type="agent"    />; }
