import { useEffect, useRef } from 'react';

/**
 * MagneticText Component
 * Splits text into individual characters and applies a physics-based repulsion effect
 * when the cursor gets close (Mescubook style).
 */
export default function MagneticText({ text, as: Component = 'span', className, style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Disable only on small screens
    if (window.innerWidth <= 768) {
      return;
    }


    const chars = containerRef.current.querySelectorAll('.mag-char');
    let mouseX = -1000;
    let mouseY = -1000;
    let isHovering = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseEnter = () => isHovering = true;
    const onMouseLeave = () => isHovering = false;

    window.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('mouseenter', onMouseEnter);
    containerRef.current.addEventListener('mouseleave', onMouseLeave);
    
    let animId;

    const render = () => {
      if (!isHovering) {
        // Smoothly return all chars to original position when not hovering near the container
        chars.forEach(char => {
          char.style.transform = 'translate(0px, 0px)';
        });
      } else {
        chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const charX = rect.left + rect.width / 2;
          const charY = rect.top + rect.height / 2;
          
          const dx = mouseX - charX;
          const dy = mouseY - charY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const maxDist = 140; // Detection radius
          const force = 35; // Max push distance in pixels
          
          if (dist < maxDist) {
            const pushX = (dx / dist) * -force * ((maxDist - dist) / maxDist);
            const pushY = (dy / dist) * -force * ((maxDist - dist) / maxDist);
            char.style.transform = `translate(${pushX}px, ${pushY}px)`;
            // Remove transition for instant physics reaction
            char.style.transition = 'none';
          } else {
            char.style.transform = 'translate(0px, 0px)';
            // Add spring-like transition back to origin
            char.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }
        });
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', onMouseEnter);
        containerRef.current.removeEventListener('mouseleave', onMouseLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, [text]);

  // Handle new lines properly
  const lines = text.split('\n');

  return (
    <Component ref={containerRef} className={className} style={{ display: 'inline-block', ...style }}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block' }}>
          {line.split(' ').map((word, j, wordArr) => (
            <span key={j} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {word.split('').map((char, k) => (
                <span key={k} className="mag-char" style={{ display: 'inline-block', willChange: 'transform', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  {char}
                </span>
              ))}
              {j < wordArr.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
}
