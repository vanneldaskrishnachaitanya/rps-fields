import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — BLUE GLOWING DOT.
 * Fixed size (no grow/shrink on hover).
 * Uses box-shadow for glow effect.
 * Desktop only — hidden on mobile/touch.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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

    // Smooth 60fps tracking
    const render = () => {
      curX += (mouseX - curX) * 0.25;
      curY += (mouseY - curY) * 0.25;
      if (dotRef.current) {
        dotRef.current.style.left = curX + "px";
        dotRef.current.style.top = curY + "px";
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    render();

    return () => {
      window.removeEventListener("mousemove", onMove);
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
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#00d4ff",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,
        boxShadow:
          "0 0 6px 2px rgba(0,212,255,0.6), 0 0 14px 4px rgba(0,212,255,0.35), 0 0 28px 8px rgba(0,212,255,0.15)",
        mixBlendMode: "screen",
      }}
    />
  );
}
