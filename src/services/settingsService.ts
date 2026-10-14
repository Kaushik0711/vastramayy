/**
 * Vastramay Store Settings & Global Demo Reset Service
 */

import { storage } from './storageAdapter';
import { productService } from './productService';
import { categoryService } from './categoryService';
import { orderService } from './orderService';
import { inventoryService } from './inventoryService';
import { promotionService } from './promotionService';
import { reviewService } from './reviewService';

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  freeShippingThreshold: number; // in INR
  standardShippingFee: number;
  expressShippingSurcharge: number;
  codMaxLimit: number;
  enableCod: boolean;
  enableGiftWrapping: boolean;
  announcementText: string;
}

const SETTINGS_STORAGE_KEY = 'store_settings';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'Vastramay Atelier',
  tagline: 'Contemporary Indian Festive & Bridal Couture',
  supportEmail: 'concierge@vastramay.com',
  supportPhone: '+91 (0) 22 4589 1920',
  freeShippingThreshold: 3000,
  standardShippingFee: 250,
  expressShippingSurcharge: 450,
  codMaxLimit: 25000,
  enableCod: true,
  enableGiftWrapping: true,
  announcementText: 'Complimentary Express Shipping Across India on All Orders Above ₹3,000',
};

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    return await storage.getItem<StoreSettings>(SETTINGS_STORAGE_KEY, DEFAULT_STORE_SETTINGS);
  },

  async saveSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated: StoreSettings = {
      ...current,
      ...updates,
    };
    await storage.setItem(SETTINGS_STORAGE_KEY, updated);
    return updated;
  },

  /**
   * Reset the entire Vastramay demo data ecosystem to factory defaults
   */
  async resetAllDemoData(): Promise<void> {
    await Promise.all([
      productService.resetToDefaults(),
      categoryService.resetToDefaults(),
      orderService.resetToDefaults(),
      inventoryService.resetToDefaults(),
      promotionService.resetToDefaults(),
      reviewService.resetToDefaults(),
      storage.setItem(SETTINGS_STORAGE_KEY, DEFAULT_STORE_SETTINGS),
      storage.removeItem('customer_session'),
      storage.removeItem('vastramay_cart_v1'),
      storage.removeItem('vastramay_wishlist_v1'),
    ]);
  },
};
