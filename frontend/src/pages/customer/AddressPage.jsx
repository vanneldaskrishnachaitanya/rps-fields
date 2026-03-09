import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function AddressPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([
    { id: 1, label:"Home", address: user?.address || "123 Main Street", city: user?.city || "Mumbai", phone: user?.phone || "9000000000", default: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label:"", address:"", city:"", phone:"" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const addAddress = () => {
    if (!form.address || !form.city) return;
    setAddresses(a => [...a, { ...form, id: Date.now(), default: false }]);
    setForm({ label:"", address:"", city:"", phone:"" });
    setShowForm(false);
  };

  const inp = { width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:13, boxSizing:"border-box", outline:"none", fontFamily:"inherit" };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"44px 20px", textAlign:"center" }}>
        <h1 style={{ color:"#fff", fontSize:32, fontFamily:"'Playfair Display',Georgia,serif" }}>📍 My Addresses</h1>
        <p style={{ color:"rgba(255,255,255,0.72)", fontSize:14 }}>Manage your delivery addresses</p>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"36px 20px" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
          <button onClick={() => setShowForm(s=>!s)} style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", padding:"10px 20px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            + Add New Address
          </button>
        </div>

        {showForm && (
          <div style={{ background:tk.bgCard, borderRadius:16, padding:24, marginBottom:20, boxShadow:tk.shadow, border:`2px solid ${tk.green6}` }}>
            <h3 style={{ fontWeight:800, color:tk.text, marginBottom:16, fontSize:15 }}>New Address</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              {[["Label","label","text","Home / Office / Other"],["Phone","phone","tel","10-digit number"]].map(([lbl,k,t,ph])=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:4, textTransform:"uppercase" }}>{lbl}</label>
                  <input type={t} style={inp} placeholder={ph} value={form[k]} onChange={set(k)} />
                </div>
              ))}
            </div>
            {[["Address","address","text","Street, area, landmark..."],["City","city","text","City"]].map(([lbl,k,t,ph])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontWeight:700, fontSize:11, color:tk.textMid, marginBottom:4, textTransform:"uppercase" }}>{lbl}</label>
                <input type={t} style={inp} placeholder={ph} value={form[k]} onChange={set(k)} />
              </div>
            ))}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={addAddress} style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", padding:"10px 22px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Save Address</button>
              <button onClick={() => setShowForm(false)} style={{ background:"transparent", border:`1px solid ${tk.border}`, color:tk.textMid, padding:"10px 18px", borderRadius:10, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </div>
        )}

        {addresses.map(addr => (
          <div key={addr.id} style={{ background:tk.bgCard, borderRadius:14, padding:22, marginBottom:14, border:`${addr.default?"2px solid "+tk.green6:"1px solid "+tk.border}`, boxShadow:tk.shadow }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontWeight:800, color:tk.text, fontSize:15 }}>📍 {addr.label || "Address"}</span>
                  {addr.default && <span style={{ background:tk.green6, color:"#fff", borderRadius:12, padding:"2px 10px", fontSize:10, fontWeight:700 }}>DEFAULT</span>}
                </div>
                <div style={{ color:tk.textMid, fontSize:14, lineHeight:1.6 }}>
                  {addr.address}, {addr.city}<br />
                  {addr.phone && <span>📞 {addr.phone}</span>}
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ background:"transparent", border:`1px solid ${tk.border}`, color:tk.textMid, padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Edit</button>
                {!addr.default && <button onClick={() => setAddresses(a => a.filter(x=>x.id!==addr.id))} style={{ background:"transparent", border:"1px solid #e74c3c", color:"#e74c3c", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Delete</button>}
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => navigate("/profile")} style={{ marginTop:8, background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, padding:"10px 22px", borderRadius:10, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
          ← Back to Profile
        </button>
      </div>
    </div>
  );
}
