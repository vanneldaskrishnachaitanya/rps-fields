import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

// ── Profile Edit Page ────────────────────────────────────────────────────────
export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSave = (e) => {
    e.preventDefault();
    // In a real app: PATCH /api/auth/profile
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate("/profile"); }, 1500);
  };

  const inp = { width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"'Inter',sans-serif" };
  const lbl = t => <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.4px" }}>{t}</label>;

  return (
    <div style={{ background:tk.bg, minHeight:"100%", padding:"50px 20px" }}>
      <div style={{ maxWidth:520, margin:"0 auto", background:tk.bgCard, borderRadius:20, padding:40, boxShadow:tk.shadowLg, border:`1px solid ${tk.border}` }}>
        <div style={{ textAlign:"center", fontSize:44, marginBottom:14 }}>✏️</div>
        <h2 style={{ fontSize:24, fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, textAlign:"center", marginBottom:24 }}>Edit Profile</h2>

        {saved && <div style={{ background:"#d4edda", border:"1px solid #28a745", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#155724", fontWeight:700, textAlign:"center" }}>✅ Profile updated!</div>}

        <form onSubmit={handleSave}>
          {[["Full Name","fullName","text","Your full name"],["Phone Number","phone","tel","10-digit number"],["Address","address","text","Street, area..."],["City","city","text","Your city"]].map(([label,k,t,ph])=>(
            <div key={k} style={{ marginBottom:16 }}>
              {lbl(label)}
              <input type={t} style={inp} placeholder={ph} value={form[k]} onChange={set(k)} />
            </div>
          ))}
          <div style={{ display:"flex", gap:12, marginTop:8 }}>
            <button type="submit" style={{ flex:1, padding:13, background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:15, fontFamily:"'Inter',sans-serif" }}>
              Save Changes
            </button>
            <button type="button" onClick={() => navigate("/profile")} style={{ flex:1, padding:13, background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
              Cancel
            </button>
          </div>
        </form>
        <p style={{ textAlign:"center", fontSize:12, color:tk.textLt, marginTop:14 }}>
          To change email or password, please contact support.
        </p>
      </div>
    </div>
  );
}
