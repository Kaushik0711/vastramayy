import { storage } from './storageAdapter';
import { MOCK_PRODUCTS } from '../data/products';
import { MOCK_CATEGORIES } from '../data/categories';
import { Product, Category, ProductGender } from '../types';

const PRODUCTS_STORAGE_KEY = 'products';
const CATEGORIES_STORAGE_KEY = 'categories';

export interface ProductFilterOptions {
  gender?: ProductGender | 'all';
  categorySlug?: string;
  subcategorySlug?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  fabrics?: string[];
  occasions?: string[];
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  minRating?: number;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'bestselling';
}

export interface AvailableFacetItem {
  id: string;
  label: string;
  count: number;
  colorHex?: string;
}

export interface CatalogFacets {
  categories: AvailableFacetItem[];
  subcategories: AvailableFacetItem[];
  sizes: AvailableFacetItem[];
  colors: AvailableFacetItem[];
  fabrics: AvailableFacetItem[];
  occasions: AvailableFacetItem[];
  priceRange: { min: number; max: number };
  totalCount: number;
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    return await storage.getItem<Product[]>(PRODUCTS_STORAGE_KEY, MOCK_PRODUCTS);
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getAllProducts();
    return products.find((p) => p.id === id);
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.getAllProducts();
    return products.find((p) => p.slug === slug);
  },

  async getCategories(): Promise<Category[]> {
    return await storage.getItem<Category[]>(CATEGORIES_STORAGE_KEY, MOCK_CATEGORIES);
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug);
  },

  async getSubcategoriesByParentSlug(parentSlug: string) {
    const category = await this.getCategoryBySlug(parentSlug);
    return category ? category.subcategories : [];
  },

  async filterProducts(options: ProductFilterOptions): Promise<Product[]> {
    let list = await this.getAllProducts();

    // 1. Gender Filter
    if (options.gender && options.gender !== 'all') {
      list = list.filter((p) => p.gender === options.gender || p.gender === 'unisex');
    }

    // 2. Category Slug Filter
    if (options.categorySlug && options.categorySlug !== 'all') {
      list = list.filter((p) => p.categorySlug === options.categorySlug);
    }

    // 3. Subcategory Slug Filter
    if (options.subcategorySlug && options.subcategorySlug !== 'all') {
      list = list.filter((p) => p.subcategorySlug === options.subcategorySlug);
    }

    // 4. Advanced Full-Text Search Matcher
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inTagline = p.tagline.toLowerCase().includes(q);
        const inDescription = p.description.toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const inCategory = p.categorySlug.toLowerCase().includes(q);
        const inSubcategory = p.subcategorySlug.toLowerCase().includes(q);
        const inFabric = p.specifications.fabric?.toLowerCase().includes(q);
        const inWeave = p.specifications.weave?.toLowerCase().includes(q);
        const inOccasions = p.specifications.occasion?.some((occ) => occ.toLowerCase().includes(q));
        const inSkus = p.variants.some(
          (v) => v.sku.toLowerCase().includes(q) || v.colorName.toLowerCase().includes(q)
        );

        return (
          inName ||
          inTagline ||
          inDescription ||
          inTags ||
          inCategory ||
          inSubcategory ||
          inFabric ||
          inWeave ||
          inOccasions ||
          inSkus
        );
      });
    }

    // 5. Price Range
    if (options.minPrice !== undefined) {
      list = list.filter((p) => p.price >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= options.maxPrice!);
    }

    // 6. Sizes Filter (Any size match)
    if (options.sizes && options.sizes.length > 0) {
      list = list.filter((p) =>
        p.variants.some((v) =>
          options.sizes!.some((s) => v.size.toLowerCase().includes(s.toLowerCase()))
        )
      );
    }

    // 7. Colors Filter
    if (options.colors && options.colors.length > 0) {
      list = list.filter((p) =>
        p.variants.some((v) =>
          options.colors!.some(
            (c) =>
              v.colorName.toLowerCase().includes(c.toLowerCase()) ||
              v.colorHex.toLowerCase() === c.toLowerCase()
          )
        )
      );
    }

    // 8. Fabrics / Materials Filter
    if (options.fabrics && options.fabrics.length > 0) {
      list = list.filter((p) =>
        options.fabrics!.some(
          (f) =>
            p.specifications.fabric.toLowerCase().includes(f.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(f.toLowerCase()))
        )
      );
    }

    // 9. Occasions Filter
    if (options.occasions && options.occasions.length > 0) {
      list = list.filter((p) =>
        options.occasions!.some((occ) =>
          p.specifications.occasion.some((o) => o.toLowerCase().includes(occ.toLowerCase()))
        )
      );
    }

    // 10. Availability Filter
    if (options.inStockOnly) {
      list = list.filter((p) => p.totalStock > 0);
    }

    // 11. Discount / On Sale Filter
    if (options.onSaleOnly) {
      list = list.filter((p) => Boolean(p.discountPercentage && p.discountPercentage > 0));
    }

    // 12. Rating Filter
    if (options.minRating !== undefined && options.minRating > 0) {
      list = list.filter((p) => p.ratingAverage >= options.minRating!);
    }

    // 13. Sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'rating':
          list.sort((a, b) => b.ratingAverage - a.ratingAverage);
          break;
        case 'bestselling':
          list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.reviewCount - a.reviewCount);
          break;
        case 'featured':
        default:
          list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return list;
  },

  /**
   * Dynamically calculate available filter facets (with real product counts) based on current scope
   */
  async getFacets(baseProducts: Product[]): Promise<CatalogFacets> {
    const categoriesMap = new Map<string, number>();
    const subcategoriesMap = new Map<string, number>();
    const sizesMap = new Map<string, number>();
    const colorsMap = new Map<string, { count: number; hex: string }>();
    const fabricsMap = new Map<string, number>();
    const occasionsMap = new Map<string, number>();

    let minPrice = Infinity;
    let maxPrice = 0;

    baseProducts.forEach((p) => {
      // Price
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;

      // Category
      categoriesMap.set(p.categorySlug, (categoriesMap.get(p.categorySlug) || 0) + 1);

      // Subcategory
      if (p.subcategorySlug) {
        subcategoriesMap.set(p.subcategorySlug, (subcategoriesMap.get(p.subcategorySlug) || 0) + 1);
      }

      // Sizes & Colors from Variants
      p.variants.forEach((v) => {
        // Size
        const cleanSize = v.size.split(' ')[0] || v.size;
        sizesMap.set(cleanSize, (sizesMap.get(cleanSize) || 0) + 1);

        // Color
        const existingColor = colorsMap.get(v.colorName);
        if (existingColor) {
          existingColor.count += 1;
        } else {
          colorsMap.set(v.colorName, { count: 1, hex: v.colorHex });
        }
      });

      // Fabrics (extract common weave keywords)
      const fabricKeywords = ['Chanderi', 'Silk', 'Brocade', 'Velvet', 'Cotton', 'Linen', 'Tussar', 'Georgette', 'Kanjivaram'];
      fabricKeywords.forEach((kw) => {
        if (
          p.specifications.fabric.toLowerCase().includes(kw.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(kw.toLowerCase()))
        ) {
          fabricsMap.set(kw, (fabricsMap.get(kw) || 0) + 1);
        }
      });

      // Occasions
      p.specifications.occasion.forEach((occ) => {
        occasionsMap.set(occ, (occasionsMap.get(occ) || 0) + 1);
      });
    });

    return {
      categories: Array.from(categoriesMap.entries()).map(([slug, count]) => ({
        id: slug,
        label: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        count,
      })),
      subcategories: Array.from(subcategoriesMap.entries()).map(([slug, count]) => ({
        id: slug,
        label: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        count,
      })),
      sizes: Array.from(sizesMap.entries()).map(([size, count]) => ({
        id: size,
        label: size,
        count,
      })),
      colors: Array.from(colorsMap.entries()).map(([name, data]) => ({
        id: name,
        label: name,
        count: data.count,
        colorHex: data.hex,
      })),
      fabrics: Array.from(fabricsMap.entries()).map(([name, count]) => ({
        id: name,
        label: name,
        count,
      })),
      occasions: Array.from(occasionsMap.entries()).map(([occ, count]) => ({
        id: occ,
        label: occ,
        count,
      })),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === 0 ? 50000 : maxPrice,
      },
      totalCount: baseProducts.length,
    };
  },

  async saveProduct(product: Product): Promise<void> {
    const products = await this.getAllProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.unshift({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    await storage.setItem(PRODUCTS_STORAGE_KEY, products);
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getAllProducts();
    const filtered = products.filter((p) => p.id !== id);
    await storage.setItem(PRODUCTS_STORAGE_KEY, filtered);
  },

  async resetToDefaults(): Promise<void> {
    await storage.setItem(PRODUCTS_STORAGE_KEY, MOCK_PRODUCTS);
    await storage.setItem(CATEGORIES_STORAGE_KEY, MOCK_CATEGORIES);
  },
};
