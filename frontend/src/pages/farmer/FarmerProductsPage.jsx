import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FarmerNav } from "./FarmerAgentPages";

export default function FarmerProductsPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    authFetch(`/products?farmerId=${user.id}`)
      .then(d=>{ if(d.success) setProducts(d.products); })
      .finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); }, []); // eslint-disable-line

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const d = await authFetch(`/products/${id}`,{method:"DELETE"});
    if (d.success) { setMsg("Product deleted."); setTimeout(()=>setMsg(""),3000); load(); }
  };

  const gc = { // glass card style
    background: dark?"rgba(12,22,15,0.82)":"rgba(255,255,255,0.82)",
    backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)",
    border:`1px solid ${dark?"rgba(82,183,136,0.12)":"rgba(255,255,255,0.9)"}`,
    boxShadow: dark?"0 4px 24px rgba(0,0,0,0.45)":"0 4px 24px rgba(0,0,0,0.08)",
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#040d06,#0d2b1a,#1b4332)", padding:"52px 20px 44px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 30% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16 }}>
          <div style={{ animation:"fadeUp 0.5s ease both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.25)", borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block" }} />
              <span style={{ color:"#74c69d", fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>🌾 Farmer Dashboard</span>
            </div>
            <h1 style={{ color:"#fff", fontSize:"clamp(24px,4vw,32px)", fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 6px" }}>My Products</h1>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, margin:0 }}>{products.length} product{products.length!==1?"s":""} listed by agents</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px 100px" }}>
        <FarmerNav />

        {msg && (
          <div style={{ background:"rgba(16,185,129,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:12, padding:"12px 18px", marginBottom:20, color:"#10b981", fontWeight:700, animation:"fadeUp 0.3s ease" }}>
            ✅ {msg}
          </div>
        )}

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
            {[1,2,3,4,5,6].map(i=><div key={i} style={{ height:260, borderRadius:20, background: dark?"rgba(12,22,15,0.5)":"rgba(255,255,255,0.4)", backdropFilter:"blur(8px)", animation:"shimmer 1.5s ease infinite" }} />)}
          </div>
        ) : products.length===0 ? (
          <div style={{ ...gc, borderRadius:24, padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🌾</div>
            <h3 style={{ color:tk.text, fontSize:22, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>No products listed yet</h3>
            <p style={{ color:tk.textLt, marginBottom:24, fontSize:15 }}>Products are added by agents on your behalf. Connect with an agent to get started.</p>
            <Link to="/farmer/find-agents" style={{ display:"inline-block", background:"linear-gradient(135deg,#52b788,#2d6a4f)", color:"#fff", padding:"12px 28px", borderRadius:50, fontWeight:700, textDecoration:"none", boxShadow:"0 6px 20px rgba(82,183,136,0.3)" }}>
              🤝 Find an Agent →
            </Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
            {products.map((p,i)=>(
              <div key={p.id||p._id} style={{
                ...gc, borderRadius:20, overflow:"hidden",
                transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                animation:`fadeUp 0.5s ease ${i*0.06}s both`,
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=dark?"0 12px 40px rgba(0,0,0,0.55)":"0 12px 40px rgba(0,0,0,0.14)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=dark?"0 4px 24px rgba(0,0,0,0.45)":"0 4px 24px rgba(0,0,0,0.08)";}}
              >
                <div style={{ height:160, overflow:"hidden", background: dark?"rgba(0,0,0,0.3)":"rgba(0,0,0,0.05)", position:"relative" }}>
                  <img src={p.img||p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }}
                    onMouseEnter={e=>e.target.style.transform="scale(1.08)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    onError={e=>e.target.style.display="none"}
                  />
                  <div style={{ position:"absolute", top:10, right:10, background:"rgba(13,43,26,0.85)", backdropFilter:"blur(8px)", color:"#74c69d", borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:700, border:"1px solid rgba(82,183,136,0.3)" }}>{p.category}</div>
                  {(p.qty||p.quantity)<20 && <div style={{ position:"absolute", top:10, left:10, background:"rgba(220,38,38,0.85)", backdropFilter:"blur(8px)", color:"#fff", borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700 }}>LOW STOCK</div>}
                </div>
                <div style={{ padding:18 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:tk.text, marginBottom:6 }}>{p.name}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                    <div style={{ fontSize:22, fontWeight:900, color:tk.green4, fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"' }}>₹{p.pricePerKg||p.price}<span style={{ fontSize:12, fontWeight:400, color:tk.textLt }}>/kg</span></div>
                    <div style={{ fontSize:13, color:(p.quantity||p.qty)<20?"#ef4444":tk.textMid, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                      {(p.quantity||p.qty)<20&&<span style={{ animation:"pulse 2s infinite" }}>⚠</span>}
                      {p.quantity||p.qty} kg
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Link to={`/farmer/edit-product/${p.id||p._id}`} style={{ flex:1, padding:"9px", background:"rgba(64,145,108,0.12)", backdropFilter:"blur(8px)", border:`1.5px solid rgba(64,145,108,0.3)`, color:tk.green4, borderRadius:50, fontWeight:700, fontSize:13, textDecoration:"none", textAlign:"center", transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.target.style.background="rgba(64,145,108,0.25)";}} onMouseLeave={e=>{e.target.style.background="rgba(64,145,108,0.12)";}}>
                      ✏️ Edit
                    </Link>
                    <button onClick={()=>handleDelete(p.id||p._id,p.name)} style={{ flex:1, padding:"9px", background:"rgba(220,38,38,0.1)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(220,38,38,0.25)", color:"#ef4444", borderRadius:50, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'Inter',sans-serif", transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.target.style.background="rgba(220,38,38,0.2)";}} onMouseLeave={e=>{e.target.style.background="rgba(220,38,38,0.1)";}}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
