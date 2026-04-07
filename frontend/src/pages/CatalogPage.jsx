import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import { API_BASE } from "../context/AuthContext";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "qty-high", label: "Quantity: High to Low" },
  { value: "qty-low", label: "Quantity: Low to High" },
];

export default function CatalogPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [loc,      setLoc]      = useState("all");
  const [sortBy,   setSortBy]   = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [search,   setSearch]   = useState("");
  const [dSearch,  setDSearch]  = useState("");
  const debounce = useRef(null);

  const load = (searchTerm) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    fetch(`${API_BASE}/products?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProducts(d.products || []);
        } else setError(d.error);
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(dSearch); }, [dSearch]); // eslint-disable-line

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setDSearch(val), 400);
  };

  const reset = () => { setLoc("all"); setSortBy("default"); setSearch(""); setDSearch(""); };

  const locations = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const val = (p.farmerLocation || p.location || "").trim();
      if (val) set.add(val);
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (loc !== "all") {
      list = list.filter((p) => {
        const l = (p.farmerLocation || p.location || "").toLowerCase();
        return l.includes(loc.toLowerCase());
      });
    }

    const getPrice = (p) => Number(p.price || p.pricePerKg || 0);
    const getQty = (p) => Number(p.quantity ?? p.qty ?? 0);

    if (sortBy === "price-high") list.sort((a, b) => getPrice(b) - getPrice(a));
    if (sortBy === "price-low") list.sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === "qty-high") list.sort((a, b) => getQty(b) - getQty(a));
    if (sortBy === "qty-low") list.sort((a, b) => getQty(a) - getQty(b));

    return list;
  }, [products, loc, sortBy]);

  return (
    <div style={{ background: tk.bg, minHeight: "100%", fontFamily: "'Inter',sans-serif" }}>

      {/* ── Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#040d06,#0d2b1a,#1b4332,#2d6a4f)", padding: "clamp(14px,2.1vw,22px) clamp(10px,2.2vw,24px) clamp(12px,2vw,20px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 25% 50%,rgba(82,183,136,0.12),transparent 55%),radial-gradient(circle at 75% 40%,rgba(116,198,157,0.08),transparent 50%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(82,183,136,0.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(82,183,136,0.3)", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#74c69d", marginBottom:14 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#52b788", display:"inline-block", animation:"pulse 2s infinite" }} />
            Fresh Produce Direct
          </div>
          <h1 style={{ color:"#fff", fontSize:"clamp(22px,3vw,32px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:6, fontWeight:700 }}>
            Product Catalog
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>
            Search products quickly, then refine with location and sort filters
          </p>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="sticky-filter" style={{ background: dark ? "rgba(4,13,6,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${tk.border}`, padding: "14px 0", position: "sticky", top: 64, zIndex: 900 }}>
        <div style={{ maxWidth: 1680, margin: "0 auto", padding: "0 clamp(10px,2.2vw,24px)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 320px", minWidth: 220 }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
              <input
                style={{ width: "100%", padding: "9px 14px 9px 36px", borderRadius: 20, border: `1.5px solid ${tk.border}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", color: tk.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", boxSizing: "border-box" }}
                placeholder="Search products..."
                value={search} onChange={e => handleSearch(e.target.value)}
                onFocus={e => { e.target.style.borderColor = "#52b788"; e.target.style.boxShadow = "0 0 0 3px rgba(82,183,136,0.2)"; }}
                onBlur={e => { e.target.style.borderColor = tk.border; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <button
              data-magnetic
              onClick={() => setShowFilters((v) => !v)}
              style={{
                padding: "9px 16px",
                borderRadius: 20,
                border: `1.5px solid ${showFilters ? "rgba(82,183,136,0.6)" : tk.border}`,
                background: showFilters ? "rgba(82,183,136,0.2)" : "transparent",
                color: showFilters ? "#fff" : tk.textMid,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              Filter Options
            </button>

            {!loading && <span style={{ color: tk.textLt, fontSize: 12, flexShrink: 0 }}>{filteredProducts.length} results</span>}
          </div>

          {showFilters && (
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: tk.textLt, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 700 }}>By Location</div>
                <select
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 12, border: `1.5px solid ${tk.border}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", color: tk.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif" }}
                >
                  {locations.map((l) => (
                    <option key={l} value={l}>{l === "all" ? "All Locations" : l}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 11, color: tk.textLt, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 700 }}>Sort</div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 12, border: `1.5px solid ${tk.border}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", color: tk.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "end" }}>
                <button
                  data-magnetic
                  onClick={reset}
                  style={{ width: "100%", padding: "9px 14px", borderRadius: 12, border: `1.5px solid ${tk.border}`, background: "transparent", color: tk.textMid, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div style={{ maxWidth: 1680, margin: "0 auto", padding: "16px clamp(10px,2.2vw,24px) 64px" }}>
        {error && (
          <div style={{ background: dark ? "rgba(220,38,38,0.12)" : "#fff3cd", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 14, padding: "16px var(--page-px,clamp(16px,4vw,48px))", marginBottom: 24, color: dark ? "#fca5a5" : "#856404", fontWeight: 600 }}>
            ⚠ {error}
          </div>
        )}

        {(loc !== "all" || search || sortBy !== "default") && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: tk.textMid, fontWeight: 600 }}>Active filters:</span>
            {loc !== "all" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(82,183,136,0.12)", border: "1px solid rgba(82,183,136,0.25)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: tk.green4, fontWeight: 600 }}>
                📍 {loc}
              </span>
            )}
            {search && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: "#60a5fa", fontWeight: 600 }}>
                🔍 "{search}"
              </span>
            )}
            {sortBy !== "default" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(200,150,12,0.12)", border: "1px solid rgba(200,150,12,0.25)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: "#c8960c", fontWeight: 600 }}>
                ↕ {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="product-grid catalog-grid">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} style={{ borderRadius: 18, overflow: "hidden", background: tk.bgCard, border: `1px solid ${tk.border}` }}>
                <div style={{ height: 200, background: `linear-gradient(90deg,${tk.bgMuted} 25%,${tk.border} 50%,${tk.bgMuted} 75%)`, backgroundSize: "400px 100%", animation: "shimmer 1.4s ease infinite" }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 16, borderRadius: 8, background: tk.bgMuted, marginBottom: 8, width: "70%" }} />
                  <div style={{ height: 12, borderRadius: 8, background: tk.bgMuted, marginBottom: 14, width: "45%" }} />
                  <div style={{ height: 32, borderRadius: 12, background: tk.bgMuted }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px var(--page-px,clamp(16px,4vw,48px))" }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🔍</div>
            <h3 style={{ fontSize: 22, color: tk.text, marginBottom: 8, fontFamily: "'Playfair Display',Georgia,serif" }}>No products found</h3>
            <p style={{ color: tk.textLt, marginBottom: 24 }}>
              Try another location, sort, or search term.
            </p>
            <button data-magnetic onClick={reset} style={{ padding: "11px 28px", background: "rgba(82,183,136,0.28)", backdropFilter: "blur(28px) saturate(200%)", WebkitBackdropFilter: "blur(28px) saturate(200%)", border: "1px solid rgba(255,255,255,0.30)", color: "#fff", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", borderRadius: 50, cursor: "pointer", fontWeight: 700, fontFamily: "'Inter',sans-serif", fontSize: 14 }}>
              Show All Products
            </button>
          </div>
        ) : (
          <div className="product-grid catalog-grid">
            {filteredProducts.map((p, i) => (
              <div key={p.id || p._id} style={{ minWidth: 0, animation: `fadeUp 0.5s ease ${Math.min(i,10)*0.04}s both` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
