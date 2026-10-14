export interface CartItem {
  id: string; // unique item id (often cartItemId or variantId)
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  colorName: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stockAvailable: number;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountPercentage?: number;
  description: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shippingFee: number;
  estimatedTax: number;
  total: number;
  totalItems: number;
  appliedCoupon?: AppliedCoupon;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  addedAt: string;
}
