# Vastramay File Structure & Directory Taxonomy

This document outlines the directory structure of the Vastramay project, explaining the architectural placement and responsibilities of every directory and key file.

```
vastramay-3d/
├── .env.example                     # Environment configuration template
├── index.html                       # HTML entry point with Google Fonts preconnections
├── package.json                     # Project manifest, dependencies, and npm scripts
├── postcss.config.js                # PostCSS configuration for Tailwind CSS
├── tailwind.config.js               # Tailwind configuration, color tokens, and custom plugins
├── tsconfig.json                    # TypeScript compiler configuration & project references
├── tsconfig.app.json                # Application-specific strict TypeScript config
├── tsconfig.node.json               # Node/Vite tooling TypeScript configuration
├── vite.config.ts                   # Vite bundler configuration, manual chunking, and aliases
│
├── docs/                            # Complete technical documentation suite (20 specifications)
│   ├── ADMIN_PANEL.md               # Administrative workflows and operational guides
│   ├── AI_HANDOVER.md               # Machine and developer onboarding manual
│   ├── ANIMATIONS_AND_PERFORMANCE.md# Framer motion tokens, 3D perspective, and bundle optimization
│   ├── ARCHITECTURE.md              # High-level architecture, design patterns, and boundaries
│   ├── AUDIT_REPORT.md              # Phase 11 comprehensive responsive & a11y audit report
│   ├── AUTHENTICATION_AND_SECURITY.md# Auth simulation, session guards, and credential safeguards
│   ├── BACKEND_MIGRATION_PLAN.md    # Production PostgreSQL schema, webhooks, and backend roadmap
│   ├── CART_CHECKOUT_ORDERS.md      # Shopping bag state, pricing math, checkout, and orders
│   ├── CHANGELOG.md                 # Chronological version history of implementation phases
│   ├── COMPONENT_GUIDE.md           # Reusable UI component catalog and usage examples
│   ├── DATA_MODELS.md               # TypeScript schemas and data contract specifications
│   ├── DESIGN_SYSTEM.md             # Color tokens, typography, and 3D architectural motifs
│   ├── ENVIRONMENT_SETUP.md         # Local installation, environment variables, and tooling
│   ├── FILE_STRUCTURE.md            # Directory map and module organization (this document)
│   ├── IMPLEMENTATION_STATUS.md     # Detailed phase-by-phase feature status matrix
│   ├── KNOWN_ISSUES.md              # Documented technical debt, gaps, and environment caveats
│   ├── PRODUCT_CATALOG.md           # Seed catalog, variant matrices, and faceted discovery
│   ├── PROJECT_OVERVIEW.md          # Business mission, brand pillars, and technical approach
│   ├── RESPONSIVE_GUIDELINES.md     # Responsive viewport thresholds and mobile touch ergonomics
│   ├── ROUTES.md                    # Route registry, guards, and code-splitting boundaries
│   ├── STATE_AND_PERSISTENCE.md     # Versioned storage adapter, envelopes, and state management
│   └── TESTING_GUIDE.md             # Automated test runners, verification suites, and QA checks
│
├── public/                          # Static assets served as-is by Vite
│   └── favicon.ico                  # Royal atelier monogram favicon
│
├── scripts/                         # Automated TypeScript verification and audit suites
│   ├── verify-data-layer.ts         # Data layer resilience, storage envelope, and repository tests
│   └── verify-phase11-audit.ts      # Bundle limits, image loading, a11y, and mobile layout checks
│
└── src/                             # Source code root
    ├── main.tsx                     # React application entry point (ReactDOM.createRoot)
    ├── App.tsx                      # Root App component mounting Router and Providers
    │
    ├── assets/                      # Bundled static images, icons, and textures
    │
    ├── components/                  # Reusable UI components
    │   ├── common/                  # Atomic primitives shared across storefront and admin
    │   │   ├── Badge.tsx            # Status, promotion, and Jharokha arch badges
    │   │   ├── Button.tsx           # Luxury action button with variants (primary, outline, editorial)
    │   │   ├── Card.tsx             # Card containers with elevated and border variants
    │   │   ├── CartDrawer.tsx       # Slide-over cart with safe-area spacing and quantity controls
    │   │   ├── Checkbox.tsx         # Accessible custom-styled checkbox
    │   │   ├── EditorialFrame.tsx   # Layered magazine frame with offset accents
    │   │   ├── EmptyState.tsx       # Engaging illustrations for empty carts, search, orders
    │   │   ├── Input.tsx            # Form input with aria-invalid, error role, and icons
    │   │   ├── LoadingSpinner.tsx   # Elegant circular loading indicator
    │   │   ├── PriceDisplay.tsx     # INR currency formatter with strikethrough original prices
    │   │   ├── SectionHeading.tsx   # Editorial heading with serif, cursive subtitle, and rules
    │   │   ├── Select.tsx           # Styled dropdown input
    │   │   └── Skeleton.tsx         # Pulse placeholder loaders for async content
    │   │
    │   ├── layout/                  # Shell layouts and framing components
    │   │   ├── AdminHeader.tsx      # Admin top navigation bar with notifications and session
    │   │   ├── AdminLayout.tsx      # Admin dashboard layout with sidebar and breadcrumbs
    │   │   ├── AdminSidebar.tsx     # Admin sidebar navigation with active route highlights
    │   │   ├── AnnouncementBar.tsx  # Rotating campaign and shipping announcement banner
    │   │   ├── MegaMenu.tsx         # Desktop 4-column mega-menu for Men & Women
    │   │   ├── MobileNavDrawer.tsx  # Slide-out accordion navigation drawer for mobile
    │   │   ├── ScrollToTop.tsx      # Route change scroll reset handler
    │   │   ├── StorefrontFooter.tsx # 5-column brand footer with newsletter validation
    │   │   ├── StorefrontHeader.tsx # Luxury header with brand wordmark, search, and badges
    │   │   └── StorefrontLayout.tsx # Customer storefront shell with route transitions
    │   │
    │   └── storefront/              # Feature-specific storefront components
    │       ├── ActiveFilterChips.tsx# Removable filter pill chips for active catalog facets
    │       ├── AddressModal.tsx     # Address creation/editing modal with PIN code validation
    │       ├── AtelierTrustPillars.tsx # 4 brand trust pillars (Silk Mark, margins, dispatch)
    │       ├── CatalogFilterSidebar.tsx # Sticky desktop multi-faceted filter sidebar
    │       ├── CatalogToolbar.tsx   # Sort dropdown, result counters, and grid view toggles
    │       ├── CategoryGrid.tsx     # Architectural category cards with arch motifs
    │       ├── CategoryStorytellingSection.tsx # Department toggle and visual stories
    │       ├── FeaturedCollectionsSection.tsx  # Editorial capsule archives (Banaras, Chanderi)
    │       ├── HeroBanner.tsx       # Campaign hero with Jharokha arch spotlight card
    │       ├── InteractiveTiltCard.tsx # 3D perspective mouse-tracking card with glare
    │       ├── MensEditorialSplit.tsx # Split magazine editorial layout for Men's collection
    │       ├── MobileFilterDrawer.tsx # Bottom slide-up filter sheet for mobile screens
    │       ├── NewArrivalsRail.tsx  # Horizontal snap-scrolling rail of new arrivals
    │       ├── OrderDetailModal.tsx # Order inspection modal with itemized breakdown
    │       ├── ProductCard.tsx      # Catalog card with mobile quick-add and wishlist micro-pulse
    │       ├── ProductEditorModal.tsx # Admin product CRUD modal with variant matrix builder
    │       ├── ProductImageGallery.tsx # PDP multi-angle gallery with thumbnail viewer
    │       ├── ReturnRequestModal.tsx # Customer return claim initiation dialog
    │       ├── ScrollReveal.tsx     # Viewport entrance animation wrapper
    │       ├── SizeGuideModal.tsx   # Tailoring measurement tables (chest, waist, length)
    │       └── WomensEditorialCollage.tsx # Asymmetric magazine collage for Women's couture
    │
    ├── context/                     # Global React state providers
    │   ├── AuthContext.tsx          # Customer & Admin authentication state and mock sessions
    │   ├── CartContext.tsx          # Shopping bag items, quantities, and pricing calculations
    │   ├── ToastContext.tsx         # Global toast notification dispatch and alert stack
    │   └── WishlistContext.tsx      # Saved heirlooms persistence and toggle methods
    │
    ├── data/                        # Centralized mock seed data
    │   ├── categories.ts            # Hierarchical category definitions (Men & Women)
    │   ├── homepageConfig.ts        # Editorial copy, campaigns, reviews, and trust pillars
    │   ├── orders.ts                # Seed orders spanning multiple statuses
    │   └── products.ts              # 36 luxury garments with variants, SKUs, and galleries
    │
    ├── pages/                       # Application route page components
    │   ├── admin/                   # Administrative operation views (code-split)
    │   │   ├── AdminCategoriesPage.tsx # Category hierarchy management
    │   │   ├── AdminCustomersPage.tsx  # Patron directory with mobile card alternative
    │   │   ├── AdminDashboardPage.tsx  # Atelier KPI metrics and sales charts
    │   │   ├── AdminInventoryPage.tsx  # Stock matrix and movement audit trail
    │   │   ├── AdminLoginPage.tsx      # Operations portal login screen
    │   │   ├── AdminOrdersPage.tsx     # Order dispatch ledger with mobile card stack
    │   │   ├── AdminProductsPage.tsx   # Catalog management with mobile card alternative
    │   │   ├── AdminPromotionsPage.tsx # Privilege coupon rules and configuration
    │   │   ├── AdminReturnsPage.tsx    # Customer return claims and refunds
    │   │   ├── AdminReviewsPage.tsx    # Review curation and moderation
    │   │   └── AdminSettingsPage.tsx   # Store settings and demo factory reset
    │   │
    │   ├── storefront/              # Customer-facing shopping views
    │   │   ├── AccountPage.tsx      # Customer account, address book, and order history
    │   │   ├── CartPage.tsx         # Dedicated shopping bag page
    │   │   ├── CheckoutPage.tsx     # Multi-step checkout with PIN lookup and payments
    │   │   ├── DesignSystemShowcasePage.tsx # Living style guide and token showcase
    │   │   ├── HomePage.tsx         # Atelier homepage assembling editorial sections
    │   │   ├── LoginPage.tsx        # Customer login screen
    │   │   ├── MenLandingPage.tsx   # Men's royal wardrobe landing page
    │   │   ├── OrderSuccessPage.tsx # Order confirmation and tracking receipt
    │   │   ├── ProductDetailPage.tsx# PDP with gallery, variants, and reviews
    │   │   ├── ProductsPage.tsx     # Catalog listing with faceted search
    │   │   ├── RegisterPage.tsx     # Customer registration screen
    │   │   ├── StaticPages.tsx      # About, Contact, FAQs, and Policies pages
    │   │   ├── WishlistPage.tsx     # Saved heirlooms collection
    │   │   └── WomenLandingPage.tsx # Women's couture wardrobe landing page
    │   │
    │   └── NotFoundPage.tsx         # 404 error page with navigation fallbacks
    │
    ├── routes/                      # Router configuration
    │   └── index.tsx                # Route tree, guards, and React.lazy code-splitting
    │
    ├── services/                    # Business logic and data repositories
    │   ├── authService.ts           # Customer and admin authentication simulation
    │   ├── categoryService.ts       # Category retrieval and hierarchy filtering
    │   ├── customerService.ts       # Customer profile and address book management
    │   ├── inventoryService.ts      # Variant stock adjustments and immutable movement audits
    │   ├── orderService.ts          # Order placement, status transitions, and lookups
    │   ├── productService.ts        # Product catalog search, facet calculations, and CRUD
    │   ├── promotionService.ts      # Coupon privilege validation and discount calculations
    │   ├── reviewService.ts         # Customer reviews and moderation
    │   ├── settingsService.ts       # Store settings and demo reset trigger
    │   └── storageAdapter.ts        # VersionedLocalStorageAdapter with schema envelope v2
    │
    ├── styles/                      # Global styling and design system tokens
    │   ├── globals.scss             # SCSS entry point, font imports, and base rules
    │   ├── mixins.scss              # Responsive breakpoints, glassmorphism, and scrollbars
    │   ├── motionTokens.ts          # Framer motion durations, easings, and variants
    │   └── variables.scss           # SASS color variables, typography, and spacing
    │
    ├── types/                       # TypeScript entity contracts and interfaces
    │   ├── admin.ts                 # Admin user and KPI metric types
    │   ├── cart.ts                  # Cart items and pricing summary types
    │   ├── category.ts              # Category and subcategory interfaces
    │   ├── content.ts               # Homepage configuration and editorial types
    │   ├── customer.ts              # Customer profile and address types
    │   ├── index.ts                 # Central barrel export for all types
    │   ├── order.ts                 # Order, OrderItem, and OrderStatus types
    │   ├── product.ts               # Product, Variant, and ProductFilterOptions types
    │   └── repositories.ts          # Abstract repository contracts (IProductRepository, etc.)
    │
    └── utils/                       # Shared utility functions
        ├── cn.ts                    # ClassName utility combining clsx and tailwind-merge
        ├── formatters.ts            # Date, phone, and text formatting helpers
        ├── pincodes.ts              # Indian postal PIN code lookup and state mapping
        └── pricing.ts               # Indian Rupee currency formatting and discount math
```
