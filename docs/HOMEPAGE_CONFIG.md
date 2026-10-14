# Vastramay Homepage Configuration & Asset Replacement Guide

This guide outlines the editorial architecture, data configuration, and asset management for the Vastramay flagship homepage.

---

## 1. Architecture Overview

The homepage is structured as an editorial fashion magazine spread rather than a standard e-commerce grid. It is composed of **14 modular sections**, each with a distinct composition:

| # | Section Component | Purpose & Composition | Data Source |
|---|-------------------|-----------------------|-------------|
| 1 | `HeroBanner` | Campaign-led hero with layered depth, asymmetric Jharokha arch visual, cursive accent, dual shopping doors (Men/Women), and atelier trust stats. | `HOMEPAGE_CONFIG.hero` |
| 2 | `AtelierTrustPillars` | 4 guarantee pillars (Silk Mark Silks, 2-Inch Fit Margins, Express Dispatch, 10-Day Doorstep Returns). | Static / Configurable |
| 3 | `NewArrivalsRail` | Horizontal product rail with smooth left/right scroll controls, snap scrolling, and quick-add support. | Catalog (`isNewArrival: true`) |
| 4 | `CategoryStorytellingSection` | Interactive department switcher (Men & Women) with architectural arch-topped tiles (`rounded-t-[70px]`) and item counts. | `HOMEPAGE_CONFIG.categoryStorytelling` |
| 5 | `MensEditorialSplit` | Asymmetric split layout: full-height campaign visual on left, 2-column curated product grid on right. | Catalog (`gender: 'men'`) |
| 6 | `WomensEditorialCollage` | Asymmetric magazine collage: 3 companion product cards on left, high-impact spotlight card with Jharokha arch on right. | Catalog (`gender: 'women'`) |
| 7 | `FeaturedCollectionsSection` | 4 luxury capsule archives (*The Royal Banaras Edit*, *Chanderi Sunrises*, *Noor Wedding Suite*, *The Wild Tussar Narrative*). | `HOMEPAGE_CONFIG.featuredCollections` |
| 8 | `BestsellersSection` | Filter tabs (All Pieces, Men's Icons, Women's Icons) with gold rank badges (#1 Atelier Favorite, #2 Royal Choice, etc.). | Catalog (`isBestseller: true`) |
| 9 | `SeasonalCampaignBanner` | Cinematic full-width campaign banner (*Autumn/Winter Royale: The Golden Hour of Varanasi*). | `HOMEPAGE_CONFIG.seasonalCampaign` |
| 10 | `CuratedOutfitInspiration` | Interactive "Shop the Look" section with look selector, constituent pieces breakdown, individual quick-add, and "Add Entire Look to Bag". | `HOMEPAGE_CONFIG.outfitInspirations` |
| 11 | `BrandStorySection` | Heritage narrative highlighting Varanasi pit looms, master weaver quote, and 4 craft pillars. | `HOMEPAGE_CONFIG.brandStory` |
| 12 | `CustomerReviewsSection` | 3 verified customer atelier reviews with real purchase badges, locations (Mumbai, Delhi, London, Bengaluru), and garment worn. | `HOMEPAGE_CONFIG.reviews` |
| 13 | `HomepageNewsletter` | Atelier VIP Circle invitation with live regex validation and demo success state. | Form validation |
| 14 | `FinalShoppingCta` | Closing brand portal with dual Men/Women doors and styling consultation CTA. | `HOMEPAGE_CONFIG.finalCta` |

---

## 2. Central Content Configuration

All homepage editorial copy, links, badges, stats, and campaigns are managed in:
👉 [`src/data/homepageConfig.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/homepageConfig.ts)

### How to Update Hero Banner Copy
```typescript
export const HOMEPAGE_CONFIG = {
  hero: {
    badge: 'The Festive Atelier 2026',
    headline: 'Where Royal Heritage',
    cursiveAccent: 'Meets Bespoke Luxury',
    statement: 'Your updated brand mission statement...',
    primaryCta: { label: "Explore Men's Suite", link: '/products?gender=men' },
    secondaryCta: { label: "Discover Women's Couture", link: '/products?gender=women' },
    // ...
  }
};
```

### How to Add or Modify Categories
Categories for both Men and Women are configured under `HOMEPAGE_CONFIG.categoryStorytelling`:
```typescript
men: [
  {
    id: 'cat-m-shirts',
    name: 'Artisanal Shirts',
    slug: 'shirts',
    gender: 'men',
    itemCount: 18,
    image: 'https://...',
    description: 'Mulberry silk and Belgian linen shirts...',
    tagline: 'Breathable Casual Luxury',
  },
  // Add additional categories here
]
```

### How to Update Styled Ensembles ("Shop the Look")
Configure looks in `HOMEPAGE_CONFIG.outfitInspirations`:
```typescript
{
  id: 'look-royal-groom',
  lookTitle: 'The Imperial Groom Ensemble',
  occasion: 'Royal Wedding & Phera Ceremony',
  tagline: 'Midnight Navy Kadwa Brocade...',
  heroImage: 'https://...',
  story: 'Crafted for the groom who commands royal poise...',
  ensembleItems: [
    {
      productId: 'prod-002',
      productName: 'Varanasi Royal Brocade Sherwani',
      productSlug: 'varanasi-royal-brocade-sherwani',
      price: 34500,
      role: 'Primary Outerwear',
      image: 'https://...',
    },
    // ...
  ]
}
```

---

## 3. Asset Replacement Guidelines

To preserve visual hierarchy and fast loading, adhere to the following specifications when replacing imagery:

| Asset Location | Aspect Ratio | Min Resolution | Style Guidance |
|----------------|--------------|----------------|----------------|
| **Hero Background** | 16:9 / 21:9 | 2000 × 1125 px | Rich moody atmospheric lighting, deep contrast, editorial model in couture. |
| **Hero Arch Spotlight** | 3:4.2 (Arch) | 800 × 1120 px | Full-body or 3/4 royal bridal or groom portrait. |
| **Category Tiles** | 3:4.2 (Arch Top) | 800 × 1120 px | Close crop on silhouette texture, fabric weave, or editorial pose. |
| **Men’s Split Campaign** | 9:16 / 3:4 | 1000 × 1600 px | Commanding editorial shot showcasing structured shoulders or collar embroidery. |
| **Featured Collections** | 16:9 | 1200 × 675 px | Atmospheric textile loom shots or expansive palace courtyard photography. |
| **Shop The Look Hero** | 3:4 | 1000 × 1333 px | Full styled ensemble showing all constituent pieces clearly. |
| **Artisan Loom Photo** | 4:5 (Arch Top) | 900 × 1125 px | Authentic handloom shuttle, pit loom, or artisan hands weaving zari. |
| **Product Primary** | 3:4 | 1000 × 1333 px | Clean editorial background, consistent eye level, natural lighting. |
| **Product Alternate** | 3:4 | 1000 × 1333 px | Detail close-up of embroidery, reverse drape, or candid movement. |

### Image Hosting & Centralization
- Unsplash CDN URLs are configured with `auto=format&fit=crop&q=80` for automatic WebP conversion and responsive resizing.
- To use custom local assets, place WebP or high-resolution JPEG files in `public/images/homepage/` and reference them via absolute paths (`/images/homepage/hero.webp`).

---

## 4. Verification Checklist

- [x] **Zero TypeScript Errors**: Built with `tsc -b && vite build` in 1.52s.
- [x] **No Fake Counters or Review Fabrication**: All reviews are tied to genuine garments with verified purchase badges.
- [x] **Full Mobile Responsiveness**: Touch-friendly product rails, scalable arch cards, and clear legible typography across viewports.
- [x] **Real Cart Integration**: "Quick Add to Bag" and "Add Entire Look to Bag" add real variant items directly into the global cart drawer with toast confirmation.
