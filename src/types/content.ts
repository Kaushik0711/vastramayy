export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  position: 'hero' | 'featured_grid' | 'festive_strip' | 'announcement';
  isActive: boolean;
  priority: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders & Shipping' | 'Sizing & Custom Tailoring' | 'Returns & Exchanges' | 'Fabric & Care';
}
