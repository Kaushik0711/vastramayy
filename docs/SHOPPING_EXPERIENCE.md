# Phase 06 — Product Details & Shopping Functionality

This document details the complete e-commerce shopping experience implemented for **Vastramay**, spanning the Product Detail Page (PDP), explicit variant state machine, integer-paise financial pricing calculations, shopping bag, persistent wishlist, delivery estimator, size guide, and verified reviews.

---

## 1. Product Detail Page (`/product/:slug`)

The PDP is located at `src/pages/storefront/ProductDetailPage.tsx` and dynamically matches product slugs from `src/data/products.ts`.

### Key Elements & Components
- **Breadcrumb Navigation**: `CatalogBreadcrumb.tsx` links back to Home, Department (Men/Women), Category, and current garment.
- **Image Gallery & Zoom**: `ProductImageGallery.tsx` provides:
  - Multi-angle thumbnail selector.
  - 2.5x hover magnifying loupe tracking cursor coordinates over high-resolution imagery.
  - Fullscreen lightbox modal with keyboard navigation (Esc to close, left/right arrows).
  - Editorial badge overlays (e.g. *Handloom Pure Silk*, *Atelier Bestseller*).
- **Header & Pricing**:
  - Garment Title, Tagline, Dynamic SKU based on active variant.
  - Star rating with direct jump anchor to customer reviews.
  - Price display in Indian Rupees formatted via `formatINR()`.
  - Strikethrough MRP with calculated discount percentage tag.
- **Variant Selectors**:
  - **Color**: Visual circular swatches with ring borders, active checkmarks, and color labels.
  - **Size**: Explicit button grid displaying available sizes (`38`, `40`, `42`, `44`, `46`), with strikethrough and disabled states for out-of-stock combinations.
  - **Size Guide Trigger**: Opens `SizeGuideModal.tsx`.
- **Quantity Stepper**:
  - Increment/decrement bounded by variant-specific `stockQuantity`.
  - Low stock warning banner when available inventory is $\le 3$ pieces.
- **Conversion Actions**:
  - **Add to Bag**: Validates size selection; adds item to cart context; triggers success toast with direct link to bag.
  - **Buy Now**: Validates variant selection, adds item to cart, and navigates immediately to `/checkout`.
  - **Wishlist Toggle**: Heart button synchronized across catalog, PDP, and header.
- **Bespoke Atelier Customization Checkbox**:
  - Option to request bespoke sleeve, chest, or length alteration with 2-inch side margin guarantee.
- **Pincode Delivery Estimator**:
  - `PincodeLookup.tsx` validates 6-digit Indian postal codes, estimating delivery within 2–5 business days and displaying courier partners (BlueDart, Delhivery).
- **Atelier Specifications Dossier**:
  - Tabbed or accordion layout detailing fabric weave, lining, embroidery technique, fit style, occasion, and care instructions (e.g. Dry Clean Only).
- **Recently Viewed Rail**:
  - `RecentlyViewedRail.tsx` records visited products into `localStorage` (`vastramay_recently_viewed`) and renders previously browsed items.
- **Related Ensembles**:
  - Intelligent product query displaying complementary silhouettes from the same department/category.
- **Verified Patron Reviews**:
  - `ProductReviewSection.tsx` showing rating breakdown, verified buyer badges, review filters, and an interactive "Write a Review" modal.

---

## 2. Variant Architecture & State Machine

Product variants are represented explicitly in `src/types/product.ts`:

```typescript
export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stockQuantity: number;
  price: number;
  originalPrice?: number;
}
```

### Selection Rules:
1. **Mandatory Explicit Selection**: Selecting a color swatch does **not** auto-select a size. Both color and size must be actively chosen by the customer before adding to bag.
2. **Dynamic SKU & Stock**: As the customer selects different colors or sizes, the displayed SKU and stock availability update in real time.
3. **Out-of-Stock Prevention**:
   - Sizes that have 0 inventory for the selected color are rendered with a strikethrough, lowered opacity, and disabled attribute.
   - If a customer attempts to click "Add to Bag" without picking a size, a validation highlight and warning toast alert the user immediately.

---

## 3. Financial Calculations & Integer-Paise Precision

To prevent floating-point rounding errors common in JavaScript currency math (e.g., `0.1 + 0.2 === 0.30000000000000004`), all internal financial computations are executed in **integer paise** ($1\text{ INR} = 100\text{ paise}$).

Central utility: `src/utils/pricing.ts`

### Mathematical Pipeline:
1. `rupeesToPaise(rupees: number): number` $\rightarrow \text{Math.round}(\text{rupees} \times 100)$
2. `paiseToRupees(paise: number): number` $\rightarrow \text{Math.round}(\text{paise}) / 100$
3. `calculateCartFinancials()` computes:
   - $\text{Subtotal}_{\text{paise}} = \sum (\text{Price}_{\text{paise}} \times \text{Quantity})$
   - $\text{Discount}_{\text{paise}} = \min(\text{CouponPaise}, \text{Subtotal}_{\text{paise}})$
   - $\text{Shipping}_{\text{paise}} = \begin{cases} 0 & \text{if Subtotal} \ge ₹3,000 \text{ or empty} \\ 25,000 \text{ paise } (₹250) & \text{otherwise} \end{cases}$
   - $\text{Total}_{\text{paise}} = \max(0, \text{Subtotal}_{\text{paise}} - \text{Discount}_{\text{paise}} + \text{Shipping}_{\text{paise}})$

### Formatting:
`formatINR(amount: number): string` utilizes `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })` to render authentic Indian numbering (e.g. `₹18,990`, `₹1,24,500`).

---

## 4. Shopping Bag (Cart) & Persistence

The shopping bag is managed by `CartContext.tsx` and displayed in both `CartPage.tsx` and slide-out `CartDrawer.tsx`.

### Core Features:
- **Quantity Management**: Increment/decrement bounded by variant stock limits.
- **Removal**: Single-click trash icon to remove an item.
- **Complimentary Shipping Bar**: Visual progress indicator showing proximity to the ₹3,000 free shipping threshold.
- **Promo Coupon System**:
  - `ROYAL10`: 10% off cart total (up to ₹2,500).
  - `FESTIVE15`: 15% off cart total (up to ₹4,000).
- **Local Persistence**: Cart state is serialized and stored via the storage adapter (`vastramay_cart_v1`), preserving bag contents across page refreshes and browser tabs.

---

## 5. Synchronized Wishlist

Managed by `WishlistContext.tsx`:
- Items can be favorited from any product card, product detail page, or category grid.
- Dedicated `/wishlist` route with count badge in the header.
- "Move to Bag" action allows transferring favorited items directly into the shopping cart.
- Synchronized with `localStorage` (`vastramay_wishlist_v1`).

---

## 6. Size Guide & Tailoring Specifications

`SizeGuideModal.tsx` provides:
- Department toggle: Men's Sherwanis & Kurtas (Chest, Waist, Shoulder, Sleeve Length) vs Women's Lehengas & Sarees (Bust, Waist, Hip, Blouse Length).
- Unit toggle: Inches vs Centimeters.
- Diagram: "How to Measure Accurately".
- **The Vastramay 2-Inch Guarantee**: All tailored garments are cut with 2 inches of internal seam allowance for effortless alterations.

---

## 7. Known Mock Data Limitations & Backend Contract

| Domain | Current Client Simulation | Production Backend Contract Requirement |
| :--- | :--- | :--- |
| **Inventory Validation** | Enforced client-side against mock variant `stockQuantity`. | Pre-checkout inventory reservation (`POST /api/cart/reserve`) with TTL locks to prevent overselling during high-traffic drops. |
| **Price Authority** | Computed via `calculateCartFinancials()` in client. | Backend API must be the single source of truth for final invoice totals, applying dynamic tax (GST) slabs based on shipping destination state. |
| **Pincode Lookup** | Simulated against standard Indian postal regex (`/^[1-9][0-9]{5}$/`). | Direct integration with logistics partner APIs (Shiprocket, Delhivery, BlueDart) to verify Serviceable Pincodes and COD availability. |
| **Reviews & Ratings** | Persisted in component memory with pre-seeded verified customer reviews. | Authenticated customer review API (`POST /api/reviews`) verifying purchase history before granting "Verified Patron" badge. |
