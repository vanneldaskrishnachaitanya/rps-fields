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
          glow.style.background = `radial-gradient(280px circle at ${x}px ${y}px, rgba(82,183,136,0.14), transparent 60%)`;
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
      document.querySelectorAll("button, a.hnav, [data-magnetic]").forEach(btn => {
        if (btn.dataset.gfxMag) return;
        if (btn.offsetWidth < 20 || btn.offsetHeight < 20) return;
        btn.dataset.gfxMag = "1";
        const onMove = e => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
          btn.style.transition = "transform 0.1s ease-out";
        };
        const onLeave = () => {
          btn.style.transform = "translate(0,0)";
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
          btn.style.boxShadow = orig + ", 0 0 15px 4px rgba(255,255,255,0.2), 0 0 30px 8px rgba(82,183,136,0.1)";
          btn.style.transition = "box-shadow 0.08s ease-out";
          setTimeout(() => { btn.style.boxShadow = orig; btn.style.transition = "box-shadow 0.4s ease-out"; }, 200);
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
          const d = Math.min((i % 8) * 0.06, 0.42);
          el.style.opacity = "0"; el.style.transform = "translateY(25px) scale(0.98)"; el.style.filter = "blur(3px)";
          el.style.transition = `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${d}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${d}s, filter 0.55s ease ${d}s`;
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
      // 7. SVG FLOATING DECORATIONS
      // ═══════════════════════════════════════
      if (!document.getElementById("gfx-svg-deco")) {
        const svgContainer = document.createElement("div");
        svgContainer.id = "gfx-svg-deco";
        Object.assign(svgContainer.style, {
          position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
          pointerEvents: "none", zIndex: "0", overflow: "hidden",
        });
        svgContainer.innerHTML = `
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="gfx-g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(82,183,136,0.06)"/>
                <stop offset="100%" stop-color="transparent"/>
              </radialGradient>
              <radialGradient id="gfx-g2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(0,212,255,0.04)"/>
                <stop offset="100%" stop-color="transparent"/>
              </radialGradient>
            </defs>
            <circle cx="15%" cy="20%" r="120" fill="url(#gfx-g1)">
              <animate attributeName="cy" values="20%;25%;20%" dur="8s" repeatCount="indefinite"/>
              <animate attributeName="r" values="120;140;120" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="85%" cy="70%" r="100" fill="url(#gfx-g2)">
              <animate attributeName="cy" values="70%;65%;70%" dur="10s" repeatCount="indefinite"/>
              <animate attributeName="cx" values="85%;82%;85%" dur="12s" repeatCount="indefinite"/>
            </circle>
            <circle cx="50%" cy="90%" r="80" fill="url(#gfx-g1)" opacity="0.5">
              <animate attributeName="cy" values="90%;85%;90%" dur="7s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30%" cy="50%" r="60" fill="url(#gfx-g2)" opacity="0.4">
              <animate attributeName="cx" values="30%;35%;30%" dur="9s" repeatCount="indefinite"/>
              <animate attributeName="cy" values="50%;45%;50%" dur="11s" repeatCount="indefinite"/>
            </circle>
            <!-- Floating lines -->
            <line x1="10%" y1="30%" x2="25%" y2="35%" stroke="rgba(82,183,136,0.06)" stroke-width="1">
              <animate attributeName="y1" values="30%;28%;30%" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="35%;33%;35%" dur="5s" repeatCount="indefinite"/>
            </line>
            <line x1="75%" y1="15%" x2="90%" y2="20%" stroke="rgba(0,212,255,0.04)" stroke-width="1">
              <animate attributeName="x1" values="75%;78%;75%" dur="7s" repeatCount="indefinite"/>
            </line>
            <!-- Pulsing dots -->
            <circle cx="20%" cy="80%" r="3" fill="rgba(82,183,136,0.15)">
              <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="70%" cy="25%" r="2" fill="rgba(0,212,255,0.12)">
              <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.12;0.25;0.12" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="90%" cy="50%" r="2.5" fill="rgba(82,183,136,0.1)">
              <animate attributeName="r" values="2.5;4.5;2.5" dur="5s" repeatCount="indefinite"/>
            </circle>
          </svg>
        `;
        document.body.appendChild(svgContainer);
        cleanups.push(() => { if (svgContainer.parentNode) svgContainer.remove(); });
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
        const svg = document.getElementById("gfx-svg-deco");
        if (svg) svg.remove();
      };
    }

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [location.pathname]);

  return null;
}
