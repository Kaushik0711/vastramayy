# Vastramay — Quintessential Indian Festive & Contemporary Luxury

> **A high-performance luxury e-commerce application featuring dual-experience architecture: customer-facing festive fashion storefront and dedicated atelier administration operations portal.**

---

## 1. Project Overview

**Vastramay** celebrates the grandeur of Indian cultural couture, translating centuries-old textile traditions (Banarasi brocades, Chanderi silks, Chikankari embroideries, royal velvet sherwanis) into modern, impeccably tailored silhouettes. 

Built with React 18, TypeScript, Vite 6, Tailwind CSS, and SCSS, the project features a fully decoupled, type-safe data architecture, schema-versioned local persistence engine, route-level code-splitting, accessible WCAG 2.1 AA components, and distinct customer and administrative workflows.

---

## 2. Technology Stack

- **Framework**: [React 18.3.1](https://react.dev/)
- **Language**: [TypeScript 5.7.2](https://www.typescriptlang.org/) (Strict mode enabled, `@/*` path aliases)
- **Build Tool & Dev Server**: [Vite 6.1.0](https://vitejs.dev/) with Rollup chunk optimization
- **Styling**:
  - [Tailwind CSS 3.4.17](https://tailwindcss.com/) with luxury palette tokens (`espresso`, `plum`, `terracotta`, `gold`, `ivory`, `sage`, `ink`)
  - Modern SCSS (`globals.scss`, `variables.scss`, `mixins.scss`) for glassmorphism, responsive utilities, and custom scrollbars
- **Routing**: [React Router DOM 6.28.0](https://reactrouter.com/) with route-level lazy loading (`React.lazy`)
- **Animation & 3D**: [Framer Motion 11.18.2](https://www.framer.com/motion/) with `motion-reduce` support and 3D pointer-tracking cards
- **Iconography**: [Lucide React 0.475.0](https://lucide.dev/)
- **Data Persistence**: `VersionedLocalStorageAdapter` (Envelope v2, automated schema migrations, fault recovery, security guards)

---

## 3. Main Features

### Customer Storefront
- **Campaign Hero & Storytelling**: Staggered headline reveals, architectural Jharokha arch spotlight, dual Men/Women shopping portals, and atelier trust guarantees.
- **Product Catalog & Discovery**: Dynamic faceted search (Price, Size, Color, Fabric, Occasion, In-Stock, On-Sale), multi-column switching (2-col mobile, 3-col/4-col desktop), and instant keyword search with debouncing.
- **Product Details (PDP)**: Multi-angle image galleries, 3D interactive zoom, color swatch toggles, real-time variant stock validation, size guide drawer, fabric specifications, customer reviews, and related heirloom recommendations.
- **Cart & Wishlist**: Slide-over drawer with progress bar toward complimentary express shipping, touch-friendly increment/decrement controls, local persistence, and instant wishlisting with heart-pulse micro-interactions.
- **Checkout & Order Placement**: Multi-step checkout with PIN code city/state auto-detection, address selection/creation, express shipping calculation, coupon privilege validation (`ROYAL10`, `FESTIVE15`), and demo order creation with tracking number.
- **Customer Account**: Profile management, delivery address book with default selection, order history ledger with tracking status, return claim initiation modal, and wishlist management.

### Atelier Admin Operations
- **Dashboard Overview**: Financial KPIs (Total Sales, Total Orders, Average Order Value, Return Rates), dynamic sales revenue charts, low-stock alerts, and recent orders.
- **Garment Catalog Management**: Search, department filtering, base SKU display, product editor modal with variant builder, garment duplication, and deletion safety dialogs.
- **Inventory Matrix & Audits**: Variant-level stock matrices, low-stock indicators, rapid unit adjustment with mandatory audit reasons, and immutable movement ledger (`inventory_movements`).
- **Order Dispatch Ledger**: Search by order number/customer, multi-status filters, and inline status transitions (`pending` $\rightarrow$ `confirmed` $\rightarrow$ `processing` $\rightarrow$ `shipped` $\rightarrow$ `delivered`).
- **Customer Directory**: Patron profiles, contact information, order count, and Lifetime Value (LTV) metrics.
- **Promotions & Privileges**: Coupon creation and rule configuration (percentage vs. fixed discounts, minimum cart values, usage caps).
- **Return Claims**: Reviewing customer return requests, inspection notes, and refund processing.
- **Store Settings & Factory Reset**: Shipping fee thresholds, COD limits, announcement text updates, and one-click global demo factory reset.

---

## 4. Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20.x` LTS recommended)
- **npm**: `v9.0.0` or higher (bundled with Node)

---

## 5. Installation & Setup

```bash
# 1. Clone repository and navigate to workspace
cd /Users/jarvis/MySites/vastramay-3d

# 2. Install dependencies
npm install

# 3. Setup environment configuration
cp .env.example .env.local
```

---

## 6. Development & Build Commands

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | Starts Vite Dev Server | Launches local development server at `http://localhost:3000` with hot module replacement (HMR). |
| `npm run build` | Typechecks & Builds | Compiles TypeScript (`tsc -b`) and generates production bundle via Vite (`dist/`). |
| `npm run preview` | Previews Production Build | Serves local production build from `dist/` directory. |
| `npm run lint` | TypeScript Strict Check | Runs `tsc --noEmit` across entire codebase to verify type safety. |
| `npm test` | Automated Test Suites | Executes data-layer resilience tests (19 assertions) and Phase 11 audit tests (22 assertions). |

---

## 7. Route Overview

### Storefront Routes
- `/` — Atelier Homepage
- `/men` — Men's Royal Wardrobe Landing
- `/women` — Women's Couture Wardrobe Landing
- `/products` — Product Catalog with dynamic faceted filtering
- `/product/:slug` — Product Detail Page (PDP)
- `/cart` — Dedicated Shopping Bag
- `/checkout` — Checkout & Order Placement
- `/order-success` — Order Confirmation & Tracking
- `/wishlist` — Saved Heirlooms
- `/account` — Customer Profile, Orders, and Addresses
- `/login` / `/register` — Customer Authentication Portals
- `/about`, `/contact`, `/faqs`, `/policies` — Brand Story & Client Services
- `/design-system` — Living Design System & Token Showcase

### Administrative Routes
- `/admin/login` — Operations Portal Authentication
- `/admin/dashboard` — Atelier KPIs & Sales Metrics
- `/admin/products` — Catalog CRUD & Garment Editor
- `/admin/inventory` — Stock Matrix & Audit Trail
- `/admin/orders` — Orders Processing & Dispatch
- `/admin/customers` — Patron Directory & LTV
- `/admin/promotions` — Privilege Coupons & Discounts
- `/admin/returns` — Return Claims & Inspections
- `/admin/reviews` — Testimonial Moderation
- `/admin/settings` — Atelier Settings & Demo Reset

---

## 8. Demo Credentials & Access

For rapid local testing and administrative evaluation:

- **Admin Login**: `/admin/login`
  - **Demo Email**: `admin@vastramay.com`
  - **Demo Password**: `admin123`
  - *Note: A 1-click "Quick Auto-Fill Admin Credentials" button is provided directly on the admin login page.*
- **Customer Login**: `/login`
  - **Demo Email**: `patron@vastramay.com`
  - **Demo Password**: Any password (demo mode simulated)

---

## 9. Current Limitations & Gaps to Production

### 1. Persistence & Data Scope
- **Current State**: Uses client-side `VersionedLocalStorageAdapter` (Schema v2). Data modifications (new products, inventory adjustments, placed orders) persist within the browser's local storage.
- **Production Gap**: Does not currently synchronize across disparate client devices or multi-user sessions without an external database. Full schema migration blueprint provided in [`docs/BACKEND_MIGRATION_PLAN.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/BACKEND_MIGRATION_PLAN.md).

### 2. Authentication & Authorization
- **Current State**: Authentication is handled via client session simulation (`authService.ts`). Route guards (`AdminRouteGuard`, `CustomerRouteGuard`) verify presence of valid mock tokens. Passwords are never stored in plain text.
- **Production Gap**: Needs production OAuth2 / JWT authentication provider (e.g. Supabase Auth, Clerk, Auth0) with HTTP-only cookies and cryptographically signed session tokens.

### 3. Payment Gateway Integration
- **Current State**: Checkout simulates card, UPI, net banking, and Cash on Delivery payments with instantaneous verification and demo order generation.
- **Production Gap**: Requires server-side Razorpay or Stripe order creation, client checkout SDK modal, and webhook signature verification (`razorpay_signature`).

### 4. Real-time Concurrency
- **Current State**: Variant stock deduction occurs atomically within local storage.
- **Production Gap**: Requires server-side database transaction isolation (`SELECT FOR UPDATE`) to prevent race conditions during high-demand festival flash sales.

---

## 10. Documentation Directory Index

Detailed technical specifications are maintained in the [`docs/`](file:///Users/jarvis/MySites/vastramay-3d/docs/) folder:

1. [`docs/PROJECT_OVERVIEW.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/PROJECT_OVERVIEW.md) — Mission, business domains, and architectural philosophy.
2. [`docs/ARCHITECTURE.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/ARCHITECTURE.md) — System boundaries, repository pattern, and service layer.
3. [`docs/FILE_STRUCTURE.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/FILE_STRUCTURE.md) — Directory taxonomy and module organization.
4. [`docs/ROUTES.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/ROUTES.md) — Complete routing map, route guards, and code-splitting boundaries.
5. [`docs/DESIGN_SYSTEM.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/DESIGN_SYSTEM.md) — Color palette, typographic triad, 3D motifs, and component tokens.
6. [`docs/COMPONENT_GUIDE.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/COMPONENT_GUIDE.md) — Reusable UI primitives and composition patterns.
7. [`docs/DATA_MODELS.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/DATA_MODELS.md) — TypeScript entity interfaces, relationships, and constraints.
8. [`docs/STATE_AND_PERSISTENCE.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/STATE_AND_PERSISTENCE.md) — Versioned storage adapter, envelopes, and state management.
9. [`docs/PRODUCT_CATALOG.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/PRODUCT_CATALOG.md) — Seed catalog, variants, and faceted discovery logic.
10. [`docs/CART_CHECKOUT_ORDERS.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/CART_CHECKOUT_ORDERS.md) — Cart management, pricing calculations, and order pipelines.
11. [`docs/ADMIN_PANEL.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/ADMIN_PANEL.md) — Administrative workflows, inventory auditing, and operations.
12. [`docs/AUTHENTICATION_AND_SECURITY.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/AUTHENTICATION_AND_SECURITY.md) — Authentication guards, security boundaries, and storage safety.
13. [`docs/ANIMATIONS_AND_PERFORMANCE.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/ANIMATIONS_AND_PERFORMANCE.md) — Motion tokens, 3D perspective, bundle budgets, and optimization.
14. [`docs/RESPONSIVE_GUIDELINES.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/RESPONSIVE_GUIDELINES.md) — Viewport thresholds, touch ergonomics, and mobile adaptations.
15. [`docs/TESTING_GUIDE.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/TESTING_GUIDE.md) — Automated verification suites, build checks, and testing protocols.
16. [`docs/ENVIRONMENT_SETUP.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/ENVIRONMENT_SETUP.md) — Local environment configuration and tooling.
17. [`docs/KNOWN_ISSUES.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/KNOWN_ISSUES.md) — Documented boundaries, environmental caveats, and roadmap gaps.
18. [`docs/IMPLEMENTATION_STATUS.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/IMPLEMENTATION_STATUS.md) — Detailed phase-by-phase feature implementation matrix.
19. [`docs/CHANGELOG.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/CHANGELOG.md) — Historical chronological record of development milestones.
20. [`docs/AI_HANDOVER.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/AI_HANDOVER.md) — AI agent and developer onboarding, rules, and safe workflows.

---

## 11. Permanent Development Rules

When extending or maintaining Vastramay:

1. **Inspect Before Modifying**: Read existing component implementations and types before applying edits.
2. **Targeted Diffs**: Make surgical, targeted modifications; never blindly overwrite intact files.
3. **Preserve Design Identity**: Utilize established color tokens (`brand-gold`, `brand-espresso`, etc.) and typography. Do not invent unbranded styles.
4. **Strict Type Safety**: Maintain TypeScript contracts in `src/types/`. Do not bypass types with `any`.
5. **Decoupled Business Logic**: Keep storage calls and calculations inside services (`services/`), keeping UI components focused on presentation.
6. **Mandatory Verification**: Run `npm test && npm run build` after any significant changes to ensure zero regressions.
