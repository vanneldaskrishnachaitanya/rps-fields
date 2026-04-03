import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalEffects — applies CSS magic across ALL pages:
 *
 * 1. Scroll-reveal: any element with [data-id] or .scroll-item
 *    fades in when scrolled into view
 * 2. Magnetic buttons: elements with [data-magnetic] pull toward cursor
 * 3. 3D Tilt: elements with [data-tilt] rotate in 3D based on mouse
 * 4. Hover-lift: all cards / clickable surfaces get lift on hover
 * 5. Ripple click effect on buttons
 */
export default function GlobalEffects() {
  const location = useLocation();

  useEffect(() => {
    // Small delay so DOM is rendered after route change
    const initTimeout = setTimeout(() => {
      initEffects();
    }, 100);

    function initEffects() {
      // ─── 1. SCROLL REVEAL (global) ───
      // Observe .scroll-item AND any [data-id] element for reveal
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              e.target.style.opacity = "1";
              e.target.style.transform = "translateY(0)";
            }
          });
        },
        { threshold: 0.08 }
      );

      document
        .querySelectorAll(".scroll-item")
        .forEach((el) => revealObserver.observe(el));

      // ─── 2. MAGNETIC BUTTONS ───
      const magneticEls = document.querySelectorAll("[data-magnetic]");

      const handleMagneticMove = (e) => {
        const btn = e.currentTarget;
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
      };
      const handleMagneticLeave = (e) => {
        e.currentTarget.style.transform = "translate(0,0)";
      };
      const handleMagneticClick = (e) => {
        const btn = e.currentTarget;
        const ripple = document.createElement("span");
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        ripple.className = "btn-ripple";
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${
          e.clientX - r.left - size / 2
        }px;top:${e.clientY - r.top - size / 2}px;`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      };

      magneticEls.forEach((btn) => {
        btn.addEventListener("mousemove", handleMagneticMove);
        btn.addEventListener("mouseleave", handleMagneticLeave);
        btn.addEventListener("click", handleMagneticClick);
      });

      // ─── 3. 3D TILT ───
      const tiltEls = document.querySelectorAll("[data-tilt]");

      const handleTiltMove = (e) => {
        const card = e.currentTarget;
        const shine = card.querySelector(".shine");
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - 0.5) * -22;
        const ry = (x - 0.5) * 22;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05)`;
        if (shine) {
          shine.style.setProperty("--mx", x * 100 + "%");
          shine.style.setProperty("--my", y * 100 + "%");
        }
      };
      const handleTiltLeave = (e) => {
        e.currentTarget.style.transform =
          "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
      };

      tiltEls.forEach((card) => {
        card.addEventListener("mousemove", handleTiltMove);
        card.addEventListener("mouseleave", handleTiltLeave);
      });

      // ─── 4. GLOBAL BUTTON RIPPLE ───
      // Add a subtle ripple to ALL buttons on click (not just magnetic)
      const handleGlobalRipple = (e) => {
        const btn = e.currentTarget;
        // Skip if already has ripple logic (magnetic buttons)
        if (btn.hasAttribute("data-magnetic")) return;
        // Don't add to tiny icon buttons
        if (btn.offsetWidth < 30 || btn.offsetHeight < 30) return;

        const ripple = document.createElement("span");
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 1.4;
        ripple.style.cssText = `
          position:absolute; border-radius:50%;
          background:rgba(82,183,136,0.18);
          width:${size}px; height:${size}px;
          left:${e.clientX - r.left - size / 2}px;
          top:${e.clientY - r.top - size / 2}px;
          transform:scale(0); pointer-events:none;
          animation:ripple-anim 0.6s linear;
        `;
        // Only add if button has position relative/absolute
        const pos = window.getComputedStyle(btn).position;
        if (pos === "static") btn.style.position = "relative";
        btn.style.overflow = "hidden";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      };

      const allButtons = document.querySelectorAll("button");
      allButtons.forEach((btn) => {
        btn.addEventListener("click", handleGlobalRipple);
      });

      // ─── CLEANUP ───
      return () => {
        revealObserver.disconnect();
        magneticEls.forEach((btn) => {
          btn.removeEventListener("mousemove", handleMagneticMove);
          btn.removeEventListener("mouseleave", handleMagneticLeave);
          btn.removeEventListener("click", handleMagneticClick);
        });
        tiltEls.forEach((card) => {
          card.removeEventListener("mousemove", handleTiltMove);
          card.removeEventListener("mouseleave", handleTiltLeave);
        });
        allButtons.forEach((btn) => {
          btn.removeEventListener("click", handleGlobalRipple);
        });
      };
    }

    let cleanup;
    const id = setTimeout(() => {
      cleanup = initEffects();
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(id);
      if (cleanup) cleanup();
    };
  }, [location.pathname]);

  return null;
}
