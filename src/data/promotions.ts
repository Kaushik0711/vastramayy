import { Banner, Coupon } from '../types';

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'ban-hero-1',
    title: 'The Royal Rajputana Edit',
    subtitle: 'Heirloom silken kurtas, hand-embroidered bundis, and bespoke sherwanis tailored for unforgettable milestones.',
    badge: 'Festive Couture 2026',
    ctaText: 'Explore Men\'s Collection',
    ctaLink: '/men',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
    position: 'hero',
    isActive: true,
    priority: 1,
  },
  {
    id: 'ban-hero-2',
    title: 'Varanasi Zari & Bridal Weaves',
    subtitle: 'Pure Katan silk sarees and velvet bridal lehengas woven with pure gold zari.',
    badge: 'Bridal Atelier',
    ctaText: 'Discover Women\'s Suite',
    ctaLink: '/women',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
    position: 'hero',
    isActive: true,
    priority: 2,
  },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'VASTRA10',
    description: '10% off on all festive kurtas & sets above ₹4,999',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 4999,
    maxDiscountAmount: 2000,
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
    usageCount: 142,
  },
  {
    code: 'ROYALFEST20',
    description: '₹2,000 flat discount on bridal couture orders above ₹25,000',
    discountType: 'fixed',
    discountValue: 2000,
    minOrderValue: 25000,
    expiresAt: '2026-11-15T23:59:59Z',
    isActive: true,
    usageCount: 48,
  },
];
