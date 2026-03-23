import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const DEMOS = [
  { label:"🌾 Farmer (Ravi)",  email:"ravi@farm.in",      password:"farm1234"  },
  { label:"🌾 Farmer (Abdul)", email:"abdul@farm.in",     password:"farm1234"  },
  { label:"🏢 Agent (Priya)",  email:"priya@agent.in",    password:"agent1234" },
  { label:"🛒 Customer",       email:"customer@test.in",  password:"cust1234"  },
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
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
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
    width:"100%", padding:"12px 16px", borderRadius:12,
    border:`1.5px solid ${hasErr ? "#e74c3c" : tk.border}`,
    background: hasErr ? (dark?"#2a1010":"#fff0f0") : tk.bgInput,
    color:tk.text, fontSize:14, boxSizing:"border-box",
    outline:"none", fontFamily:"'Inter',sans-serif",
    transition:"border-color 0.2s, box-shadow 0.2s",
  });

  return (
    <div style={{
      background: tk.bg, minHeight:"100%",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"60px 20px",
    }}>
      <div style={{ width:"100%", maxWidth:460, animation:"fadeInUp 0.5s ease both" }}>

        {/* Card */}
        <div style={{
          background:tk.bgCard, borderRadius:24, padding:"44px 40px",
          boxShadow: dark?"0 20px 60px rgba(0,0,0,0.5)":"0 20px 60px rgba(27,67,50,0.12)",
          border:`1px solid ${tk.border}`, marginBottom:16,
        }}>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{
              width:70, height:70, borderRadius:"50%",
              background:`linear-gradient(135deg,${tk.green6},${tk.green7})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:30, margin:"0 auto 18px",
              boxShadow:"0 8px 24px rgba(82,183,136,0.3)",
            }}>🔑</div>
            <h2 style={{ fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:6 }}>Welcome Back</h2>
            <p style={{ color:tk.textLt, fontSize:14 }}>Sign in to your RPS Fields account</p>
          </div>

          {apiError && (
            <div style={{ background: dark?"#2a1010":"#fff0f0", border:"1px solid #e74c3c", borderRadius:12, padding:"12px 16px", marginBottom:20, color:"#c0392b", fontSize:13, fontWeight:700, display:"flex", gap:8, alignItems:"center" }}>
              ⚠ {apiError}
            </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Email Address</label>
            <input type="email" style={inp(!!errors.email)} placeholder="you@email.com" value={email}
              onChange={e => { setEmail(e.target.value); setErrors(er => ({...er, email:undefined})); }}
              onFocus={e => e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)"}
              onBlur={e => e.target.style.boxShadow="none"}
            />
            {errors.email && <div style={{ color:"#e74c3c", fontSize:11, marginTop:4, fontWeight:600 }}>⚠ {errors.email}</div>}
          </div>

          <div style={{ marginBottom:26 }}>
            <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Password</label>
            <input type="password" style={inp(!!errors.password)} placeholder="Your password" value={password}
              onChange={e => { setPassword(e.target.value); setErrors(er => ({...er, password:undefined})); }}
              onKeyDown={e => e.key==="Enter" && handleLogin()}
              onFocus={e => e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)"}
              onBlur={e => e.target.style.boxShadow="none"}
            />
            {errors.password && <div style={{ color:"#e74c3c", fontSize:11, marginTop:4, fontWeight:600 }}>⚠ {errors.password}</div>}
          </div>

          <button onClick={handleLogin} disabled={loading} style={{
            background: loading ? tk.border : "linear-gradient(135deg,#52b788,#2d6a4f)",
            color:"#fff", border:"none", width:"100%", padding:"14px",
            borderRadius:12, cursor: loading?"not-allowed":"pointer",
            fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif",
            boxShadow: loading?"none":"0 6px 20px rgba(82,183,136,0.35)",
            transition:"all 0.25s", opacity: loading?0.75:1,
          }}
            onMouseEnter={e => { if (!loading) { e.target.style.transform="translateY(-1px)"; e.target.style.boxShadow="0 10px 28px rgba(82,183,136,0.45)"; }}}
            onMouseLeave={e => { e.target.style.transform="none"; e.target.style.boxShadow="0 6px 20px rgba(82,183,136,0.35)"; }}
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>

          {/* Demo accounts */}
          <div style={{ marginTop:20, padding:"14px 16px", background:tk.bgMuted, borderRadius:14, border:`1px solid ${tk.border}` }}>
            <div style={{ fontWeight:800, fontSize:11, color:tk.textMid, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:10 }}>🧪 Demo Accounts</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {DEMOS.map(({ label, email:e, password:p }) => (
                <button key={e} onClick={() => { setEmail(e); setPassword(p); setErrors({}); setApiError(""); }} style={{
                  fontSize:11, padding:"7px 10px",
                  background: dark?"rgba(82,183,136,0.1)":"rgba(82,183,136,0.08)",
                  border:`1px solid ${tk.border}`, borderRadius:8,
                  color:tk.textMid, cursor:"pointer", fontFamily:"'Inter',sans-serif",
                  fontWeight:700, textAlign:"left", transition:"all 0.2s",
                }}
                  onMouseEnter={e2 => { e2.target.style.background="rgba(82,183,136,0.2)"; e2.target.style.borderColor="#52b788"; e2.target.style.color=tk.text; }}
                  onMouseLeave={e2 => { e2.target.style.background=dark?"rgba(82,183,136,0.1)":"rgba(82,183,136,0.08)"; e2.target.style.borderColor=tk.border; e2.target.style.color=tk.textMid; }}
                >{label}</button>
              ))}
            </div>
          </div>

          <p style={{ textAlign:"center", marginTop:18, fontSize:13, color:tk.textLt }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={{ color:tk.green7, cursor:"pointer", fontWeight:800 }}>Register here</span>
          </p>
        </div>

        {/* Admin */}
        <div onClick={() => navigate("/admin/login")} style={{
          background: dark?"#0f1f14":"#1a3a5c", borderRadius:16, padding:"16px 22px",
          border:"1px solid #2a5a8c", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          transition:"all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:26 }}>🛡</span>
            <div>
              <div style={{ color:"#7eb8f7", fontWeight:800, fontSize:14 }}>Admin Panel Login</div>
              <div style={{ color:"rgba(126,184,247,0.6)", fontSize:12, marginTop:2 }}>Staff only · admin@rpsfields.in</div>
            </div>
          </div>
          <span style={{ color:"#7eb8f7", fontSize:18 }}>→</span>
        </div>
      </div>
    </div>
  );
}
