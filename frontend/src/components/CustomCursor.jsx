import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — Mescubook Style Hollow Ring with Physics Lag.
 * Expands and turns green when hovering over clickable elements.
 * Desktop only — hidden on mobile/touch.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only disable on small screens to ensure Windows laptops with touchscreens still get the cursor
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      return;
    }


    // Hide default cursor globally on desktop
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let animId;
    let isHovering = false;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const checkHover = (e) => {
      const tag = e.target.tagName.toLowerCase();
      // Added data-tilt as well since cards use it
      const isInteractive = tag === 'a' || tag === 'button' || e.target.closest('button') || e.target.closest('a') || e.target.dataset.magnetic || e.target.closest('[data-tilt]');
      isHovering = !!isInteractive;
    };

    // Smooth 60fps tracking using linear interpolation
    const render = () => {
      // Easing physics (magnetic lag)
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      
      if (cursorRef.current) {
        cursorRef.current.style.left = curX + "px";
        cursorRef.current.style.top = curY + "px";
        
        // Handle transform state based on hover
        if (isHovering) {
            cursorRef.current.style.transform = "translate(-50%, -50%) scale(1.6)";
            cursorRef.current.style.borderColor = "rgba(116, 198, 157, 0.8)"; // tk.green4
            cursorRef.current.style.backgroundColor = "transparent";
            cursorRef.current.style.borderWidth = "2px";
        } else {
            cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
            cursorRef.current.style.borderColor = "rgba(255, 255, 255, 0.6)";
            cursorRef.current.style.backgroundColor = "transparent";
            cursorRef.current.style.borderWidth = "1.5px";
        }
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", checkHover);
    render();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", checkHover);
      cancelAnimationFrame(animId);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);


  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      id="rps-cursor"
      style={{
        position: "fixed",
        left: "-100px",
        top: "-100px",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        border: "1.5px solid rgba(255, 255, 255, 0.6)",
        transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s ease, border-width 0.3s ease",
        transform: "translate(-50%, -50%) translateZ(0)",
        willChange: "transform, border-color, border-width, top, left",
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference", // Excellent for ensuring it's visible on both light and dark backgrounds
      }}
    />
  );
}
