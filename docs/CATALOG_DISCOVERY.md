# Vastramay Product Catalog & Discovery Architecture

This document details the category hierarchy, search engine, multi-attribute filtering logic, and route parameter specifications for the Vastramay catalog.

---

## 1. Category Architecture & Data Model

Vastramay organizes clothing into **Men** and **Women** as primary departments, with normalized category records supporting arbitrary levels of nesting.

### Category Interface Specification
```typescript
export interface Category {
  id: string;               // Unique stable identifier (e.g. 'cat-men-kurtas')
  name: string;             // Editorial display name (e.g. 'Kurtas & Kurta Sets')
  slug: string;             // URL-safe slug (e.g. 'kurtas')
  gender: ProductGender;    // Department: 'men' | 'women' | 'unisex'
  parentId?: string | null; // Null for root categories; ID of parent for subcategories
  displayOrder: number;     // Sequencing in navigation and filter lists
  isActive: boolean;        // Soft-delete toggle
  description: string;      // Curated artisan narrative
  tagline?: string;         // Short poetic subtitle (e.g. 'Timeless Royal Silhouettes')
  image: string;            // Primary card thumbnail
  heroBannerImage?: string; // High-resolution panoramic hero banner
  featured: boolean;        // Highlighted on homepage & mega-menus
  itemCount: number;        // Total designs available
  subcategories: Subcategory[];
}
```

### Supported Departments & Categories

#### Men's Department (`/men`)
1. **Kurtas & Kurta Sets** (`kurtas`) — Chanderi, Chikankari, Asymmetric, Kurta Sets.
2. **Sherwanis & Achkans** (`sherwanis`) — Groom Sherwanis, Achkans, Indo-Western.
3. **Nehru & Bundi Jackets** (`nehru-jackets`) — Raw Silk, Jacquard, Velvet.
4. **Artisanal Shirts** (`shirts`) — Hand-Block Silk, Belgian Linen.
5. **Tailored Trousers** (`trousers`) — Gurkha Trousers, Raw Silk Churidars.
6. **Co-ord Sets** (`co-ord-sets`) — Festive Chanderi, Resort Silk.
7. **Luxe T-Shirts** (`t-shirts`) — Supima Crewnecks, Silk-Cotton Polos.
8. **Selvedge Denims** (`jeans`) — Raw Indigo, Vintage Washed.

#### Women's Department (`/women`)
1. **Festive & Bridal Lehengas** (`lehengas`) — Bridal Couture, Sangeet, Pastel Organza.
2. **Handcrafted Sarees** (`sarees`) — Banarasi Brocade, Kanjivaram Korvai, Pre-Draped.
3. **Designer Kurtis** (`kurtis`) — Chanderi Gold Leaf, Angrakha Tunics.
4. **Anarkalis & Sharara Sets** (`anarkalis`) — Floor-Length Kalidar, Shararas.
5. **Silk Co-ord Sets** (`co-ord-sets`) — Wild Tussar Sets, Hand-Block Georgette.
6. **Couture Dresses** (`dresses`) — Banarasi Gowns, Organza Overlays.
7. **Bottom Wear** (`bottom-wear`) — Silk Palazzos, Cigarette Pants.
8. **Artisan Dupattas** (`dupattas`) — Banarasi Brocade, Hand-Painted Organza.

---

## 2. Listing Pages & Route Matrix

| Route | Component | Page Title / Description | Shopping Controls |
|---|---|---|---|
| `/products` | `ProductsPage` | The Royal Collection (All Curations) | Full Sidebar, Toolbar, 2/3/4-col switch |
| `/men` | `ProductsPage forcedGender="men"` | Men's Sartorial Suite | Department Hero, quick category pills |
| `/women` | `ProductsPage forcedGender="women"` | Women's Couture Atelier | Department Hero, quick category pills |
| `/category/:categorySlug` | `ProductsPage` | Category Name & Story | Deep Breadcrumb, Subcategory tabs |
| `/category/:categorySlug/:subcategorySlug` | `ProductsPage` | Subcategory Focus | Deep Breadcrumb, refined facets |
| `/sale` | `ProductsPage isSalePage={true}` | Festive Sale & Privileges | Pre-filtered on discounted pieces |
| `/search` | `SearchPage` | Search the Collection | Query input, recent searches, trending pills |

---

## 3. Multi-Attribute Filtering Engine

Filtering is executed via a unified service method:
👉 [`productService.filterProducts(options: ProductFilterOptions)`](file:///Users/jarvis/MySites/vastramay-3d/src/services/productService.ts)

### Supported Combinable Dimensions
- **Gender / Department**: `men`, `women`, `all`.
- **Category & Subcategory**: Matched against `p.categorySlug` and `p.subcategorySlug`.
- **Price Range**: Presets (Under ₹5k, ₹5k–₹15k, ₹15k–₹30k, Above ₹30k) or custom `minPrice` / `maxPrice`.
- **Sizes**: Dynamically extracted from product variant sizes (e.g. `38`, `40`, `42`, `S`, `M`, `L`, `XL`, `Free Size`).
- **Colors**: Real hex swatches with checkmarks (`Emerald Green`, `Midnight Navy`, `Royal Crimson`, `Marigold Gold`, `Warm Sand`, `Indigo Azure`, `Terracotta Rust`, `Deep Plum`, `Antique Ivory`).
- **Fabrics & Weaves**: Extracted from `specifications.fabric` and `tags` (*Chanderi, Raw Silk, Brocade, Velvet, Tussar, Cotton Gabardine, Georgette, Kanjivaram*).
- **Occasions**: Extracted from `specifications.occasion` (*Wedding, Sangeet, Festive, Cocktail, Pooja, Resort*).
- **Availability**: `inStockOnly: true` checks `totalStock > 0`.
- **On Sale**: `onSaleOnly: true` checks `discountPercentage > 0`.
- **Rating**: `minRating: 4.5` or `4.0` stars.

### Dynamic Facets Calculation
`productService.getFacets(products)` scans the current product scope in real time to return only the sizes, colors, fabrics, and categories with active item counts.

---

## 4. Sorting Modes

| Mode Value | Label | Sort Criteria |
|---|---|---|
| `featured` | Recommended (Curated) | `p.featured === true` first |
| `newest` | New Arrivals | `createdAt` descending |
| `price-asc` | Price: Low to High | `p.price` ascending |
| `price-desc` | Price: High to Low | `p.price` descending |
| `rating` | Highest Rated | `p.ratingAverage` descending |
| `bestselling` | Best Sellers | `p.isBestseller === true` & `reviewCount` descending |

---

## 5. Search Engine Behavior

The search system (`/search` and the header search overlay) matches user queries against:
1. Product title (`name`)
2. Tagline and subtitle
3. Full editorial description
4. Product tags
5. Category and subcategory slugs
6. Fabric specifications (`specifications.fabric`, `specifications.weave`)
7. Occasion tags (`specifications.occasion`)
8. SKU codes and color names from variants (`variants[].sku`, `variants[].colorName`)

### Key Features
- **Case-Insensitive & Normalized**: Trims excess whitespace and normalizes text casing.
- **Recent Searches History**: Persisted in `localStorage` under `vastramay_recent_searches` (up to 6 items with 1-click removal).
- **Popular Curated Queries**: Shortcuts for immediate discovery (*Banarasi Brocade, Chanderi Silk, Gota Patti Lehenga, Royal Sherwani*).
- **No-Results State**: Recommends resetting filters or directs visitors to signature department doors.

---

## 6. URL Query Parameter Specification

All filter and pagination states sync directly to the URL via `useSearchParams`:

```
/products?gender=men&category=kurtas&minPrice=5000&maxPrice=15000&size=40&size=42&color=Emerald+Green&sort=newest
```

| Parameter | Type | Example | Description |
|---|---|---|---|
| `gender` | `string` | `men` | Filter by department |
| `category` | `string` | `kurtas` | Category slug |
| `subcategory` | `string` | `chanderi-silk` | Subcategory slug |
| `q` / `search` | `string` | `banarasi` | Full-text query |
| `minPrice` | `number` | `5000` | Minimum price in INR |
| `maxPrice` | `number` | `25000` | Maximum price in INR |
| `size` | `string[]` | `size=40&size=42` | Repeatable size filters |
| `color` | `string[]` | `color=Emerald+Green` | Repeatable color filters |
| `fabric` | `string[]` | `fabric=Chanderi` | Repeatable fabric filters |
| `occasion` | `string[]` | `occasion=Wedding` | Repeatable occasion filters |
| `inStock` | `boolean` | `true` | In stock only |
| `sale` | `boolean` | `true` | Discounted only |
| `rating` | `number` | `4.5` | Minimum star rating |
| `sort` | `string` | `price-asc` | Active sorting mode |

This ensures that any URL can be bookmarked, shared, or restored seamlessly when navigating back from product detail pages.
