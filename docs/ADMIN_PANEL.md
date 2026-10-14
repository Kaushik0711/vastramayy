# Vastramay Atelier Admin Operations Guide

This document specifies the internal administrative management suite designed for Vastramay atelier staff, inventory managers, and store operators.

---

## 1. Architectural Separation

The administration panel is strictly separated from the public storefront:
- **Dedicated Route Group**: `/admin/*` guarded by `AdminRouteGuard`.
- **Dedicated Shell Layout**: [`src/components/layout/AdminLayout.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/components/layout/AdminLayout.tsx).
- **Independent State**: Admin session state is isolated in `authService.ts`.
- **Code-Splitting**: All 11 administrative pages are lazy-loaded via `React.lazy()` so standard shoppers never download admin code or editor bundles.

---

## 2. Authentication & Session Access

- **Admin Login Route**: `/admin/login`
- **Default Demo Credentials**:
  - **Email**: `admin@vastramay.com`
  - **Password**: `admin123`
  - *Convenience Feature: 1-click "Quick Auto-Fill Admin Credentials" button on login form.*
- **Session Lifespan**: Stored in `sessionStorage` with automatic redirect upon logout.

---

## 3. Administrative Workflows & Pages

### 1. Operations Dashboard (`/admin/dashboard`)
- **Key Metrics**:
  - Total Gross Revenue (INR)
  - Total Orders Count
  - Average Order Value (AOV)
  - Active Catalog Garment Count
  - Low-Stock Variant Count
  - Pending Dispatch Orders
- **Sales Analytics Chart**: Interactive SVG visual bar chart visualizing revenue trends across seeded orders.
- **Recent Orders & Top Performing Heirlooms**: Real-time sales rankings.

### 2. Garment Catalog Management (`/admin/products`)
- **Desktop Table & Mobile Stack**: Dual-view architecture (`hidden md:block` table vs `md:hidden` card stack).
- **Garment Editor Modal**: Dynamic form for updating title, tagline, description, price, original price, tags, and category associations.
- **Variant Matrix Builder**: Add, edit, or remove discrete variants (SKU, size, color name, hex swatch, unit stock).
- **Duplicate Garment Flow**: Clones an existing heirloom into a new catalog draft with unique IDs.
- **Safe Deletion**: Two-step confirmation modal preventing accidental catalog deletion.

### 3. Inventory Stock Control & Logistics (`/admin/inventory`)
- **Variant Stock Matrix**: Flat ledger of all active SKUs with real-time stock levels and color/size breakdowns.
- **Stock Status Filters**: Quick filtering by `All`, `Low Stock (<= 5)`, or `Out of Stock (0)`.
- **Stock Adjustment Modal**: Adjust inventory (+/- units) with **mandatory audit reason logging** (e.g. `'Atelier Restock'`, `'Damaged Fabric'`, `'Sample Sent'`).
- **Immutable Movement Audit Trail**: Complete historical ledger (`inventory_movements`) tracking timestamp, SKU, garment name, delta, old/new balance, operator, and verified reason.
- **Negative Stock Prevention**: Strictly rejects adjustments that would cause negative inventory.

### 4. Order Fulfillment & Dispatch (`/admin/orders`)
- **Search & Multi-Filtering**: Instant search by order number or customer name; filter by order status and payment status.
- **Inline Status Pipeline**: Update order progress directly from table or cards:
  $$\text{Pending} \rightarrow \text{Confirmed} \rightarrow \text{In Tailoring} \rightarrow \text{Shipped} \rightarrow \text{Delivered}$$
- **Order Inspector Modal**: View detailed line items, SKU codes, pricing, customer phone/email, and shipping address.

### 5. Patron Directory (`/admin/customers`)
- **Customer Profiles**: Name, email, mobile phone, and registration date.
- **Order History & LTV**: Lifetime Value (total spent in INR) and total completed orders count.
- **Patron Royale Tier**: VIP badges assigned to high-value clientele.

### 6. Privileges & Promotions (`/admin/promotions`)
- **Coupon Configuration**: Create and edit codes (`ROYAL10`, `FESTIVE15`, `ATELIER1000`).
- **Discount Rules**: Percentage discounts with maximum ceiling caps or flat cash discounts.
- **Order Thresholds**: Minimum order cart requirement in INR.
- **Status Toggle**: Instant active/inactive switch without code redeployment.

### 7. Quality Assurance & Returns (`/admin/returns`)
- **Return Claims Queue**: Review incoming customer return claims.
- **Claim Inspection**: View reason category, client comments, and inspection notes.
- **Refund Processing**: Approve returns, mark as received, and trigger simulated refunds.

### 8. Customer Reviews Moderation (`/admin/reviews`)
- **Testimonial Curation**: View customer feedback with star ratings and garment links.
- **Moderation Actions**: Approve for public storefront display, hide, or delete inappropriate reviews.

### 9. Category Architecture (`/admin/categories`)
- **Category Hierarchy**: Reorder display priorities, edit titles, descriptions, and department associations.
- **Deletion Guard**: Prohibits deletion of categories that have active garments assigned.

### 10. Store Settings & Demo Reset (`/admin/settings`)
- **Store Configuration**: Edit complimentary shipping thresholds, express surcharges, and live announcement strip copy.
- **Global Factory Reset**: 1-click **Reset All Demo Data** button restoring local storage to initial pristine catalog and order seeds.
