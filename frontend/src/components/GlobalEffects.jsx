import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalEffects — CSS magic injected into EVERY page.
 *
 * 1. SCROLL-REVEAL      — cards fade-up on scroll
 * 2. 3D TILT            — [data-tilt] cards rotate in 3D
 * 3. ALL BUTTONS MAGNETIC — every <button> + .hnav links attract toward cursor
 * 4. BUTTON RIPPLE       — ripple on every button click
 * 5. WHITE GLOW ON CLICK — dim white glow lighting on button press
 * 6. CARD HOVER GLOW     — border glow on card hover
 * 7. COUNT-UP            — numbers animate counting up on scroll
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

      const revealEls = document.querySelectorAll(
        "[data-id], .scroll-item, .product-grid > div, .stat-grid > div"
      );
      const revealedSet = [];
      revealEls.forEach((el, i) => {
        if (el.dataset.gfxR) return;
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.75) {
          el.dataset.gfxR = "1";
          revealedSet.push(el);
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
      // 2. 3D TILT on [data-tilt]
      // ═══════════════════════════════════════
      document.querySelectorAll("[data-tilt]").forEach((card) => {
        if (card.dataset.gfxT || card.offsetHeight < 60) return;
        card.dataset.gfxT = "1";
        card.style.transition =
          (card.style.transition || "") + ", transform 0.15s ease-out";

        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          const rx = (y - 0.5) * -10;
          const ry = (x - 0.5) * 10;
          card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.02)`;
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
      // 3. ALL BUTTONS + NAV LINKS MAGNETIC
      // ═══════════════════════════════════════
      const magTargets = document.querySelectorAll("button, a.hnav, [data-magnetic]");
      magTargets.forEach((btn) => {
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
          btn.style.transition =
            "transform 0.35s cubic-bezier(0.22,1,0.36,1)";
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });

      // ═══════════════════════════════════════
      // 4. BUTTON RIPPLE — cyan ripple on click
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
      // 5. WHITE GLOW ON CLICK — dim white light
      // ═══════════════════════════════════════
      const glowClick = (e) => {
        const btn = e.currentTarget;
        if (btn.offsetWidth < 28) return;
        // Flash: brief white glow boxShadow
        const origShadow = btn.style.boxShadow || "";
        btn.style.boxShadow =
          origShadow +
          ", 0 0 15px 4px rgba(255,255,255,0.25), 0 0 30px 8px rgba(255,255,255,0.1)";
        btn.style.transition = "box-shadow 0.08s ease-out";
        setTimeout(() => {
          btn.style.boxShadow = origShadow;
          btn.style.transition = "box-shadow 0.4s ease-out";
        }, 200);
      };

      document.querySelectorAll("button").forEach((btn) => {
        if (btn.dataset.gfxGlow) return;
        btn.dataset.gfxGlow = "1";
        btn.addEventListener("mousedown", glowClick);
        cleanups.push(() =>
          btn.removeEventListener("mousedown", glowClick)
        );
      });

      // ═══════════════════════════════════════
      // 6. CARD HOVER GLOW
      // ═══════════════════════════════════════
      document
        .querySelectorAll("div[style*='borderRadius'][style*='border']")
        .forEach((card) => {
          if (card.dataset.gfxH || card.offsetHeight < 60) return;
          card.dataset.gfxH = "1";
          const origBorder = card.style.borderColor || "";
          const origShadow = card.style.boxShadow || "";
          const onIn = () => {
            card.style.borderColor = "rgba(82,183,136,0.35)";
            if (
              !card.style.boxShadow ||
              card.style.boxShadow === "none"
            )
              card.style.boxShadow =
                "0 8px 30px rgba(82,183,136,0.08)";
          };
          const onOut = () => {
            card.style.borderColor = origBorder;
            card.style.boxShadow = origShadow;
          };
          card.addEventListener("mouseenter", onIn);
          card.addEventListener("mouseleave", onOut);
          cleanups.push(() => {
            card.removeEventListener("mouseenter", onIn);
            card.removeEventListener("mouseleave", onOut);
          });
        });

      // ═══════════════════════════════════════
      // 7. COUNT-UP — animate numbers on scroll
      // ═══════════════════════════════════════
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !entry.target.dataset.gfxCounted
            ) {
              entry.target.dataset.gfxCounted = "1";
              animateCount(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      function animateCount(el) {
        const origText = el.textContent.trim();
        // Match: optional prefix (₹, $, etc), number with commas/decimals, optional suffix
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

          let formatted;
          if (isFloat) formatted = current.toFixed(decimals);
          else formatted = Math.round(current).toString();

          if (hasCommas) {
            const parts = formatted.split(".");
            if (useIndian) parts[0] = indianComma(parseInt(parts[0]));
            else
              parts[0] = parts[0].replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
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

      // Target .num elements (explicit class)
      document.querySelectorAll(".num, .price-value, .rupee, .currency-value").forEach(
        (el) => {
          if (el.dataset.gfxC) return;
          if (!/\d/.test(el.textContent)) return;
          el.dataset.gfxC = "1";
          countObserver.observe(el);
        }
      );

      // Auto-detect bold stat numbers (fontWeight 800/900, short numeric text)
      document
        .querySelectorAll(
          "div[style*='fontWeight: 900'], div[style*='fontWeight:900'], " +
            "div[style*='fontWeight: 800'], div[style*='fontWeight:800'], " +
            "span[style*='fontWeight: 900'], span[style*='fontWeight:900'], " +
            "span[style*='fontWeight: 800'], span[style*='fontWeight:800']"
        )
        .forEach((el) => {
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
        revealedSet.forEach((el) => delete el.dataset.gfxR);
        const attrs = ["gfxT","gfxMag","gfxRip","gfxGlow","gfxH","gfxC","gfxCounted"];
        attrs.forEach((a) => {
          document.querySelectorAll(`[data-${a.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase())}]`).forEach(
            (el) => delete el.dataset[a]
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
