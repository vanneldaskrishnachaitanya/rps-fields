import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — a glowing DOT (no ring).
 * Uses mix-blend-mode: difference so it auto-inverts against
 * any background, staying visible on light AND dark surfaces.
 * Desktop only — hidden on mobile/touch.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Skip on mobile / touch devices
    if (
      window.innerWidth <= 768 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    ) {
      setIsMobile(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let hovering = false;
    let animId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e) => {
      const t = e.target;
      const wasHovering = hovering;
      hovering =
        t.tagName === "BUTTON" ||
        t.tagName === "A" ||
        t.tagName === "INPUT" ||
        t.tagName === "SELECT" ||
        t.tagName === "TEXTAREA" ||
        !!t.closest("button") ||
        !!t.closest("a") ||
        !!t.closest("[data-tilt]") ||
        !!t.closest("[data-magnetic]") ||
        !!t.closest("[role='button']") ||
        !!t.closest("label") ||
        window.getComputedStyle(t).cursor === "pointer";

      if (dotRef.current && hovering !== wasHovering) {
        const el = dotRef.current;
        if (hovering) {
          el.style.width = "40px";
          el.style.height = "40px";
          el.style.opacity = "0.5";
        } else {
          el.style.width = "12px";
          el.style.height = "12px";
          el.style.opacity = "1";
        }
      }
    };

    // Smooth 60fps tracking
    const render = () => {
      curX += (mouseX - curX) * 0.35;
      curY += (mouseY - curY) * 0.35;
      if (dotRef.current) {
        dotRef.current.style.left = curX + "px";
        dotRef.current.style.top = curY + "px";
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    render();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={dotRef}
      id="rps-cursor"
      style={{
        position: "fixed",
        left: "-100px",
        top: "-100px",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "#fff",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference",
        transition:
          "width 0.2s cubic-bezier(0.23,1,0.32,1), height 0.2s cubic-bezier(0.23,1,0.32,1), opacity 0.2s ease",
      }}
    />
  );
}
