# Vastramay Project Changelog

All notable changes, architectural milestones, and implementation phases completed for the Vastramay luxury couture web application.

## [Post-Audit QA] — Real-Browser Visual Verification & Quality Fixes (October 2026)
### Fixed
- **Mobile Storefront Header Overlap**: Scaled brand typography and tracking (`text-lg sm:text-3xl tracking-[0.12em] sm:tracking-[0.22em]`), adjusted container padding (`px-2.5 sm:px-6`), and added `shrink-0` to right utilities container in `StorefrontHeader.tsx` to eliminate horizontal clipping across narrow viewports (320px–390px).
- **Mobile Announcement Bar Truncation**: Hid desktop "Design System" button (`hidden sm:inline-block`) on mobile viewports, granting 100% width to announcement messages and eliminating horizontal margin clipping.
- **Horizontal Viewport Expansion**: Enforced `overflow-x: hidden; max-width: 100vw;` on `html, body` in `globals.scss` and `overflow-x-clip w-full` on `StorefrontLayout.tsx`, completely eliminating horizontal scrolling caused by negative-margin horizontal product rails.
- **Admin Returns Filter Toolbar**: Added `overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none` and `whitespace-nowrap shrink-0` to filter buttons in `AdminReturnsPage.tsx`, ensuring all status tabs ("All", "Requested", "Approved", "Pickup Scheduled", "Refunded", "Rejected") are fully legible and touch-scrollable without truncation on small screens.
### Verified
- Automated multi-viewport verification across 8 viewports (320px, 375px, 390px, 430px, 768px, 1024px, 1440px, 1600px) with 0px horizontal overflow.
- 10/10 real-browser interaction QA checks passing via Chrome DevTools Protocol with 0 console errors.
- 28 full-page screenshots captured across desktop, tablet, and mobile viewports for all storefront and administrative routes.

---

## [Phase 12] — Complete Documentation & Project Handover (October 2026)
### Added
- Root [`README.md`](file:///Users/jarvis/MySites/vastramay-3d/README.md) comprehensively documenting project overview, tech stack, installation, dev/build/test commands, route registry, demo boundaries, and permanent rules.
- Complete documentation suite in `docs/` with 20 dedicated specifications.
- Updated [`docs/AI_HANDOVER.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/AI_HANDOVER.md) with explicit file references, dependency versions, and safe workflows.
- Added `npm test` script to `package.json` uniting data-layer resilience tests and Phase 11 audit suites.
- Added `.env.example` template with clean security defaults.

---

## [Phase 11] — Responsive, Accessibility, and Performance Audit (October 2026)
### Added
- Automated audit suite `scripts/verify-phase11-audit.ts` (22 assertions).
- Mobile quick-add action in `ProductCard.tsx` (`md:hidden`) for non-hover 1-tap cart additions.
- Responsive dual-view architecture (desktop table vs. mobile card stack) across `AdminOrdersPage`, `AdminProductsPage`, `AdminInventoryPage`, and `AdminCustomersPage`.
- Accessible form attributes (`aria-invalid`, `aria-describedby`, error `role="alert"`) in `Input.tsx`.
- Mobile virtual keyboard attributes (`inputMode`, `autoComplete`) in `CheckoutPage.tsx`.
- Touch-friendly quantity controls ($\ge 32\text{px}$) and safe area spacing (`safe-area-pb`) in `CartDrawer.tsx`.
### Optimized
- Route-level code-splitting with `React.lazy()` and `<Suspense>` in `routes/index.tsx`.
- Manual vendor chunking in `vite.config.ts`, reducing initial storefront bundle from ~893 kB to **452 kB** (101 kB gzip) with 11 on-demand admin chunks.
- Prioritized above-the-fold hero visual delivery with `loading="eager"` and `decoding="sync"`.

---

## [Phase 10] — Motion Design and 3D Polish (October 2026)
### Added
- Motion tokens system in `src/styles/motionTokens.ts` defining durations, luxury cubic-bezier easings, and Framer Motion variants.
- `InteractiveTiltCard.tsx` delivering 3D perspective mouse-tracking tilt ($\pm 3.5^\circ$) with dynamic cursor glare and touch device bypass.
- `ScrollReveal.tsx` entrance animation wrapper with automated `useReducedMotion()` fallback.
- Wishlist heart-pulse bounce micro-interaction, active tap scaling (`whileTap={{ scale: 0.96 }}`), and PDP swatch feedback.
- Accessible modal animations in `CartDrawer.tsx`, `SizeGuideModal.tsx`, `AddressModal.tsx`, and `OrderDetailModal.tsx`.

---

## [Phase 09] — Data Layer and Future Backend Readiness (October 2026)
### Added
- Expanded seed catalog in `src/data/products.ts` to 36 distinct luxury garments (18 Men, 18 Women).
- `VersionedLocalStorageAdapter` (Envelope Schema v2) with automated migration, JSON corruption recovery, in-memory private browsing fallback, and credential security guards.
- Typed repository interfaces in `src/types/repositories.ts` decoupling UI from persistence.
- Automated data-layer test runner `scripts/verify-data-layer.ts` (19 assertions).
- Backend migration blueprint in `docs/BACKEND_MIGRATION_PLAN.md` with PostgreSQL DDL and webhook architecture.

---

## [Phase 08] — Vastramay Admin Panel (October 2026)
### Added
- Complete administrative management suite with dedicated layout `AdminLayout.tsx` and sidebar `AdminSidebar.tsx`.
- Dashboard with financial KPIs and SVG sales revenue trend chart.
- Garment catalog CRUD in `AdminProductsPage.tsx` with `ProductEditorModal.tsx` and variant builder.
- Variant stock matrix in `AdminInventoryPage.tsx` with stock status filtering, low-stock alerts, and immutable movement audits.
- Order dispatch ledger in `AdminOrdersPage.tsx` with inline status progression pipeline.
- Customer directory, coupon management, return claims queue, review moderation, and 1-click global factory reset.

---

## [Phase 07] — Checkout and Customer Account (October 2026)
### Added
- Multi-step checkout in `CheckoutPage.tsx` with Indian postal PIN code lookup (`pincodes.ts`).
- Delivery address book management (add, edit, delete, default selection).
- Promotional coupon privilege engine in `promotionService.ts`.
- Customer account dashboard with order tracking timelines and return request modal.

---

## [Phase 06] — Product Details and Shopping Functionality (October 2026)
### Added
- Product Detail Page (`ProductDetailPage.tsx`) with multi-angle gallery and interactive zoom viewer.
- Real-time variant selection matrix (size and color swatch synchronization).
- Slide-over `CartDrawer.tsx` with free shipping threshold progress meter.
- Size guide modal with measurement charts for Men's Sherwanis and Women's Lehengas.

---

## [Phase 05] — Product Catalog and Discovery (October 2026)
### Added
- Product catalog page (`ProductsPage.tsx`) with dynamic multi-faceted filter sidebar.
- Department landing pages for Men (`MenLandingPage.tsx`) and Women (`WomenLandingPage.tsx`).
- Instant search bar with debounced keyword querying.
- Grid column switcher (2-col, 3-col, 4-col).

---

## [Phase 04] — Homepage and Editorial Experience (October 2026)
### Added
- Campaign hero banner (`HeroBanner.tsx`) with Jharokha arch spotlight card.
- Atelier trust pillars (`AtelierTrustPillars.tsx`) and New Arrivals product rail (`NewArrivalsRail.tsx`).
- Split magazine editorial for Men (`MensEditorialSplit.tsx`) and asymmetric collage for Women (`WomensEditorialCollage.tsx`).
- Featured collection capsule archives (`FeaturedCollectionsSection.tsx`).

---

## [Phase 03] — Storefront Shell and Navigation (October 2026)
### Added
- Reusable luxury storefront shell (`StorefrontLayout.tsx`).
- Storefront header with brand wordmark, instant search overlay, and badge counters.
- 4-column mega-menus for Men and Women with 180ms hover intent grace timer.
- Mobile slide-out navigation drawer with accordion category groups.
- 5-column brand footer with newsletter validation and craft trust badges.

---

## [Phase 02] — Visual Identity and Design System (October 2026)
### Added
- Curated luxury color palette (Espresso, Deep Plum, Terracotta, Antique Gold, Warm Ivory, Sage, Ink).
- Typographic triad: Cormorant Garamond, Plus Jakarta Sans, Alex Brush.
- Reusable UI primitives: `Button`, `Badge`, `PriceDisplay`, `SectionHeading`, `EditorialFrame`, `Input`, `Select`, `Checkbox`.
- Living style guide showcase at `/design-system`.

---

## [Phase 01] — Project Foundation (October 2026)
### Added
- Initialized clean Vite 6 + React 18 + TypeScript strict mode repository.
- Tailwind CSS and SCSS design tokens, responsive mixins, and glassmorphism filters.
- Core TypeScript schemas (`src/types/`).
- Initial mock data seeds and local persistence adapter.
