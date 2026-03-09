import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme, TK } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function FarmerProductsPage() {
  const navigate = useNavigate();
  const { dark } = useTheme(); const tk = TK(dark);
  const { user, authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    authFetch(`/products?farmerId=${user.id}`)
      .then(d => { if (d.success) setProducts(d.products); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const d = await authFetch(`/products/${id}`, { method: "DELETE" });
    if (d.success) { setMsg("Product deleted."); setTimeout(()=>setMsg(""),3000); load(); }
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f)", padding:"44px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <p style={{ color:"#74c69d", fontSize:11, letterSpacing:"2px", textTransform:"uppercase", margin:"0 0 6px" }}>🌾 Farmer Dashboard</p>
            <h1 style={{ color:"#fff", fontSize:30, fontFamily:"'Playfair Display',Georgia,serif", margin:0 }}>My Products</h1>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, margin:"4px 0 0" }}>{products.length} product{products.length!==1?"s":""} listed</p>
          </div>
          <Link to="/farmer/add-product" style={{ background:"linear-gradient(135deg,#d4a017,#c49010)", color:"#1b4332", padding:"12px 22px", borderRadius:10, fontWeight:800, fontSize:14, textDecoration:"none", boxShadow:"0 4px 14px rgba(212,160,23,0.4)" }}>
            + Add New Product
          </Link>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 20px" }}>
        {msg && <div style={{ background:"#d4edda", border:"1px solid #28a745", borderRadius:10, padding:"12px 18px", marginBottom:20, color:"#155724", fontWeight:700 }}>✅ {msg}</div>}

        {/* Sub-nav */}
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {[["📊 Dashboard","/farmer/dashboard"],["📦 Products","/farmer/products"],["🛒 Orders","/farmer/orders"],["👤 Profile","/farmer/profile"]].map(([lbl,to])=>(
            <Link key={to} to={to} style={{ padding:"9px 16px", borderRadius:8, border:`1.5px solid ${to==="/farmer/products"?tk.green7:tk.border}`, background:to==="/farmer/products"?tk.green7:"transparent", color:to==="/farmer/products"?"#fff":tk.textMid, fontWeight:700, fontSize:13, textDecoration:"none" }}>{lbl}</Link>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:tk.textLt }}><div style={{ fontSize:48, marginBottom:12 }}>🌿</div><p>Loading...</p></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:"center", padding:60, background:tk.bgCard, borderRadius:16, border:`1px solid ${tk.border}` }}>
            <div style={{ fontSize:56, marginBottom:14 }}>🌾</div>
            <h3 style={{ color:tk.text, marginBottom:8 }}>No products yet</h3>
            <Link to="/farmer/add-product" style={{ background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", padding:"12px 24px", borderRadius:10, fontWeight:700, textDecoration:"none", display:"inline-block", marginTop:8 }}>
              + Add First Product
            </Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
            {products.map(p => (
              <div key={p.id} style={{ background:tk.bgCard, borderRadius:16, overflow:"hidden", border:`1px solid ${tk.border}`, boxShadow:tk.shadow }}>
                <div style={{ height:150, overflow:"hidden", background:tk.bgMuted, position:"relative" }}>
                  <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
                  <div style={{ position:"absolute", top:8, right:8, background:"rgba(27,67,50,0.85)", color:"#74c69d", borderRadius:14, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{p.category}</div>
                  {p.qty < 20 && <div style={{ position:"absolute", top:8, left:8, background:"rgba(231,76,60,0.9)", color:"#fff", borderRadius:10, padding:"2px 8px", fontSize:10, fontWeight:700 }}>LOW STOCK</div>}
                </div>
                <div style={{ padding:16 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:tk.text, marginBottom:4 }}>{p.name}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, fontSize:13, color:tk.textMid }}>
                    <span style={{ fontWeight:800, color:tk.green7, fontSize:18 }}>₹{p.price}<span style={{ fontSize:11, fontWeight:400 }}>/kg</span></span>
                    <span style={{ color: p.qty<20?"#e74c3c":tk.textMid }}>📦 {p.qty} kg</span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <Link to={`/farmer/edit-product/${p.id}`} style={{ flex:1, padding:"9px", background:"transparent", border:`1.5px solid ${tk.green7}`, color:tk.green7, borderRadius:8, fontWeight:700, fontSize:13, textDecoration:"none", textAlign:"center" }}>✏️ Edit</Link>
                    <button onClick={() => handleDelete(p.id, p.name)} style={{ flex:1, padding:"9px", background:"transparent", border:"1.5px solid #e74c3c", color:"#e74c3c", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>🗑 Delete</button>
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
