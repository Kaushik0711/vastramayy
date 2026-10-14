# Development Rules & Architectural Standards

## 1. Code Standards & TypeScript Guidelines

1. **Strict TypeScript Mode**:
   - `strict: true`, `noUnusedLocals: true`, and `noUnusedParameters: true` must remain enabled.
   - Do not use `any`. Always define explicit interfaces or use discriminated unions.
2. **Path Aliasing**:
   - Always use `@/*` for internal `src` imports (e.g. `@/components/common/Button`).
3. **No Dead or Unused Code**:
   - Avoid leaving unused imports or placeholder variables that fail build linters.
4. **Accessible HTML & Semantic Elements**:
   - Use `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`, and `<button>` elements with `aria-label` tags for screen readers.

---

## 2. Styling Rules

1. **Utility-First with Tailwind CSS**:
   - Use Tailwind for structural, responsive, and layout styles (`flex`, `grid`, `space-y`, `text-sm`, `p-6`).
2. **SCSS for Visual Effects**:
   - SCSS rules are scoped to variables, glassmorphism filters, text gradients, and custom scrollbars in `src/styles/`.
3. **Palette Constraints**:
   - Rely on defined brand tokens (`vastra-gold`, `vastra-navy`, `vastra-maroon`, `vastra-sand`, `vastra-emerald`, `vastra-charcoal`). Avoid introducing ad-hoc hex codes inline.

---

## 3. Data & State Rules

1. **Decoupled Persistence**:
   - Always access entities via services (`productService`, `orderService`, `authService`) rather than directly manipulating `localStorage`.
2. **Separation of Auth Concerns**:
   - Maintain client-side mock authentication separately from production authentication. Do not hardcode real credentials or assume browser storage is secure for production tokens.
