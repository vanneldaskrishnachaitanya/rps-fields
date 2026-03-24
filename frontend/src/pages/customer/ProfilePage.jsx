import { useNavigate, Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, logout } = useAuth();

  const Field = ({ icon, label, value }) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px 0", borderBottom:`1px solid ${tk.border}` }}>
      <div style={{ width:38, height:38, borderRadius:10, background: dark?"#1c3525":"#e8f5ee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:15, color: value ? tk.text : tk.textLt, fontWeight: value ? 600 : 400, fontStyle: value ? "normal" : "italic" }}>{value || "Not set"}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%", animation:"fadeIn 0.4s ease" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0d2b1a,#1b4332,#2d6a4f)", padding:"56px 20px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 50% 80%,rgba(82,183,136,0.15),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ position:"relative" }}>
          <div style={{ width:84, height:84, borderRadius:"50%", background:"rgba(82,183,136,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px", boxShadow:"0 12px 36px rgba(82,183,136,0.35)" }}>👤</div>
          <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 6px" }}>{user?.fullName}</h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>Customer · Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"}) : "2024"}</p>
        </div>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"36px 20px 100px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, margin:0 }}>Account Details</h2>
          <Link to="/profile/edit" style={{ background:"rgba(82,183,136,0.28)", color:"#fff", padding:"9px 20px", borderRadius:50, fontWeight:700, fontSize:13, textDecoration:"none", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)" }}>
            ✏️ Edit Profile
          </Link>
        </div>

        <div style={{ background:tk.bgCard, borderRadius:22, padding:"6px 24px 20px", border:`1px solid ${tk.border}`, marginBottom:22, animation:"fadeUp 0.5s ease both" }}>
          <Field icon="👤" label="Full Name"     value={user?.fullName} />
          <Field icon="🆔" label="Username"      value={user?.username} />
          <Field icon="📧" label="Email Address" value={user?.email} />
          <Field icon="📞" label="Phone Number"  value={user?.phone||user?.mobile} />
          <Field icon="📍" label="Address"       value={user?.address} />
          <Field icon="🏙" label="City"          value={user?.city||user?.location} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16, animation:"fadeUp 0.5s ease 0.1s both" }}>
          {[["📦","My Orders","/orders"],["📍","Addresses","/address"],["🛒","Catalog","/catalog"],["📊","Dashboard","/customer/dashboard"]].map(([icon,lbl,to])=>(
            <button key={to} onClick={()=>navigate(to)} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", background:tk.bgCard, border:`1.5px solid ${tk.border}`, borderRadius:14, cursor:"pointer", fontWeight:700, fontSize:14, color:tk.text, fontFamily:"'Inter',sans-serif", transition:"all 0.2s", textAlign:"left" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#52b788"; e.currentTarget.style.background=dark?"#162b1d":"#f0faf3";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=tk.border; e.currentTarget.style.background=tk.bgCard;}}>
              <span style={{ fontSize:20 }}>{icon}</span>{lbl}
            </button>
          ))}
        </div>

        <button onClick={()=>{logout();navigate("/");}} style={{ width:"100%", padding:14, background:"rgba(220,38,38,0.12)", backdropFilter:"blur(20px) saturate(180%)", WebkitBackdropFilter:"blur(20px) saturate(180%)", border:"1px solid rgba(255,140,140,0.3)", color:"#ef4444", borderRadius:14, cursor:"pointer", fontWeight:800, fontSize:14, fontFamily:"'Inter',sans-serif", transition:"all 0.2s", animation:"fadeUp 0.5s ease 0.2s both" }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.1)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
