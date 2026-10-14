/**
 * Vastramay Review Moderation Service
 */

import { storage } from './storageAdapter';

export interface CustomerReviewRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  status: 'approved' | 'pending' | 'hidden';
  createdAt: string;
}

const REVIEWS_STORAGE_KEY = 'customer_reviews';

export const INITIAL_REVIEWS: CustomerReviewRecord[] = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    productName: 'Imperial Emerald Chanderi Kurta Set',
    customerName: 'Devrat Mehra',
    rating: 5,
    title: 'Flawless drape and authentic zari',
    comment: 'Wore this for my brother’s Sangeet in Udaipur. The pure silk lining felt weightless throughout the evening, and the 2-inch side margin was a lifesaver for minor tailoring.',
    verifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'rev-02',
    productId: 'prod-002',
    productName: 'Varanasi Royal Brocade Sherwani',
    customerName: 'Karanvir Singhania',
    rating: 5,
    title: 'The gold zari is breathtaking under chandelier light',
    comment: 'The Varanasi weavers have outdone themselves. Received countless compliments. White glove packaging and cedar block aroma were an extraordinary touch.',
    verifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-03-18T14:20:00Z',
  },
  {
    id: 'rev-03',
    productId: 'prod-003',
    productName: 'Noor Hand-Embroidered Velvet Bandhgala',
    customerName: 'Siddharth V.',
    rating: 4,
    title: 'Stunning fit, slightly warmer for summer',
    comment: 'Supreme craftsmanship on the zardozi buttons. Best suited for autumn/winter indoor gala receptions.',
    verifiedBuyer: true,
    status: 'approved',
    createdAt: '2026-03-22T09:15:00Z',
  },
];

export const reviewService = {
  async getAllReviews(): Promise<CustomerReviewRecord[]> {
    return await storage.getItem<CustomerReviewRecord[]>(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
  },

  async updateReviewStatus(id: string, status: CustomerReviewRecord['status']): Promise<CustomerReviewRecord> {
    const reviews = await this.getAllReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');

    reviews[index].status = status;
    await storage.setItem(REVIEWS_STORAGE_KEY, reviews);
    return reviews[index];
  },

  async deleteReview(id: string): Promise<void> {
    const reviews = await this.getAllReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    await storage.setItem(REVIEWS_STORAGE_KEY, filtered);
  },

  async resetToDefaults(): Promise<void> {
    await storage.setItem(REVIEWS_STORAGE_KEY, INITIAL_REVIEWS);
  },
};
