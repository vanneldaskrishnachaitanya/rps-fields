import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — BLUE GLOWING DOT.
 * Fixed size (no grow/shrink on hover).
 * Uses box-shadow for glow effect.
 * Desktop only — hidden on mobile/touch.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ambientRef = useRef(null);
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
      if (ambientRef.current) {
        ambientRef.current.style.left = curX + "px";
        ambientRef.current.style.top = curY + "px";
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
    <>
      <div
        ref={ambientRef}
        style={{
          position: "fixed",
          left: "-1000px",
          top: "-1000px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,198,157,0.06) 0%, rgba(0,212,255,0.02) 40%, transparent 70%)",
          transform: "translate(-50%, -50%) translateZ(0)",
          willChange: "transform",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
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
          background: "#00d4ff",
          transform: "translate(-50%, -50%) translateZ(0)",
          willChange: "transform",
          pointerEvents: "none",
          zIndex: 99999,
          boxShadow:
            "0 0 8px 3px rgba(0,212,255,0.7), 0 0 20px 6px rgba(0,212,255,0.4), inset 0 0 4px rgba(255,255,255,0.8)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
