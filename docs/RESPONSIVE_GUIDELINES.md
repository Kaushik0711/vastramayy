# Vastramay Responsive & Mobile Ergonomics Guidelines

This document specifies the responsive breakpoints, touch target rules, mobile layout adaptations, and safe area handling established across Vastramay.

---

## 1. Responsive Breakpoint Matrix

Vastramay builds upon standard Tailwind breakpoints with bespoke adjustments for luxury e-commerce layouts:

| Breakpoint | Viewport Width | Typical Devices | Layout Behaviors |
| :--- | :--- | :--- | :--- |
| **Default / Mobile** | `< 640px` (320–430px) | iPhone SE, 14, 15, 16, Pixel, Galaxy | Single-column editorial layouts; 2-column catalog product grid; mobile drawer navigation; stacked card views for admin data tables; sticky mobile actions with safe area padding. |
| `sm` | `640px – 767px` | Large phones landscape, small phablets | 2-column product grid with wider margins; 2-column checkout form fields. |
| `md` | `768px – 1023px` | iPad portrait, Android tablets | 3-column catalog grid; administrative full data tables activate (`hidden md:block`); desktop header actions visible. |
| `lg` | `1024px – 1279px` | iPad landscape, small laptops | 4-column mega-menus activate; sticky catalog filter sidebar displays alongside product grid; admin sidebar transitions from drawer to fixed rail. |
| `xl` | `1280px – 1535px` | Standard desktops, MacBooks | 4-column catalog grid; full editorial split magazine layouts. |
| `2xl` | `≥ 1536px` | Ultra-wide monitors, 4K displays | Maximum content container width capped at `max-w-7xl` (`1280px`) with centered auto margins to preserve editorial whitespace. |

---

## 2. Mobile Shopping Accommodations

### Eliminating Hover Traps
On touchscreens, the CSS `:hover` pseudo-class does not fire naturally. All primary shopping flows operate without requiring hover states:
- **Mobile Quick-Add**: A visible shopping bag quick-add button is permanently rendered in the product card footer on mobile viewports (`md:hidden`), allowing 1-tap cart additions without entering the PDP.
- **Wishlist Toggle**: Heart button is permanently visible in the top-right corner of all product cards.

### Touch Target Ergonomics
- All interactive buttons, drawer close triggers, and quantity selectors maintain a minimum touch target size of **$32\text{px} \times 32\text{px}$** to **$44\text{px} \times 44\text{px}$**.
- Adequate padding is provided between adjacent buttons to prevent accidental taps.

### Mobile Virtual Keyboards & Autofill
All form inputs on `/checkout`, `/login`, and `/account` declare proper attributes to guide mobile virtual keyboards:
- Email inputs: `type="email"`, `inputMode="email"`, `autoComplete="email"`.
- Mobile phone inputs: `type="tel"`, `inputMode="tel"`, `autoComplete="tel"`.
- PIN code inputs: `inputMode="numeric"`, `autoComplete="postal-code"`.
- Street address: `autoComplete="address-line1"`, `autoComplete="address-line2"`.
- City: `autoComplete="address-level2"`.

### Mobile Safe Areas (`env(safe-area-inset-*)`)
To prevent bottom buttons from overlapping the iOS home indicator bar on modern notched/dynamic-island devices:
- A custom utility `safe-area-pb` (`padding-bottom: max(1.25rem, env(safe-area-inset-bottom))`) is applied to fixed footers, slide-over drawer action bars, and sticky checkout CTAs.

---

## 3. Administrative Dual-View Architecture

Dense data tables with 6–8 columns cause horizontal clipping and awkward scrolling on mobile phones. Vastramay employs a **dual-view architecture**:

```tsx
{/* 1. Desktop High-Density Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full text-left text-xs">
    {/* Full multi-column table */}
  </table>
</div>

{/* 2. Mobile Responsive Card Stack */}
<div className="md:hidden divide-y divide-brand-espresso/10 p-3 space-y-3">
  {items.map((item) => (
    <div key={item.id} className="pt-3 first:pt-0 space-y-2">
      {/* High-priority card summary with inline actions */}
    </div>
  ))}
</div>
```

This pattern is consistently applied across:
- `AdminOrdersPage.tsx`
- `AdminProductsPage.tsx`
- `AdminInventoryPage.tsx`
- `AdminCustomersPage.tsx`
