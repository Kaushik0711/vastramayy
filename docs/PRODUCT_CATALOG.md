# Vastramay Product Catalog & Discovery Specification

This document details the product catalog architecture, garment taxonomy, SKU conventions, variant matrices, and multi-faceted search mechanisms implemented in Vastramay.

---

## 1. Catalog Architecture & Taxonomy

Vastramay organizes garments under two primary luxury departments: **Men** and **Women**.

- **Seed Catalog File**: [`src/data/products.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/products.ts)
- **Categories File**: [`src/data/categories.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/data/categories.ts)
- **Total Seed Garments**: 36 distinct handcrafted pieces (18 Men, 18 Women).

### Department Category Taxonomy

```
Vastramay Catalog
├── Men's Royal Wardrobe
│   ├── Royal Sherwanis (Velvet, Raw Silk, Embroidered Brocade)
│   ├── Silk Kurta Sets (Pure Silk, Tussar, Jacquard)
│   ├── Nehru Jackets & Bandhgalas (Jodhpuri, Handloom Silk)
│   └── Festive Dhotis & Breeches (Chanderi, Dupion)
│
└── Women's Couture Wardrobe
    ├── Bridal & Heritage Lehengas (Banarasi Katan, Zardozi, Velvet)
    ├── Pure Handloom Sarees (Banarasi Katan, Organza, Tussar)
    ├── Anarkalis & Festive Ensembles (Georgette, Chikankari, Chanderi)
    └── Luxury Kurtas & Shararas (Raw Silk, Tissue Chanderi)
```

---

## 2. Garment Data Structure & Variant Matrices

Each garment in Vastramay represents a master product associated with a discrete variant matrix.

```typescript
export interface Product {
  id: string;                     // e.g. "prod-001"
  slug: string;                   // e.g. "padmavati-crimson-zari-bridal-lehenga"
  name: string;                   // e.g. "Padmavati Crimson Zari Bridal Lehenga"
  tagline: string;                // e.g. "Hand-embroidered in pure Banarasi Katan silk..."
  description: string;            // Detailed narrative copy
  gender: 'men' | 'women';
  categorySlug: string;           // e.g. "bridal-lehengas"
  subcategorySlug?: string;
  price: number;                  // Integer INR (e.g. 84999)
  originalPrice?: number;         // Strikethrough comparison price
  discountPercentage?: number;    // Calculated discount (e.g. 15)
  images: {
    primary: string;              // High-resolution frontal angle
    gallery: string[];            // Multi-angle detail and craft close-ups
    thumbnail: string;            // Square optimized preview
  };
  variants: ProductVariant[];     // Discrete variant matrix
  totalStock: number;             // Aggregate stock across all variants
  isNewArrival?: boolean;
  isBestseller?: boolean;
  featured?: boolean;
  ratingAverage: number;          // e.g. 4.9
  reviewCount: number;            // e.g. 28
  specifications: {
    fabric: string;               // e.g. "Pure Banarasi Katan Silk"
    weave: string;                // e.g. "Kadwa Weave with Antique Zari"
    washCare: string;             // e.g. "Strictly Dry Clean Only"
    fit: string;                  // e.g. "Custom Flared Silhouette"
    origin: string;               // e.g. "Varanasi Atelier, Uttar Pradesh"
  };
}
```

### Discrete Variant Matrix & SKU Convention
Every variant has an unambiguous, stable SKU code adhering to the standard Vastramay naming convention:

$$\text{VM} - \text{GENDER} - \text{CATEGORY} - \text{ID} - \text{COLOR} - \text{SIZE}$$

Example: `VM-WOM-LEH-001-RED-M`
- **Product ID**: `prod-001`
- **Variant ID**: `prod-001-red-m`
- **Size**: `M` (Options: `XS`, `S`, `M`, `L`, `XL`, `XXL`)
- **Color**: `Crimson Red` (`#8B0000`)
- **Stock Quantity**: Real-time units in stock (e.g. `4`)

---

## 3. Dynamic Faceted Discovery System

The product catalog discovery engine is implemented in [`src/services/productService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/productService.ts).

### Search & Filter Capabilities
1. **Department & Category Filtering**: Fast segmenting by Men, Women, category slugs, and subcategory slugs.
2. **Price Range Filtering**: Bounds checks against `minPrice` and `maxPrice`.
3. **Size Availability Filtering**: Matches garments with active stock in chosen sizes.
4. **Color Palette Filtering**: Matches visual color swatches.
5. **Fabric & Craft Weave Filtering**: Filters across silk, velvet, brocade, tussar, and georgette.
6. **Occasion Filtering**: Filters for Wedding, Festive, Evening, Mehendi, or Sangeet.
7. **Stock & Sale Toggles**: Filters for `inStockOnly` or `onSaleOnly`.
8. **Full-Text Keyword Search**: Normalized case-insensitive matching across product title, description, fabric specifications, and SKUs.

### Dynamic Facet Calculation
The `productService.computeFacets()` method analyzes the currently available products and calculates live count distributions for all filters:
- Category counts
- Size distribution counts
- Color availability counts
- Fabric counts
- Price extremes (`minPrice`, `maxPrice`)

### Sorting Algorithms
- `'featured'`: Highlighting curated editorial heirlooms first.
- `'newest'`: Prioritizing `isNewArrival` garments.
- `'price-asc'`: Ascending integer price sorting.
- `'price-desc'`: Descending integer price sorting.
- `'rating'`: Highest review rating average.
- `'bestselling'`: Prioritizing `isBestseller` garments.
