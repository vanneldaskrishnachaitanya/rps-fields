import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
      setIsMobile(true);
      return;
    }

    let rx = -100;
    let ry = -100;
    let mouseX = -100;
    let mouseY = -100;
    let animationFrameId;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-tilt]') ||
        target.closest('[data-magnetic]')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    // Smooth following loop
    const render = () => {
      rx += (mouseX - rx) * 0.5;
      ry += (mouseY - ry) * 0.5;
      setPosition({ x: rx, y: ry });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    render();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      id="cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        height: hovering ? '14px' : '28px',
        width: hovering ? '14px' : '4px',
        borderRadius: hovering ? '50%' : '4px',
        background: hovering ? 'var(--neon-pink, #ff00c8)' : 'var(--neon-cyan, #00f5ff)',
        boxShadow: hovering 
          ? '0 0 10px var(--neon-pink, #ff00c8), 0 0 20px var(--neon-pink, #ff00c8)' 
          : '0 0 10px var(--neon-cyan, #00f5ff), 0 0 20px var(--neon-cyan, #00f5ff)',
        transition: 'height 0.2s cubic-bezier(0.23, 1, 0.32, 1), width 0.2s cubic-bezier(0.23, 1, 0.32, 1), border-radius 0.2s, background-color 0.2s, box-shadow 0.2s'
      }}
    />
  );
}
