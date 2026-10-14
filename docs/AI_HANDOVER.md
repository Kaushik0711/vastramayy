# Vastramay Developer & AI Coding Agent Handover Manual

> **CRITICAL REFERENCE DOCUMENT**: Read this entire manual before modifying, extending, or refactoring any part of the Vastramay codebase.

---

## 1. Project Purpose & Current Status

**Vastramay** is a contemporary Indian ethnic and festive couture e-commerce platform. It features a dual-experience architecture:
1. **Public Luxury Storefront**: Editorial storytelling, Jharokha arch visual motifs, 3D perspective cards, multi-faceted product discovery, product details with sizing charts, persistent cart/wishlist, and multi-step checkout with Indian PIN code lookup.
2. **Atelier Admin Operations Panel**: Isolated `/admin/*` operations suite covering inventory matrix control, immutable stock movement audits, order fulfillment pipelines, customer LTV directory, coupon management, and 1-click global factory reset.

**Current Status**: **All 12 Phases (Foundation through Audit & Handover) are 100% complete**. 
- Production build succeeds with 0 errors (`npm run build`).
- 41/41 automated tests pass (`npm test`).
- Zero chunk size warnings; bundle is code-split into 20 distinct lazy chunks.

---

## 2. Technology Stack & Exact Versions (from `package.json`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | `^18.3.1` | Core UI library |
| `react-dom` | `^18.3.1` | DOM renderer |
| `react-router-dom` | `^6.28.0` | Client-side routing with `React.lazy` support |
| `framer-motion` | `^11.18.2` | Luxury motion design, 3D cards, and scroll entrances |
| `lucide-react` | `^0.475.0` | High-quality UI iconography |
| `clsx` | `^2.1.1` | Conditional class utility |
| `tailwind-merge` | `^2.6.0` | Conflict-free Tailwind class resolution |
| `typescript` | `~5.7.2` | Strict typechecking compiler |
| `vite` | `^6.1.0` | High-performance bundler and dev server |
| `tailwindcss` | `^3.4.17` | Utility-first CSS framework |
| `sass` | `^1.85.0` | SCSS preprocessor for variables and mixins |

---

## 3. Architecture & Codebase Map

### Entry Points
- **HTML Entry**: [`index.html`](file:///Users/jarvis/MySites/vastramay-3d/index.html) — Connects Google Fonts (Cormorant Garamond, Plus Jakarta Sans, Alex Brush) and mounts `#root`.
- **React Entry**: [`src/main.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/main.tsx) — Bootstraps React root with `StrictMode`.
- **Root Component**: [`src/App.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/App.tsx) — Wraps application in `BrowserRouter`, `AuthProvider`, `CartProvider`, `WishlistProvider`, and `ToastProvider`.
- **Router Configuration**: [`src/routes/index.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/routes/index.tsx) — Central route registry with `React.lazy` code-splitting, `AdminRouteGuard`, and `CustomerRouteGuard`.

---

## 4. Where Code & Configurations Live

### Global Styles, Design Tokens, & Fonts
- **Tailwind Tokens**: [`tailwind.config.js`](file:///Users/jarvis/MySites/vastramay-3d/tailwind.config.js) — Custom color tokens (`brand-espresso`, `brand-plum`, `brand-terracotta`, `brand-gold`, `brand-ivory`, `brand-sage`, `brand-ink`).
- **SCSS Entry**: [`src/styles/globals.scss`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/globals.scss) — Font declarations, glassmorphism utilities, scrollbars, and `prefers-reduced-motion` overrides.
- **SASS Variables & Mixins**: [`src/styles/variables.scss`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/variables.scss), [`src/styles/mixins.scss`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/mixins.scss).
- **Motion Tokens**: [`src/styles/motionTokens.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/motionTokens.ts) — Reusable durations (`0.15s` – `0.8s`) and cubic-bezier curves (`luxury`, `editorial`).

### Data Models & Repository Contracts
- **Data Schemas**: [`src/types/index.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/index.ts) exporting:
  - `Product`, `ProductVariant`, `ProductFilterOptions` in [`src/types/product.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/product.ts)
  - `Category`, `Subcategory` in [`src/types/category.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/category.ts)
  - `CartItem`, `CartSummary` in [`src/types/cart.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/cart.ts)
  - `Order`, `OrderItem`, `OrderStatus` in [`src/types/order.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/order.ts)
  - `Customer`, `Address` in [`src/types/customer.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/customer.ts)
  - `AdminUser`, `DashboardMetrics` in [`src/types/admin.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/admin.ts)
- **Repository Interfaces**: [`src/types/repositories.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/repositories.ts) — Abstract contracts (`IProductRepository`, `IOrderRepository`, `IInventoryRepository`, etc.) decoupling UI from persistence.

### Mock Seed Data
- **Products Catalog**: [`src/data/products.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/products.ts) — 36 handcrafted luxury garments (18 Men, 18 Women).
- **Categories**: [`src/data/categories.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/categories.ts) — Hierarchical taxonomy.
- **Editorial Homepage Content**: [`src/data/homepageConfig.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/homepageConfig.ts) — Copy, campaigns, trust pillars, and customer reviews.
- **Initial Orders**: [`src/data/orders.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/orders.ts) — Seed orders across multiple statuses.

### Business Logic & Repositories
- **Products & Faceted Search**: [`src/services/productService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/productService.ts) — Multi-attribute filtering and dynamic facet counts.
- **Cart & Pricing Math**: [`src/context/CartContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/CartContext.tsx) and [`src/utils/pricing.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/utils/pricing.ts).
- **Coupons & Privileges**: [`src/services/promotionService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/promotionService.ts) — Discount validation and rules.
- **Stock Control & Audits**: [`src/services/inventoryService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/inventoryService.ts) — Adjustments with mandatory audit logging.
- **Order Pipeline**: [`src/services/orderService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/orderService.ts) — Status progression and order creation.
- **Customer Profiles & Addresses**: [`src/services/customerService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/customerService.ts).
- **Authentication**: [`src/services/authService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/authService.ts) — Customer and admin session validation.
- **Storage Engine**: [`src/services/storageAdapter.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/storageAdapter.ts) — `VersionedLocalStorageAdapter` (Schema Envelope v2).

### Administrative Management Pages (`src/pages/admin/`)
- `AdminDashboardPage.tsx`: Executive KPIs and sales chart.
- `AdminProductsPage.tsx`: Product CRUD with mobile card alternative.
- `AdminInventoryPage.tsx`: Variant stock control and audit trail with mobile card alternative.
- `AdminOrdersPage.tsx`: Order dispatch ledger with mobile card stack.
- `AdminCustomersPage.tsx`: Patron directory with mobile card view.
- `AdminPromotionsPage.tsx`: Coupon rules and privilege management.
- `AdminReturnsPage.tsx`: Return claim inspection and refund processing.
- `AdminReviewsPage.tsx`: Review curation and moderation.
- `AdminCategoriesPage.tsx`: Category hierarchy management.
- `AdminSettingsPage.tsx`: Store settings and global demo factory reset.

---

## 5. Persistence & Mock Service Boundaries

```
[UI Components] ──► [Domain Services] ──► [VersionedLocalStorageAdapter] ──► [Browser Storage]
                                                          │
                                         (Envelope v2: {schemaVersion: 2, timestamp, data})
```

- **Persistence Layer**: Everything writes to browser `localStorage` wrapped in a v2 envelope.
- **In-Memory Fallback**: When `localStorage` is disabled or full, writes seamlessly route to an in-memory Map.
- **Corruption Recovery**: If JSON is corrupted, it safely logs a diagnostic and falls back to seed data.
- **Security Guard**: Plain text passwords are never stored. Attempting to write sensitive keys triggers an automatic security block.

---

## 6. Known Limitations & Unfinished Gaps

1. **Multi-User Sync**: Data is local to the current browser. Cross-device syncing requires a live backend database (see [`docs/BACKEND_MIGRATION_PLAN.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/BACKEND_MIGRATION_PLAN.md)).
2. **Real Payment Gateway**: Checkout is currently simulated. Live production requires Razorpay/Stripe SDK integration and webhook verification.
3. **Database Concurrency**: Stock deductions happen in local state. High-concurrency flash sales require server-side row-level locks (`SELECT FOR UPDATE`).

---

## 7. Protected Files — Do Not Casually Overwrite

The following files contain carefully tuned business logic, schema envelopes, and security guards. Never blindly overwrite them:
- [`src/services/storageAdapter.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/storageAdapter.ts) — Core persistence engine, envelope serialization, and corruption recovery.
- [`src/routes/index.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/routes/index.tsx) — Route code-splitting boundaries and guards.
- [`src/styles/globals.scss`](file:///Users/jarvis/MySites/vastramay-3d/src/styles/globals.scss) & [`tailwind.config.js`](file:///Users/jarvis/MySites/vastramay-3d/tailwind.config.js) — Design tokens and brand palette.
- [`src/data/products.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/products.ts) — 36 validated seed products with intact SKU and variant matrices.

---

## 8. Safe Implementation Workflow for AI Coding Agents

When tasked with extending or modifying Vastramay, follow this exact protocol:

```
1. READ & INSPECT:
   - View the target component and its referenced types in src/types/.
   - Understand existing props, classNames, and state hooks.

2. TARGETED DIFFS ONLY:
   - Use surgical edits (replace_file_content). Never replace an entire 800-line file.
   - Preserve existing unrelated comments and docstrings.

3. REUSE DESIGN TOKENS:
   - Always use existing Tailwind tokens: bg-brand-espresso, text-brand-gold, font-serif, etc.
   - Never inject arbitrary hex colors like #123456 unless explicitly requested.

4. KEEP BUSINESS LOGIC DECOUPLED:
   - Perform calculations and storage calls inside services/, keeping components presentational.

5. VERIFY AUTOMATICALLY:
   - Run: npm test && npm run build
   - Ensure all 41 assertions pass and TypeScript reports 0 errors.
```

---

## 9. Verification Commands

Always run these commands to confirm system health:

```bash
# 1. Run all 41 automated tests (Data Layer + Phase 11 Audit):
npm test

# 2. Strict TypeScript typecheck:
npm run lint

# 3. Production bundle compilation:
npm run build
```
