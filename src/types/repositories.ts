import {
  Product,
  Category,
  Order,
  OrderStatus,
  ReturnRequest,
  CustomerProfile,
  CustomerSummary,
} from './index';
import { ProductFilterOptions, CatalogFacets } from '../services/productService';
import { InventoryMovement } from '../services/inventoryService';
import { CouponRule, CouponValidationResult } from '../services/promotionService';
import { CustomerReviewRecord } from '../services/reviewService';
import { StoreSettings } from '../services/settingsService';

/**
 * Repository interface contracts for Vastramay.
 * These interfaces decouple presentation components from the storage engine,
 * enabling clean substitution with REST, GraphQL, Supabase, or microservices
 * without requiring component rewrites.
 */

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: string): Promise<Product | undefined>;
  filterProducts(options: ProductFilterOptions): Promise<Product[]>;
  getFacets(baseProducts: Product[]): Promise<CatalogFacets>;
  saveProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  duplicateProduct(id: string): Promise<Product | undefined>;
  resetToDefaults(): Promise<void>;
}

export interface ICategoryRepository {
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  saveCategory(category: Category): Promise<Category>;
  deleteCategory(id: string): Promise<{ success: boolean; error?: string }>;
  resetToDefaults(): Promise<void>;
}

export interface IOrderRepository {
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(payload: any): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null>;
  getAllReturnRequests(): Promise<ReturnRequest[]>;
  createReturnRequest(payload: any): Promise<ReturnRequest>;
  resetToDefaults(): Promise<void>;
}

export interface IInventoryRepository {
  adjustVariantStock(params: {
    productId: string;
    variantId: string;
    newStock: number;
    reason: InventoryMovement['reason'];
    notes?: string;
    adjustedBy?: string;
  }): Promise<{ product: Product; movement: InventoryMovement }>;
  getMovements(): Promise<InventoryMovement[]>;
  resetToDefaults(): Promise<void>;
}

export interface IPromotionRepository {
  getAllCoupons(): Promise<CouponRule[]>;
  getCouponByCode(code: string): Promise<CouponRule | null>;
  validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult>;
  saveCoupon(coupon: Omit<CouponRule, 'id' | 'usageCount'> & { id?: string }): Promise<CouponRule>;
  toggleCouponActive(id: string): Promise<CouponRule>;
  deleteCoupon(id: string): Promise<void>;
  resetToDefaults(): Promise<void>;
}

export interface ICustomerRepository {
  getProfile(): Promise<CustomerProfile>;
  updateProfile(updates: Partial<CustomerProfile>): Promise<CustomerProfile>;
  getAllCustomers(): Promise<CustomerSummary[]>;
}

export interface IReviewRepository {
  getAllReviews(): Promise<CustomerReviewRecord[]>;
  getProductReviews(productId: string): Promise<CustomerReviewRecord[]>;
  createReview(
    review: Omit<CustomerReviewRecord, 'id' | 'createdAt'>
  ): Promise<CustomerReviewRecord>;
  updateReviewStatus(
    id: string,
    status: 'approved' | 'hidden'
  ): Promise<CustomerReviewRecord>;
  deleteReview(id: string): Promise<boolean>;
  resetToDefaults(): Promise<void>;
}

export interface ISettingsRepository {
  getSettings(): Promise<StoreSettings>;
  updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings>;
  resetAllDemoData(): Promise<void>;
}
