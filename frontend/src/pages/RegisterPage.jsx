import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../context/ThemeContext";

const OPTIONS = [
  { icon:"🛒", title:"I'm a Customer",  desc:"Buy fresh produce directly from verified farmers. Farm-fresh quality at fair prices.", btn:"Register as Customer", path:"/register/customer", color:"#40916c", badge:null },
  { icon:"🌾", title:"I'm a Farmer",    desc:"List your produce and connect with agents. Reach thousands of customers without middlemen.", btn:"Register as Farmer",   path:"/register/farmer",   color:"#2d6a4f", badge:null },
  { icon:"🏢", title:"I'm an Agent",    desc:"Partner with farmers, add products to the catalog and manage sales on their behalf.", btn:"Register as Agent",    path:"/register/agent",    color:"#1e40af", badge:null },
  { icon:"🛡", title:"Admin Access",    desc:"Platform management for RPS Fields staff only.", btn:"Go to Admin Login", path:"/admin/login", color:"#1a3a5c", badge:"Staff Only" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const tk = TK(dark);

  return (
    <div style={{ background:tk.bg, minHeight:"100%", padding:"60px 20px", textAlign:"center" }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ fontSize:52, marginBottom:14 }}>🌿</div>
        <h1 style={{ fontSize:36, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:10 }}>Join RPS Fields</h1>
        <p style={{ color:tk.textLt, fontSize:15, maxWidth:440, margin:"0 auto" }}>Choose how you'd like to use the platform</p>
      </div>

      <div style={{ display:"flex", gap:22, justifyContent:"center", flexWrap:"wrap", maxWidth:1100, margin:"0 auto" }}>
        {OPTIONS.map(opt => (
          <div key={opt.title} onClick={() => navigate(opt.path)}
            style={{ background:tk.bgCard, borderRadius:20, padding:"34px 28px", width:245, boxShadow:tk.shadowLg, border:`2px solid ${opt.color}40`, transition:"transform 0.2s, box-shadow 0.2s, border-color 0.2s", cursor:"pointer", position:"relative", textAlign:"center" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-7px)"; e.currentTarget.style.borderColor=opt.color; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor=`${opt.color}40`; }}>
            {opt.badge && (
              <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"#1a3a5c", color:"#7eb8f7", borderRadius:20, padding:"3px 14px", fontSize:10, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", border:"1px solid #2a5a8c" }}>{opt.badge}</div>
            )}
            <div style={{ fontSize:52, marginBottom:14 }}>{opt.icon}</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:tk.text, marginBottom:8 }}>{opt.title}</h3>
            <p style={{ color:tk.textLt, fontSize:13, lineHeight:1.7, marginBottom:24, minHeight:60 }}>{opt.desc}</p>
            <button onClick={e => { e.stopPropagation(); navigate(opt.path); }}
              style={{ background:`linear-gradient(135deg,${opt.color},${opt.color}cc)`, color:"#fff", border:"none", width:"100%", padding:"11px 0", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
              {opt.btn} →
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop:40, fontSize:14, color:tk.textLt }}>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} style={{ color:tk.green7, cursor:"pointer", fontWeight:700 }}>Login here</span>
      </p>
    </div>
  );
}
