import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalEffects — CSS magic injected into EVERY page.
 *
 * 1. SCROLL-REVEAL        — cards fade-up on scroll
 * 2. 3D TILT              — ALL cards auto-detected + [data-tilt] rotate in 3D
 * 3. CURSOR SPOTLIGHT GLOW — radial glow follows cursor inside every card
 * 4. ALL BUTTONS MAGNETIC  — every <button> + .hnav links attract toward cursor
 * 5. BUTTON RIPPLE          — ripple on every button click
 * 6. WHITE GLOW ON CLICK   — dim white glow lighting on button press
 * 7. COUNT-UP              — numbers animate counting up on scroll
 */
export default function GlobalEffects() {
  const location = useLocation();
  const cleanupRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => run(), 250);
    const t2 = setTimeout(() => run(), 2200);

    function run() {
      if (cleanupRef.current) cleanupRef.current();
      const cleanups = [];

      // Helper: find ALL card-like elements
      function getAllCards() {
        const set = new Set();
        // Explicit data-tilt
        document.querySelectorAll("[data-tilt]").forEach((el) => set.add(el));
        // Cards with borderRadius + border in inline style
        document.querySelectorAll("div[style*='borderRadius']").forEach((el) => {
          if (el.offsetHeight >= 60 && el.offsetWidth >= 100) set.add(el);
        });
        // Product card wrappers
        document.querySelectorAll(".product-grid > div, .stat-grid > div").forEach((el) => set.add(el));
        return Array.from(set);
      }

      // ═══════════════════════════════════════
      // 1. SCROLL-REVEAL
      // ═══════════════════════════════════════
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.style.opacity = "1";
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.filter = "blur(0)";
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
      );

      document.querySelectorAll("[data-id], .scroll-item").forEach((el, i) => {
        if (el.dataset.gfxR) return;
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.75) {
          el.dataset.gfxR = "1";
          const delay = Math.min((i % 8) * 0.06, 0.42);
          el.style.opacity = "0";
          el.style.transform = "translateY(25px) scale(0.98)";
          el.style.filter = "blur(3px)";
          el.style.transition = `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s,
                                 transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s,
                                 filter 0.55s ease ${delay}s`;
          revealObserver.observe(el);
        }
      });

      // ═══════════════════════════════════════
      // 2. 3D TILT ON ALL CARDS
      // ═══════════════════════════════════════
      getAllCards().forEach((card) => {
        if (card.dataset.gfxT) return;
        // Skip tiny elements, inputs, buttons, nav
        if (card.offsetHeight < 60 || card.offsetWidth < 100) return;
        if (card.tagName === "BUTTON" || card.tagName === "INPUT" || card.tagName === "NAV") return;
        if (card.closest("nav") || card.closest("header") || card.closest("aside")) return;
        card.dataset.gfxT = "1";

        const origTransition = card.style.transition || "";
        card.style.transition = origTransition + (origTransition ? ", " : "") + "transform 0.15s ease-out";

        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          const rx = (y - 0.5) * -8;
          const ry = (x - 0.5) * 8;
          card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`;
        };
        const onLeave = () => {
          card.style.transform = "";
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // ═══════════════════════════════════════
      // 3. CURSOR SPOTLIGHT GLOW INSIDE CARDS
      //    — radial gradient follows cursor
      // ═══════════════════════════════════════
      getAllCards().forEach((card) => {
        if (card.dataset.gfxSpot) return;
        if (card.offsetHeight < 60 || card.offsetWidth < 100) return;
        if (card.tagName === "BUTTON" || card.tagName === "INPUT" || card.tagName === "NAV") return;
        if (card.closest("nav") || card.closest("header") || card.closest("aside")) return;
        card.dataset.gfxSpot = "1";

        // Create overlay div for the glow
        const glow = document.createElement("div");
        Object.assign(glow.style, {
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          borderRadius: "inherit",
          pointerEvents: "none",
          opacity: "0",
          transition: "opacity 0.3s ease",
          zIndex: "1",
          background:
            "radial-gradient(300px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(82,183,136,0.12), transparent 60%)",
        });

        // Ensure card is positioned
        const pos = window.getComputedStyle(card).position;
        if (pos === "static") card.style.position = "relative";

        card.appendChild(glow);

        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          glow.style.setProperty("--glow-x", x + "px");
          glow.style.setProperty("--glow-y", y + "px");
          glow.style.background = `radial-gradient(250px circle at ${x}px ${y}px, rgba(82,183,136,0.15), transparent 60%)`;
          glow.style.opacity = "1";
        };
        const onLeave = () => {
          glow.style.opacity = "0";
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
          if (glow.parentNode) glow.remove();
        });
      });

      // ═══════════════════════════════════════
      // 4. ALL BUTTONS + NAV LINKS MAGNETIC
      // ═══════════════════════════════════════
      document.querySelectorAll("button, a.hnav, [data-magnetic]").forEach((btn) => {
        if (btn.dataset.gfxMag) return;
        if (btn.offsetWidth < 20 || btn.offsetHeight < 20) return;
        btn.dataset.gfxMag = "1";

        const onMove = (e) => {
          const r = btn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
          btn.style.transition = "transform 0.1s ease-out";
        };
        const onLeave = () => {
          btn.style.transform = "translate(0,0)";
          btn.style.transition = "transform 0.35s cubic-bezier(0.22,1,0.36,1)";
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });

      // ═══════════════════════════════════════
      // 5. BUTTON RIPPLE — on click
      // ═══════════════════════════════════════
      const ripple = (e) => {
        const btn = e.currentTarget;
        if (btn.offsetWidth < 28) return;
        const span = document.createElement("span");
        const r = btn.getBoundingClientRect();
        const sz = Math.max(r.width, r.height) * 1.5;
        Object.assign(span.style, {
          position: "absolute",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          width: sz + "px",
          height: sz + "px",
          left: e.clientX - r.left - sz / 2 + "px",
          top: e.clientY - r.top - sz / 2 + "px",
          transform: "scale(0)",
          pointerEvents: "none",
          animation: "ripple-anim 0.55s ease-out",
        });
        const orig = window.getComputedStyle(btn).position;
        if (orig === "static") btn.style.position = "relative";
        const origOv = btn.style.overflow;
        btn.style.overflow = "hidden";
        btn.appendChild(span);
        setTimeout(() => {
          span.remove();
          if (orig === "static") btn.style.position = "";
          btn.style.overflow = origOv;
        }, 600);
      };

      document.querySelectorAll("button").forEach((btn) => {
        if (btn.dataset.gfxRip) return;
        btn.dataset.gfxRip = "1";
        btn.addEventListener("click", ripple);
        cleanups.push(() => btn.removeEventListener("click", ripple));
      });

      // ═══════════════════════════════════════
      // 6. WHITE GLOW ON CLICK
      // ═══════════════════════════════════════
      document.querySelectorAll("button").forEach((btn) => {
        if (btn.dataset.gfxGlow) return;
        btn.dataset.gfxGlow = "1";
        const handler = () => {
          if (btn.offsetWidth < 28) return;
          const orig = btn.style.boxShadow || "";
          btn.style.boxShadow =
            orig + ", 0 0 15px 4px rgba(255,255,255,0.25), 0 0 30px 8px rgba(255,255,255,0.1)";
          btn.style.transition = "box-shadow 0.08s ease-out";
          setTimeout(() => {
            btn.style.boxShadow = orig;
            btn.style.transition = "box-shadow 0.4s ease-out";
          }, 200);
        };
        btn.addEventListener("mousedown", handler);
        cleanups.push(() => btn.removeEventListener("mousedown", handler));
      });

      // ═══════════════════════════════════════
      // 7. COUNT-UP — animate numbers on scroll
      // ═══════════════════════════════════════
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.dataset.gfxCounted) {
              entry.target.dataset.gfxCounted = "1";
              animateCount(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      function animateCount(el) {
        const origText = el.textContent.trim();
        const match = origText.match(/^([^\d]*?)([\d,]+(?:\.\d+)?)(.*?)$/);
        if (!match) return;
        const prefix = match[1];
        const numStr = match[2].replace(/,/g, "");
        const suffix = match[3];
        const target = parseFloat(numStr);
        if (isNaN(target) || target === 0) return;
        const isFloat = numStr.includes(".");
        const decimals = isFloat ? (numStr.split(".")[1] || "").length : 0;
        const hasCommas = match[2].includes(",");
        const useIndian = /\d{1,2},\d{2},\d{3}/.test(match[2]);
        const duration = 1200;
        const startTime = performance.now();
        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = target * ease;
          let formatted = isFloat ? current.toFixed(decimals) : Math.round(current).toString();
          if (hasCommas) {
            const parts = formatted.split(".");
            parts[0] = useIndian ? indianComma(parseInt(parts[0])) : parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            formatted = parts.join(".");
          }
          el.textContent = prefix + formatted + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = origText;
        }
        requestAnimationFrame(step);
      }
      function indianComma(num) {
        const s = Math.abs(num).toString();
        if (s.length <= 3) return (num < 0 ? "-" : "") + s;
        const last3 = s.slice(-3);
        let rest = s.slice(0, -3);
        rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        return (num < 0 ? "-" : "") + rest + "," + last3;
      }

      // Count-up targets
      document.querySelectorAll(".num, .price-value, .rupee, .currency-value").forEach((el) => {
        if (el.dataset.gfxC || !/\d/.test(el.textContent)) return;
        el.dataset.gfxC = "1";
        countObserver.observe(el);
      });
      // Auto-detect bold stat numbers
      document.querySelectorAll(
        "div[style*='fontWeight: 900'], div[style*='fontWeight:900'], " +
        "div[style*='fontWeight: 800'], div[style*='fontWeight:800'], " +
        "span[style*='fontWeight: 900'], span[style*='fontWeight:900'], " +
        "span[style*='fontWeight: 800'], span[style*='fontWeight:800']"
      ).forEach((el) => {
        if (el.dataset.gfxC) return;
        const text = el.textContent.trim();
        if (text.length > 25 || !/\d/.test(text)) return;
        if (el.tagName === "BUTTON" || el.closest("button")) return;
        el.dataset.gfxC = "1";
        countObserver.observe(el);
      });

      // ═══════════════════════════════════════
      // CLEANUP
      // ═══════════════════════════════════════
      cleanupRef.current = () => {
        revealObserver.disconnect();
        countObserver.disconnect();
        cleanups.forEach((fn) => fn());
        // Remove gfx data attributes
        ["gfxR","gfxT","gfxSpot","gfxMag","gfxRip","gfxGlow","gfxC","gfxCounted","gfxH"].forEach((attr) => {
          document.querySelectorAll(`[data-${attr.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}]`).forEach(
            (el) => delete el.dataset[attr]
          );
        });
      };
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [location.pathname]);

  return null;
}
