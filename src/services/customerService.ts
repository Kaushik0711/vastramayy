/**
 * Customer Profile & Address Management Service
 * Manages customer account details, bespoke tailoring measurements, and address book CRUD.
 */

import { storage } from './storageAdapter';
import { CustomerProfile, Address, CustomerSummary } from '../types';
import { MOCK_CUSTOMER_PROFILE, MOCK_CUSTOMERS_LIST } from '../data/customers';

const CUSTOMER_PROFILE_KEY = 'customer_session';

export const customerService = {
  /**
   * Get active customer profile
   */
  async getProfile(): Promise<CustomerProfile> {
    const profile = await storage.getItem<CustomerProfile | null>(CUSTOMER_PROFILE_KEY, null);
    if (!profile) {
      // Initialize with mock profile if none stored
      await storage.setItem(CUSTOMER_PROFILE_KEY, MOCK_CUSTOMER_PROFILE);
      return MOCK_CUSTOMER_PROFILE;
    }
    return profile;
  },

  /**
   * Update personal profile details
   */
  async updateProfile(updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const current = await this.getProfile();
    const updated: CustomerProfile = {
      ...current,
      ...updates,
      id: current.id, // Immutable ID
    };
    await storage.setItem(CUSTOMER_PROFILE_KEY, updated);
    return updated;
  },

  /**
   * Update bespoke tailoring measurements
   */
  async updateMeasurements(
    measurements: NonNullable<CustomerProfile['measurements']>
  ): Promise<CustomerProfile> {
    const current = await this.getProfile();
    const updated: CustomerProfile = {
      ...current,
      measurements: {
        ...current.measurements,
        ...measurements,
      },
    };
    await storage.setItem(CUSTOMER_PROFILE_KEY, updated);
    return updated;
  },

  /**
   * Get all saved addresses
   */
  async getAddresses(): Promise<Address[]> {
    const profile = await this.getProfile();
    return profile.addresses || [];
  },

  /**
   * Add a new delivery address
   */
  async addAddress(addressData: Omit<Address, 'id'>): Promise<Address> {
    const profile = await this.getProfile();
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };

    // If marked as default, unset others
    let addresses = profile.addresses || [];
    if (newAddress.isDefaultShipping) {
      addresses = addresses.map((a) => ({ ...a, isDefaultShipping: false }));
    }
    if (newAddress.isDefaultBilling) {
      addresses = addresses.map((a) => ({ ...a, isDefaultBilling: false }));
    }

    // If this is the first address, ensure it's default
    if (addresses.length === 0) {
      newAddress.isDefaultShipping = true;
      newAddress.isDefaultBilling = true;
    }

    addresses.push(newAddress);
    await this.updateProfile({ addresses });
    return newAddress;
  },

  /**
   * Update an existing address
   */
  async updateAddress(addressId: string, updates: Partial<Address>): Promise<Address | null> {
    const profile = await this.getProfile();
    let addresses = [...(profile.addresses || [])];
    const index = addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return null;

    if (updates.isDefaultShipping) {
      addresses = addresses.map((a) => ({ ...a, isDefaultShipping: false }));
    }
    if (updates.isDefaultBilling) {
      addresses = addresses.map((a) => ({ ...a, isDefaultBilling: false }));
    }

    addresses[index] = {
      ...addresses[index],
      ...updates,
      id: addressId, // Prevent mutating ID
    };

    await this.updateProfile({ addresses });
    return addresses[index];
  },

  /**
   * Delete an address by ID
   */
  async deleteAddress(addressId: string): Promise<boolean> {
    const profile = await this.getProfile();
    const currentAddresses = profile.addresses || [];
    const filtered = currentAddresses.filter((a) => a.id !== addressId);

    // If deleted address was default, set next available as default
    if (filtered.length > 0) {
      const hadDefaultShipping = currentAddresses.find((a) => a.id === addressId)?.isDefaultShipping;
      if (hadDefaultShipping && !filtered.some((a) => a.isDefaultShipping)) {
        filtered[0].isDefaultShipping = true;
      }
    }

    await this.updateProfile({ addresses: filtered });
    return true;
  },

  /**
   * Set an address as default for shipping or billing
   */
  async setDefaultAddress(addressId: string, type: 'shipping' | 'billing'): Promise<void> {
    const profile = await this.getProfile();
    const addresses = (profile.addresses || []).map((addr) => {
      if (type === 'shipping') {
        return { ...addr, isDefaultShipping: addr.id === addressId };
      } else {
        return { ...addr, isDefaultBilling: addr.id === addressId };
      }
    });

    await this.updateProfile({ addresses });
  },

  /**
   * Get all registered patrons for Admin Patron Directory
   */
  async getAllCustomers(): Promise<CustomerSummary[]> {
    return await storage.getItem<CustomerSummary[]>('admin_customers_list', MOCK_CUSTOMERS_LIST);
  },
};
