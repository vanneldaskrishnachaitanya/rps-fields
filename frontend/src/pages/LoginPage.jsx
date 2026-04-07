import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";
import { useAuth, API_BASE } from "../context/AuthContext";

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

  // Forgot password state
  const [forgotMode, setForgotMode]   = useState(false); // "email" | "otp" | "reset" | false
  const [fpEmail,    setFpEmail]      = useState("");
  const [fpOtp,      setFpOtp]        = useState("");
  const [fpNewPwd,   setFpNewPwd]     = useState("");
  const [fpLoading,  setFpLoading]    = useState(false);
  const [fpMsg,      setFpMsg]        = useState("");
  const [fpError,    setFpError]      = useState("");
  const [fpToken,    setFpToken]      = useState("");

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

  // Forgot password handlers
  const sendOtp = async () => {
    if (!fpEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) { setFpError("Enter a valid email"); return; }
    setFpLoading(true); setFpError(""); setFpMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const d = await res.json();
      if (d.success) { setFpMsg("OTP sent to your email! Check your inbox."); setForgotMode("otp"); }
      else setFpError(d.error || "Failed to send OTP");
    } catch { setFpError("Network error. Please try again."); }
    finally { setFpLoading(false); }
  };

  const verifyOtp = async () => {
    if (!fpOtp || fpOtp.length < 4) { setFpError("Enter the OTP from your email"); return; }
    setFpLoading(true); setFpError(""); setFpMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp }),
      });
      const d = await res.json();
      if (d.success) { setFpToken(d.resetToken || ""); setForgotMode("reset"); setFpMsg("OTP verified! Enter your new password."); }
      else setFpError(d.error || "Invalid OTP");
    } catch { setFpError("Network error. Please try again."); }
    finally { setFpLoading(false); }
  };

  const resetPassword = async () => {
    if (!fpNewPwd || fpNewPwd.length < 6) { setFpError("Password must be at least 6 characters"); return; }
    setFpLoading(true); setFpError(""); setFpMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp, newPassword: fpNewPwd, resetToken: fpToken }),
      });
      const d = await res.json();
      if (d.success) {
        setFpMsg("Password reset successfully! You can now log in.");
        setTimeout(() => { setForgotMode(false); setFpEmail(""); setFpOtp(""); setFpNewPwd(""); setFpMsg(""); }, 2500);
      } else setFpError(d.error || "Failed to reset password");
    } catch { setFpError("Network error. Please try again."); }
    finally { setFpLoading(false); }
  };

  const inp = hasErr => ({
    width:"100%", padding:"12px 16px", borderRadius:12,
    border:`1.5px solid ${hasErr ? "#e74c3c" : tk.border}`,
    background: hasErr ? (dark?"#2a1010":"#fff0f0") : tk.bgInput,
    color:tk.text, fontSize:14, boxSizing:"border-box",
    outline:"none", fontFamily:"'Inter',sans-serif",
    transition:"border-color 0.2s, box-shadow 0.2s",
  });

  const btnStyle = (loading2) => ({
    width:"100%", padding:"14px",
    cursor: loading2?"not-allowed":"pointer",
    opacity: loading2?0.75:1,
    marginTop: 10
  });

  return (
    <div style={{ background:tk.bg, minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:"60px var(--page-px,clamp(16px,4vw,48px))" }}>
      <div style={{ width:"100%", maxWidth:460, animation:"fadeInUp 0.5s ease both" }}>

        {/* Main Card */}
        <div data-tilt className={dark ? "liquid-glass-dark" : "liquid-glass"} style={{ borderRadius:24, padding:"44px 40px", marginBottom:16 }}>

          {!forgotMode ? (
            <>
              <div style={{ textAlign:"center", marginBottom:32 }}>
                <div style={{ width:70, height:70, borderRadius:"50%", background:"linear-gradient(135deg,#2d6a4f,#1b4332)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 18px", boxShadow:"0 8px 24px rgba(82,183,136,0.3)" }}>🔑</div>
                <h2 className="grad-text" style={{ fontSize:32, fontFamily:"'Playfair Display',Georgia,serif", fontWeight: 900, marginBottom:6 }}>Welcome Back</h2>
                <p style={{ color:tk.textLt, fontSize:15 }}>Sign in to your RPS Fields account</p>
              </div>

              {apiError && (
                <div style={{ background:dark?"#2a1010":"#fff0f0", border:"1px solid #e74c3c", borderRadius:12, padding:"12px 16px", marginBottom:20, color:"#c0392b", fontSize:13, fontWeight:700, display:"flex", gap:8, alignItems:"center" }}>⚠ {apiError}</div>
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

              <div style={{ marginBottom:10 }}>
                <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Password</label>
                <input type="password" style={inp(!!errors.password)} placeholder="Your password" value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(er => ({...er, password:undefined})); }}
                  onKeyDown={e => e.key==="Enter" && handleLogin()}
                  onFocus={e => e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)"}
                  onBlur={e => e.target.style.boxShadow="none"}
                />
                {errors.password && <div style={{ color:"#e74c3c", fontSize:11, marginTop:4, fontWeight:600 }}>⚠ {errors.password}</div>}
              </div>

              <div style={{ textAlign:"right", marginBottom:20 }}>
                <span onClick={() => { setForgotMode("email"); setFpEmail(email); setFpError(""); setFpMsg(""); }} style={{ color:tk.green4, fontSize:12, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Forgot password?</span>
              </div>

              <button onClick={handleLogin} disabled={loading} style={btnStyle(loading)} className="ios-btn"
              >{loading ? "Signing In..." : "Sign In →"}</button>

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
                <span onClick={() => navigate("/register")} style={{ color:tk.green4, cursor:"pointer", fontWeight:800 }}>Register here</span>
              </p>
            </>
          ) : (
            /* ── Forgot Password Flow ── */
            <>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#d97706,#b45309)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 16px", boxShadow:"0 8px 24px rgba(217,119,6,0.3)" }}>
                  {forgotMode==="otp"?"📱":forgotMode==="reset"?"🔐":"📧"}
                </div>
                <h2 style={{ fontSize:22, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:6 }}>
                  {forgotMode==="email"?"Reset Password":forgotMode==="otp"?"Enter OTP":"New Password"}
                </h2>
                <p style={{ color:tk.textLt, fontSize:13 }}>
                  {forgotMode==="email"?"We'll send an OTP to your email":forgotMode==="otp"?`OTP sent to ${fpEmail}`:"Almost done! Set your new password"}
                </p>
              </div>

              {fpMsg && <div style={{ background:dark?"#0a2510":"#e8f5ee", border:"1px solid #52b788", borderRadius:12, padding:"12px 16px", marginBottom:16, color:"#2d6a4f", fontSize:13, fontWeight:700 }}>✓ {fpMsg}</div>}
              {fpError && <div style={{ background:dark?"#2a1010":"#fff0f0", border:"1px solid #e74c3c", borderRadius:12, padding:"12px 16px", marginBottom:16, color:"#c0392b", fontSize:13, fontWeight:700 }}>⚠ {fpError}</div>}

              {forgotMode==="email" && (
                <>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Email Address</label>
                    <input type="email" style={inp(false)} placeholder="your@email.com" value={fpEmail}
                      onChange={e => setFpEmail(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && sendOtp()}
                      onFocus={e => e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)"}
                      onBlur={e => e.target.style.boxShadow="none"}
                    />
                  </div>
                  <button onClick={sendOtp} disabled={fpLoading} style={btnStyle(fpLoading)}>{fpLoading?"Sending OTP...":"Send OTP →"}</button>
                </>
              )}

              {forgotMode==="otp" && (
                <>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Enter OTP</label>
                    <input type="text" maxLength={6} style={{ ...inp(false), textAlign:"center", fontSize:22, letterSpacing:8, fontFamily:"monospace" }}
                      placeholder="------" value={fpOtp}
                      onChange={e => setFpOtp(e.target.value.replace(/\D/g,""))}
                      onKeyDown={e => e.key==="Enter" && verifyOtp()}
                      onFocus={e => e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)"}
                      onBlur={e => e.target.style.boxShadow="none"}
                    />
                    <div style={{ fontSize:11, color:tk.textLt, marginTop:6, textAlign:"center" }}>Check your email for the OTP</div>
                  </div>
                  <button onClick={verifyOtp} disabled={fpLoading} style={btnStyle(fpLoading)}>{fpLoading?"Verifying...":"Verify OTP →"}</button>
                  <div style={{ textAlign:"center", marginTop:12 }}>
                    <span onClick={sendOtp} style={{ color:tk.green4, fontSize:12, cursor:"pointer", fontWeight:700 }}>Resend OTP</span>
                  </div>
                </>
              )}

              {forgotMode==="reset" && (
                <>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>New Password</label>
                    <input type="password" style={inp(false)} placeholder="Min 6 characters" value={fpNewPwd}
                      onChange={e => setFpNewPwd(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && resetPassword()}
                      onFocus={e => e.target.style.boxShadow="0 0 0 3px rgba(82,183,136,0.2)"}
                      onBlur={e => e.target.style.boxShadow="none"}
                    />
                  </div>
                  <button onClick={resetPassword} disabled={fpLoading} style={btnStyle(fpLoading)}>{fpLoading?"Resetting...":"Reset Password →"}</button>
                </>
              )}

              <div style={{ textAlign:"center", marginTop:18 }}>
                <span onClick={() => { setForgotMode(false); setFpError(""); setFpMsg(""); }} style={{ color:tk.textLt, fontSize:13, cursor:"pointer" }}>← Back to login</span>
              </div>
            </>
          )}
        </div>

        {/* Admin Link */}
        <div data-tilt onClick={() => navigate("/admin/login")} className={dark ? "liquid-glass-dark hover-lift" : "liquid-glass hover-lift"} style={{ borderRadius:16, padding:"16px 22px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all 0.3s" }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:26 }}>🛡</span>
            <div>
              <div style={{ color: dark?"#7eb8f7":"#2563eb", fontWeight:800, fontSize:14 }}>Admin Panel Login</div>
              <div style={{ color: dark?"rgba(126,184,247,0.6)":"rgba(37,99,235,0.5)", fontSize:12, marginTop:2 }}>Staff only · admin@rpsfields.in</div>
            </div>
          </div>
          <span style={{ color: dark?"#7eb8f7":"#2563eb", fontSize:18 }}>→</span>
        </div>
      </div>
    </div>
  );
}
