# Vastramay — Project Overview

## 1. Executive Summary

**Vastramay** is an e-commerce platform engineered for Indian ethnic, festive, and wedding couture. The application combines bespoke custom-tailoring workflows with a consumer retail experience and an atelier administrative back-office.

---

## 2. Product Vision & Brand Identity

Indian ethnic wear is defined by intricate artisanal techniques—including Varanasi Kadwa brocades, Jaipur gota patti, Lucknowi chikankari, and Kanchipuram silk mark weaves. Vastramay brings these generational craft traditions online through:

1. **Atelier Fit Guarantee**: Standard sizes backed by complimentary 2-inch internal alteration margins and custom measurement capture.
2. **Material Transparency**: Detailed fabric composition, weave density, lining specification, and care guides.
3. **Dual Application Ecosystem**:
   - **Customer Storefront**: Immersive catalog navigation, product customization, wishlist curation, coupon redemption, responsive cart drawer, and order tracking.
   - **Atelier Operations Console**: Real-time KPI summaries, SKU stock management, order status pipeline updates, and patron records.

---

## 3. Core Architectural Highlights

- **Pluggable Storage Layer**: Data interactions run through an async `StorageAdapter` interface. Local mock data persists to browser `localStorage` with configurable network latency simulation, enabling zero-server offline testing and future REST/GraphQL backend replacement.
- **Strict Typing Throughout**: Every entity—variants, specifications, customer measurements, timeline events, and promotional coupons—is typed using TypeScript in `src/types/`.
- **Bespoke Design System**: Custom royal Indian aesthetic tokens integrating Espresso (`#38231F`), Deep Plum (`#3D1838`), Terracotta (`#873E36`), Antique Gold (`#B99B69`), Warm Ivory (`#F5EFE6`), Sage (`#65715A`), and Ink (`#201C1B`).
- **Resilient Data Architecture**: Versioned storage adapter (Envelope v2) with automated schema migration, JSON corruption recovery, in-memory private browsing fallback, and credential security guards.
- **Performance & Accessibility**: 100% WCAG 2.1 AA compliance, route-level code-splitting, eager hero loading, and dual-view responsive administrative tables.
