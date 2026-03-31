import { useNavigate } from 'react-router-dom';
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../context/AuthContext";
import { CATEGORIES } from "../data/products";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=1400&q=90",
    tag: "100% Direct from Farms",
    title: "From Our Farmers\nto Your Family",
    sub: "Fresh, chemical-free produce delivered straight from verified farms across Telangana",
    cta: "Shop Fresh Now",
  },
  {
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=90",
    tag: "Harvest Season",
    title: "Nature's Finest\nJust Harvested",
    sub: "Seasonal vegetables and fruits picked at peak ripeness — no cold storage, no chemicals",
    cta: "Explore Catalog",
  },
  {
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&q=90",
    tag: "Farm Fresh Daily",
    title: "Straight from the\nField to You",
    sub: "Our farmers harvest every morning. Your order reaches you within 24 hours of picking",
    cta: "Order Today",
  },
  {
    img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1400&q=90",
    tag: "Organic Certified",
    title: "Real Food, Real\nFarmers, Real Trust",
    sub: "Every farmer on RPS Fields is verified. Every product is quality-checked before dispatch",
    cta: "View Products",
  },
];

const STATS = [
  { num: "50+",  label: "Product Types",      icon: "🥦" },
  { num: "100%", label: "Farm Fresh",         icon: "🌾" },
  { num: "24h",  label: "Delivery Guarantee", icon: "🚚" },
  { num: "0",    label: "Chemicals Used",     icon: "✅" },
];

const WHY = [
  { icon: "🌿", title: "100% Organic",      desc: "Certified organic farms. Zero harmful chemicals, ever." },
  { icon: "🚚", title: "Same-Day Delivery", desc: "Order by noon, delivered fresh the same evening." },
  { icon: "💰", title: "Farmer Fair Price", desc: "Direct sourcing. Farmers earn more, you pay less." },
  { icon: "🔒", title: "Quality Checked",   desc: "Every product inspected before it leaves the farm." },
  { icon: "🤝", title: "Verified Farmers",  desc: "All farmers on our platform are background-verified." },
  { icon: "📱", title: "Easy Ordering",     desc: "Order in seconds. Track delivery in real time." },
];

export default function HomePage() {
  const navigate  = useNavigate();
  const { dark }  = useTheme();
  const tk        = TK(dark);
  const [products, setProducts]   = useState([]);
  const [slide, setSlide]         = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible]     = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products.slice(0, 6)); })
      .catch(() => {});
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => changeSlide(s => (s + 1) % SLIDES.length), 5000);
  };

  const changeSlide = (indexOrFn) => {
    setAnimating(true);
    setTimeout(() => { setSlide(indexOrFn); setAnimating(false); }, 350);
    startTimer();
  };

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true })); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-id]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [products]);

  const reveal = (id, delay = 0) => ({
    opacity:   visible[id] ? 1 : 0,
    transform: visible[id] ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  const cur = SLIDES[slide];

  return (
    <div style={{ background: tk.bg, overflowX: "hidden" }}>

      {/* ─────────────── HERO SLIDER ─────────────── */}
      <section style={{ position: "relative", height: "clamp(420px,88vh,780px)", minHeight: 520, maxHeight: 780, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${cur.img})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: animating ? 0 : 1,
          transform: animating ? "scale(1.03)" : "scale(1)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0.05) 100%)" }} />

        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center", maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(82,183,136,0.22)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(82,183,136,0.45)", borderRadius: 30,
              padding: "5px 16px", marginBottom: 22,
              opacity: animating ? 0 : 1, transform: animating ? "translateY(-8px)" : "none",
              transition: "all 0.5s ease 0.1s",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#52b788", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#74c69d", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>{cur.tag}</span>
            </div>

            <h1 style={{
              color: "#fff", fontSize: "clamp(28px, 5.2vw, 60px)",
              fontFamily: "'Playfair Display',Georgia,serif",
              fontWeight: 700, lineHeight: 1.1, marginBottom: 20,
              opacity: animating ? 0 : 1, transform: animating ? "translateY(18px)" : "none",
              transition: "all 0.5s ease 0.18s", whiteSpace: "pre-line",
            }}>{cur.title}</h1>

            <p style={{
              color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.7,
              maxWidth: 460, marginBottom: 34,
              opacity: animating ? 0 : 1, transform: animating ? "translateY(18px)" : "none",
              transition: "all 0.5s ease 0.26s",
            }}>{cur.sub}</p>

            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start",
              opacity: animating ? 0 : 1, transform: animating ? "translateY(18px)" : "none",
              transition: "all 0.5s ease 0.34s",
            }}>
              <button onClick={() => navigate("/catalog")} style={{
                background: "rgba(200,150,12,0.32)", color: "#1b2e10",
                border: "none", padding: "14px 34px", borderRadius: 50,
                cursor: "pointer", fontWeight: 800, fontSize: 15, fontFamily: "inherit",
                boxShadow: "0 6px 24px rgba(212,160,23,0.4)", letterSpacing: "0.2px",
                transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 32px rgba(212,160,23,0.55)"; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 6px 24px rgba(212,160,23,0.4)"; }}
              >{cur.cta} →</button>

              <button onClick={() => navigate("/register")} style={{
                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
                padding: "14px 28px", borderRadius: 50, cursor: "pointer",
                fontWeight: 700, fontSize: 15, fontFamily: "inherit", transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              >Join as Farmer / Agent</button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => changeSlide(i)} style={{
              width: i === slide ? 28 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
              background: i === slide ? "#52b788" : "rgba(255,255,255,0.38)",
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

        {/* Arrows */}
        <button onClick={() => changeSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)} style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:42, height:42, borderRadius:"50%", cursor:"pointer", fontSize:16, zIndex:3, transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.3)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
        >❮</button>
        <button onClick={() => changeSlide(s => (s + 1) % SLIDES.length)} style={{ position:"absolute", right:18, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:42, height:42, borderRadius:"50%", cursor:"pointer", fontSize:16, zIndex:3, transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.3)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
        >❯</button>
      </section>

      {/* ─────────────── STATS BAR ─────────────── */}
      <div style={{ background: dark ? "#0f2018" : "#1b4332", borderBottom: "3px solid #52b788" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))" }}>
          {STATS.map((s, i) => (
            <div key={i} data-id={`stat-${i}`} style={{ textAlign:"center", padding:"22px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", ...reveal(`stat-${i}`, i * 0.08) }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:900, color:"#74c69d", fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"' }}>{s.num}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"1.2px", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────── CATEGORIES ─────────────── */}
      <section style={{ padding: "72px 20px", background: tk.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div data-id="cat-hd" style={{ textAlign:"center", marginBottom:48, ...reveal("cat-hd") }}>
            <span style={{ display:"inline-block", background: dark?"#1c3525":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:14 }}>Shop by Category</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,40px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:10 }}>Find What You're Looking For</h2>
            <p style={{ color:tk.textLt, fontSize:15, maxWidth:460, margin:"0 auto" }}>From crisp vegetables to premium dry fruits — all direct from farms</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:18 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={cat.name} data-id={`cat-${i}`} onClick={() => navigate("/catalog")} style={{
                borderRadius:20, overflow:"hidden", cursor:"pointer",
                position:"relative", height:200,
                boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
                transition:"all 0.3s ease",
                ...reveal(`cat-${i}`, i * 0.08),
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-7px) scale(1.02)"; e.currentTarget.style.boxShadow="0 14px 40px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.12)"; }}
              >
                <img src={cat.img} alt={cat.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s ease" }}
                  onMouseEnter={e => e.target.style.transform="scale(1.1)"}
                  onMouseLeave={e => e.target.style.transform="scale(1)"}
                />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 55%)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"16px 14px" }}>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{cat.name}</div>
                  <div style={{ color:"rgba(255,255,255,0.65)", fontSize:11, marginTop:3 }}>Explore →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURED PRODUCTS ─────────────── */}
      <section style={{ padding:"20px 20px 56px", background: dark?"#080f09":"#eef7f0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div data-id="feat-hd" style={{ textAlign:"center", marginBottom:48, ...reveal("feat-hd") }}>
            <span style={{ display:"inline-block", background: dark?"#1c3525":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:14 }}>Featured This Week</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,40px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:10 }}>Handpicked Fresh Arrivals</h2>
            <p style={{ color:tk.textLt, fontSize:15 }}>Curated by our farmers — freshest produce available right now</p>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:tk.textLt }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🌾</div>
              <p>Loading fresh products...</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
              {products.map((p, i) => (
                <div key={p.id} data-id={`prod-${i}`} style={reveal(`prod-${i}`, i * 0.09)}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <div data-id="view-all" style={{ textAlign:"center", marginTop:48, ...reveal("view-all") }}>
            <button onClick={() => navigate("/catalog")} style={{
              background:"rgba(82,183,136,0.28)", color:"#fff",
              border:"none", padding:"14px 42px", borderRadius:50, cursor:"pointer",
              fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif",
              boxShadow:"0 6px 24px rgba(82,183,136,0.35)", transition:"all 0.25s",
            }}
              onMouseEnter={e => { e.target.style.transform="translateY(-2px)"; e.target.style.boxShadow="0 12px 36px rgba(82,183,136,0.5)"; }}
              onMouseLeave={e => { e.target.style.transform="none"; e.target.style.boxShadow="0 6px 24px rgba(82,183,136,0.35)"; }}
            >View All Products →</button>
          </div>
        </div>
      </section>

      {/* ─────────────── TRUST BANNER ─────────────── */}
      <div style={{ background:"linear-gradient(135deg,#1b4332,#2d6a4f,#1b4332)", padding:"52px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(82,183,136,0.14),transparent 60%),radial-gradient(circle at 80% 50%,rgba(116,198,157,0.09),transparent 60%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div data-id="trust" style={reveal("trust")}>
            <div style={{ fontSize:36, marginBottom:16 }}>⭐⭐⭐⭐⭐</div>
            <h2 style={{ color:"#fff", fontSize:"clamp(22px,3vw,36px)", fontFamily:"'Playfair Display',Georgia,serif", marginBottom:14, lineHeight:1.4, fontStyle:"italic" }}>
              "The freshest produce I've ever received,<br />straight from the farm to my kitchen."
            </h2>
            <p style={{ color:"#74c69d", fontSize:13, fontWeight:700, letterSpacing:"1px" }}>— Priya M., Hyderabad customer since 2024</p>
          </div>
          <div data-id="trust2" style={{ display:"flex", justifyContent:"center", gap:44, marginTop:52, flexWrap:"wrap", ...reveal("trust2", 0.2) }}>
            {[["🌾","500+","Verified Farmers"],["📦","10K+","Orders Delivered"],["⭐","4.8/5","Avg Rating"],["🗺","15+","States Covered"]].map(([icon,num,label]) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
                <div style={{ color:"#fff", fontSize:26, fontWeight:900, fontFamily:"'Playfair Display',Georgia,serif" }}>{num}</div>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────── WHY US ─────────────── */}
      <section style={{ padding:"56px 20px", background:tk.bg }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div data-id="why-hd" style={{ textAlign:"center", marginBottom:52, ...reveal("why-hd") }}>
            <span style={{ display:"inline-block", background: dark?"#1c3525":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:14 }}>Why RPS Fields</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,40px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text }}>What Makes Us Different</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
            {WHY.map((w, i) => (
              <div key={w.title} data-id={`why-${i}`} style={{
                background:tk.bgCard, borderRadius:20, padding:"30px 26px",
                border:`1px solid ${tk.border}`, transition:"all 0.3s ease",
                ...reveal(`why-${i}`, i * 0.07),
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 14px 40px rgba(27,67,50,0.15)"; e.currentTarget.style.borderColor="#52b788"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=tk.border; }}
              >
                <div style={{ width:50, height:50, borderRadius:14, background: dark?"#1c3525":"#e8f5ee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:16 }}>{w.icon}</div>
                <div style={{ fontWeight:800, fontSize:16, color:tk.text, marginBottom:8 }}>{w.title}</div>
                <div style={{ fontSize:13, color:tk.textLt, lineHeight:1.65 }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── JOIN CTA ─────────────── */}
      <section style={{ padding:"48px 20px 80px", background: dark?"#080f09":"#f0f7f2", borderTop:`1px solid ${tk.border}` }}>
        <div data-id="cta" style={{ maxWidth:680, margin:"0 auto", textAlign:"center", ...reveal("cta") }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🌿</div>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:14 }}>
            Are You a Farmer or Agent?
          </h2>
          <p style={{ color:tk.textLt, fontSize:15, lineHeight:1.75, maxWidth:460, margin:"0 auto 34px" }}>
            Join the RPS Fields network. List your produce, reach thousands of customers across Telangana, and earn more by cutting out the middleman.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navigate("/register/farmer")} style={{ background:"rgba(82,183,136,0.25)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", border:"1px solid rgba(255,255,255,0.28)", color:"#fff", padding:"14px 32px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:"0 6px 24px rgba(27,67,50,0.3)", transition:"all 0.25s" }}
              onMouseEnter={e => e.target.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform="none"}
            >🌾 Join as Farmer</button>
            <button onClick={() => navigate("/register/agent")} style={{ background:"rgba(59,130,246,0.25)", backdropFilter:"blur(28px) saturate(200%)", WebkitBackdropFilter:"blur(28px) saturate(200%)", border:"1px solid rgba(255,255,255,0.30)", color:"#fff", boxShadow:"inset 0 1.5px 0 rgba(255,255,255,0.55),inset 0 -1px 0 rgba(0,0,0,0.12),0 8px 28px rgba(0,0,0,0.22)", padding:"14px 32px", borderRadius:50, cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"'Inter',sans-serif", boxShadow:"0 6px 24px rgba(30,64,175,0.3)", transition:"all 0.25s" }}
              onMouseEnter={e => e.target.style.transform="translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform="none"}
            >🏢 Join as Agent</button>
          </div>
        </div>
      </section>

    </div>
  );
}
