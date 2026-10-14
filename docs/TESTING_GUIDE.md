# Vastramay Testing & Verification Guide

This document describes the automated test suites, quality assurance protocols, and regression verification commands for Vastramay.

---

## 1. Automated Test Commands

Vastramay provides dedicated TypeScript verification suites executable in Node/Node-TS environments:

| Command | Suite Executed | What It Tests | Total Assertions |
| :--- | :--- | :--- | :--- |
| `npm test` | Data Layer + Audit Suites | Complete regression test runner combining both suites | 41 checks |
| `npm run build` | TypeScript + Vite Production Build | Strict typechecking (`tsc -b`) and asset bundling | 0 errors |
| `npm run lint` | TypeScript Strict Check | `tsc --noEmit` across all modules and tests | 0 errors |
| `npx tsx scripts/verify-data-layer.ts` | Data Layer Resilience Suite | Storage envelopes, migrations, JSON corruption, security, catalog scale | 19 checks |
| `npx tsx scripts/verify-phase11-audit.ts` | Phase 11 Audit Suite | Bundle size limits, image loading, a11y labels, mobile cards, pricing math | 22 checks |

---

## 2. Test Suite 1: Data Layer Resilience (`scripts/verify-data-layer.ts`)

- **File**: [`scripts/verify-data-layer.ts`](file:///Users/jarvis/MySites/vastramay-3d/scripts/verify-data-layer.ts)
- **Target**: Verifies that the storage adapter and domain services function predictably without crashing:
  1. **Seed Catalog Scale**: 36 distinct products, balanced gender distribution (18 Men, 18 Women), stable unique IDs, complete variant matrices, multi-angle galleries, and integer INR pricing.
  2. **Storage Envelope & Resilience**: Missing keys safely return defaults; corrupted JSON payloads in storage are caught, quarantined, and reset without crashing; legacy unversioned payloads auto-migrate to schema v2; sensitive credentials (`password`) are intercepted by security guards.
  3. **Repository Services**: `productService` filtering and dynamic facet calculations; `promotionService` coupon discount calculations (`ROYAL10`, `FESTIVE15`); `inventoryService` stock deductions and immutable audit log generation (`inventory_movements`); rejection of negative stock adjustments.

---

## 3. Test Suite 2: Phase 11 Audit Suite (`scripts/verify-phase11-audit.ts`)

- **File**: [`scripts/verify-phase11-audit.ts`](file:///Users/jarvis/MySites/vastramay-3d/scripts/verify-phase11-audit.ts)
- **Target**: Audits performance budgets, accessibility attributes, and mobile shopping ergonomics:
  1. **Bundle Budget**: Verifies production bundle in `dist/assets/` contains $>5$ split chunks and no single JS chunk exceeds 550 kB.
  2. **Image Loading Strategies**: Asserts `loading="eager"` and `decoding="sync"` on hero visual; asserts `loading="lazy"` on product cards.
  3. **Accessibility**: Form `Input.tsx` contains `aria-invalid`, `aria-describedby`, and error `role="alert"`; buttons contain dynamic `aria-label` tags; cart quantity buttons contain accessible names with item names.
  4. **Mobile Usability**: Mobile touch quick-add button present; cart buttons meet $\ge 32\text{px}$ minimums; `safe-area-pb` declared; checkout fields declare `inputMode` and `autoComplete`.
  5. **Admin Dual Layout**: Verifies `hidden md:block` and `md:hidden` dual view in `AdminOrdersPage`, `AdminProductsPage`, and `AdminInventoryPage`.
  6. **Business Logic Math**: Accurate discount calculations for percentage and fixed privileges.

---

## 4. Manual QA Verification Checklist

When conducting end-to-end manual testing in a browser:

### Storefront Shopping Flow
- [ ] Load `http://localhost:3000` — Hero animation plays smoothly; rotating announcement bar cycles every 5 seconds.
- [ ] Hover over 'Men' or 'Women' in header — 4-column mega-menu opens with 180ms hover grace period; clicking a subcategory navigates to catalog.
- [ ] Navigate to `/products` — Filter products by size or color; URL parameters update dynamically.
- [ ] Click 'Quick Add' on any product card — Cart drawer slides open smoothly from right; item appears with correct size, color, price.
- [ ] Adjust quantity in cart drawer — Financial subtotal updates instantly; free shipping progress bar updates.
- [ ] Click 'Proceed to Atelier Checkout' — Navigates to `/checkout`.
- [ ] Enter 6-digit PIN code `110001` or `400001` — City and State automatically populate.
- [ ] Apply coupon `ROYAL10` or `FESTIVE15` — Discount reflects in financial summary.
- [ ] Click 'Place Order' — Seamless transition to `/order-success` with demo tracking number.

### Administrative Operations Flow
- [ ] Navigate to `/admin/login` — Click 'Quick Auto-Fill Admin Credentials' and sign in.
- [ ] Navigate to `/admin/inventory` — Click 'Adjust Stock' on any SKU, input adjustment units and mandatory audit reason, click save — table updates and new entry appears under Movement Audit Trail.
- [ ] Navigate to `/admin/orders` — Change order status via dropdown — status badge updates in real time.
- [ ] Navigate to `/admin/settings` — Click 'Reset All Demo Data to Factory State' — confirms and restores storage.
