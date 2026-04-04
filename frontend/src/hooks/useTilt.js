import { useEffect, useRef } from 'react';

/**
 * Custom hook to apply 3D tilt effect to elements using Vanilla Tilt
 * Usage: const tiltRef = useTilt(); <div ref={tiltRef} data-tilt>...</div>
 */
export function useTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Dynamically import Vanilla Tilt
    import('vanilla-tilt').then(VanillaTilt => {
      VanillaTilt.init(element, {
        max: 25,
        scale: 1.02,
        speed: 400,
        transition: true,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
        perspective: 1000,
        glare: true,
        glarePreload: true,
        glareMaxOpacity: 0.2,
        glareColor: 'rgba(82, 183, 136, 0.3)',
        glarePosition: 'front',
      });
    });

    return () => {
      if (element.vanillaTilt) {
        element.vanillaTilt.destroy();
      }
    };
  }, []);

  return ref;
}

/**
 * Alternative: Pure CSS 3D tilt effect (no external dependency)
 * Use this for lighter performance if vanilla-tilt fails
 */
export function usePureCSS3DTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 15;
      const rotateY = ((centerX - x) / centerX) * 15;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}
