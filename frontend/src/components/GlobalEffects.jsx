import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GlobalEffects() {
  const location = useLocation();

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-item').forEach(el => observer.observe(el));

    // Magnetic buttons
    const handleMagneticMove = (e) => {
      const btn = e.currentTarget;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top  + r.height/2);
      btn.style.transform = `translate(${dx*0.35}px, ${dy*0.35}px)`;
    };
    const handleMagneticLeave = (e) => {
      e.currentTarget.style.transform = 'translate(0,0)';
    };
    
    // Ripple effect for magnetic buttons
    const handleMagneticClick = (e) => {
      const btn = e.currentTarget;
      const ripple = document.createElement('span');
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      ripple.className = 'btn-ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', handleMagneticMove);
      btn.addEventListener('mouseleave', handleMagneticLeave);
      btn.addEventListener('click', handleMagneticClick);
    });

    // 3D Tilt
    const handleTiltMove = (e) => {
      const card = e.currentTarget;
      const shine = card.querySelector('.shine');
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;
      const rx2 = (y - 0.5) * -22;
      const ry2 = (x - 0.5) *  22;
      card.style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) scale(1.05)`;
      if(shine) {
        shine.style.setProperty('--mx', x*100+'%');
        shine.style.setProperty('--my', y*100+'%');
      }
    };
    const handleTiltLeave = (e) => {
      e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    };
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', handleTiltMove);
      card.addEventListener('mouseleave', handleTiltLeave);
    });

    return () => {
      observer.disconnect();
      document.querySelectorAll('[data-magnetic]').forEach(btn => {
        btn.removeEventListener('mousemove', handleMagneticMove);
        btn.removeEventListener('mouseleave', handleMagneticLeave);
        btn.removeEventListener('click', handleMagneticClick);
      });
      document.querySelectorAll('[data-tilt]').forEach(card => {
        card.removeEventListener('mousemove', handleTiltMove);
        card.removeEventListener('mouseleave', handleTiltLeave);
      });
    };
  }, [location.pathname]);

  return null;
}
