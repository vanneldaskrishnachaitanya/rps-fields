/**
 * SVG Animations Helper Component
 * Provides reusable SVG elements and animations
 */

// Floating leaf SVG decorator
export function FloatingLeafSVG({ color = "#52b788", size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`animate-float ${className}`}
      data-animate-float
      data-glow
      style={{ filter: 'drop-shadow(0 0 8px rgba(82,183,136,0.3))' }}
    >
      <path
        d="M50 10 Q60 30 50 50 Q40 30 50 10 Z"
        fill={color}
        opacity="0.8"
      />
      <ellipse cx="45" cy="35" rx="3" ry="6" fill={color} opacity="0.6" />
    </svg>
  );
}

// Pulsing circle SVG decorator
export function PulsingCircleSVG({ color = "#52b788", size = 50, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`animate-pulse ${className}`}
      data-animate-pulse
    >
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="50" cy="50" r="25" fill={color} opacity="0.6" />
    </svg>
  );
}

// Rotating gear SVG
export function RotatingGearSVG({ color = "#52b788", size = 45, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`animate-spin ${className}`}
      data-animate-rotate
    >
      <g fill={color} opacity="0.8">
        <circle cx="50" cy="50" r="30" />
        <rect x="45" y="15" width="10" height="12" />
        <rect x="45" y="73" width="10" height="12" />
        <rect x="15" y="45" width="12" height="10" />
        <rect x="73" y="45" width="12" height="10" />
        <circle cx="50" cy="50" r="15" fill="#080f12" />
      </g>
    </svg>
  );
}

// Bouncing ball SVG
export function BouncingBallSVG({ color = "#52b788", size = 35, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`animate-bounce ${className}`}
    >
      <circle cx="50" cy="50" r="30" fill={color} opacity="0.7" />
      <circle cx="55" cy="45" r="8" fill="#fff" opacity="0.3" />
    </svg>
  );
}

// Glowing orb SVG
export function GlowingOrbSVG({ color = "#52b788", size = 60, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      data-glow
    >
      <defs>
        <radialGradient id="orbGradient">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#orbGradient)" filter="url(#glow)" />
      <circle cx="50" cy="50" r="25" fill={color} opacity="0.5" />
    </svg>
  );
}

// Animated wave SVG
export function WaveSVG({ color = "#52b788", height = 60, className = "" }) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={className}
      data-animate-float
    >
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z"
        fill="url(#waveGrad)"
        style={{ animation: 'svgFloat 3s ease-in-out infinite' }}
      />
    </svg>
  );
}

// Animated checkmark SVG
export function CheckmarkSVG({ color = "#52b788", size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      data-animate-scale
    >
      <path
        d="M20 50 L40 70 L80 30"
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: 'pathDraw 1s ease-in-out forwards',
          strokeDasharray: 80,
          strokeDashoffset: 80,
        }}
      />
    </svg>
  );
}

// Staggered dots loader
export function StaggeredDotsLoader({ color = "#52b788", size = 15 }) {
  return (
    <div style={{ display: 'flex', gap: size / 2, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            animation: `bounce 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// Gradient text with animation
export function AnimatedGradientText({ text, className = "" }) {
  return (
    <span
      className={`animate-text-glow ${className}`}
      style={{
        background: 'linear-gradient(135deg, #52b788 0%, #d4a017 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'textGlow 2s ease-in-out infinite',
      }}
    >
      {text}
    </span>
  );
}

// Card with tilt and animation
export function AnimatedCard({ children, className = "", style = {} }) {
  return (
    <div
      data-tilt
      className={`animate-fade-in-scale ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Animated flex container with staggered children
export function StaggeredContainer({ children, className = "", delay = 0.05 }) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                animation: `fadeInUp 0.6s ease-out ${delay * i}s both`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
