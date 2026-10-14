# Vastramay Component Guide & Reusable UI Catalog

This document specifies the core reusable UI components built for Vastramay, detailing their props, styling variants, accessibility patterns, and composition rules.

---

## 1. Design Philosophy

All Vastramay components follow three governing principles:
1. **Design System Adherence**: Colors (`brand-espresso`, `brand-gold`, `brand-plum`, `brand-terracotta`, `brand-ivory`) and typography (`font-serif`, `font-sans`, `font-cursive`) are bound to tokens rather than arbitrary Tailwind hex classes.
2. **Accessible by Default**: Form elements include programmatic error labels (`aria-invalid`, `aria-describedby`), buttons provide descriptive `aria-label` tags, and modals trap focus with keyboard Escape listeners.
3. **Decoupled Business Logic**: Presentation components receive data via props or context hooks and emit events via callbacks. Storage operations and calculations remain encapsulated within the service layer.

---

## 2. Common & Atomic UI Primitives (`src/components/common/`)

### `Button`
The primary interactive element supporting luxury variants and states.

- **File**: [`src/components/common/Button.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/Button.tsx)
- **Props**:
  - `variant`: `'primary'` (Espresso bg with gold text), `'secondary'` (Deep Plum bg), `'outline'` (Gold border with hover fill), `'gold'` (Solid Antique Gold), `'editorial'` (Text with animated underline accent), `'danger'` (Terracotta/Rose).
  - `size`: `'sm'`, `'md'`, `'lg'`.
  - `isLoading`: Boolean to display an embedded spinner and disable pointer events.
  - `fullWidth`: Boolean for 100% block expansion.
  - Standard HTML button attributes (`onClick`, `type`, `disabled`, `aria-label`).
- **Example Usage**:
  ```tsx
  <Button variant="primary" size="lg" onClick={handleCheckout}>
    Proceed to Atelier Checkout
  </Button>
  ```

### `Badge`
Used for product tags, stock states, and promotional indicators.

- **File**: [`src/components/common/Badge.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/Badge.tsx)
- **Props**:
  - `variant`: `'espresso'`, `'gold'`, `'terracotta'`, `'plum'`, `'sage'`, `'outline'`, `'arch'` (Features traditional curved arch top).
  - `size`: `'sm'`, `'md'`.
- **Example Usage**:
  ```tsx
  <Badge variant="gold" size="sm">
    Bestseller
  </Badge>
  <Badge variant="arch" size="md">
    Pure Silk Handloom
  </Badge>
  ```

### `PriceDisplay`
Standardized Indian Rupee pricing presentation with formatting and strikethroughs.

- **File**: [`src/components/common/PriceDisplay.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/PriceDisplay.tsx)
- **Props**:
  - `price`: Current price in integer INR (e.g. `12999`).
  - `originalPrice` (optional): Strikethrough comparison price (e.g. `15999`).
  - `discountPercentage` (optional): Numeric discount badge percentage (e.g. `20`).
  - `size`: `'sm'`, `'md'`, `'lg'`, `'xl'`.
- **Example Usage**:
  ```tsx
  <PriceDisplay price={14999} originalPrice={19999} discountPercentage={25} size="lg" />
  ```

### `Input`
Accessible form input with integrated validation alerts and icon slots.

- **File**: [`src/components/common/Input.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/Input.tsx)
- **Props**:
  - `label`: Floating or top-aligned field label.
  - `error` (optional): Validation error string (automatically sets `aria-invalid="true"` and renders `role="alert"`).
  - `leftIcon` / `rightIcon` (optional): Lucide React icon components.
  - Standard HTML input attributes (`type`, `value`, `onChange`, `autoComplete`, `inputMode`, `required`, `placeholder`).
- **Example Usage**:
  ```tsx
  <Input
    label="Postal PIN Code"
    value={pincode}
    maxLength={6}
    inputMode="numeric"
    autoComplete="postal-code"
    error={errors.pincode}
    onChange={(e) => setPincode(e.target.value)}
    required
  />
  ```

### `SectionHeading`
Editorial section title component with Cormorant Garamond serif, Alex Brush cursive accent, and decorative gold hairline accents.

- **File**: [`src/components/common/SectionHeading.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/SectionHeading.tsx)
- **Props**:
  - `title`: Primary serif title string.
  - `subtitle` (optional): Cursive accent or category descriptor.
  - `alignment`: `'left'`, `'center'`, `'right'`.
  - `hasAccentRule`: Boolean indicating if royal hairline borders should be drawn.
- **Example Usage**:
  ```tsx
  <SectionHeading
    title="The Banarasi Bridal Edit"
    subtitle="Woven in Pure Katan Silk"
    alignment="center"
    hasAccentRule
  />
  ```

### `CartDrawer`
Full-featured slide-over shopping bag drawer with progress indicators and touch-friendly actions.

- **File**: [`src/components/common/CartDrawer.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/common/CartDrawer.tsx)
- **Features**:
  - Complimentary shipping progress meter toward ₹5,000 threshold.
  - Touch-friendly ($\ge 32\text{px}$) quantity decrement/increment buttons.
  - Item removal with confirmation.
  - Mobile safe-area bottom padding (`safe-area-pb`).
  - Keyboard Escape listener and background scroll lock (`overflow: hidden`).

---

## 3. Storefront Feature Components (`src/components/storefront/`)

### `ProductCard`
Responsive product presentation card used across catalog and rails.

- **File**: [`src/components/storefront/ProductCard.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/ProductCard.tsx)
- **Features**:
  - Proportional `aspect-[3/4]` imagery with alternate angle hover reveal.
  - Mobile-specific touch quick-add button in footer (`md:hidden`), eliminating hover traps.
  - Desktop hover action bar with gold border and spring entrance.
  - Heart micro-pulse wishlist animation.
  - Color swatches displaying unique variant tones.

### `InteractiveTiltCard`
3D perspective interactive card with pointer-tracking glare highlight.

- **File**: [`src/components/storefront/InteractiveTiltCard.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/InteractiveTiltCard.tsx)
- **Features**:
  - Lightweight CSS perspective transforms ($\pm 3.5^\circ$).
  - Dynamic radial light glare tracking cursor coordinates.
  - Automated fine-pointer detection (`@media (pointer: fine)`) with touch fallback to zero transforms.
  - Automated `useReducedMotion()` fallback.

### `ScrollReveal`
Orchestrated viewport entrance animation wrapper for editorial sections.

- **File**: [`src/components/storefront/ScrollReveal.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/ScrollReveal.tsx)
- **Features**:
  - Framer Motion `whileInView` with `viewport={{ once: true, margin: '-40px' }}`.
  - Configurable stagger delay, vertical translation distance, and luxury easing.
  - Respects user's system `prefers-reduced-motion` settings.

### `CatalogFilterSidebar` & `MobileFilterDrawer`
Multi-faceted filtering systems for desktop and mobile devices.

- **Files**:
  - Desktop: [`src/components/storefront/CatalogFilterSidebar.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/CatalogFilterSidebar.tsx)
  - Mobile: [`src/components/storefront/MobileFilterDrawer.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/MobileFilterDrawer.tsx)
- **Filter Capabilities**:
  - Price range sliders and presets.
  - Sizes (XS, S, M, L, XL, XXL).
  - Colors with visual color swatch circles.
  - Fabrics (Banarasi Silk, Chanderi, Georgette, Velvet, Tussar, Raw Silk).
  - Occasions (Wedding, Festive, Evening, Mehendi, Sangeet).
  - Stock availability and On-sale toggles.

### `ProductImageGallery`
PDP multi-angle image gallery with thumbnail rail and zoom view.

- **File**: [`src/components/storefront/ProductImageGallery.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/storefront/ProductImageGallery.tsx)
- **Features**:
  - Vertical thumbnail strip on desktop; swipeable pagination on mobile.
  - Crossfade animation between gallery angles.
  - Full-resolution interactive zoom inspect overlay.

---

## 4. Modals & Dialogs

All modal dialogs in Vastramay conform to the following pattern:
- Wrapped in `<AnimatePresence>` for smooth entry and exit transitions.
- Semi-transparent backdrop with blur: `bg-brand-espresso/60 backdrop-blur-sm`.
- Centered container with responsive padding and max-width limits.
- Focus trapping and `onKeyDown` Escape listener.
- Explicit accessibility role (`role="dialog"`, `aria-modal="true"`).

Key modals implemented:
- `OrderDetailModal.tsx`: Displays order progress timeline, itemized SKU breakdown, shipping address, and tracking number.
- `SizeGuideModal.tsx`: Measurement charts (chest, waist, hip, length in inches and cm) for Men's Sherwanis and Women's Lehengas.
- `AddressModal.tsx`: Dynamic form for adding or editing customer delivery addresses with PIN code lookup.
- `ReturnRequestModal.tsx`: Customer return claim submission with reason selection and comment input.
- `ProductEditorModal.tsx`: Admin garment creation and editing with dynamic variant matrix generation.
