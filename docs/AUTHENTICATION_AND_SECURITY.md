# Vastramay Authentication & Security Architecture

This document specifies the authentication model, session lifecycle, security boundaries, and storage safeguards implemented in Vastramay.

---

## 1. Authentication Architecture

Vastramay segregates authentication into two discrete domains:
1. **Customer Patron Authentication**: Accessible via `/login` and `/register`. Manages customer order history, saved addresses, and profile details.
2. **Atelier Staff / Admin Authentication**: Accessible via `/admin/login`. Guards all administrative operations and sensitive store data.

- **Service File**: [`src/services/authService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/authService.ts)
- **Context File**: [`src/context/AuthContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/AuthContext.tsx)

---

## 2. Session Management & Storage Boundaries

### Session Separation
To prevent privilege escalation, customer and admin sessions are kept completely independent:

| Session Entity | Storage Medium | Storage Key | Expiry / Invalidation |
| :--- | :--- | :--- | :--- |
| **Admin User** | `sessionStorage` | `vastramay_admin_session` | Tab close, manual logout, or session timeout |
| **Customer User** | `localStorage` | `vastramay_customer_session` | Manual logout |

### Plain-Text Password Prohibition
- Passwords entered by users during demo login/registration are **never stored in plain text**.
- `authService.ts` hashes/simulates credentials and returns clean token envelopes omitting secret strings.
- The `storageAdapter.ts` security blacklist actively intercepts and aborts any write operations containing sensitive keys such as `'password'`, `'token_secret'`, or `'private_key'`.

---

## 3. Route Guards & Authorization

Route protection is implemented in [`src/routes/index.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/routes/index.tsx):

### `AdminRouteGuard`
- Inspects `authService.isAdminAuthenticated()`.
- If unauthenticated, immediately redirects to `/admin/login` with `replace: true`, preventing back-button access to cached admin views.
- Wraps the administrative layout and all nested routes (`/admin/dashboard`, `/admin/orders`, `/admin/products`, etc.).

### `CustomerRouteGuard`
- Inspects `authService.isCustomerAuthenticated()`.
- Guards sensitive customer-specific routes (`/account`, saved addresses).
- Unauthenticated visitors are prompted to sign in or proceed with guest checkout.

---

## 4. Input Sanitization & Form Validation

- **Email Validation**: Strict regex verification (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) across customer login, checkout, and footer newsletter forms.
- **Phone Validation**: Verified 10-digit Indian mobile standard format (`/^[6-9]\d{9}$/`).
- **PIN Code Validation**: Strict 6-digit numeric pattern matching (`/^\d{6}$/`).
- **XSS & Injection Protection**: React automatically escapes JSX string literals. Raw HTML injection (`dangerouslySetInnerHTML`) is avoided throughout the application.

---

## 5. Production Hardening Roadmap

When transitioning from the current mock/demo architecture to a live cloud production environment:

1. **Authentication Provider**: Replace simulated `authService.ts` with Supabase Auth, Clerk, or AWS Cognito.
2. **Session Security**: Shift from client-side tokens to HTTP-only, secure, `SameSite=Strict` cookies.
3. **Role-Based Access Control (RBAC)**: Enforce granular administrative permissions (`super_admin`, `inventory_clerk`, `order_manager`) on the server database.
4. **Rate Limiting**: Implement IP-based rate limiting on `/login` and `/admin/login` endpoints to prevent brute-force attacks.
5. **CSRF Protection**: Implement Anti-CSRF tokens for all state-mutating requests (`POST`, `PUT`, `DELETE`).
