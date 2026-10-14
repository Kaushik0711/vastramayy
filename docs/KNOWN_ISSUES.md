# Vastramay Known Issues, Boundaries & Technical Debt

This document honestly and transparently details current architectural boundaries, environmental caveats, and gaps to live cloud deployment.

---

## 1. Architectural & Persistence Boundaries

### Client-Side Persistence
- **Current Limitation**: All catalog modifications, inventory updates, addresses, and order creations are persisted exclusively within the user's browser `localStorage` via `VersionedLocalStorageAdapter`.
- **Impact**: Changes made in one browser or device will not synchronize to another device.
- **Roadmap Resolution**: Connect repository interfaces to a live cloud PostgreSQL database (see [`docs/BACKEND_MIGRATION_PLAN.md`](file:///Users/jarvis/MySites/vastramay-3d/docs/BACKEND_MIGRATION_PLAN.md)).

### Concurrency & Flash-Sale Race Conditions
- **Current Limitation**: Inventory deductions occur synchronously in local browser state.
- **Impact**: Multiple concurrent users attempting to purchase the last available unit of a limited-edition bridal lehenga cannot be synchronized without server-side transaction locks.
- **Roadmap Resolution**: Implement database row-level locking (`SELECT FOR UPDATE`) on the backend order creation RPC function.

---

## 2. Authentication & Authorization Boundaries

### Simulated Client Authentication
- **Current Limitation**: Authentication in `authService.ts` simulates login tokens and session state. While plain text passwords are never stored, cryptographic JWT validation does not occur on a secure server.
- **Impact**: Administrative route guards can be inspected in the client bundle.
- **Roadmap Resolution**: Integrate an enterprise auth provider (Supabase Auth, Auth0, or Clerk) with secure HTTP-only cookies and cryptographic JWT verification.

---

## 3. Payment Gateway Integration

### Simulated Payment Verification
- **Current Limitation**: Checkout simulates UPI, net banking, card payments, and COD. Order success is triggered immediately upon clicking "Place Order".
- **Impact**: No real monetary transactions or real-time banking authorizations take place.
- **Roadmap Resolution**: Integrate Razorpay SDK with server-side order generation and webhook signature verification (`razorpay_signature`).

---

## 4. Environmental & Tooling Caveats

### Headless Playwright Driver CDN 404 in Certain Sandboxes & Chrome CDP Resolution
- **Context**: During initial browser subagent initialization, the automated tool encountered a download 404 on Azure Edge driver mirrors (`playwright.azureedge.net`).
- **Mitigation & Resolution**: Visual verification was executed directly using the host's native Google Chrome (`/Applications/Google Chrome.app`) in headless mode via Chrome DevTools Protocol (CDP) WebSocket sessions over port 9222/9225.
- **Verification Evidence**:
  - Captured 28 high-resolution full-page screenshots across desktop (1440x900), tablet (768x1024), and mobile (390x844, 375x667, 320x900) viewports stored in `<artifactDir>/qa_screenshots/`.
  - Executed automated multi-viewport layout audit proving 0px horizontal overflow across all 8 standard breakpoints (320px–1600px).
  - Executed 10/10 automated interactive user flows via CDP (variant selection, Add to Bag, Cart Drawer animation, Escape key dismissal, Wishlist toggle, active checkout rendering, 404 handling, Admin login gate) with 0 browser console errors.

---

## 5. Non-Blocking Aesthetic Notes

### Image Asset Hosting
- **Context**: Demo product images are hosted on high-availability Unsplash CDNs with pre-configured query parameters (`auto=format&fit=crop&q=80`).
- **Roadmap Resolution**: In a production environment, all garment photography should be migrated to an enterprise media CDN (Cloudinary or AWS CloudFront) with automatic AVIF/WebP transcoding.
