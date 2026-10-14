# Vastramay Admin Panel — Operational Manual & Architecture

## 1. Overview & Operational Philosophy

The **Vastramay Admin Application** is a high-efficiency operational workspace tailored for luxury Indian apparel inventory, catalog curation, fulfillment dispatch, and customer service.

While customer-facing touchpoints prioritize editorial storytelling, the admin panel leverages the same refined brand tokens (`brand-espresso`, `brand-gold`, `brand-ivory`, `brand-terracotta`) engineered for **maximum operational density, high readability, and zero-latency decision making**.

---

## 2. Admin Shell & Navigation Architecture

### Layout & Navigation Structure
- **Desktop Sidebar (`AdminSidebar.tsx`)**:
  - Pinned left-hand navigation with collapsed responsive states.
  - Divided into 3 operational domains:
    1. **Overview**: Executive Dashboard.
    2. **Commerce Operations**: Products, Inventory & Audit, Categories, Orders Ledger, Returns & QA.
    3. **Management**: Patrons, Privileges & Coupons, Review Moderation, Store Settings.
  - Visual indicator showing live role: `Atelier Administrator (Superuser)`.
- **Responsive Mobile Navigation**:
  - Drawer navigation for tablet and mobile devices with backdrop blur and smooth toggle.
- **Top Bar (`AdminHeader.tsx`)**:
  - Dynamic route breadcrumbs with serif title hierarchy.
  - Operational notification popover with unread counter.
  - Quick link to the customer storefront (`/`).
  - Secure session termination (`logoutAdmin`).
- **Interactive Feedback**:
  - Toast notification engine (`useToast()`) providing instant non-blocking feedback on all mutations.
  - Explicit confirmation modals before destructive operations (product deletions, category removals, factory resets).

---

## 3. Operational Modules & Capabilities

### 3.1. Executive Dashboard (`/admin/dashboard`)
Derived strictly from seeded storage records without artificial inflation:
- **Financial & Operational KPIs**:
  - **Total Revenue**: Sum of all confirmed/completed customer orders in INR.
  - **Total Orders**: Total count of active orders with pending order badge.
  - **Average Order Value (AOV)**: Calculated dynamically (`Total Sales / Total Orders`).
  - **Catalog Garments**: Count of active SKUs in the catalog.
  - **Low-Stock Alerts**: Count of variants with $\le 5$ units remaining.
  - **Active Return Claims**: Pending patron return inquiries requiring QA triage.
- **Order Volume Visualization**: Dynamic horizontal bar chart illustrating order totals from actual customer bookings.
- **Atelier Bestsellers**: Garments ranked by real order frequencies and units sold.
- **Recent Orders Ledger**: Quick-action list with inline order modal inspection.

### 3.2. Product Management (`/admin/products`)
Comprehensive product catalog management:
- **Search & Multi-Facet Filtering**: Filter by search query (name, tagline, SKU), department (`men`, `women`), or specific category.
- **Garment Matrix Table**:
  - High-resolution thumbnail preview.
  - Garment title, category, department, base SKU, and retail pricing.
  - Total combined stock calculated across all child variants.
  - Status badges: `Featured`, `New Arrival`, `Bestseller`, `Custom Tailorable`.
- **Product Actions**:
  - **Create Garment**: Clean modal for drafting new luxury ensembles.
  - **Edit Garment**: Modifies metadata, pricing, descriptions, and variant matrix.
  - **Duplicate Garment**: Clones garment attributes and creates unique copy SKUs.
  - **Delete Garment**: Requires explicit two-step confirmation to prevent accidental loss.
- **Rich `ProductEditorModal`**:
  - Auto-generated URL slugs with slug editing.
  - Dual price configuration (`Price` and `Compare-At / MRP`).
  - **Dynamic Variant Matrix Builder**:
    - Add, modify, or remove child variants on the fly.
    - Set variant SKU, size (`38`, `40`, `42`, `44`, `XS`, `S`, `M`, `L`, `XL`), color name, color hex swatch, and unit stock.
    - Automatic total stock aggregation.
    - Duplicate SKU validation guard.

### 3.3. Category Hierarchy (`/admin/categories`)
- **Department Partitioning**: Switch between All, Men's, and Women's categories.
- **Category Metadata**: Title, URL slug, description, display order, subcategories list, and hero banner asset.
- **Active / Inactive Status Toggle**: Instant activation/deactivation affecting navigation menus.
- **Strict Deletion Guard**:
  - Checks `productService.getAllProducts()` for any garments assigned to the target category.
  - **Blocks deletion** if active garments are present, alerting the admin with the exact number of dependent garments to prevent orphaned products.

### 3.4. Inventory & Stock Audits (`/admin/inventory`)
- **Variant-Level Stock Matrix**:
  - Granular breakdown of every single SKU, size, and color combination across the atelier.
  - **Low-Stock Warning Badge**: Automatically flags any variant with $\le 5$ units left in inventory.
- **Stock Adjustment Workflow**:
  - Quick modal supporting addition (`Restock / Inbound`) or deduction (`Damage / Shrinkage / Return Inspection`).
  - **Mandatory Audit Reason**: Admin must provide an operational rationale (`New Stock Received`, `Quality Inspection Rejection`, `Cycle Count Correction`).
  - **Non-Negative Guard**: Prevents adjustments that would result in negative stock.
- **Immutable Movement Ledger (`inventory_movements`)**:
  - Comprehensive historical audit trail capturing timestamp, SKU, garment name, previous stock, delta change, new stock balance, and recorded reason.

### 3.5. Orders Ledger & Fulfillment (`/admin/orders`)
- **Real-Time Order Ledger**: Search by order number (`#VAST-2026-XXXX`), patron name, email, or garment keyword.
- **Status Filtering**: Filter by fulfillment stage (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`).
- **Payment & Method Badges**: Visual indicator of payment status (`paid`, `pending`, `refunded`) and method (`UPI`, `CARD`, `NETBANKING`, `COD`).
- **Inline Status Transition Pipeline**: Admin can transition orders through the fulfillment lifecycle with immediate feedback.
- **Full Order Inspection**: Opens `OrderDetailModal` showing item-level snapshots, customer shipping address, and carrier tracking simulation.

### 3.6. Quality Assurance & Returns (`/admin/returns`)
- **Return Claims Queue**: Triage patron return requests submitted from the storefront account portal.
- **Item-Level Inspection Details**: View order number, return reason (`Size / Fit Too Loose`, `Fabric Defect`, etc.), patron comment, and refund estimate.
- **Decision Workflow**:
  - `Approve Claim`: Moves status to `approved`.
  - `Schedule Pickup`: Updates to `pickup_scheduled`.
  - `Atelier Received`: Verifies return package received at warehouse.
  - `Complete Refund`: Issues simulated refund credit to original payment method.
  - `Reject Claim`: Formal denial with reason logging.

### 3.7. Patron Directory (`/admin/customers`)
- **Customer Directory**: Centralized ledger of registered patrons.
- **Customer Intelligence**: Email, contact phone, join date, total completed orders, and Lifetime Value (LTV).
- **VIP Tier Badges**:
  - `Royal Club Patron`: LTV $\ge ₹40,000$.
  - `Atelier Connoisseur`: LTV $\ge ₹20,000$.
  - `Standard Patron`: New / prospective clients.

### 3.8. Privileges & Coupons (`/admin/promotions`)
- **Promotional Rule Engine**:
  - Manage active coupon codes (`ROYAL10`, `FESTIVE15`, `ATELIER1000`).
  - Supports percentage discounts (`10%`, `15%`) or fixed INR discounts (`₹1,000 Off`).
  - Enforce minimum order threshold and maximum discount caps.
- **Live Activation Toggle**: Enable or disable promotions instantly without deleting campaign history.
- **Full Coupon CRUD**: Add new holiday/festive campaigns with validity expiration dates.

### 3.9. Review Moderation (`/admin/reviews`)
- **Client Testimonial Curation**: View all customer garment reviews submitted from the PDP.
- **Content Moderation**:
  - `Approve`: Publishes review to the storefront product detail page.
  - `Hide`: Conceals inappropriate or unverified feedback.
  - `Delete`: Permanent removal.

### 3.10. Store Settings & Demo Reset (`/admin/settings`)
- **Storefront Parameters**:
  - Store title, tagline, support contact email, and concierge hotline.
  - Free shipping threshold (default `₹3,000`).
  - Standard delivery charge and white-glove express surcharge.
  - Maximum Cash on Delivery ceiling (default `₹25,000`).
  - Live announcement bar text broadcast.
- **Global Factory Reset (`resetAllDemoData`)**:
  - Resets all storage keys (`vastramay_products`, `vastramay_orders`, `vastramay_categories`, `inventory_movements`, `vastramay_coupons`, `vastramay_reviews`, `vastramay_settings`, `return_requests`).
  - Restores factory seed records in a single click.

---

## 4. Data Consistency & Storage Architecture

Both the Customer Storefront and Admin Panel share the unified `storageAdapter` layer:
```
           ┌─────────────────────────────────────────┐
           │        Shared Storage Adapter           │
           │  (Browser LocalStorage + Async Driver)   │
           └──────────────────┬──────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌──────────────────┐                    ┌──────────────────┐
│ Storefront App   │                    │   Admin Panel    │
│ - Product Detail │ ◄── [Synchronous] ─► - Product CRUD   │
│ - Cart & Checkout│   Storage Contract │ - Stock Adjust   │
│ - Account Portal │                    │ - Order Pipeline │
└──────────────────┘                    └──────────────────┘
```

1. **Immediate Propagation**: When an admin adjusts stock in `/admin/inventory` or edits pricing in `/admin/products`, the storefront PDP and cart immediately reflect the updated numbers.
2. **Order Immutability**: Storefront orders create a deep-cloned snapshot of the garment title, price, and variant attributes at time of purchase. Future admin price adjustments do not distort historical customer order invoices.
3. **Inventory Integrity**: Deductions from customer checkouts and manual adjustments from the admin inventory module share the same variant stock counters.

---

## 5. Security & Authentication Boundary

- **Demo Credentials**:
  - **Email**: `admin@vastramay.com`
  - **Password**: `admin123`
  - Fast auto-fill button provided on the login page for rapid evaluation.
- **Route Guards**:
  - `/admin/*` routes are protected by `AdminGuard.tsx`, redirecting unauthenticated sessions to `/admin/login`.
- **Architectural Note on Role Enforcement**:
  > [!IMPORTANT]
  > Frontend route guards provide user experience separation and navigation protection only. In a production cloud deployment, administrative authorization MUST be enforced on the backend via cryptographically signed JWT tokens, HTTP-only session cookies, and database role-based access control (RBAC). No sensitive administrative keys or secrets are embedded in the client build.
