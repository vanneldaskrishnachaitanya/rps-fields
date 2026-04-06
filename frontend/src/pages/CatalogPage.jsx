import { useState, useEffect, useRef } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import { API_BASE } from "../context/AuthContext";

const CATEGORIES = ["All","Vegetables","Fruits","Dairy","Dry Fruits","Grains","Spices"];

// Telangana + major Indian cities
const LOCATIONS = [
  "All Locations",
  "Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam",
  "Nalgonda","Adilabad","Mahabubnagar","Suryapet","Siddipet",
  "Vijayawada","Chennai","Bangalore","Mumbai","Delhi",
];

const CAT_ICONS = {
  "All":"🛒","Vegetables":"🥦","Fruits":"🍎","Dairy":"🥛",
  "Dry Fruits":"🥜","Grains":"🌾","Spices":"🌶️",
};

export default function CatalogPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [loc,      setLoc]      = useState("All Locations");
  const [cat,      setCat]      = useState("All");
  const [search,   setSearch]   = useState("");
  const [dSearch,  setDSearch]  = useState("");
  const [locSearch, setLocSearch] = useState("");
  const debounce = useRef(null);

  const load = (location, category, searchTerm) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (searchTerm) params.set("search", searchTerm);
    // filter by location client-side since backend may not support it
    fetch(`${API_BASE}/products?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          let prods = d.products;
          // Filter by location (farmerLocation field)
          if (location && location !== "All Locations") {
            prods = prods.filter(p => {
              const fl = (p.farmerLocation || p.location || "").toLowerCase();
              return fl.includes(location.toLowerCase());
            });
          }
          setProducts(prods);
        } else setError(d.error);
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(loc, cat, dSearch); }, [loc, cat, dSearch]); // eslint-disable-line

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setDSearch(val), 400);
  };

  const reset = () => { setLoc("All Locations"); setCat("All"); setSearch(""); setDSearch(""); };

  // Group products by location for display hints
  const locationCounts = products.reduce((acc, p) => {
    const l = p.farmerLocation || p.location || "Unknown";
    acc[l] = (acc[l] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ background: tk.bg, minHeight: "100%", fontFamily: "'Inter',sans-serif" }}>

      {/* ── Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#040d06,#0d2b1a,#1b4332,#2d6a4f)", padding: "52px 20px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 25% 50%,rgba(82,183,136,0.12),transparent 55%),radial-gradient(circle at 75% 40%,rgba(116,198,157,0.08),transparent 50%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.3)", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#74c69d", marginBottom:14 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block", animation:"pulse 2s infinite" }} />
            Fresh Produce Direct
          </div>
          <h1 style={{ color:"#fff", fontSize:"clamp(28px,4vw,42px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:8, fontWeight:700 }}>
            Product Catalog
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:15 }}>
            Browse farm-fresh produce by location — then filter by category
          </p>
        </div>
      </div>

      {/* ── STEP 1: Location selector ── */}
      <div className="sticky-filter" style={{ background: dark ? "rgba(4,13,6,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${tk.border}`, padding: "18px 0", position: "sticky", top: 64, zIndex: 900 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>

          {/* Step label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#52b788,#2d6a4f)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>1</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: tk.textMid, textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Choose Location
            </span>
            {loc !== "All Locations" && (
              <span style={{ fontSize: 11, color: tk.textLt, marginLeft: 4 }}>
                → showing {products.length} product{products.length !== 1 ? "s" : ""} from {loc}
              </span>
            )}
          </div>

          {/* Location search input */}
          <div style={{ position: "relative", marginBottom: 12, maxWidth: 300 }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>📍</span>
            <input
              style={{ width: "100%", padding: "9px 14px 9px 36px", borderRadius: 20, border: `1.5px solid ${tk.border}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", color: tk.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", boxSizing: "border-box" }}
              placeholder="Search locations..."
              value={locSearch} onChange={e => setLocSearch(e.target.value)}
              onFocus={e => { e.target.style.borderColor = "#52b788"; e.target.style.boxShadow = "0 0 0 3px rgba(82,183,136,0.2)"; }}
              onBlur={e => { e.target.style.borderColor = tk.border; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Location pills — scrollable */}
          <div style={{ overflowX: "auto", paddingBottom: 4 }}>
            <div className="filter-pills" style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
              {LOCATIONS.filter(l => l === "All Locations" || l.toLowerCase().includes(locSearch.toLowerCase())).map(l => {
                const isActive = loc === l;
                return (
                  <button key={l} onClick={() => setLoc(l)} style={{
                    padding: "7px 16px", borderRadius: 20, cursor: "pointer",
                    fontWeight: 600, fontSize: 13, fontFamily: "'Inter',sans-serif",
                    whiteSpace: "nowrap",
                    background: isActive ? "rgba(82,183,136,0.28)" : "transparent",
                    backdropFilter: isActive ? "blur(20px) saturate(180%)" : "none",
                    WebkitBackdropFilter: isActive ? "blur(20px) saturate(180%)" : "none",
                    border: `1.5px solid ${isActive ? "rgba(82,183,136,0.6)" : tk.border}`,
                    color: isActive ? "#fff" : tk.textMid,
                    boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,0.4),0 4px 12px rgba(82,183,136,0.25)" : "none",
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "#52b788"; e.currentTarget.style.color = tk.text; }}}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textMid; }}}
                  >
                    {l === "All Locations" ? "🌍 All Locations" : `📍 ${l}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 2: Category + Search ── */}
      <div style={{ background: dark ? "rgba(4,13,6,0.85)" : "rgba(248,252,249,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${tk.border}`, padding: "14px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>

          {/* Step label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#c8960c,#a37009)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>2</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: tk.textMid, textTransform: "uppercase", letterSpacing: "0.8px" }}>Filter by Category</span>
          </div>

          {/* Category pills */}
          <div className="filter-pills" style={{ display: "flex", gap: 7, flexWrap: "wrap", flex: 1 }}>
            {CATEGORIES.map(c => {
              const isActive = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: "7px 14px", borderRadius: 20, cursor: "pointer",
                  fontWeight: 600, fontSize: 13, fontFamily: "'Inter',sans-serif",
                  display: "flex", alignItems: "center", gap: 5,
                  background: isActive ? "rgba(200,150,12,0.28)" : "transparent",
                  backdropFilter: isActive ? "blur(20px) saturate(180%)" : "none",
                  WebkitBackdropFilter: isActive ? "blur(20px) saturate(180%)" : "none",
                  border: `1.5px solid ${isActive ? "rgba(200,150,12,0.6)" : tk.border}`,
                  color: isActive ? "#fff" : tk.textMid,
                  boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,0.4),0 4px 12px rgba(200,150,12,0.25)" : "none",
                  transition: "all 0.2s ease",
                }}>
                  <span>{CAT_ICONS[c]}</span> {c}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: "relative", minWidth: 220, flex: "0 0 260px" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
            <input
              style={{ width: "100%", padding: "9px 14px 9px 36px", borderRadius: 20, border: `1.5px solid ${tk.border}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", color: tk.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", boxSizing: "border-box" }}
              placeholder="Search products..."
              value={search} onChange={e => handleSearch(e.target.value)}
              onFocus={e => { e.target.style.borderColor = "#52b788"; e.target.style.boxShadow = "0 0 0 3px rgba(82,183,136,0.2)"; }}
              onBlur={e => { e.target.style.borderColor = tk.border; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {!loading && <span style={{ color: tk.textLt, fontSize: 12, flexShrink: 0 }}>{products.length} results</span>}
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 100px" }}>
        {error && (
          <div style={{ background: dark ? "rgba(220,38,38,0.12)" : "#fff3cd", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, color: dark ? "#fca5a5" : "#856404", fontWeight: 600 }}>
            ⚠ {error}
          </div>
        )}

        {/* Active filters summary */}
        {(loc !== "All Locations" || cat !== "All" || search) && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: tk.textMid, fontWeight: 600 }}>Active filters:</span>
            {loc !== "All Locations" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(82,183,136,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(82,183,136,0.25)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: tk.green4, fontWeight: 600 }}>
                📍 {loc} <span onClick={() => setLoc("All Locations")} style={{ cursor: "pointer", marginLeft: 2, opacity: 0.7 }}>×</span>
              </span>
            )}
            {cat !== "All" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(200,150,12,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(200,150,12,0.25)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: "#c8960c", fontWeight: 600 }}>
                {CAT_ICONS[cat]} {cat} <span onClick={() => setCat("All")} style={{ cursor: "pointer", marginLeft: 2, opacity: 0.7 }}>×</span>
              </span>
            )}
            {search && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(59,130,246,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: "#60a5fa", fontWeight: 600 }}>
                🔍 "{search}" <span onClick={() => { setSearch(""); setDSearch(""); }} style={{ cursor: "pointer", marginLeft: 2, opacity: 0.7 }}>×</span>
              </span>
            )}
            <button onClick={reset} style={{ fontSize: 12, color: tk.textLt, cursor: "pointer", background: "transparent", border: "none", fontFamily: "'Inter',sans-serif", textDecoration: "underline" }}>
              Clear all
            </button>
          </div>
        )}

        {/* Location summary chips (when All Locations is selected) */}
        {loc === "All Locations" && !loading && products.length > 0 && Object.keys(locationCounts).length > 1 && (
          <div style={{ marginBottom: 24, padding: "14px 18px", background: dark ? "rgba(12,26,15,0.6)" : "rgba(240,247,242,0.8)", backdropFilter: "blur(12px)", border: `1px solid ${tk.border}`, borderRadius: 14 }}>
            <div style={{ fontSize: 12, color: tk.textMid, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.6px" }}>
              📦 Products available from these locations:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(locationCounts).sort((a,b) => b[1]-a[1]).slice(0, 12).map(([location, count]) => (
                <button key={location} onClick={() => setLoc(location)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "transparent", border: `1px solid ${tk.border}`, borderRadius: 20, fontSize: 12, color: tk.textMid, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#52b788"; e.currentTarget.style.color = tk.green4; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textMid; }}>
                  📍 {location} <span style={{ background: dark ? "rgba(82,183,136,0.15)" : "rgba(82,183,136,0.1)", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700, color: tk.green4 }}>{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 22 }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: tk.bgCard, border: `1px solid ${tk.border}` }}>
                <div style={{ height: 200, background: `linear-gradient(90deg,${tk.bgMuted} 25%,${tk.border} 50%,${tk.bgMuted} 75%)`, backgroundSize: "400px 100%", animation: "shimmer 1.4s ease infinite" }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 16, borderRadius: 8, background: tk.bgMuted, marginBottom: 8, width: "70%" }} />
                  <div style={{ height: 12, borderRadius: 8, background: tk.bgMuted, marginBottom: 14, width: "45%" }} />
                  <div style={{ height: 32, borderRadius: 12, background: tk.bgMuted }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🔍</div>
            <h3 style={{ fontSize: 22, color: tk.text, marginBottom: 8, fontFamily: "'Playfair Display',Georgia,serif" }}>No products found</h3>
            <p style={{ color: tk.textLt, marginBottom: 24 }}>
              {loc !== "All Locations" ? `No ${cat !== "All" ? cat.toLowerCase() : "products"} available in ${loc} yet.` : "Try a different filter or search term"}
            </p>
            <button onClick={reset} style={{ padding: "11px 28px", background: "rgba(82,183,136,0.28)", backdropFilter: "blur(28px) saturate(200%)", WebkitBackdropFilter: "blur(28px) saturate(200%)", border: "1px solid rgba(255,255,255,0.30)", color: "#fff", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", borderRadius: 50, cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif", fontSize: 14 }}>
              Show All Products
            </button>
          </div>
        ) : (
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 22 }}>
            {products.map((p, i) => (
              <div key={p.id || p._id} style={{ animation: `fadeUp 0.5s ease ${Math.min(i,8)*0.06}s both` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
