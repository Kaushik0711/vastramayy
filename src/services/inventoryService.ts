/**
 * Vastramay Inventory Management & Stock Adjustment Service
 * Records inventory movements with audit logs and prevents negative inventory.
 */

import { storage } from './storageAdapter';
import { productService } from './productService';
import { Product } from '../types';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  previousStock: number;
  delta: number;
  newStock: number;
  reason:
    | 'Received from Varanasi Weavers'
    | 'Damaged in Atelier Inspection'
    | 'Physical Audit Variance'
    | 'Customer Return Restocked'
    | 'Order Fulfilled'
    | 'Manual Stock Correction';
  notes?: string;
  adjustedBy: string;
  timestamp: string;
}

const INVENTORY_LOGS_KEY = 'inventory_movements';

export const INITIAL_INVENTORY_LOGS: InventoryMovement[] = [
  {
    id: 'mov-101',
    productId: 'prod-001',
    productName: 'Imperial Emerald Chanderi Kurta Set',
    variantId: 'v-001-40-emerald',
    sku: 'VM-KUR-001-EM-40',
    size: '40',
    colorName: 'Emerald Green',
    previousStock: 8,
    delta: 4,
    newStock: 12,
    reason: 'Received from Varanasi Weavers',
    notes: 'Batch #BAN-2026-04 arrived via BlueDart logistics',
    adjustedBy: 'Vikramaditya Roy (Admin)',
    timestamp: '2026-03-28T11:30:00.000Z',
  },
  {
    id: 'mov-102',
    productId: 'prod-002',
    productName: 'Varanasi Royal Brocade Sherwani',
    variantId: 'v-002-42-maroon',
    sku: 'VM-SHR-002-MR-42',
    size: '42',
    colorName: 'Imperial Crimson',
    previousStock: 4,
    delta: -1,
    newStock: 3,
    reason: 'Damaged in Atelier Inspection',
    notes: 'Zari snag on left lapel during final steaming',
    adjustedBy: 'Vikramaditya Roy (Admin)',
    timestamp: '2026-03-30T15:45:00.000Z',
  },
];

export const inventoryService = {
  /**
   * Get all inventory movement logs
   */
  async getMovementLogs(): Promise<InventoryMovement[]> {
    return await storage.getItem<InventoryMovement[]>(INVENTORY_LOGS_KEY, INITIAL_INVENTORY_LOGS);
  },

  async getMovements(): Promise<InventoryMovement[]> {
    return this.getMovementLogs();
  },

  /**
   * Adjust stock for a specific product variant
   */
  async adjustVariantStock(params: {
    productId: string;
    variantId: string;
    newStock: number;
    reason: InventoryMovement['reason'];
    notes?: string;
    adjustedBy?: string;
  }): Promise<{ product: Product; movement: InventoryMovement }> {
    if (params.newStock < 0) {
      throw new Error('Negative inventory is not permitted. Stock quantity must be 0 or greater.');
    }

    const product = await productService.getProductById(params.productId);
    if (!product) throw new Error('Product not found');

    const variantIndex = product.variants.findIndex((v) => v.id === params.variantId);
    if (variantIndex === -1) throw new Error('Variant not found');

    const variant = product.variants[variantIndex];
    const previousStock = variant.stockQuantity;
    const delta = params.newStock - previousStock;

    if (delta === 0) {
      throw new Error('New stock quantity is identical to existing quantity.');
    }

    // Update variant stock
    product.variants[variantIndex].stockQuantity = params.newStock;

    // Recalculate total product stock
    product.totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);

    // Save updated product
    await productService.saveProduct(product);

    // Record movement audit log
    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      sku: variant.sku,
      size: variant.size,
      colorName: variant.colorName,
      previousStock,
      delta,
      newStock: params.newStock,
      reason: params.reason,
      notes: params.notes,
      adjustedBy: params.adjustedBy || 'Vikramaditya Roy (Super Admin)',
      timestamp: new Date().toISOString(),
    };

    const logs = await this.getMovementLogs();
    logs.unshift(movement);
    await storage.setItem(INVENTORY_LOGS_KEY, logs);

    return { product, movement };
  },

  /**
   * Get low-stock items across all products ($\le 5$ units)
   */
  async getLowStockItems(threshold = 5): Promise<
    {
      product: Product;
      variant: Product['variants'][0];
    }[]
  > {
    const products = await productService.getAllProducts();
    const lowStock: { product: Product; variant: Product['variants'][0] }[] = [];

    for (const p of products) {
      for (const v of p.variants) {
        if (v.stockQuantity <= threshold) {
          lowStock.push({ product: p, variant: v });
        }
      }
    }

    return lowStock;
  },

  /**
   * Reset inventory movement logs
   */
  async resetToDefaults(): Promise<void> {
    await storage.setItem(INVENTORY_LOGS_KEY, INITIAL_INVENTORY_LOGS);
  },
};
