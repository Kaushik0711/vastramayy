import { storage } from './storageAdapter';
import { AdminUser, CustomerProfile } from '../types';
import { MOCK_CUSTOMER_PROFILE } from '../data/customers';

const CUSTOMER_SESSION_KEY = 'customer_session';
const ADMIN_SESSION_KEY = 'admin_session';

export const MOCK_ADMIN_USER: AdminUser = {
  id: 'adm-001',
  name: 'Vikramaditya Roy',
  email: 'admin@vastramay.com',
  role: 'super_admin',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  lastLogin: new Date().toISOString(),
};

/**
 * Notice: This is explicitly a client-side mock authentication service designed
 * for development, UX review, and state persistence. In production, this adapter
 * connects to a secure backend OAuth/JWT token endpoint with HttpOnly cookies.
 */
export const authService = {
  // --- Customer Storefront Auth ---
  async getCurrentCustomer(): Promise<CustomerProfile | null> {
    return await storage.getItem<CustomerProfile | null>(CUSTOMER_SESSION_KEY, null);
  },

  async loginCustomer(email: string): Promise<CustomerProfile> {
    const profile: CustomerProfile = {
      ...MOCK_CUSTOMER_PROFILE,
      email: email || MOCK_CUSTOMER_PROFILE.email,
    };
    await storage.setItem(CUSTOMER_SESSION_KEY, profile);
    return profile;
  },

  async logoutCustomer(): Promise<void> {
    await storage.removeItem(CUSTOMER_SESSION_KEY);
  },

  // --- Admin Panel Auth ---
  async getCurrentAdmin(): Promise<AdminUser | null> {
    return await storage.getItem<AdminUser | null>(ADMIN_SESSION_KEY, null);
  },

  async loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    // Demonstration credentials verification (Never used in production)
    if (email === 'admin@vastramay.com' && password === 'admin123') {
      const user = { ...MOCK_ADMIN_USER, lastLogin: new Date().toISOString() };
      await storage.setItem(ADMIN_SESSION_KEY, user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid admin credentials. Use demo: admin@vastramay.com / admin123' };
  },

  async logoutAdmin(): Promise<void> {
    await storage.removeItem(ADMIN_SESSION_KEY);
  },
};
