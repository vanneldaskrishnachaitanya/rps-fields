import { useNavigate, Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, logout } = useAuth();

  const row = (icon, label, value) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 0", borderBottom:`1px solid ${tk.border}` }}>
      <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11, color:tk.textLt, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:15, color:tk.text, fontWeight:600 }}>{value || <span style={{ color:tk.textLt, fontStyle:"italic" }}>Not set</span>}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"50px 20px", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 14px" }}>👤</div>
        <h1 style={{ color:"#fff", fontSize:28, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px" }}>{user?.fullName}</h1>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14 }}>Customer Account</p>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"36px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:tk.text, margin:0 }}>Account Details</h2>
          <Link to="/profile/edit" style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", padding:"9px 20px", borderRadius:10, fontWeight:700, fontSize:13, textDecoration:"none" }}>
            ✏️ Edit Profile
          </Link>
        </div>

        <div style={{ background:tk.bgCard, borderRadius:20, padding:"4px 24px 20px", boxShadow:tk.shadow, border:`1px solid ${tk.border}`, marginBottom:20 }}>
          {row("👤", "Full Name", user?.fullName)}
          {row("🆔", "Username", user?.username)}
          {row("📧", "Email Address", user?.email)}
          {row("📞", "Phone Number", user?.phone)}
          {row("📍", "Address", user?.address)}
          {row("🏙", "City", user?.city)}
          {row("📅", "Member Since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {month:"long",year:"numeric"}) : null)}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[["📦","My Orders","/orders"],["📍","Manage Addresses","/address"],["🛒","Continue Shopping","/catalog"],["🏠","Dashboard","/customer/dashboard"]].map(([icon,lbl,to])=>(
            <button key={to} onClick={()=>navigate(to)} style={{ padding:"14px 16px", background:tk.bgCard, border:`1.5px solid ${tk.border}`, borderRadius:12, cursor:"pointer", fontWeight:700, fontSize:14, color:tk.text, fontFamily:"inherit", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>{icon}</span>{lbl}
            </button>
          ))}
        </div>

        <button onClick={()=>{logout();navigate("/");}} style={{ marginTop:20, width:"100%", padding:13, background:"transparent", border:"1.5px solid #e74c3c", color:"#e74c3c", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
