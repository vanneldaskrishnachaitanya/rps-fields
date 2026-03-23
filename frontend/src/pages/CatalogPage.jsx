import { useState, useEffect, useRef } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import { API_BASE } from "../context/AuthContext";

const CATS = ["All","Vegetables","Fruits","Dairy","Dry Fruits","Grains"];

export default function CatalogPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [cat,      setCat]      = useState("All");
  const [search,   setSearch]   = useState("");
  const [dSearch,  setDSearch]  = useState("");
  const debounce = useRef(null);

  const load = (category, searchTerm) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (searchTerm) params.set("search", searchTerm);
    fetch(`${API_BASE}/products?${params}`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products); else setError(d.error); })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(cat, dSearch); }, [cat, dSearch]); // eslint-disable-line

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setDSearch(val), 400);
  };

  return (
    <div style={{ background: tk.bg, minHeight: "100%" }}>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg,#1b4332,#2d6a4f,#40916c)",
        padding: "50px 20px 44px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 30% 50%,rgba(116,198,157,0.15),transparent 55%),radial-gradient(circle at 70% 50%,rgba(82,183,136,0.1),transparent 55%)", pointerEvents:"none" }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#74c69d", marginBottom:14 }}>
            Fresh Produce
          </div>
          <h1 style={{ color:"#fff", fontSize:"clamp(28px,4vw,42px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8 }}>
            Product Catalog
          </h1>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15 }}>
            Fresh produce directly from verified farmers across India
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{
        background: tk.bgCard, borderBottom: `1px solid ${tk.border}`,
        padding: "14px 0", position: "sticky", top: 68, zIndex: 900,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 20px", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:220 }}>
            <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" }}>🔍</span>
            <input
              style={{ width:"100%", padding:"10px 14px 10px 38px", borderRadius:12, border:`1.5px solid ${tk.border}`, background:tk.bgInput, color:tk.text, fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color 0.2s" }}
              placeholder="Search products or farmers..."
              value={search} onChange={e => handleSearch(e.target.value)}
              onFocus={e => e.target.style.borderColor="#52b788"}
              onBlur={e => e.target.style.borderColor=tk.border}
            />
          </div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:"8px 16px", borderRadius:20,
                border:`1.5px solid ${cat===c ? "#52b788" : tk.border}`,
                background: cat===c ? "linear-gradient(135deg,#52b788,#40916c)" : "transparent",
                color: cat===c ? "#fff" : tk.textMid,
                cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit",
                transition:"all 0.2s ease",
                boxShadow: cat===c ? "0 4px 14px rgba(82,183,136,0.3)" : "none",
              }}>{c}</button>
            ))}
          </div>
          {!loading && <span style={{ color:tk.textLt, fontSize:13, marginLeft:"auto", whiteSpace:"nowrap" }}>{products.length} products</span>}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 20px 80px" }}>
        {error && (
          <div style={{ background:"#fff3cd", border:"1px solid #ffc107", borderRadius:14, padding:"16px 20px", marginBottom:24, color:"#856404", fontWeight:600 }}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius:20, overflow:"hidden", background:tk.bgCard, border:`1px solid ${tk.border}` }}>
                <div style={{ height:210, background:`linear-gradient(90deg,${tk.bgMuted} 25%,${tk.border} 50%,${tk.bgMuted} 75%)`, backgroundSize:"400px 100%", animation:"shimmer 1.4s ease infinite" }} />
                <div style={{ padding:18 }}>
                  <div style={{ height:16, borderRadius:8, background:tk.bgMuted, marginBottom:10, width:"70%" }} />
                  <div style={{ height:12, borderRadius:8, background:tk.bgMuted, marginBottom:14, width:"50%" }} />
                  <div style={{ height:36, borderRadius:10, background:tk.bgMuted }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 20px", color:tk.textLt }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
            <h3 style={{ fontSize:22, color:tk.text, marginBottom:8, fontFamily:"'Playfair Display',Georgia,serif" }}>No products found</h3>
            <p>Try a different category or search term</p>
            <button onClick={() => { setCat("All"); setSearch(""); setDSearch(""); }} style={{ marginTop:20, padding:"10px 24px", background:"linear-gradient(135deg,#52b788,#40916c)", color:"#fff", border:"none", borderRadius:20, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
              Show All Products
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
            {products.map((p, i) => (
              <div key={p.id || p._id} style={{ animation:`fadeInUp 0.5s ease ${Math.min(i,8)*0.06}s both` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
