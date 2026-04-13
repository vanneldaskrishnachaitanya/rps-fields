import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

const OPTIONS = [
  {
    icon:"🛒",
    title:"I'm a Customer",
    desc:"Buy fresh produce directly from verified farmers. Farm-fresh quality at fair prices.",
    btn:"Register as Customer",
    path:"/register/customer",
    color:"#2d9f73",
    iconBg:"linear-gradient(145deg, rgba(143,228,193,0.45), rgba(64,145,108,0.28))",
    btnGrad:"linear-gradient(135deg,#58c59a,#2f8f69)",
  },
  {
    icon:"🌾",
    title:"I'm a Farmer",
    desc:"List your produce and connect with agents. Reach thousands of customers without middlemen.",
    btn:"Register as Farmer",
    path:"/register/farmer",
    color:"#c9951f",
    iconBg:"linear-gradient(145deg, rgba(249,223,150,0.50), rgba(201,149,31,0.28))",
    btnGrad:"linear-gradient(135deg,#e3b84b,#b88312)",
  },
  {
    icon:"🏢",
    title:"I'm an Agent",
    desc:"Partner with farmers, add products to the catalog and manage sales on their behalf.",
    btn:"Register as Agent",
    path:"/register/agent",
    color:"#3d7ee8",
    iconBg:"linear-gradient(145deg, rgba(174,201,252,0.50), rgba(61,126,232,0.26))",
    btnGrad:"linear-gradient(135deg,#6ca0ef,#3d7ee8)",
  },
  {
    icon:"🛡",
    title:"Admin Access",
    desc:"Platform management for RPS Fields staff only. Restricted access.",
    btn:"Admin Login",
    path:"/admin/login",
    color:"#8b5cf6",
    iconBg:"linear-gradient(145deg, rgba(196,172,252,0.48), rgba(139,92,246,0.30))",
    btnGrad:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
    badge:"Staff Only"
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);

  return (
    <div style={{ background:tk.bg, minHeight:"100%", padding:"60px var(--page-px,clamp(16px,4vw,48px)) 100px" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:52, animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background: dark?"#162b1d":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"5px 18px", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:18 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block", animation:"pulse 2s infinite" }} />
          Join the Platform
        </div>
        <h1 style={{ fontSize:"clamp(30px,5vw,46px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:12, fontWeight:700 }}>
          Welcome to RPS Fields
        </h1>
        <p style={{ color:tk.textLt, fontSize:16, maxWidth:460, margin:"0 auto" }}>
          Choose your role and start connecting farmers, agents and customers
        </p>
      </div>

      {/* Cards */}
      <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", maxWidth:1100, margin:"0 auto" }}>
        {OPTIONS.map((opt, i) => (
          <div key={opt.title} data-tilt onClick={() => navigate(opt.path)}
            style={{
              background:tk.bgCard, borderRadius:24, padding:"36px 30px",
              width:256, cursor:"pointer", position:"relative", textAlign:"center",
              border:`1px solid ${tk.border}`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              animation:`fadeUp 0.55s ease ${i*0.1}s both`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-10px) scale(1.01)"; e.currentTarget.style.boxShadow=`0 20px 48px ${opt.color}25`; e.currentTarget.style.borderColor=opt.color; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor=tk.border; }}
          >
            {opt.badge && (
              <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:"#1a1a2e", color:"#a78bfa", borderRadius:20, padding:"3px 14px", fontSize:10, fontWeight:800, letterSpacing:"1px", textTransform:"uppercase", border:"1px solid rgba(139,92,246,0.4)", whiteSpace:"nowrap" }}>
                {opt.badge}
              </div>
            )}

            <div style={{
              width:64, height:64, borderRadius:18, background:opt.iconBg,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:28, margin:"0 auto 18px",
              boxShadow:`0 8px 24px ${opt.color}30`,
            }}>{opt.icon}</div>

            <h3 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:10 }}>{opt.title}</h3>
            <p style={{ color:tk.textLt, fontSize:13, lineHeight:1.7, marginBottom:24, minHeight:54 }}>{opt.desc}</p>

            <button data-magnetic onClick={e => { e.stopPropagation(); navigate(opt.path); }}
              style={{
                background:opt.btnGrad,
                backdropFilter:"blur(18px) saturate(170%)",
                WebkitBackdropFilter:"blur(18px) saturate(170%)",
                color:"#fff",
                border:"1px solid rgba(255,255,255,0.48)",
                width:"100%",
                padding:"12px 0",
                borderRadius:50,
                textShadow:"0 1px 4px rgba(0,0,0,0.30)",
                boxShadow:`inset 0 1.5px 0 rgba(255,255,255,0.58), inset 0 -1px 0 rgba(0,0,0,0.16), 0 8px 24px ${opt.color}66, 0 2px 8px rgba(0,0,0,0.12)`,
                cursor:"pointer",
                fontWeight:800,
                fontSize:14,
                fontFamily:"'Inter',sans-serif",
                transition:"all 0.2s"
              }}
            >{opt.btn} →</button>
          </div>
        ))}
      </div>

      <p style={{ textAlign:"center", marginTop:44, fontSize:14, color:tk.textLt, animation:"fadeIn 0.6s ease 0.4s both" }}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ color:"#52b788", cursor:"pointer", fontWeight:800, textDecoration:"underline", textUnderlineOffset:3 }}>Sign in here</span>
      </p>
    </div>
  );
}
