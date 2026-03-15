import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const DEMOS = [
  { label:"🌾 Farmer (Ravi)",   email:"ravi@farm.in",      password:"farm1234"  },
  { label:"🌾 Farmer (Abdul)",  email:"abdul@farm.in",     password:"farm1234"  },
  { label:"🏢 Agent (Priya)",   email:"priya@agent.in",    password:"agent1234" },
  { label:"🛒 Customer",        email:"customer@test.in",  password:"cust1234"  },
];

const ROLE_DEST = {
  farmer:   "/farmer/dashboard",
  agent:    "/agent/dashboard",
  customer: "/customer/dashboard",
  admin:    "/admin/dashboard",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required";
    if (!password || password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true); setApiError("");
    try {
      const user = await login(email, password);
      navigate(ROLE_DEST[user.role] || "/");
    } catch (e) { setApiError(e.message); }
    finally { setLoading(false); }
  };

  const inp = hasErr => ({
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${hasErr?"#e74c3c":tk.border}`,
    background:hasErr?"#fff0f0":tk.bgInput,
    color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit",
  });

  return (
    <div style={{ background:tk.bg, minHeight:"100%", padding:"50px 20px" }}>
      <div style={{ maxWidth:440, margin:"0 auto" }}>

        {/* Main card */}
        <div style={{ background:tk.bgCard, borderRadius:20, padding:40, boxShadow:tk.shadowLg, border:`1px solid ${tk.border}`, marginBottom:14 }}>
          <div style={{ textAlign:"center", fontSize:48, marginBottom:14 }}>🔑</div>
          <h2 style={{ fontSize:26, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, textAlign:"center", marginBottom:4 }}>Welcome Back</h2>
          <p style={{ color:tk.textLt, textAlign:"center", marginBottom:28, fontSize:14 }}>Login to your RPS Fields account</p>

          {apiError && <div style={{ background:"#fff0f0", border:"1px solid #e74c3c", borderRadius:10, padding:"10px 14px", marginBottom:18, color:"#c0392b", fontSize:13, fontWeight:600 }}>⚠ {apiError}</div>}

          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase" }}>Email</label>
            <input type="email" style={inp(!!errors.email)} placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.email}</div>}
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase" }}>Password</label>
            <input type="password" style={inp(!!errors.password)} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} />
            {errors.password && <div style={{ color:"#e74c3c", fontSize:11, marginTop:3 }}>⚠ {errors.password}</div>}
          </div>

          <button onClick={handleLogin} disabled={loading}
            style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", width:"100%", padding:14, borderRadius:10, cursor:loading?"not-allowed":"pointer", fontWeight:700, fontSize:15, fontFamily:"inherit", opacity:loading?0.7:1, boxShadow:"0 4px 14px rgba(82,183,136,0.35)" }}>
            {loading ? "Logging in..." : "Login →"}
          </button>

          {/* Demo fills */}
          <div style={{ marginTop:18, padding:"12px 14px", background:tk.bgMuted, borderRadius:10, border:`1px solid ${tk.border}` }}>
            <div style={{ fontWeight:700, fontSize:11, color:tk.textMid, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>🧪 Demo Accounts</div>
            {DEMOS.map(({ label, email:e, password:p }) => (
              <div key={e} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:12, color:tk.textMid }}>{label}: <strong style={{ color:tk.text }}>{e}</strong></span>
                <button onClick={() => { setEmail(e); setPassword(p); setErrors({}); setApiError(""); }}
                  style={{ fontSize:11, padding:"3px 10px", background:tk.green7, color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>Fill</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop:16, textAlign:"center", fontSize:13, color:tk.textLt }}>
            No account?{" "}
            <span onClick={() => navigate("/register")} style={{ color:tk.green7, cursor:"pointer", fontWeight:700 }}>Register here</span>
          </div>
        </div>

        {/* Admin login link */}
        <div onClick={() => navigate("/admin/login")}
          style={{ background:dark?"#0f1f14":"#1a3a5c", borderRadius:14, padding:"16px 22px", border:"1px solid #2a5a8c", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:26 }}>🛡</span>
            <div>
              <div style={{ color:"#7eb8f7", fontWeight:800, fontSize:14 }}>Admin Panel Login</div>
              <div style={{ color:"rgba(126,184,247,0.6)", fontSize:12, marginTop:2 }}>Staff only · admin@rpsfields.in / admin123</div>
            </div>
          </div>
          <span style={{ color:"#7eb8f7", fontSize:20 }}>→</span>
        </div>
      </div>
    </div>
  );
}
