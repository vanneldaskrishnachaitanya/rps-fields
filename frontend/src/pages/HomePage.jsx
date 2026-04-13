/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useTheme, TK } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";
import MagneticText from "../components/MagneticText";
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

const ScrollRevealTestimonial = ({ dark, tk }) => {
  const containerRef = useRef(null);

  const testimonials = [
    {
      text: "The delivery is incredibly fast, and the farm freshness is unmatched. I won't buy my vegetables anywhere else.",
      author: "Rajesh K.",
      location: "Verified Customer",
      highlights: ["incredibly fast", "unmatched"]
    },
    {
      text: "Since ordering directly from the farmers here, we've seen a huge difference in taste. Healthy, organic, and highly recommended.",
      author: "Priya M.",
      location: "Verified Mother",
      highlights: ["huge difference in taste", "highly recommended"]
    },
    {
      text: "A truly wonderful initiative that supports local agriculture while giving us access to the freshest ingredients perfectly packaged.",
      author: "Arun V.",
      location: "Verified Chef",
      highlights: ["freshest ingredients", "supports local agriculture"]
    }
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) { ticking = false; return; }
          const rect = containerRef.current.getBoundingClientRect();
          const wh = window.innerHeight;
          let p = (wh * 0.7 - rect.top) / (rect.height * 0.85);
          p = Math.max(0, Math.min(1, p));
          containerRef.current.style.setProperty('--scroll-p', p);

          const blocks = containerRef.current.querySelectorAll('.wacus-block');
          const thresholds = [0.15, 0.45, 0.75];
          blocks.forEach((el, index) => {
             if (p > thresholds[index]) {
               el.classList.add('wacus-active');
             } else {
               el.classList.remove('wacus-active');
             }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} style={{ padding: "100px var(--page-px)", background: tk.bg, position: "relative", overflow: "hidden" }}>
      
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 3 }}>
        <div style={{ 
            display: "inline-block", background: "rgba(234, 88, 12, 0.1)", color: "#ea580c", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase" 
        }}>
           What our customers say
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", paddingBottom: 80 }}>
        
        {/* Unified Text Blocks */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 840, margin: "0 auto" }}>
          <style>
            {`
              .wacus-block {
                color: rgba(120, 130, 125, 0.3);
                transition: color 0.6s cubic-bezier(0.22,1,0.36,1);
              }
              .wacus-block.wacus-active {
                color: ${dark ? "#ffffff" : "#111111"};
              }
              .wacus-block .wacus-hl {
                color: inherit;
                transition: all 0.6s cubic-bezier(0.22,1,0.36,1);
                background-color: transparent;
                border-radius: 4px;
                padding: 0;
              }
              .wacus-block.wacus-active .wacus-hl {
                color: #fff;
                background-color: #ea580c;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 100 100'%3E%3Cpath d='M0,10 Q50,0 100,10 L100,90 Q50,100 0,90 Z' fill='%23ea580c' opacity='0.9'/%3E%3C/svg%3E");
                background-size: 100% 100%;
                padding: 2px 8px;
                margin: 0 4px;
                display: inline-block;
                transform: rotate(-1.5deg) scale(1.02);
                box-shadow: 0 4px 14px rgba(234, 88, 12, 0.25);
              }
              .wacus-block .wacus-meta {
                opacity: 0;
                transform: translateY(15px);
                transition: all 0.6s ease;
              }
              .wacus-block.wacus-active .wacus-meta {
                opacity: 1;
                transform: translateY(0);
              }
            `}
          </style>

          {testimonials.map((t, i) => {
            let textParts = [{ type: 'text', val: t.text }];
            t.highlights.forEach(word => {
              const newParts = [];
              textParts.forEach(chunk => {
                if (chunk.type === 'highlight') {
                  newParts.push(chunk);
                } else {
                  const split = chunk.val.split(word);
                  split.forEach((s, idx) => {
                    if (s) newParts.push({ type: 'text', val: s });
                    if (idx < split.length - 1) newParts.push({ type: 'highlight', val: word });
                  });
                }
              });
              textParts = newParts;
            });

            return (
              <div key={i} className="wacus-block" style={{ marginBottom: 120 }}>
                <h2 style={{ 
                  fontSize: "clamp(26px, 4vw, 36px)", 
                  fontFamily: "'Playfair Display', Georgia, serif", 
                  fontWeight: 800, 
                  lineHeight: 1.4, 
                  marginBottom: 30
                }}>
                  "
                  {textParts.map((chunk, cIdx) => (
                    <span key={cIdx} className={chunk.type === 'highlight' ? "wacus-hl" : ""}>
                      {chunk.val}
                    </span>
                  ))}
                  "
                </h2>
                <div className="wacus-meta" style={{ fontSize: 16, fontWeight: 700, color: tk.text }}>
                  — {t.author}
                  <span style={{ fontSize: 14, fontWeight: 500, color: tk.textLt, marginLeft: 12 }}>
                    {t.location}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SVG Drawing Curve */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 3, pointerEvents: "none" }}>
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <path 
              d="M 1100, 0 C 800, 50 150, 100 200, 250 C 250, 400 850, 450 700, 600 C 550, 750 150, 850 250, 1050" 
              fill="none" 
              stroke="#ea580c" 
              strokeWidth="6" 
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              pathLength="100"
              style={{ 
                 strokeDasharray: "100", 
                 strokeDashoffset: "calc(100 - (var(--scroll-p, 0) * 100))",
                 filter: "drop-shadow(0 0 12px rgba(234, 88, 12, 0.4))",
                 transition: "stroke-dashoffset 0.1s linear"
              }}
            />
          </svg>
        </div>

      </div>
    </section>
  );
};

export default function HomePage() {
  const navigate  = useNavigate();
  const { dark }  = useTheme();
  const tk        = TK(dark);
  const [products, setProducts]   = useState([]);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth <= 768);
  const [slide, setSlide]         = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible]     = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [blurFlash, setBlurFlash] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState(null);
  const [transitionTo, setTransitionTo] = useState(null);
  const timerRef = useRef(null);
  const snapLockRef = useRef(false);
  const sectionRefs = useRef([]);
  const headerOffset = 72;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products || []); })
      .catch(() => {});
  }, []);

  const visibleProducts = products.slice(0, isMobile ? 3 : 6);

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

  const scrollToStep = (step) => {
    const target = sectionRefs.current[step];
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    let isSnapping = false;
    const handleWheel = (e) => {
      // Only snap if user is at the absolute top of the page and scrolling down
      if (window.scrollY < 50 && e.deltaY > 0 && !isSnapping) {
        e.preventDefault();
        isSnapping = true;
        
        const target = sectionRefs.current[1];
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: "smooth" });
        }
        
        // Cooldown before they can snap again (allows smooth scroll to finish)
        setTimeout(() => { isSnapping = false; }, 800);
      }
    };

    // We must use passive: false to allow e.preventDefault() for overriding the scroll
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [headerOffset]);


  const sectionTransitionStyle = (idx) => {
    const outgoing = blurFlash && idx === transitionFrom;
    const incoming = blurFlash && idx === transitionTo;
    return {
      transition: "filter 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.42s cubic-bezier(0.22,1,0.36,1), transform 0.42s cubic-bezier(0.22,1,0.36,1)",
      filter: outgoing ? "blur(3.8px)" : incoming ? "blur(1.6px)" : "blur(0px)",
      opacity: outgoing ? 0.72 : incoming ? 0.9 : 1,
      transform: outgoing ? "scale(0.94)" : incoming ? "scale(1.035)" : "scale(1)",
      transformOrigin: "center top",
      willChange: "transform, opacity, filter",
    };
  };

  const cur = SLIDES[slide];

  const homeBtnBase = {
    border: "none",
    borderRadius: 16,
    padding: "12px 24px",
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    cursor: "pointer",
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
  };

  const homeBtnPrimary = {
    ...homeBtnBase,
    color: "#ffffff",
    background: "linear-gradient(135deg,#d4a017,#b8860b)",
    border: "1px solid rgba(255,220,120,0.5)",
  };

  const homeBtnGreen = {
    ...homeBtnBase,
    color: "#ffffff",
    background: "linear-gradient(135deg,#52b788,#2d6a4f)",
    border: "1px solid rgba(149,213,178,0.45)",
  };

  const homeBtnGhost = {
    ...homeBtnBase,
    color: "#ffffff",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.38)",
    backdropFilter: "blur(18px)",
  };

  return (
    <div style={{ background: tk.bg, overflowX: "hidden" }}>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: dark ? "rgba(3,8,6,0.34)" : "rgba(10,20,14,0.16)",
          opacity: blurFlash ? 1 : 0,
          transition: "opacity 0.3s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
          zIndex: 700,
        }}
      />

      <div ref={el => { sectionRefs.current[0] = el; }} style={sectionTransitionStyle(0)}>
      {/* ─────────────── HERO SLIDER ─────────────── */}
      <section style={{ position: "relative", height: "clamp(320px,62vh,520px)", minHeight: 320, maxHeight: 520, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${cur.img})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: animating ? 0 : 1,
          transform: animating ? "scale(1.03)" : "scale(1)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0.05) 100%)" }} />

        <div className="home-hero-inner" style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center", maxWidth: "var(--content-max)", margin: "0 auto", padding: "0 clamp(58px,5.5vw,94px)" }}>
          <div className="home-hero-content" style={{ maxWidth: 580 }}>
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
            }}>
              <MagneticText text={cur.title} />
            </h1>


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
              <button
                data-magnetic
                onClick={() => navigate("/catalog")}
                style={homeBtnPrimary}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.filter="brightness(1.06)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.filter="none";}}
              >
                {cur.cta} →
              </button>

              <button
                data-magnetic
                onClick={() => navigate("/register")}
                style={homeBtnGhost}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.background="rgba(255,255,255,0.24)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.background="rgba(255,255,255,0.16)";}}
              >
                Join as Farmer / Agent
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button data-magnetic key={i} onClick={() => changeSlide(i)} style={{
              width: i === slide ? 28 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
              background: i === slide ? "#52b788" : "rgba(255,255,255,0.38)",
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

        {/* Arrows */}
        <button data-magnetic onClick={() => changeSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:38, height:38, borderRadius:"50%", cursor:"pointer", fontSize:14, zIndex:3, transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.3)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
        >❮</button>
        <button data-magnetic onClick={() => changeSlide(s => (s + 1) % SLIDES.length)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:38, height:38, borderRadius:"50%", cursor:"pointer", fontSize:14, zIndex:3, transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.3)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.15)"}
        >❯</button>
      </section>

      {/* ─────────────── STATS BAR ─────────────── */}
      <div style={{ background: dark ? "#0f2018" : "#1b4332", borderBottom: "3px solid #52b788", width:"100%" }}>

        <div className="home-stats-grid" style={{ maxWidth: "var(--content-max)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,minmax(150px,220px))", justifyContent:"center", padding:"0 var(--page-px, clamp(10px,2.2vw,24px))" }}>
          {STATS.map((s, i) => (
            <div className="home-stat-item" key={i} data-id={`stat-${i}`} style={{ textAlign:"center", padding:"22px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", ...reveal(`stat-${i}`, i * 0.08) }}>
              <div className="home-stat-icon" style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
              <div className="home-stat-num" style={{ fontSize:26, fontWeight:900, color:"#74c69d", fontFamily:"'Inter',sans-serif", fontFeatureSettings:'"tnum"' }}>{s.num}</div>
              <div className="home-stat-label" style={{ fontSize:10, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"1.2px", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div ref={el => { sectionRefs.current[1] = el; }} style={sectionTransitionStyle(1)}>
      {/* ─────────────── CATEGORIES ─────────────── */}
      <section style={{ padding: "clamp(10px,2.2vw,24px) var(--page-px,clamp(10px,2.2vw,24px))", background: tk.bg }}>
        <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
          <div data-id="cat-hd" style={{ textAlign:"center", marginBottom:16, ...reveal("cat-hd") }}>
            <span style={{ display:"inline-block", background: dark?"#1c3525":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:14 }}>Shop by Category</span>
            <h2 className="grad-text" style={{ fontSize:"clamp(28px,4vw,40px)", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:900, marginBottom:10 }}>Find What You're Looking For</h2>
            <p style={{ color:tk.textLt, fontSize:15, maxWidth:460, margin:"0 auto" }}>From crisp vegetables to premium dry fruits — all direct from farms</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:10 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={cat.name} data-id={`cat-${i}`} data-tilt className={dark ? "liquid-glass-dark hover-lift" : "liquid-glass hover-lift"} onClick={() => navigate("/catalog")} style={{
                borderRadius:14, overflow:"hidden", cursor:"pointer",
                position:"relative", height:150,
                transition:"all 0.3s ease",
                ...reveal(`cat-${i}`, i * 0.08),
              }}
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
      <section style={{ padding:"clamp(2px,1vw,8px) var(--page-px,clamp(10px,2.2vw,24px)) clamp(10px,2vw,20px)", background: dark?"#080f09":"#eef7f0" }}>
        <div style={{ maxWidth:"var(--content-max)", margin:"0 auto" }}>
          <div data-id="feat-hd" style={{ textAlign:"center", marginBottom:10, ...reveal("feat-hd") }}>
            <span style={{ display:"inline-block", background: dark?"#1c3525":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:14 }}>Featured This Week</span>
            <h2 className="grad-text-animated" style={{ fontSize:"clamp(28px,4vw,40px)", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:900, marginBottom:10 }}>Handpicked Fresh Arrivals</h2>
            <p style={{ color:tk.textLt, fontSize:15 }}>Curated by our farmers — freshest produce available right now</p>
          </div>

          {visibleProducts.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:tk.textLt }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🌾</div>
              <p>Loading fresh products...</p>
            </div>
          ) : (
            <div className="home-product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(6,minmax(0,1fr))", gap:12, alignItems:"stretch" }}>
              {visibleProducts.map((p, i) => (
                <div key={p.id || p._id} data-id={`prod-${i}`} style={{ minWidth:0, ...reveal(`prod-${i}`, i * 0.07) }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <div data-id="view-all" style={{ textAlign:"center", marginTop:16, ...reveal("view-all") }}>
            <button
              data-magnetic
              onClick={() => navigate("/catalog")}
              style={homeBtnGreen}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.filter="brightness(1.06)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.filter="none";}}
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>
      </div>

      <div ref={el => { sectionRefs.current[2] = el; }} style={sectionTransitionStyle(2)}>
      {/* ─────────────── TESTIMONIAL + WHY GRID ─────────────── */}
      <section style={{ padding:"clamp(10px,2vw,20px) var(--page-px,clamp(10px,2.2vw,24px)) clamp(18px,2.8vw,30px)", background:tk.bg }}>
        <div className="home-trust-grid" style={{ maxWidth:"var(--content-max)", margin:"0 auto", display:"grid", gridTemplateColumns:"minmax(280px,360px) 1fr", gap:14, alignItems:"start" }}>

          {/* Testimonial card */}
          <div data-id="trust" className={dark ? "liquid-glass-dark" : "liquid-glass"} style={{
            borderRadius:18,
            padding:"16px 14px",
            ...reveal("trust"),
          }}>
            <div style={{ fontSize:22, marginBottom:6 }}>⭐⭐⭐⭐⭐</div>
            <h3 style={{ color:dark ? "#f8fafc" : "#163524", fontSize:"clamp(17px,1.8vw,22px)", fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.3, marginBottom:8, fontStyle:"italic" }}>
              "The freshest produce I've ever received, straight from the farm to my kitchen."
            </h3>
            <p style={{ color:dark ? "#74c69d" : "#2d6a4f", fontSize:11.5, fontWeight:700, marginBottom:10 }}>— Priya M., Hyderabad customer since 2024</p>
            <div className="home-trust-metrics" data-id="trust2" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, ...reveal("trust2", 0.12) }}>
              {[["🌾","500+","Verified Farmers"],["📦","10K+","Orders Delivered"],["⭐","4.8/5","Avg Rating"],["🗺","15+","States Covered"]].map(([icon,num,label]) => (
                <div key={label} style={{ textAlign:"center", padding:"6px 4px", borderRadius:10, background:dark ? "rgba(255,255,255,0.08)" : "rgba(16,53,36,0.08)" }}>
                  <div style={{ fontSize:15 }}>{icon}</div>
                  <div className="num" style={{ color:dark ? "#ffffff" : "#163524", fontSize:17, fontWeight:900, fontFamily:"'Inter',sans-serif" }}>{num}</div>
                  <div style={{ color:dark ? "rgba(255,255,255,0.72)" : "rgba(22,53,36,0.72)", fontSize:10 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why cards moved to the right */}
          <div>
            <div data-id="why-hd" style={{ marginBottom:10, ...reveal("why-hd") }}>
              <span style={{ display:"inline-block", background: dark?"#1c3525":"#e8f5ee", color:"#40916c", borderRadius:20, padding:"4px 14px", fontSize:10.5, fontWeight:700, letterSpacing:"1.1px", textTransform:"uppercase", marginBottom:8 }}>Why RPS Fields</span>
              <h2 className="grad-text" style={{ fontSize:"clamp(24px,3vw,34px)", fontFamily:"'Playfair Display',Georgia,serif", fontWeight:900, marginBottom:8 }}>What Makes Us Different</h2>
            </div>
            <div className="home-why-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10 }}>
              {WHY.map((w, i) => (
                <div key={w.title} data-id={`why-${i}`} data-tilt className={dark ? "liquid-glass-dark hover-lift" : "liquid-glass hover-lift"} style={{
                  borderRadius:14, padding:"14px 12px",
                  transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  ...reveal(`why-${i}`, i * 0.05),
                }}
                >
                  <div style={{ width:36, height:36, borderRadius:10, background: dark?"#1c3525":"#e8f5ee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, marginBottom:8 }}>{w.icon}</div>
                  <div style={{ fontWeight:800, fontSize:13.5, color:tk.text, marginBottom:4 }}>{w.title}</div>
                  <div style={{ fontSize:11.5, color:tk.textLt, lineHeight:1.45 }}>{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ScrollRevealTestimonial dark={dark} tk={tk} />

      {/* ─────────────── JOIN CTA ─────────────── */}
      <section style={{ padding:"clamp(16px,2.3vw,24px) var(--page-px,clamp(10px,2.2vw,24px))", background: dark?"#080f09":"#f0f7f2", borderTop:`1px solid ${tk.border}` }}>
        <div data-id="cta" style={{ maxWidth:620, margin:"0 auto", textAlign:"center", ...reveal("cta") }}>
          <div style={{ fontSize:34, marginBottom:10 }}>🌿</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,32px)", fontFamily:"'Playfair Display',Georgia,serif", color:tk.text, marginBottom:10 }}>
            Are You a Farmer or Agent?
          </h2>
          <p style={{ color:tk.textLt, fontSize:14, lineHeight:1.6, maxWidth:520, margin:"0 auto 16px" }}>
            Join the RPS Fields network. List your produce, reach thousands of customers across Telangana, and earn more by cutting out the middleman.
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginTop: 12 }}>
            <button
              data-magnetic
              onClick={() => navigate("/register/farmer")}
              style={homeBtnGreen}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.filter="brightness(1.06)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.filter="none";}}
            >
              🌾 Join as Farmer
            </button>
            <button
              data-magnetic
              onClick={() => navigate("/register/agent")}
              style={homeBtnPrimary}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.filter="brightness(1.06)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.filter="none";}}
            >
              🏢 Join as Agent
            </button>
          </div>
        </div>
      </section>
      </div>

    </div>
  );
}
