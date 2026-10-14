export type ProductGender = 'men' | 'women' | 'unisex';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stockQuantity: number;
  price: number;
  originalPrice?: number;
}

export type ProductFit =
  | 'Tailored'
  | 'Regular'
  | 'Slim'
  | 'Structured Slim'
  | 'Flared Kalidar'
  | 'Relaxed Kalidar'
  | 'Oversized'
  | 'Relaxed'
  | string;

export interface ProductSpecification {
  fabric: string;
  weave?: string;
  lining?: string;
  embroideryType?: string;
  fit: ProductFit;
  careInstructions: string[];
  occasion: string[];
}

export interface ProductReview {
  id: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  gender: ProductGender;
  categorySlug: string;
  subcategorySlug: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  featured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isCustomTailorable: boolean;
  tags: string[];
  specifications: ProductSpecification;
  variants: ProductVariant[];
  images: {
    primary: string;
    gallery: string[];
    thumbnail: string;
  };
  totalStock: number;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: ProductGender;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  description: string;
  tagline?: string;
  image: string;
  heroBannerImage?: string;
  featured: boolean;
  itemCount: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  displayOrder?: number;
  isActive?: boolean;
  description?: string;
  image?: string;
  itemCount?: number;
}
