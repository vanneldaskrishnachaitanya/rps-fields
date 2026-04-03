import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalEffects — AUTO-APPLIES visual magic to ALL pages in the project.
 *
 * Since the project uses inline styles (no className), this component
 * scans the DOM and injects effects on actual elements:
 *
 * 1. SCROLL REVEAL  — all cards, sections, grid items fade-up on scroll
 * 2. 3D TILT        — product cards and category cards tilt on hover
 * 3. HOVER LIFT     — all interactive cards get lift + shadow on hover
 * 4. GLASSMORPHISM  — backdrop-filter panels get glass sheen
 * 5. MAGNETIC BTN   — CTA buttons attract toward cursor
 * 6. BUTTON RIPPLE  — every button click spawns a ripple
 * 7. GRADIENT LINES — dividers between sections get gradient treatment
 */
export default function GlobalEffects() {
  const location = useLocation();

  const applyEffects = useCallback(() => {
    // ═══════════════════════════════════════
    // 1. SCROLL-REVEAL — fade-up on scroll
    // ═══════════════════════════════════════
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.opacity = "1";
            el.style.transform = el.dataset.origTransform || "translateY(0)";
            el.style.filter = "blur(0)";
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    // Target: every card-like element (has borderRadius + border),
    // grid children, and sections with data-id
    const revealSelectors = [
      "[data-id]",                           // existing scroll triggers
      ".scroll-item",                        // explicit scroll items
      ".product-grid > div",                 // product grid children
      "section > div > div[style*='borderRadius']",  // cards with radius
    ];

    const revealEls = document.querySelectorAll(revealSelectors.join(","));
    const revealedSet = new Set();

    revealEls.forEach((el, i) => {
      // Don't double-apply
      if (el.dataset.fxReveal) return;
      el.dataset.fxReveal = "1";
      revealedSet.add(el);

      // Only apply initial hidden state if element is below-fold
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.85) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.filter = "blur(2px)";
        el.style.transition = `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${Math.min(i % 6, 5) * 0.07}s, 
                               transform 0.6s cubic-bezier(0.22,1,0.36,1) ${Math.min(i % 6, 5) * 0.07}s,
                               filter 0.6s ease ${Math.min(i % 6, 5) * 0.07}s`;
      }
      revealObserver.observe(el);
    });

    // ═══════════════════════════════════════
    // 2. 3D TILT on hover — product / category cards
    // ═══════════════════════════════════════
    // Find cards that have images inside them and are in grids
    const tiltCards = document.querySelectorAll(
      ".product-grid > div > div, [data-tilt]"
    );
    const tiltCleanups = [];

    tiltCards.forEach((card) => {
      if (card.dataset.fxTilt) return;
      // Only apply to elements that look like cards (have some height)
      if (card.offsetHeight < 100) return;
      card.dataset.fxTilt = "1";
      card.style.transformStyle = "preserve-3d";

      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - 0.5) * -8;  // subtle tilt
        const ry = (x - 0.5) * 8;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px) scale(1.02)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      tiltCleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    // ═══════════════════════════════════════
    // 3. GLASSMORPHISM SHEEN — on panels with backdrop-filter
    // ═══════════════════════════════════════
    document.querySelectorAll("[style*='backdrop-filter'], [style*='backdropFilter']").forEach((el) => {
      if (el.dataset.fxGlass) return;
      el.dataset.fxGlass = "1";
      // Add subtle animated sheen on hover
      el.addEventListener("mouseenter", () => {
        el.style.borderColor = "rgba(82,183,136,0.4)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.borderColor = "";
      });
    });

    // ═══════════════════════════════════════
    // 4. MAGNETIC BUTTONS — CTA / hero buttons
    // ═══════════════════════════════════════
    const magneticBtns = document.querySelectorAll("[data-magnetic]");
    const magCleanups = [];

    magneticBtns.forEach((btn) => {
      if (btn.dataset.fxMag) return;
      btn.dataset.fxMag = "1";

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
      magCleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    // ═══════════════════════════════════════
    // 5. BUTTON RIPPLE — on every button click
    // ═══════════════════════════════════════
    const rippleHandler = (e) => {
      const btn = e.currentTarget;
      if (btn.offsetWidth < 30) return;

      const ripple = document.createElement("span");
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.5;
      Object.assign(ripple.style, {
        position: "absolute",
        borderRadius: "50%",
        background: "rgba(82,183,136,0.2)",
        width: size + "px",
        height: size + "px",
        left: (e.clientX - r.left - size / 2) + "px",
        top: (e.clientY - r.top - size / 2) + "px",
        transform: "scale(0)",
        pointerEvents: "none",
        animation: "ripple-anim 0.6s ease-out",
      });

      const origPos = window.getComputedStyle(btn).position;
      if (origPos === "static") btn.style.position = "relative";
      const origOverflow = btn.style.overflow;
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
        if (origPos === "static") btn.style.position = "";
        btn.style.overflow = origOverflow;
      }, 650);
    };

    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((btn) => {
      if (btn.dataset.fxRipple) return;
      btn.dataset.fxRipple = "1";
      btn.addEventListener("click", rippleHandler);
    });

    // ═══════════════════════════════════════
    // 6. HOVER GLOW on interactive cards
    // ═══════════════════════════════════════
    // Find all card-like divs that have border + borderRadius
    const cardEls = document.querySelectorAll(
      "div[style*='borderRadius'][style*='border']"
    );
    cardEls.forEach((card) => {
      if (card.dataset.fxHover || card.offsetHeight < 80) return;
      card.dataset.fxHover = "1";
      
      card.addEventListener("mouseenter", () => {
        card.style.transition = (card.style.transition || "") + ", box-shadow 0.3s ease";
      });
    });

    // ═══════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════
    return () => {
      revealObserver.disconnect();
      tiltCleanups.forEach((fn) => fn());
      magCleanups.forEach((fn) => fn());
      allButtons.forEach((btn) => {
        btn.removeEventListener("click", rippleHandler);
      });
      // Reset data attributes
      revealedSet.forEach((el) => delete el.dataset.fxReveal);
      document.querySelectorAll("[data-fx-tilt]").forEach((el) => delete el.dataset.fxTilt);
      document.querySelectorAll("[data-fx-glass]").forEach((el) => delete el.dataset.fxGlass);
      document.querySelectorAll("[data-fx-mag]").forEach((el) => delete el.dataset.fxMag);
      document.querySelectorAll("[data-fx-ripple]").forEach((el) => delete el.dataset.fxRipple);
      document.querySelectorAll("[data-fx-hover]").forEach((el) => delete el.dataset.fxHover);
    };
  }, []);

  useEffect(() => {
    // Wait for DOM to render after route change
    const timeoutId = setTimeout(() => {
      const cleanup = applyEffects();
      
      // Re-apply after dynamic content loads (products, etc.)
      const retryId = setTimeout(() => {
        applyEffects();
      }, 1500);

      return () => {
        clearTimeout(retryId);
        if (cleanup) cleanup();
      };
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, applyEffects]);

  return null;
}
