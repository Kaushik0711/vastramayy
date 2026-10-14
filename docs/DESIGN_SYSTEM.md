# Vastramay Design System & Visual Identity Specification

## 1. Brand Positioning

Vastramay is an Indian contemporary fashion brand defined by artistic direction, rich textile craftsmanship, and modern silhouettes. The design language is built on:
- **Heritage & Contemporary Harmony**: Combining traditional Indian regal tones (Espresso, Terracotta, Antique Gold, Deep Plum) with modern editorial white/warm-ivory negative space.
- **Dimensional Tactility**: Sculptural architectural forms (Jharokha arches, fluted curves), 3D perspective layering, and soft layered ambient shadows.
- **Editorial Typography Triad**: Display Serif for royal campaign headlines, Sans-serif for crisp functional controls, and Cursive Script for intimate atelier annotations.

---

## 2. Curated Color Palette & Tokens

### Core Brand Colors

| Token Name | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Espresso** | `#38231F` | Deep earthen base, dark mode luxury cards, primary dark buttons |
| **Deep Plum** | `#3D1838` | Jewel campaign surface, festive evening couture accents |
| **Terracotta** | `#873E36` | Warm earthen contrast, discount tags, alerts & warm CTAs |
| **Antique Gold** | `#B99B69` | Primary metallic brand accent, active borders, key CTAs, highlights |
| **Warm Ivory** | `#F5EFE6` | Default page canvas, soft tactile backdrop, breathable space |
| **Sage** | `#65715A` | Botanical craft markers, verified badges, sustainable indicators |
| **Ink** | `#201C1B` | High-contrast typography, crisp line art, borders |
| **White** | `#FFFFFF` | Crisp card surfaces, form inputs, dialog canvases |

### Semantic Tokens (CSS Variables)

- `--color-bg-page`: `#F5EFE6` (Warm ivory)
- `--color-surface`: `#FFFFFF` (White)
- `--color-surface-elevated`: `#FAF7F2` (Soft ivory tint)
- `--color-surface-dark`: `#38231F` (Espresso)
- `--color-surface-plum`: `#3D1838` (Deep Plum)
- `--color-text-primary`: `#201C1B` (Ink)
- `--color-text-secondary`: `#685F5D` (Muted charcoal)
- `--color-text-accent`: `#B99B69` (Antique Gold)
- `--color-text-light`: `#F5EFE6` (Ivory for dark surfaces)
- `--color-border-subtle`: `rgba(56, 35, 31, 0.12)`
- `--color-border-medium`: `rgba(56, 35, 31, 0.22)`
- `--color-border-gold`: `rgba(185, 155, 105, 0.35)`
- `--color-focus`: `#B99B69`
- `--color-success`: `#4A6B53`
- `--color-warning`: `#C27803`
- `--color-error`: `#9A2C2C`

---

## 3. Typography System

### Font Triad

1. **Campaign Headlines & Display**:
   - Font: `'Cormorant Garamond', 'Playfair Display', Georgia, serif`
   - Class: `.font-serif`
   - Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
   - Usage: Primary hero titles, section headings, collection names.

2. **Functional UI, Navigation & Body**:
   - Font: `'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif`
   - Class: `.font-sans`
   - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
   - Usage: Navigation menus, product descriptions, prices, inputs, tables, buttons.

3. **Restrained Handwritten Editorial Accents**:
   - Font: `'Alex Brush', 'Playfair Display', cursive`
   - Class: `.font-cursive` / `.editorial-note`
   - Rules: **Strictly forbidden on prices, buttons, technical specifications, or navigation.** Exclusively reserved for artistic annotations, loom edition stamps, and editorial campaign notes.

---

## 4. Architectural & 3D Dimensional Elements

- **Jharokha Arch Frames (`.arch-frame`, `rounded-arch`)**:
  - CSS: `border-radius: 120px 120px 12px 12px;`
  - Evokes classical Indian palace arches and pavilions without skeuomorphism.
- **3D Perspective Cards (`.card-3d`)**:
  - `perspective: 1000px; transform-style: preserve-3d;`
  - Subtle interactive lift: `transform: translateY(-4px) rotateX(1.5deg) rotateY(-1.5deg);`
  - Soft multi-layered dimensional shadow: `0 20px 35px -8px rgba(56, 35, 31, 0.16)`.
- **Layered 3D Offset Backgrounds**:
  - Backing tint offset by `translate-x-3 translate-y-3` in antique gold with subtle borders.

---

## 5. UI Component Primitives

Located in `src/components/common/`:

1. **Button (`Button.tsx`)**:
   - Variants: `primary` (antique gold), `espresso`, `plum`, `terracotta`, `outline`, `gold-outline`, `ghost`, `editorial` (underlined minimalist).
   - Sizes: `sm`, `md`, `lg`.
   - States: hover, active, focus-visible ring, disabled, `isLoading` with spinner.
2. **Badge (`Badge.tsx`)**:
   - Variants: `gold`, `espresso`, `plum`, `terracotta`, `sage`, `ivory`, `arch` (architectural rounded top), `outline`.
3. **PriceDisplay (`PriceDisplay.tsx`)**:
   - Formatted INR amount, strike-through original price, discount percentage tag, and tax note.
4. **SectionHeading (`SectionHeading.tsx`)**:
   - Kicker tag, oversized display title, optional handwritten cursive accent, subtitle, and layout variants (`left`, `center`, `split`).
5. **EditorialFrame (`EditorialFrame.tsx`)**:
   - 3D offset layered frame, architectural arch shape, floating handwritten annotation.
6. **Form Controls (`Input.tsx`, `Select.tsx`, `Checkbox.tsx`)**:
   - Consistent focus ring (`focus:ring-brand-gold`), validation error messages, helper text, custom icons.
7. **Skeleton (`Skeleton.tsx`) & EmptyState (`EmptyState.tsx`)**:
   - Shimmer states and empty curations.

---

## 6. Living Internal Style Showcase

An interactive style showcase is available at route:
`http://localhost:3000/design-system`
(accessible via the header announcement bar and footer link).
