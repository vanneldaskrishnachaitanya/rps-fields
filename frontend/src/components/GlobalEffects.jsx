import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalEffects — universal CSS magic for EVERY page.
 *
 * 1. 3D TILT on EVERY card — auto-detects ALL card-like divs
 * 2. CURSOR SPOTLIGHT GLOW inside every card
 * 3. ALL BUTTONS MAGNETIC
 * 4. BUTTON RIPPLE + WHITE GLOW ON CLICK
 * 5. COUNT-UP on numbers
 * 6. SCROLL-REVEAL
 * 7. SVG FLOATING DECORATIONS injection
 */
export default function GlobalEffects() {
  const location = useLocation();
  const cleanupRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => run(), 300);
    const t2 = setTimeout(() => run(), 2500);

    function run() {
      if (cleanupRef.current) cleanupRef.current();
      const cleanups = [];

      // ═════════════════════════════════════════════
      // UNIVERSAL CARD FINDER — catches every card
      // ═════════════════════════════════════════════
      function findAllCards() {
        const set = new Set();
        // 1. Explicit data-tilt
        document.querySelectorAll("[data-tilt]").forEach(el => set.add(el));
        // 2. Any div with borderRadius in style (inline)
        document.querySelectorAll("div[style*='borderRadius'], div[style*='border-radius']").forEach(el => {
          if (el.offsetHeight >= 50 && el.offsetWidth >= 80) set.add(el);
        });
        // 3. Any div with border + rounded
        document.querySelectorAll("div[style*='border:'], div[style*='border:1']").forEach(el => {
          if (el.offsetHeight >= 50) set.add(el);
        });
        // 4. Product cards, stat grids, glass cards
        document.querySelectorAll(".product-grid > div, .stat-grid > div").forEach(el => set.add(el));
        // 5. Table wrappers
        document.querySelectorAll("div[style*='overflow: hidden'][style*='borderRadius']").forEach(el => set.add(el));
        // Filter out nav, header, aside, small things
        const filtered = [];
        set.forEach(el => {
          if (el.tagName === "BUTTON" || el.tagName === "INPUT" || el.tagName === "SELECT") return;
          if (el.tagName === "NAV" || el.tagName === "HEADER" || el.tagName === "ASIDE") return;
          if (el.closest("nav") || el.closest("header") || el.closest("aside")) return;
          if (el.closest("[data-no-tilt]")) return;
          if (el.offsetHeight < 50 || el.offsetWidth < 80) return;
          filtered.push(el);
        });
        return filtered;
      }

      const allCards = findAllCards();

      // ═══════════════════════════════════════
      // 1. 3D TILT ON EVERY CARD
      // ═══════════════════════════════════════
      allCards.forEach(card => {
        if (card.dataset.gfxT) return;
        card.dataset.gfxT = "1";
        const orig = card.style.transition || "";
        card.style.transition = orig + (orig ? ", " : "") + "transform 0.18s ease-out";

        const onMove = e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          const rx = (y - 0.5) * -8;
          const ry = (x - 0.5) * 8;
          card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`;
        };
        const onLeave = () => { card.style.transform = ""; };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // ═══════════════════════════════════════
      // 2. CURSOR SPOTLIGHT GLOW INSIDE CARDS
      // ═══════════════════════════════════════
      allCards.forEach(card => {
        if (card.dataset.gfxSpot) return;
        card.dataset.gfxSpot = "1";

        const glow = document.createElement("div");
        Object.assign(glow.style, {
          position: "absolute", top: "0", left: "0", right: "0", bottom: "0",
          borderRadius: "inherit", pointerEvents: "none",
          opacity: "0", transition: "opacity 0.3s ease", zIndex: "1",
        });
        const pos = window.getComputedStyle(card).position;
        if (pos === "static") card.style.position = "relative";
        card.style.overflow = card.style.overflow || "hidden";
        card.appendChild(glow);

        const onMove = e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          glow.style.background = `radial-gradient(140px circle at ${x}px ${y}px, rgba(82,183,136,0.08), transparent 60%)`;
          glow.style.opacity = "1";
        };
        const onLeave = () => { glow.style.opacity = "0"; };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
          if (glow.parentNode) glow.remove();
        });
      });

      // ═══════════════════════════════════════
      // 3. ALL BUTTONS MAGNETIC
      // ═══════════════════════════════════════
      document.querySelectorAll("button, a.hnav, .mlink, [data-magnetic], [role='button']").forEach(btn => {
        if (btn.dataset.gfxMag) return;
        if (btn.offsetWidth < 20 || btn.offsetHeight < 20) return;
        if (btn.closest("header")) return;
        btn.dataset.gfxMag = "1";
        const baseTransform = btn.style.transform || "";
        const onMove = e => {
          const r = btn.getBoundingClientRect();
          const tx = (e.clientX - r.left - r.width / 2) * 0.25;
          const ty = (e.clientY - r.top - r.height / 2) * 0.25;
          btn.style.transform = `${baseTransform} translate(${tx}px, ${ty}px)`.trim();
          btn.style.transition = "transform 0.1s ease-out";
        };
        const onLeave = () => {
          btn.style.transform = baseTransform;
          btn.style.transition = "transform 0.35s cubic-bezier(0.22,1,0.36,1)";
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); });
      });

      // ═══════════════════════════════════════
      // 4. BUTTON RIPPLE + WHITE GLOW
      // ═══════════════════════════════════════
      document.querySelectorAll("button").forEach(btn => {
        if (btn.dataset.gfxRip) return;
        btn.dataset.gfxRip = "1";
        const ripple = e => {
          if (btn.offsetWidth < 28) return;
          const span = document.createElement("span");
          const r = btn.getBoundingClientRect();
          const sz = Math.max(r.width, r.height) * 1.5;
          Object.assign(span.style, {
            position: "absolute", borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            width: sz + "px", height: sz + "px",
            left: e.clientX - r.left - sz / 2 + "px",
            top: e.clientY - r.top - sz / 2 + "px",
            transform: "scale(0)", pointerEvents: "none",
            animation: "ripple-anim 0.55s ease-out",
          });
          const op = window.getComputedStyle(btn).position;
          if (op === "static") btn.style.position = "relative";
          const ov = btn.style.overflow;
          btn.style.overflow = "hidden";
          btn.appendChild(span);
          setTimeout(() => { span.remove(); if (op === "static") btn.style.position = ""; btn.style.overflow = ov; }, 600);
        };
        const glow = () => {
          if (btn.offsetWidth < 28) return;
          const orig = btn.style.boxShadow || "";
          btn.style.boxShadow = orig + ", 0 0 24px 8px rgba(255,255,255,0.3), 0 0 60px 15px rgba(82,183,136,0.6), inset 0 0 20px rgba(255,255,255,0.4)";
          btn.style.transition = "box-shadow 0.05s ease-out";
          setTimeout(() => { btn.style.boxShadow = orig; btn.style.transition = "box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)"; }, 250);
        };
        btn.addEventListener("click", ripple);
        btn.addEventListener("mousedown", glow);
        cleanups.push(() => { btn.removeEventListener("click", ripple); btn.removeEventListener("mousedown", glow); });
      });

      // ═══════════════════════════════════════
      // 5. SCROLL-REVEAL
      // ═══════════════════════════════════════
      const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0) scale(1)"; e.target.style.filter = "blur(0)"; } });
      }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
      document.querySelectorAll("[data-id], .scroll-item").forEach((el, i) => {
        if (el.dataset.gfxR) return;
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.75) {
          el.dataset.gfxR = "1";
          const d = Math.min((i % 8) * 0.05, 0.4);
          el.style.opacity = "0"; 
          el.style.transform = "perspective(1200px) rotateX(12deg) translateY(40px) scale(0.92)"; 
          el.style.filter = "blur(8px)";
          el.style.transition = `opacity 0.65s cubic-bezier(0.34,1.56,0.64,1) ${d}s, transform 0.65s cubic-bezier(0.34,1.56,0.64,1) ${d}s, filter 0.65s ease ${d}s`;
          revealObs.observe(el);
        }
      });

      // ═══════════════════════════════════════
      // 6. COUNT-UP
      // ═══════════════════════════════════════
      const countObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.gfxCounted) {
            entry.target.dataset.gfxCounted = "1";
            countUp(entry.target);
          }
        });
      }, { threshold: 0.2 });
      function countUp(el) {
        const orig = el.textContent.trim();
        const m = orig.match(/^([^\d]*?)([\d,]+(?:\.\d+)?)(.*?)$/);
        if (!m) return;
        const [, pre, numStr, suf] = m;
        const num = parseFloat(numStr.replace(/,/g, ""));
        if (isNaN(num) || num === 0) return;
        const isF = numStr.includes("."), dec = isF ? (numStr.split(".")[1] || "").length : 0;
        const hasC = numStr.includes(","), indian = /\d{1,2},\d{2},\d{3}/.test(numStr);
        const dur = 1200, start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3), cur = num * ease;
          let f = isF ? cur.toFixed(dec) : Math.round(cur).toString();
          if (hasC) { const pts = f.split("."); pts[0] = indian ? indCom(parseInt(pts[0])) : pts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); f = pts.join("."); }
          el.textContent = pre + f + suf;
          if (p < 1) requestAnimationFrame(step); else el.textContent = orig;
        })(start);
      }
      function indCom(n) { const s = Math.abs(n).toString(); if (s.length <= 3) return (n < 0 ? "-" : "") + s; const l = s.slice(-3); let r = s.slice(0, -3); r = r.replace(/\B(?=(\d{2})+(?!\d))/g, ","); return (n < 0 ? "-" : "") + r + "," + l; }

      document.querySelectorAll(".num, .price-value, .rupee, .currency-value").forEach(el => {
        if (el.dataset.gfxC || !/\d/.test(el.textContent)) return;
        el.dataset.gfxC = "1"; countObs.observe(el);
      });
      document.querySelectorAll(
        "div[style*='fontWeight: 900'], div[style*='fontWeight:900'], div[style*='fontWeight: 800'], div[style*='fontWeight:800'], span[style*='fontWeight: 900'], span[style*='fontWeight:900'], span[style*='fontWeight: 800'], span[style*='fontWeight:800']"
      ).forEach(el => {
        if (el.dataset.gfxC) return;
        const t = el.textContent.trim();
        if (t.length > 25 || !/\d/.test(t) || el.tagName === "BUTTON" || el.closest("button")) return;
        el.dataset.gfxC = "1"; countObs.observe(el);
      });

      // ═══════════════════════════════════════
      // 7. HARDWARE-ACCELERATED AURORA BG
      // ═══════════════════════════════════════
      if (!document.getElementById("gfx-aurora-bg")) {
        const bgContainer = document.createElement("div");
        bgContainer.id = "gfx-aurora-bg";
        Object.assign(bgContainer.style, {
          position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
          pointerEvents: "none", zIndex: "-1", overflow: "hidden", mixBlendMode: "screen"
        });
        
        // CSS animations appended to head
        if (!document.getElementById("aurora-styles")) {
          const style = document.createElement("style");
          style.id = "aurora-styles";
          style.innerHTML = `
            @keyframes auroraMove1 {
              0% { transform: translate(0%, 0%) rotate(0deg) scale(1.2); }
              33% { transform: translate(15%, -15%) rotate(15deg) scale(1); }
              66% { transform: translate(-10%, 10%) rotate(-5deg) scale(1.1); }
              100% { transform: translate(0%, 0%) rotate(0deg) scale(1.2); }
            }
            @keyframes auroraMove2 {
              0% { transform: translate(0%, 0%) scale(1); }
              50% { transform: translate(-20%, -10%) scale(1.2); }
              100% { transform: translate(0%, 0%) scale(1); }
            }
            @keyframes auroraMove3 {
              0% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
              50% { transform: translate(10%, 20%) rotate(-10deg) scale(1.3); }
              100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
            }
          `;
          document.head.appendChild(style);
        }

        const createOrb = (color, size, anim, top, left) => {
          const orb = document.createElement("div");
          Object.assign(orb.style, {
            position: "absolute", top, left,
            width: size, height: size,
            background: `radial-gradient(circle at center, ${color} 10%, transparent 65%)`,
            transformOrigin: "center center",
            animation: `${anim} ease-in-out infinite alternate`,
            opacity: "0.5",
            willChange: "transform",
            transform: "translateZ(0)"
          });
          return orb;
        };

        const isDark = document.body.dataset.theme !== "light";
        // Deep emerald/teal/gold for dark, subtle mint/blue for light
        const c1 = isDark ? "rgba(82,183,136,0.35)" : "rgba(82,183,136,0.15)";
        const c2 = isDark ? "rgba(0,212,255,0.25)" : "rgba(0,180,255,0.1)";
        const c3 = isDark ? "rgba(212,160,23,0.15)" : "rgba(200,150,15,0.08)";

        bgContainer.appendChild(createOrb(c1, "80vw", "auroraMove1 22s", "-20%", "-10%"));
        bgContainer.appendChild(createOrb(c2, "90vw", "auroraMove2 28s", "40%", "40%"));
        bgContainer.appendChild(createOrb(c3, "70vw", "auroraMove3 20s", "-10%", "50%"));

        document.body.appendChild(bgContainer);
        cleanups.push(() => { if (bgContainer.parentNode) bgContainer.remove(); });
      }

      // ═══════════════════════════════════════
      // 8. MESCUBOOK BACKGROUND THEME
      // ═══════════════════════════════════════
      if (!document.getElementById("gfx-mescubook-theme")) {
        const themeWrapper = document.createElement("div");
        themeWrapper.id = "gfx-mescubook-theme";
        Object.assign(themeWrapper.style, {
          position: "fixed", inset: "0", pointerEvents: "none", zIndex: "-1"
        });
        
        // Vignette Overlay (now in background!)
        const vignette = document.createElement("div");
        Object.assign(vignette.style, {
          position: "absolute", inset: "0",
          background: "radial-gradient(circle at center, transparent 30%, rgba(2, 6, 4, 0.95) 100%)",
          mixBlendMode: "multiply",
        });

        // Film Grain Texture
        const grain = document.createElement("div");
        Object.assign(grain.style, {
          position: "absolute", inset: "0",
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.35'/%3E%3C/svg%3E")`,
          mixBlendMode: "hard-light",
          opacity: "0.2" // Toned down slightly for background
        });

        themeWrapper.appendChild(vignette);
        themeWrapper.appendChild(grain);
        document.body.appendChild(themeWrapper);
        cleanups.push(() => { if (themeWrapper.parentNode) themeWrapper.remove(); });
      }

      // ═══════════════════════════════════════
      // CLEANUP

      // ═══════════════════════════════════════
      cleanupRef.current = () => {
        revealObs.disconnect();
        countObs.disconnect();
        cleanups.forEach(fn => fn());
        ["gfxR","gfxT","gfxSpot","gfxMag","gfxRip","gfxGlow","gfxC","gfxCounted"].forEach(a => {
          document.querySelectorAll(`[data-${a.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}]`).forEach(el => delete el.dataset[a]);
        });
        const bg = document.getElementById("gfx-aurora-bg");
        if (bg) bg.remove();
        const theme = document.getElementById("gfx-mescubook-theme");
        if (theme) theme.remove();
      };
    }


    return () => {

      clearTimeout(t1); clearTimeout(t2);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [location.pathname]);

  return null;
}
