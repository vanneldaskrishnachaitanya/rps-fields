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

const FEATURED_LABELS = ["Fresh Today", "Best Seller", "Low Stock", "Farm Direct"];

export default function CatalogPage() {
  const { dark } = useTheme(); const tk = TK(dark);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [loc,      setLoc]      = useState("all");
  const [sortBy,   setSortBy]   = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [search,   setSearch]   = useState("");
  const [dSearch,  setDSearch]  = useState("");
  const debounce = useRef(null);
  const filterPanelRef = useRef(null);

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

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!filterPanelRef.current) return;
      if (!filterPanelRef.current.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("catalog-saved-products") || "[]");
      const compared = JSON.parse(localStorage.getItem("catalog-compared-products") || "[]");
      setSavedIds(Array.isArray(saved) ? saved : []);
      setCompareIds(Array.isArray(compared) ? compared : []);
    } catch {
      setSavedIds([]);
      setCompareIds([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("catalog-saved-products", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("catalog-compared-products", JSON.stringify(compareIds));
  }, [compareIds]);

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

  const featuredProducts = useMemo(() => {
    const ranked = [...products].sort((a, b) => {
      const aScore = Number(b.avgRating || 0) - Number(a.avgRating || 0);
      const aPrice = Number(a.price || a.pricePerKg || 0);
      const bPrice = Number(b.price || b.pricePerKg || 0);
      return aScore || aPrice - bPrice;
    });
    return ranked.slice(0, 4).map((product, index) => ({
      ...product,
      spotlight: FEATURED_LABELS[index],
    }));
  }, [products]);

  const smartChips = [
    { key: "near", label: "Near Me", action: () => setLoc(locations[1] || "all") },
    { key: "cheap", label: "Under ₹50", action: () => setSortBy("price-low") },
    { key: "fresh", label: "Fresh Stock", action: () => setSortBy("qty-high") },
    { key: "seasonal", label: "Seasonal", action: () => setSearch("seasonal") },
    { key: "organic", label: "Organic", action: () => setSearch("organic") },
    { key: "fast", label: "Fast Delivery", action: () => setSearch("delivery") },
  ];

  const selectedLocationLabel = loc === "all" ? "All Locations" : loc;
  const selectedSortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label || "Default";
  const activeFilterCount = Number(loc !== "all") + Number(sortBy !== "default") + Number(Boolean(search));

  const toggleSaved = (product) => {
    const id = product.id || product._id;
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleCompared = (product) => {
    const id = product.id || product._id;
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

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

      {/* ── Featured Picks ── */}
      <div style={{ padding: "16px clamp(10px,2.2vw,24px) 6px" }}>
        <div style={{ maxWidth: 1680, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: tk.green4, marginBottom: 4 }}>Handpicked For You</div>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: tk.text, lineHeight: 1.1 }}>Featured Picks</h2>
            </div>
            <span style={{ fontSize: 12, color: tk.textLt }}>Curated highlights to start browsing faster</span>
          </div>

          <div className="featured-strip">
            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => (
              <button
                key={product.id || product._id || index}
                data-magnetic
                onClick={() => setSearch(product.name)}
                className={`featured-chip ${dark ? "featured-chip-dark" : "featured-chip-light"}`}
              >
                <div className="featured-chip-badge">{product.spotlight}</div>
                <div className="featured-chip-title">{product.name}</div>
                <div className="featured-chip-meta">₹{Number(product.price || product.pricePerKg || 0).toLocaleString("en-IN")} / {product.unit || "kg"}</div>
              </button>
            )) : (
              <div className={`catalog-empty ${dark ? "catalog-empty-dark" : "catalog-empty-light"}`} style={{ marginTop: 0 }}>
                <div className="catalog-empty-graphic">✨</div>
                <h3>Featured picks will appear here</h3>
                <p>As soon as products load, this strip becomes a curated launchpad for the catalog.</p>
              </div>
            )}
          </div>
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

          <div className="smart-chip-row">
            {smartChips.map((chip) => (
              <button
                key={chip.key}
                data-magnetic
                onClick={chip.action}
                className={`smart-chip ${dark ? "smart-chip-dark" : "smart-chip-light"}`}
                style={{ animationDelay: `${smartChips.findIndex((item) => item.key === chip.key) * 0.05}s` }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div ref={filterPanelRef} className="catalog-filter-panel" style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
              <div className="catalog-dropdown-shell">
                <div className="catalog-dropdown-label">By Location</div>
                <button
                  data-magnetic
                  type="button"
                  className={`catalog-dropdown-trigger ${dark ? "catalog-dropdown-dark" : "catalog-dropdown-light"}`}
                  onClick={() => setOpenMenu((current) => current === "location" ? null : "location")}
                >
                  <span className="catalog-dropdown-value">{selectedLocationLabel}</span>
                  <span className={`catalog-dropdown-caret ${openMenu === "location" ? "is-open" : ""}`}>▾</span>
                </button>
                {openMenu === "location" && (
                  <div className={`catalog-dropdown-menu ${dark ? "catalog-dropdown-menu-dark" : "catalog-dropdown-menu-light"}`}>
                    {locations.map((location) => {
                      const active = loc === location;
                      const label = location === "all" ? "All Locations" : location;
                      return (
                        <button
                          key={location}
                          type="button"
                          data-magnetic
                          className={`catalog-dropdown-item ${active ? "is-active" : ""}`}
                          onClick={() => { setLoc(location); setOpenMenu(null); }}
                        >
                          <span>{label}</span>
                          {active && <span className="catalog-dropdown-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="catalog-dropdown-shell">
                <div className="catalog-dropdown-label">Sort</div>
                <button
                  data-magnetic
                  type="button"
                  className={`catalog-dropdown-trigger ${dark ? "catalog-dropdown-dark" : "catalog-dropdown-light"}`}
                  onClick={() => setOpenMenu((current) => current === "sort" ? null : "sort")}
                >
                  <span className="catalog-dropdown-value">{selectedSortLabel}</span>
                  <span className={`catalog-dropdown-caret ${openMenu === "sort" ? "is-open" : ""}`}>▾</span>
                </button>
                {openMenu === "sort" && (
                  <div className={`catalog-dropdown-menu ${dark ? "catalog-dropdown-menu-dark" : "catalog-dropdown-menu-light"}`}>
                    {SORT_OPTIONS.map((option) => {
                      const active = sortBy === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          data-magnetic
                          className={`catalog-dropdown-item ${active ? "is-active" : ""}`}
                          onClick={() => { setSortBy(option.value); setOpenMenu(null); }}
                        >
                          <span>{option.label}</span>
                          {active && <span className="catalog-dropdown-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "end" }}>
                <button
                  data-magnetic
                  onClick={() => { reset(); setOpenMenu(null); }}
                  style={{ width: "100%", minHeight: 52, padding: "9px 14px", borderRadius: 16, border: `1.5px solid ${tk.border}`, background: "linear-gradient(135deg, rgba(82,183,136,0.10), rgba(45,106,79,0.04))", color: tk.textMid, fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
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
        <div className={`summary-bar ${dark ? "summary-bar-dark" : "summary-bar-light"}`}>
          <div className="summary-bar-left">
            <span className="summary-pill summary-pill-strong">{filteredProducts.length} items</span>
            <span className="summary-pill" style={{ background: "rgba(82,183,136,0.10)", color: tk.textMid, border: "1px solid rgba(82,183,136,0.16)" }}>{activeFilterCount} active filters</span>
            <span className="summary-copy">matching your current filters</span>
          </div>
          <div className="summary-bar-right">
            <button data-magnetic onClick={reset} className="summary-action summary-action-ghost">Clear All</button>
            <button data-magnetic onClick={() => setSortBy("default")} className="summary-action summary-action-primary">Reset Sort</button>
          </div>
        </div>

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
          <div className={`catalog-empty ${dark ? "catalog-empty-dark" : "catalog-empty-light"}`}>
            <div className="catalog-empty-graphic">🌾</div>
            <h3>No products found</h3>
            <p>Try a different filter or jump into a trending category below.</p>
            <div className="catalog-empty-actions">
              <button data-magnetic onClick={reset} className="summary-action summary-action-primary">Show All Products</button>
              <button data-magnetic onClick={() => { setSearch(""); setSortBy("default"); setLoc("all"); }} className="summary-action summary-action-ghost">Reset Everything</button>
            </div>
          </div>
        ) : (
          <div className="product-grid catalog-grid">
            {filteredProducts.map((p, i) => (
              <div key={p.id || p._id} style={{ minWidth: 0, animation: `fadeUp 0.5s ease ${Math.min(i,10)*0.04}s both` }}>
                <ProductCard
                  product={p}
                  onQuickView={() => setQuickViewProduct(p)}
                  onToggleSave={() => toggleSaved(p)}
                  onToggleCompare={() => toggleCompared(p)}
                  isSaved={savedIds.includes(p.id || p._id)}
                  isCompared={compareIds.includes(p.id || p._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <div className="catalog-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className={`catalog-modal ${dark ? "catalog-modal-dark" : "catalog-modal-light"}`} onClick={(e) => e.stopPropagation()}>
            <button className="catalog-modal-close" onClick={() => setQuickViewProduct(null)}>×</button>
            <div className="catalog-modal-grid">
              <div className="catalog-modal-image-wrap">
                <img src={quickViewProduct.img || quickViewProduct.image} alt={quickViewProduct.name} className="catalog-modal-image" />
                <div className="catalog-modal-tag">{quickViewProduct.category}</div>
              </div>
              <div className="catalog-modal-content">
                <div className="catalog-modal-kicker">Quick View</div>
                <h3>{quickViewProduct.name}</h3>
                <p className="catalog-modal-farmer">🧑‍🌾 {quickViewProduct.farmerName || quickViewProduct.farmer || "Farmer"}</p>
                <div className="catalog-modal-price">₹{Number(quickViewProduct.price || quickViewProduct.pricePerKg || 0).toLocaleString("en-IN")} <span>/{quickViewProduct.unit || "kg"}</span></div>
                <div className="catalog-modal-info-row">
                  <span>📍 {quickViewProduct.farmerLocation || quickViewProduct.location || "Location unavailable"}</span>
                  <span>⭐ {Number(quickViewProduct.avgRating || 0).toFixed(1)}</span>
                </div>
                <p className="catalog-modal-description">
                  A fast snapshot of the product so customers can decide instantly without leaving the catalog.
                </p>
                <div className="catalog-modal-actions">
                  <button data-magnetic onClick={() => setQuickViewProduct(null)} className="summary-action summary-action-ghost">Keep Browsing</button>
                  <button data-magnetic onClick={() => { setQuickViewProduct(null); toggleSaved(quickViewProduct); }} className="summary-action summary-action-primary">Save for Later</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
