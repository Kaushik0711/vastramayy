# Application Routes Inventory

## Storefront Routes

| Path | Component | Description & Key Parameters |
| :--- | :--- | :--- |
| `/` | `HomePage` | Editorial brand hero, signature suites, curated products, heritage spotlight, trust pillars |
| `/men` | `ProductsPage` | Men's collection catalog (`forcedGender="men"`) with Department Hero & subcategory quick rail |
| `/women` | `ProductsPage` | Women's collection catalog (`forcedGender="women"`) with Department Hero & subcategory quick rail |
| `/products` | `ProductsPage` | Full product catalog with multi-attribute filtering, sorting, facets, and 2/3/4-col switch |
| `/category/:categorySlug` | `ProductsPage` | Dedicated category listing page with deep breadcrumb and subcategory navigation |
| `/category/:categorySlug/:subcategorySlug` | `ProductsPage` | Deep subcategory listing page with refined facets |
| `/sale` | `ProductsPage` | Festive sale collection (`isSalePage={true}`) pre-filtered for discounted pieces |
| `/search` | `SearchPage` | Dedicated search experience with debounced input, recent history, popular suggestions, and facets |
| `/product/:slug` | `ProductDetailPage` | Detailed view with image gallery, size variants, stock status, bespoke tailoring options, specifications, and care instructions |
| `/cart` | `CartPage` | Full shopping bag page with quantity modifiers and coupon code validation |
| `/checkout` | `CheckoutPage` | Encrypted 2-step checkout with address details, payment selection, and order placement |
| `/wishlist` | `WishlistPage` | Saved items curation with direct move-to-bag actions |
| `/login` | `CustomerLoginPage` | Customer login with demo auto-fill |
| `/account` | `AccountPage` | Customer profile, bespoke measurements, and order history with live timeline tracking |
| `/about` | `AboutPage` | Brand story, artisan clusters, and weaving traditions |
| `/contact` | `ContactPage` | Client concierge details and enquiry form |
| `/faqs` | `FAQPage` | Interactive accordion FAQs for sizing, delivery, and care |
| `/shipping` | `PolicyPage` | Shipping timelines and express courier information |
| `/returns` | `PolicyPage` | 10-day doorstep return policy |
| `/privacy` | `PolicyPage` | Privacy and terms of engagement |
| `/design-system` | `DesignSystemShowcasePage` | Internal design system and visual identity living showcase |
| `*` | `NotFoundPage` | 404 error handler with links back to the catalog |

---

## Desktop Mega-Menu Destinations

- **Men Mega-Menu (`MEN_MEGA_MENU`)**:
  - *Silhouettes*: Kurtas (`/products?category=kurtas`), Sherwanis (`/products?category=sherwanis`), Nehru Jackets (`/products?category=nehru-jackets`), Indo-Western (`/men`), Churidar (`/men`)
  - *Weaves*: Chanderi (`/products?search=chanderi`), Chikankari (`/products?search=chikankari`), Raw Silk (`/products?search=raw-silk`), Zari Brocade (`/products?search=zari`), Velvet (`/products?search=velvet`)
  - *Spotlight*: The Groom & Royal Suite (`/products?category=sherwanis`)
- **Women Mega-Menu (`WOMEN_MEGA_MENU`)**:
  - *Silhouettes*: Lehengas (`/products?category=lehengas`), Sarees (`/products?category=sarees`), Anarkalis (`/products?category=anarkalis`), Pre-Draped (`/women`), Sharara Sets (`/women`)
  - *Crafts*: Jaipur Gota Patti (`/products?search=gota-patti`), Kadwa Weaving (`/products?search=varanasi`), Silver Zari (`/products?search=kanjivaram`), Mukesh (`/products?search=chikankari`), Organza (`/products?search=organza`)
  - *Spotlight*: The Bridal Atelier 2026 (`/products?category=lehengas`)

---

## Admin Portal Routes

| Path | Component | Description |
| :--- | :--- | :--- |
| `/admin/login` | `AdminLoginPage` | Secure login view with demo staff credential auto-fill (`admin@vastramay.com` / `admin123`) |
| `/admin` | `Navigate` | Redirects to `/admin/dashboard` |
| `/admin/dashboard` | `AdminDashboardPage` | Executive revenue, order volume, low-stock alerts, and SVG sales trend chart |
| `/admin/products` | `AdminProductsPage` | Garment catalog CRUD, variant matrix builder, duplicate product flow, and mobile card stack |
| `/admin/inventory` | `AdminInventoryPage` | Real-time variant stock control, low-stock filters, audit adjustments, and movement history |
| `/admin/orders` | `AdminOrdersPage` | Order dispatch ledger with inline status progression pipeline and inspection modal |
| `/admin/customers` | `AdminCustomersPage` | Registered customer directory with contact information, order count, and lifetime value |
| `/admin/promotions` | `AdminPromotionsPage` | Privilege coupon creation, percentage/fixed discount rules, and minimum cart values |
| `/admin/returns` | `AdminReturnsPage` | Customer return claims queue, reason inspection, and simulated refund processing |
| `/admin/reviews` | `AdminReviewsPage` | Testimonial moderation, star ratings, and approve / hide / delete controls |
| `/admin/categories` | `AdminCategoriesPage` | Category hierarchy display ordering, active state toggles, and deletion safety guards |
| `/admin/settings` | `AdminSettingsPage` | Storefront configurations, shipping thresholds, announcement copy, and 1-click factory reset |

---

## Code-Splitting & Route Architecture

All administrative routes (`src/pages/admin/*`) and secondary pages (`DesignSystemShowcasePage`, `StaticPages`) are lazy-loaded via `React.lazy()` and `<Suspense>` in `src/routes/index.tsx`. 
- **Customer Storefront Initial Bundle**: **452 kB** (101 kB gzip).
- **Admin Chunks**: Partitioned into 11 on-demand modules (1.6 kB – 22.3 kB) downloaded only when staff access `/admin/*`.
- **Route Guards**: `AdminRouteGuard` intercepts unauthenticated visitors with an immediate redirect to `/admin/login`.
