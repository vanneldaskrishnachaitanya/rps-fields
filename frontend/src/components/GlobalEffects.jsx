import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalEffects — Automatically injects CSS magic animations into EVERY page.
 *
 * This works by scanning the live DOM for card-like/interactive elements and
 * injecting effects. No className or data-attributes needed on individual
 * components — this finds everything automatically.
 *
 * Effects applied:
 * 1. SCROLL-REVEAL  — cards/sections fade-up + blur-in when scrolled into view
 * 2. 3D TILT        — cards with images get 3D hover tilt
 * 3. MAGNETIC       — [data-magnetic] buttons attract toward cursor
 * 4. BUTTON RIPPLE  — green ripple wave on every button click
 * 5. CARD HOVER GLOW — border + shadow glow on card hover
 * 6. IMAGE ZOOM     — images inside cards zoom slightly on hover
 */
export default function GlobalEffects() {
  const location = useLocation();
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Run effects with delays to catch both initial render and async content
    const t1 = setTimeout(() => run(), 200);
    const t2 = setTimeout(() => run(), 1800); // re-run after async data loads

    function run() {
      // Clean previous
      if (cleanupRef.current) cleanupRef.current();
      const cleanups = [];

      // ═══════════════════════════════════════
      // 1. SCROLL-REVEAL
      // ═══════════════════════════════════════
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const el = e.target;
              el.style.opacity = "1";
              el.style.transform = "translateY(0) scale(1)";
              el.style.filter = "blur(0)";
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
      );

      // Find ALL card-like elements across every page
      const cardSelectors = [
        // Cards with explicit border-radius (the project pattern)
        "div[style*='borderRadius: 2']",
        "div[style*='borderRadius: 1']",
        "div[style*='borderRadius:2']",
        "div[style*='borderRadius:1']",
        // Grid children — product cards, stat cards, category cards
        ".product-grid > div",
        ".stat-grid > div",
        // Explicit selectors
        "[data-id]",
        ".scroll-item",
        // Table rows
        "table tbody tr",
      ];

      const allCards = document.querySelectorAll(cardSelectors.join(","));
      const revealedEls = [];

      allCards.forEach((el, i) => {
        if (el.dataset.gfxR) return; // already applied
        const rect = el.getBoundingClientRect();
        // Only animate below-fold elements
        if (rect.top > window.innerHeight * 0.75) {
          el.dataset.gfxR = "1";
          revealedEls.push(el);
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
      // 2. 3D TILT on cards (those with images or data-tilt)
      // ═══════════════════════════════════════
      const tiltTargets = document.querySelectorAll(
        "[data-tilt], .product-grid > div > div"
      );
      tiltTargets.forEach((card) => {
        if (card.dataset.gfxT || card.offsetHeight < 80) return;
        card.dataset.gfxT = "1";
        card.style.transition =
          (card.style.transition || "") +
          ", transform 0.15s ease-out, box-shadow 0.3s ease";

        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          const rx = (y - 0.5) * -10;
          const ry = (x - 0.5) * 10;
          card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.02)`;
          card.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
        };
        const onLeave = () => {
          card.style.transform = "";
          card.style.boxShadow = "";
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });

      // ═══════════════════════════════════════
      // 3. MAGNETIC BUTTONS
      // ═══════════════════════════════════════
      document.querySelectorAll("[data-magnetic]").forEach((btn) => {
        if (btn.dataset.gfxM) return;
        btn.dataset.gfxM = "1";
        const onMove = (e) => {
          const r = btn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
        };
        const onLeave = () => {
          btn.style.transform = "translate(0,0)";
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });

      // ═══════════════════════════════════════
      // 4. BUTTON RIPPLE — every <button>
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
          background: "rgba(82,183,136,0.18)",
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

      const allBtns = document.querySelectorAll("button");
      allBtns.forEach((btn) => {
        if (btn.dataset.gfxB) return;
        btn.dataset.gfxB = "1";
        btn.addEventListener("click", ripple);
        cleanups.push(() => btn.removeEventListener("click", ripple));
      });

      // ═══════════════════════════════════════
      // 5. CARD HOVER GLOW — green border glow
      // ═══════════════════════════════════════
      const hoverCards = document.querySelectorAll(
        "div[style*='borderRadius'][style*='border']"
      );
      hoverCards.forEach((card) => {
        if (card.dataset.gfxH || card.offsetHeight < 60) return;
        card.dataset.gfxH = "1";
        const origBorder = card.style.borderColor || "";
        const origShadow = card.style.boxShadow || "";
        const onIn = () => {
          card.style.borderColor = "rgba(82,183,136,0.45)";
          if (!card.style.boxShadow || card.style.boxShadow === "none") {
            card.style.boxShadow = "0 8px 30px rgba(82,183,136,0.12)";
          }
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
      // 6. IMAGE ZOOM on hover (cards with images)
      // ═══════════════════════════════════════
      document
        .querySelectorAll("div[style*='overflow'] img[style*='objectFit']")
        .forEach((img) => {
          if (img.dataset.gfxI) return;
          img.dataset.gfxI = "1";
          if (!img.style.transition) {
            img.style.transition = "transform 0.5s ease";
          }
        });

      // ═══════════════════════════════════════
      // CLEANUP
      // ═══════════════════════════════════════
      cleanupRef.current = () => {
        revealObserver.disconnect();
        cleanups.forEach((fn) => fn());
        // Reset data attributes
        revealedEls.forEach((el) => delete el.dataset.gfxR);
        document.querySelectorAll("[data-gfx-t]").forEach((el) => delete el.dataset.gfxT);
        document.querySelectorAll("[data-gfx-m]").forEach((el) => delete el.dataset.gfxM);
        document.querySelectorAll("[data-gfx-b]").forEach((el) => delete el.dataset.gfxB);
        document.querySelectorAll("[data-gfx-h]").forEach((el) => delete el.dataset.gfxH);
        document.querySelectorAll("[data-gfx-i]").forEach((el) => delete el.dataset.gfxI);
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
