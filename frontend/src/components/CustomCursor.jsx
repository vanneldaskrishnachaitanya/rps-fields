import { useEffect, useRef, useState } from "react";

/**
 * Glowing blue bar cursor — desktop only, no ring.
 * Becomes a dot when hovering interactive elements.
 */
export default function CustomCursor() {
  const curRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const hoveringRef = useRef(false);

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
    let animId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e) => {
      const t = e.target;
      hoveringRef.current =
        t.tagName === "BUTTON" ||
        t.tagName === "A" ||
        t.tagName === "INPUT" ||
        t.tagName === "SELECT" ||
        t.tagName === "TEXTAREA" ||
        !!t.closest("button") ||
        !!t.closest("a") ||
        !!t.closest("[data-tilt]") ||
        !!t.closest("[data-magnetic]") ||
        !!t.closest("[role='button']");

      if (curRef.current) {
        const el = curRef.current;
        if (hoveringRef.current) {
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.borderRadius = "50%";
          el.style.background = "#3b82f6";
          el.style.boxShadow =
            "0 0 12px rgba(59,130,246,0.8), 0 0 24px rgba(59,130,246,0.5)";
        } else {
          el.style.width = "4px";
          el.style.height = "28px";
          el.style.borderRadius = "3px";
          el.style.background =
            "linear-gradient(180deg, #00b4ff, #0066ff)";
          el.style.boxShadow =
            "0 0 10px rgba(0,120,255,0.7), 0 0 22px rgba(0,120,255,0.4), 0 2px 8px rgba(0,120,255,0.3)";
        }
      }
    };

    const render = () => {
      curX += (mouseX - curX) * 0.45;
      curY += (mouseY - curY) * 0.45;
      if (curRef.current) {
        curRef.current.style.left = curX + "px";
        curRef.current.style.top = curY + "px";
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
      ref={curRef}
      id="rps-cursor"
      style={{
        position: "fixed",
        left: "-100px",
        top: "-100px",
        width: "4px",
        height: "28px",
        borderRadius: "3px",
        background: "linear-gradient(180deg, #00b4ff, #0066ff)",
        boxShadow:
          "0 0 10px rgba(0,120,255,0.7), 0 0 22px rgba(0,120,255,0.4), 0 2px 8px rgba(0,120,255,0.3)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,
        transition:
          "width 0.18s cubic-bezier(0.23,1,0.32,1), height 0.18s cubic-bezier(0.23,1,0.32,1), border-radius 0.18s, background 0.18s, box-shadow 0.18s",
      }}
    />
  );
}
