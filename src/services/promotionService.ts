/**
 * Vastramay Promotional Coupons Management Service
 */

import { storage } from './storageAdapter';

export interface CouponRule {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10%, or 500 for ₹500
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  validUntil: string;
  usageCount: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponRule;
  discountAmount?: number;
  message: string;
}

const PROMOTIONS_STORAGE_KEY = 'promotions';

export const INITIAL_COUPONS: CouponRule[] = [
  {
    id: 'coup-01',
    code: 'ROYAL10',
    description: '10% privilege discount for all authentic handloom ensembles',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscountAmount: 2500,
    isActive: true,
    validUntil: '2026-12-31T23:59:59Z',
    usageCount: 42,
  },
  {
    id: 'coup-02',
    code: 'FESTIVE15',
    description: '15% festive wedding season atelier privilege',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 5000,
    maxDiscountAmount: 4000,
    isActive: true,
    validUntil: '2026-12-31T23:59:59Z',
    usageCount: 18,
  },
  {
    id: 'coup-03',
    code: 'ATELIER1000',
    description: 'Flat ₹1,000 off on bridal lehengas and royal brocade sherwanis',
    discountType: 'fixed',
    discountValue: 1000,
    minOrderAmount: 10000,
    isActive: false,
    validUntil: '2026-06-30T23:59:59Z',
    usageCount: 7,
  },
];

export const promotionService = {
  async getAllCoupons(): Promise<CouponRule[]> {
    return await storage.getItem<CouponRule[]>(PROMOTIONS_STORAGE_KEY, INITIAL_COUPONS);
  },

  async getCouponByCode(code: string): Promise<CouponRule | null> {
    const coupons = await this.getAllCoupons();
    const cleanCode = code.trim().toUpperCase();
    return coupons.find((c) => c.code === cleanCode) || null;
  },

  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const coupon = await this.getCouponByCode(code);
    if (!coupon || !coupon.isActive) {
      return { valid: false, message: 'Invalid or expired promotional code.' };
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `This privilege requires a minimum cart value of ₹${coupon.minOrderAmount.toLocaleString('en-IN')}`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Privilege code ${coupon.code} applied successfully!`,
    };
  },

  async saveCoupon(couponData: Omit<CouponRule, 'id' | 'usageCount'> & { id?: string }): Promise<CouponRule> {
    const coupons = await this.getAllCoupons();
    const existingIndex = coupons.findIndex(
      (c) => (couponData.id && c.id === couponData.id) || c.code.toUpperCase() === couponData.code.toUpperCase()
    );

    if (existingIndex >= 0) {
      coupons[existingIndex] = {
        ...coupons[existingIndex],
        ...couponData,
        code: couponData.code.toUpperCase(),
      };
      await storage.setItem(PROMOTIONS_STORAGE_KEY, coupons);
      return coupons[existingIndex];
    } else {
      const newCoupon: CouponRule = {
        ...couponData,
        id: `coup-${Date.now()}`,
        code: couponData.code.toUpperCase(),
        usageCount: 0,
      };
      coupons.unshift(newCoupon);
      await storage.setItem(PROMOTIONS_STORAGE_KEY, coupons);
      return newCoupon;
    }
  },

  async toggleCouponActive(id: string): Promise<CouponRule> {
    const coupons = await this.getAllCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Coupon not found');

    coupons[index].isActive = !coupons[index].isActive;
    await storage.setItem(PROMOTIONS_STORAGE_KEY, coupons);
    return coupons[index];
  },

  async deleteCoupon(id: string): Promise<void> {
    const coupons = await this.getAllCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    await storage.setItem(PROMOTIONS_STORAGE_KEY, filtered);
  },

  async resetToDefaults(): Promise<void> {
    await storage.setItem(PROMOTIONS_STORAGE_KEY, INITIAL_COUPONS);
  },
};
