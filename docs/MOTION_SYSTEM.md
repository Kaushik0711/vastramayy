# Vastramay Luxury Motion Design System & 3D Polish

This document defines the formal motion tokens, architectural principles, 3D visual language, and accessibility rules for the Vastramay luxury fashion e-commerce storefront.

---

## 1. Core Motion Principles

1. **Fashion-Oriented & Restrained**: Movement reflects the tactile grace of fine Indian textiles—Banarasi silk, velvet, and organza. Animations are subtle, smooth, and intentional, never frenetic or playful like consumer SaaS.
2. **Perceived Performance**: Animations must never delay or hinder critical shopping actions (e.g., adding to cart, selecting sizes, opening checkout). Interactions respond immediately to input.
3. **Decoupled 3D Layering**: Three-dimensional depth is achieved using lightweight CSS perspective, transform-based layering, and dynamic lighting glare highlights—**no heavy continuous WebGL rendering or Three.js render loops**.
4. **Single Motion Engine**: All complex React transitions and modal orchestrations leverage `framer-motion` (`^11.18.2`). Simple hover lifts use optimized CSS transitions. No overlapping animation libraries are permitted.
5. **Universal Accessibility (WCAG AAA)**: Full respect for `prefers-reduced-motion` and touch screen device constraints (`pointer: coarse`).

---

## 2. Motion Design Tokens

All shared motion tokens are centralized in [`src/styles/motionTokens.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/motionTokens.ts).

### Duration Scale

| Token | Value | Ideal Use Case |
| :--- | :--- | :--- |
| `MOTION_DURATIONS.instant` | `0.10s` | Active taps, swatch focus, toggle states |
| `MOTION_DURATIONS.fast` | `0.20s` | Button presses, micro-interactions, badge reveals |
| `MOTION_DURATIONS.normal` | `0.35s` | Drawers, dropdowns, modal entrances, page transitions |
| `MOTION_DURATIONS.deliberate` | `0.50s` | Viewport reveals, gallery crossfades, filter toggles |
| `MOTION_DURATIONS.editorial` | `0.75s` | Hero headlines, brand story reveals, large visual layers |
| `MOTION_DURATIONS.slow` | `1.00s` | Ambient background subtle loops |

### Curated Easing Curves

```typescript
export const MOTION_EASINGS = {
  // Ultra-silky luxury deceleration (starts briskly, smoothly settles)
  luxury: [0.16, 1, 0.3, 1],
  // Editorial fluid movement
  editorial: [0.25, 1, 0.5, 1],
  // Balanced standard ease-in-out
  smooth: [0.4, 0, 0.2, 1],
  // Responsive interactive snap
  snap: [0.05, 0.7, 0.1, 1.0],
};
```

### Spring Configurations

- **`gentle`**: `{ type: 'spring', stiffness: 260, damping: 20, mass: 0.8 }` (used for wishlist hearts and status badges).
- **`snappy`**: `{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }` (used for quick add to bag and swatch rings).

### Distance Hierarchy

| Token | Value | Description |
| :--- | :--- | :--- |
| `micro` | `4px` | Subtle press/feedback elevation |
| `subtle` | `8px` | Modal and page transition initial y-offset |
| `standard` | `16px` | Staggered list items and rail cards |
| `reveal` | `24px` | Standard viewport scroll entrances |
| `editorial` | `40px` | Hero and editorial headline entrances |

---

## 3. Reusable Motion Components

### 1. `ScrollReveal`
**Location**: [`src/components/common/ScrollReveal.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/ScrollReveal.tsx)

Viewport-triggered entrance wrapper with `whileInView`, `viewport={{ once: true, margin: '-40px' }}`, and automated `useReducedMotion()` fallback.
- **Variants**: `'fade-up'`, `'fade'`, `'stagger'`, `'scale'`.
- **Usage Example**:
  ```tsx
  <ScrollReveal variant="fade-up" delay={0.1}>
    <FeaturedCollectionsSection />
  </ScrollReveal>
  ```

### 2. `InteractiveTiltCard`
**Location**: [`src/components/common/InteractiveTiltCard.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/InteractiveTiltCard.tsx)

A lightweight CSS 3D perspective tilt component ($\pm 3.5^\circ$) with an interactive cursor-tracking lighting glare highlight.
- **Features**:
  - Dynamically computes `rotateX` and `rotateY` based on normalized pointer coordinates.
  - Generates a radial ambient glare highlight (`radial-gradient`) following mouse position.
  - Smoothly resets to `(0, 0)` with silk easing upon mouse leave.
  - Automatically disables tilt on touch devices via `window.matchMedia('(pointer: fine)')`.
  - Cleans up event listeners and media query subscriptions on unmount.
- **Usage Example**:
  ```tsx
  <InteractiveTiltCard maxTilt={3.5} perspective={1100} glareOpacity={0.2}>
    <div className="rounded-t-[130px] rounded-b-xl overflow-hidden shadow-2xl">
      <img src={heroImage} alt="Haute Couture" />
    </div>
  </InteractiveTiltCard>
  ```

### 3. `ScrollToTop`
**Location**: [`src/components/common/ScrollToTop.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/ScrollToTop.tsx)

Automatically resets the window scroll position to `(0, 0)` upon route changes, eliminating awkward scroll retention during storefront page transitions.

---

## 4. Homepage Motion Architecture

1. **Hero Text Entrance**:
   - The atelier badge fades in with a fast luxury ease.
   - The main editorial serif headline and cursive accent enter with staggered vertical translation.
   - The atelier brand statement and dual shopping buttons settle in sequence.
2. **Campaign Visual Reveal**:
   - The hero campaign backdrop transitions smoothly from `scale: 1.08, opacity: 0` to `scale: 1.02, opacity: 0.35` over 1.2s with luxury deceleration.
3. **Sculptural 3D Jharokha Arch**:
   - The right column features an authentic Rajasthani Jharokha arch frame with a layered gold border and cursor-following 3D tilt.
   - Linked directly to the real catalog product: `/product/padmavati-crimson-zari-bridal-lehenga`.
4. **Scroll-Triggered Section Entrances**:
   - Every major homepage section (Trust Pillars, New Arrivals Rail, Category Storytelling, Men's Editorial Split, Women's Editorial Collage, Collections, and Testimonials) is wrapped in `<ScrollReveal />`, preventing sudden pop-in and ensuring an editorial reading rhythm.

---

## 5. Product Interactions & Micro-Animations

1. **Wishlist Heart Micro-Interaction**:
   - Clicking the wishlist heart on any card or detail page triggers an energetic spring bounce (`scale: [1, 1.35, 1]`) with instant color change and toast confirmation.
2. **Alternate Image Reveal**:
   - Product cards smoothly dissolve between primary campaign photography and alternate angle imagery on desktop hover (`transition-all duration-500 ease-out`).
3. **Quick-Add to Bag**:
   - The hover action bar slides up into view on product card hover.
   - Active press scale (`whileTap={{ scale: 0.96 }}`) provides immediate haptic feedback before opening the cart drawer.
4. **Variant Selection Feedback**:
   - Color swatches expand and display an active checkmark with spring feedback.
   - Size buttons indicate live stock status and provide active tap feedback (`scale: 0.95`).
5. **Product Lightbox & Gallery**:
   - The full-screen zoom lightbox enters with backdrop blur and smooth scale-up (`scale: 0.96 -> 1`).
   - Smooth keyboard Escape key handling and backdrop click dismissal.

---

## 6. Storefront Route Transitions

Storefront page navigation is orchestrated in [`src/components/layout/StorefrontLayout.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/layout/StorefrontLayout.tsx):

- Wrapped with `<AnimatePresence mode="wait" initial={false}>`.
- Keyed on `location.pathname` for instant recognition of forward, back, and direct URL entry.
- Lightweight vertical displacement ($y: 8\text{px} \rightarrow 0$) with `opacity: 0 \rightarrow 1` ensures no layout jumps or invisible overlay traps.
- **Admin Isolation**: Admin panel routes (`/admin/*`) use [`AdminLayout`](file:///Users/jarvis/MySites/vastramay-3d/src/components/layout/AdminLayout.tsx) and remain completely free of full-page transition wrappers to preserve operational efficiency.

---

## 7. Drawers & Modals

Every drawer and modal in the application implements accessible entrance and exit transitions with `<AnimatePresence>`:

| Component | Backdrop Transition | Surface Transition | Accessibility Features |
| :--- | :--- | :--- | :--- |
| `CartDrawer` | Fade (`0 -> 1 -> 0`) | Slide right (`100% -> 0% -> 100%`) | Body scroll lock, Escape key dismiss |
| `MobileFilterDrawer` | Fade (`0 -> 1 -> 0`) | Slide right (`100% -> 0% -> 100%`) | Body scroll lock, Escape key dismiss |
| `SizeGuideModal` | Fade (`0 -> 1 -> 0`) | Scale + subtle Y (`0.96 -> 1.0 -> 0.96`) | Body scroll lock, Escape key dismiss |
| `AddressModal` | Fade (`0 -> 1 -> 0`) | Scale + subtle Y (`0.96 -> 1.0 -> 0.96`) | Body scroll lock, Escape key dismiss |
| `OrderDetailModal` | Fade (`0 -> 1 -> 0`) | Scale + subtle Y (`0.96 -> 1.0 -> 0.96`) | Body scroll lock, Escape key dismiss |
| `ReturnRequestModal` | Fade (`0 -> 1 -> 0`) | Scale + subtle Y (`0.96 -> 1.0 -> 0.96`) | Body scroll lock, Escape key dismiss |

---

## 8. Accessibility & Device Performance

1. **`prefers-reduced-motion` Support**:
   - System-wide CSS media query in [`src/styles/globals.scss`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/globals.scss) disables continuous animations for sensitive users.
   - Framer Motion's `useReducedMotion()` hook automatically swaps transform-heavy transitions for clean, instantaneous opacity fades.
2. **Touch Device Detection**:
   - 3D card tilt and mouse-following glare are guarded behind `window.matchMedia('(pointer: fine)').matches`. Touch screen users receive clean standard elevations without unnecessary event listeners.
3. **Event Listener Hygiene**:
   - All `keydown` (Escape) and `mousemove` listeners are cleanly removed on component unmount to prevent memory leaks and zombie listeners.
4. **Layout Performance**:
   - Animations exclusively target `transform` and `opacity` properties, avoiding layout recalculations and repaints.

---

## 9. Verification Summary

- **TypeScript Compilation**: `tsc -b` passes with **0 errors**.
- **Production Bundle**: `vite build` completes successfully in **1.99s** (2,052 modules transformed).
- **Dev Server**: Running on `http://localhost:3000` (HTTP 200 OK).
- **Navigation Safety**: Zero scroll-locking bugs, zero horizontal overflow, and zero invisible overlay blockers.
