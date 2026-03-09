import { useState, useEffect, useRef } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import { API_BASE } from "../context/AuthContext";

const CATEGORIES = ["All","Vegetables","Fruits","Dairy","Dry Fruits","Grains"];

export default function CatalogPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState(""), [dSearch, setDSearch] = useState("");
  const debounce = useRef(null);

  const load = (category, searchTerm) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (searchTerm) params.set("search", searchTerm);
    fetch(`${API_BASE}/products?${params}`)
      .then(r=>r.json())
      .then(d=>{ if(d.success) setProducts(d.products); else setError(d.error); })
      .catch(e=>setError("Cannot connect to server. Is the backend running on port 4000?"))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(cat, dSearch); }, [cat, dSearch]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(()=>setDSearch(val), 400);
  };

  return (
    <div style={{ background:tk.bg, minHeight:"100%" }}>
      <div style={{ background:"linear-gradient(135deg,#1b4332,#40916c)", padding:"44px 20px", textAlign:"center" }}>
        <h1 style={{ color:"#fff", fontSize:36, fontFamily:"'Playfair Display',Georgia,serif", marginBottom:6 }}>🛒 Product Catalog</h1>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15 }}>Fresh produce directly from verified farmers</p>
      </div>

      {/* Filter bar */}
      <div style={{ background:tk.bgCard, borderBottom:`1px solid ${tk.border}`, padding:"13px 0", position:"sticky", top:68, zIndex:900 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 20px", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
          <input style={{ padding:"9px 14px", borderRadius:10, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:14, outline:"none", minWidth:240, fontFamily:"inherit" }}
            placeholder="🔍 Search products or farmers..." value={search} onChange={e=>handleSearch(e.target.value)} />
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid #40916c`, background:cat===c?"#40916c":"transparent", color:cat===c?"#fff":"#40916c", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>{c}</button>
            ))}
          </div>
          <button onClick={()=>load(cat,dSearch)} style={{ padding:"8px 16px", borderRadius:8, background:"transparent", border:`1.5px solid ${tk.border}`, color:tk.textMid, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>↻ Refresh</button>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"34px 20px" }}>
        {error && (
          <div style={{ background:"#fff3cd", border:"1px solid #ffc107", borderRadius:12, padding:"16px 20px", marginBottom:24, color:"#856404" }}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>
            <div style={{ fontSize:48, marginBottom:12, animation:"spin 1s linear infinite" }}>🌿</div>
            <p>Loading fresh products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:"center", padding:60, color:tk.textLt }}>
            <div style={{ fontSize:56, marginBottom:12 }}>🌿</div>
            <p style={{ fontSize:16 }}>No products found.</p>
          </div>
        ) : (
          <>
            <p style={{ color:tk.textLt, fontSize:13, marginBottom:22 }}>{products.length} product{products.length!==1?"s":""} found</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
              {products.map(p=><ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
