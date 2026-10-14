# Vastramay Animations & Performance Architecture

This document specifies the motion design system, 3D perspective effects, bundle optimization techniques, and asset delivery strategies implemented in Vastramay.

---

## 1. Motion Design Tokens & Principles

Vastramay's motion identity balances luxury restraint with tactile feedback:
- **Duration**: Paced from `instant` (100ms) for micro-swatches to `slow` (1,000ms) for editorial reveals.
- **Easing**: Custom cubic-bezier curves mimicking silk drape and high-end fashion magazines.
- **Tokens File**: [`src/styles/motionTokens.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/motionTokens.ts)

```typescript
export const MOTION_EASINGS = {
  luxury: [0.16, 1, 0.3, 1],       // Smooth, decelerating entrance
  editorial: [0.25, 1, 0.5, 1],    // Magazine-style weighted motion
  sharp: [0.4, 0, 0.2, 1],         // Clean interface transitions
};

export const MOTION_DURATIONS = {
  micro: 0.15,                     // 150ms: Wishlist, swatches
  standard: 0.3,                   // 300ms: Buttons, dropdowns
  expanded: 0.5,                   // 500ms: Drawers, modals
  editorial: 0.8,                  // 800ms: Section entrances
};
```

---

## 2. 3D Perspective & Interactive Cards

Implemented in [`src/components/storefront/InteractiveTiltCard.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/InteractiveTiltCard.tsx):
- **Lightweight CSS Transforms**: Calculates pointer coordinates relative to card center, applying subtle 3D tilt ($\pm 3.5^\circ$ maximum) using `perspective(1000px) rotateX(...) rotateY(...)`.
- **Dynamic Glare Highlight**: Renders a cursor-following radial light gradient overlay (`radial-gradient(circle at X Y, rgba(255,255,255,0.2), transparent 70%)`).
- **Touch-Friendly Fallback**: Automatically checks `@media (pointer: fine)`. On coarse touchscreens (smartphones/tablets), 3D tilt calculations are completely bypassed to eliminate battery drain and touch drag friction.

---

## 3. Viewport Scroll Entrances & Reduced Motion

- **Entrance Wrapper**: [`src/components/storefront/ScrollReveal.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/ScrollReveal.tsx).
- **Trigger**: Framer Motion `whileInView` with `viewport={{ once: true, margin: '-40px' }}` ensures elements only animate into view once without distracting re-triggering upon reverse scroll.
- **WCAG AAA Compliance**: When the user activates `prefers-reduced-motion` in their operating system, all translations and scale springs collapse to simple, instantaneous opacity changes.

---

## 4. Bundle Optimization & Code-Splitting

### Strategic Route Splitting
Vite bundler configuration and React router were refactored to prevent standard shoppers from downloading heavy administrative management code:

- **Router File**: [`src/routes/index.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/routes/index.tsx)
- **Lazy Loading**: All 11 administrative pages (`AdminDashboardPage`, `AdminProductsPage`, etc.) and secondary static pages (`StaticPages`, `DesignSystemShowcasePage`) are loaded via `React.lazy()`.
- **Chunk Partitioning** in [`vite.config.ts`](file:///Users/jarvis/MySites/vastramay-3d/vite.config.ts):
  - `vendor-react`: React, ReactDOM, React Router (`166.7 kB` / `54.4 kB` gzip)
  - `vendor-motion`: Framer Motion (`114.4 kB` / `37.8 kB` gzip)
  - `vendor-icons`: Lucide React (`34.5 kB` / `7.5 kB` gzip)
  - `index`: Storefront Core (`452.7 kB` / `101.9 kB` gzip)
  - `Admin*.js`: 11 discrete lazy-loaded chunks (1.6 kB – 22.3 kB each)

### Impact
- **Initial Storefront Bundle**: Dropped from ~893 kB to **452 kB** (a 49.3% reduction in initial payload weight).
- **Chunk Warning Elimination**: Zero Vite warnings regarding oversized 500 kB chunks.

---

## 5. Image Loading & Layout Shift (CLS) Prevention

- **Above-The-Fold Prioritization**: The hero background visual and architectural Jharokha arch spotlight in [`src/components/storefront/HeroBanner.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/HeroBanner.tsx) utilize `loading="eager"` and `decoding="sync"` to optimize Largest Contentful Paint (LCP).
- **Below-The-Fold Lazy Loading**: All product card thumbnails, magazine collages, and gallery views use `loading="lazy"` and `decoding="async"`.
- **Pre-Reserved Aspect Ratios**: Container wrappers explicitly declare aspect ratios (`aspect-[3/4]`, `aspect-[4/5]`) to prevent layout shifts as images load over high-latency networks.
