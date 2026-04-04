# RPS Fields - 3D Effects & Animations Implementation Guide

## Overview
This document describes the comprehensive animations and 3D effects implemented across the RPS Fields application.

## Features Implemented

### 1. **Dark Mode (Default)**
- Dark theme is now the default application background
- Added to: `body` in `index.css`
- Color: `#080f12` with subtle radial gradients
- All text colors automatically adjusted for dark mode visibility

### 2. **3D Tilt Effects on Cards**
- **How it works**: Uses Vanilla Tilt library for smooth 3D perspective
- **Files Affected**:
  - `frontend/src/hooks/useTilt.js` - Custom hook implementation
  - `frontend/src/components/ProductCard.jsx` - Applied to product cards
  - CSS classes: `[data-tilt]`, `.card-tilt`

- **Usage in Components**:
  ```javascript
  import { useTilt } from "../hooks/useTilt";
  
  export function MyCard() {
    const tiltRef = useTilt();
    return (
      <div ref={tiltRef} data-tilt>
        {/* Card content */}
      </div>
    );
  }
  ```

### 3. **Glowing Button Effects**
- **Green Gradient Background**: All buttons use `linear-gradient(135deg, rgba(82,183,136,0.85) 0%, rgba(45,106,79,0.95))`
- **Green Glow Box Shadow**: 
  - Normal: `0 0 20px rgba(82,183,136,0.3), 0 0 40px rgba(82,183,136,0.15)`
  - Hover: `0 0 30px rgba(82,183,136,0.5), 0 0 60px rgba(82,183,136,0.25)`
  - Active: `0 0 40px rgba(82,183,136,0.6), 0 0 80px rgba(82,183,136,0.3)`

- **Button Types with Green Glow**:
  - `.ios-btn` - Base green button
  - `.ios-btn-gold` - Gold variant
  - `.ios-btn-blue` - Blue variant
  - `.ios-btn-danger` - Red variant
  - `.ios-btn-ghost` - White glass variant

### 4. **SVG Animations**
- **Available Components** (in `SVGAnimations.jsx`):
  - `<FloatingLeafSVG />` - Floating animation
  - `<PulsingCircleSVG />` - Pulsing effect
  - `<RotatingGearSVG />` - Continuous rotation
  - `<BouncingBallSVG />` - Bouncing animation
  - `<GlowingOrbSVG />` - Glowing effect
  - `<WaveSVG />` - Wave animation
  - `<CheckmarkSVG />` - Checkmark animation
  - `<StaggeredDotsLoader />` - Loading indicator
  - `<AnimatedGradientText />` - Gradient text animation
  - `<AnimatedCard />` - Card with tilt and animations
  - `<StaggeredContainer />` - Staggered animation container

### 5. **CSS Animation Classes**
- `.animate-float` - Floating up/down animation
- `.animate-pulse` - Pulsing in/out animation
- `.animate-glow-pulse` - Glowing pulse effect
- `.animate-spin` - Rotating animation
- `.animate-bounce` - Bouncing animation
- `.animate-fade-in-up` - Fade and slide up
- `.animate-fade-in-scale` - Fade and scale
- `.animate-text-glow` - Text glow animation

- **Delay Classes**:
  - `.animate-delay-100` - 100ms delay
  - `.animate-delay-200` - 200ms delay
  - `.animate-delay-300` - 300ms delay
  - `.animate-delay-500` - 500ms delay

### 6. **Keyframes**
All animations are defined in `index.css`:
- `countPulse` - Scale pulse
- `svgFloat` - Floating motion
- `svgPulse` - Opacity pulse
- `glowPulse` - Box shadow glow
- `rotate360` - Full rotation
- `bounce` - Vertical bounce
- `fadeInUp` - Fade and slide up
- `fadeInScale` - Fade and scale
- `shimmer` - Shimmer effect
- `pathDraw` - SVG path draw animation
- `textGlow` - Text shadow glow

## Implementation Examples

### Adding 3D Tilt to a Component
```javascript
import { useTilt } from "../hooks/useTilt";

export function MyComponent() {
  const tiltRef = useTilt();
  
  return (
    <div ref={tiltRef} data-tilt style={{ perspective: '1000px' }}>
      <div style={{ borderRadius: 20, background: '#0e1a1f' }}>
        Your tiled content here
      </div>
    </div>
  );
}
```

### Adding SVG Animations
```javascript
import { 
  FloatingLeafSVG, 
  PulsingCircleSVG, 
  GlowingOrbSVG,
  AnimatedGradientText 
} from "../components/SVGAnimations";

export function MyPage() {
  return (
    <div>
      <FloatingLeafSVG color="#52b788" size={40} />
      <PulsingCircleSVG color="#d4a017" size={50} />
      <GlowingOrbSVG color="#52b788" size={60} />
      <AnimatedGradientText text="Welcome to RPS Fields" />
    </div>
  );
}
```

### Using Animation Classes
```javascript
export function MyCard() {
  return (
    <div className="animate-fade-in-up animate-delay-200">
      <div className="card animate-glow-pulse">
        <div className="animate-text-glow">Animated Text</div>
      </div>
    </div>
  );
}
```

### Using Staggered Container
```javascript
import { StaggeredContainer, AnimatedCard } from "../components/SVGAnimations";

export function ProductList({ products }) {
  return (
    <StaggeredContainer delay={0.1}>
      {products.map(product => (
        <AnimatedCard key={product.id}>
          {/* Product card content */}
        </AnimatedCard>
      ))}
    </StaggeredContainer>
  );
}
```

## CSS Classes Applied Globally

### Cards and Containers
- `.card` - Base card with tilt effect
- `.admin-card` - Admin-specific card styling
- `.card-tilt` - Tilt container
- `[data-tilt]` - Tilt target element

### Text and Effects
- `.text-glow` - Text with glow animation
- `.box-glow` - Box with glow effect
- `.gradient-border` - Gradient border effect
- `.grad-text` - Gradient text effect

### Form Elements
- Inputs and textareas have focus glow effect green color
- Focus state: `0 0 0 3px rgba(82,183,136,0.2)`

### Scrollbar
- Custom green gradient scrollbar
- Hover state with enhanced glow

## Default Colors Used
- **Primary Green**: `#52b788` (rgba: 82, 183, 136)
- **Dark Green**: `#2d6a4f` (rgba: 45, 106, 79)
- **Light Green**: `#74c69d` (rgba: 116, 198, 157)
- **Gold**: `#d4a017` (rgba: 212, 160, 23)
- **Dark Background**: `#080f12`
- **Card Background**: `#0e1a1f`

## File Dependencies
- **Main CSS**: `frontend/src/index.css`
- **Tilt Hook**: `frontend/src/hooks/useTilt.js`
- **SVG Components**: `frontend/src/components/SVGAnimations.jsx`
- **Updated Components**:
  - `frontend/src/components/ProductCard.jsx` - Uses tilt effect
  - `frontend/src/context/ThemeContext.js` - Dark mode by default
  - `frontend/package.json` - Added vanilla-tilt dependency

## Package Dependencies
- `vanilla-tilt` - For 3D perspective tilt effects

## Best Practices

1. **Always use ref for tilt elements**:
   ```javascript
   const tiltRef = useTilt();
   <div ref={tiltRef} data-tilt>...</div>
   ```

2. **Use animation delays for staggered effects**:
   ```javascript
   <div className="animate-fade-in-up animate-delay-200">...</div>
   ```

3. **Combine animations for rich effects**:
   ```javascript
   <div className="card animate-glow-pulse" data-tilt>
     <span className="text-glow">Text</span>
   </div>
   ```

4. **Apply SVG animations contextually**:
   - Use `FloatingLeafSVG` for nature/farming context
   - Use `PulsingCircleSVG` for emphasis
   - Use `GlowingOrbSVG` for focus/highlight
   - Use `RotatingGearSVG` for loading states

## Performance Notes
- All animations use GPU-accelerated properties (transform, opacity)
- Vanilla Tilt is optimized for mobile and desktop
- CSS animations are performant with `will-change` hints
- Consider reducing animations on low-end devices using `prefers-reduced-motion`

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
- Fallback CSS support for animations

## Troubleshooting

### Tilt not working?
- Ensure `vanilla-tilt` is installed: `npm install vanilla-tilt`
- Check that ref is properly assigned: `<div ref={tiltRef}>`
- Verify `data-tilt` attribute is present
- Check browser console for errors

### Animations not showing?
- Verify CSS is loaded: Check `index.css` imports
- Check `prefers-reduced-motion` setting in browser
- Ensure element has proper z-index and positioning
- Verify animation class names match exactly

### Performance issues?
- Reduce number of animated elements on screen
- Use `will-change` CSS property sparingly
- Consider using `transform` instead of position changes
- Test on target devices before deployment

## Future Enhancements
- Mobile gesture support for tilt (device orientation)
- Touch-friendly animations
- Advanced SVG path animations
- Particle effects integration
- Theme customization panel
- Animation intensity settings
