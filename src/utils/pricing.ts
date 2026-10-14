/**
 * Vastramay Integer-Paise Precision Pricing Utility
 * Avoids floating point inaccuracies by executing all calculations in integer paise (1 INR = 100 paise).
 */

export interface PriceBreakdown {
  subtotalInPaise: number;
  discountInPaise: number;
  shippingInPaise: number;
  taxInPaise: number;
  totalInPaise: number;
  // Converted to standard Rupees for display
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * Convert standard INR Rupee amount to integer paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert integer paise back to standard INR Rupee amount
 */
export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

/**
 * Calculate cart financials strictly using integer paise
 */
export function calculateCartFinancials(
  items: { price: number; quantity: number }[],
  couponDiscountValue?: number,
  couponDiscountType?: 'fixed' | 'percentage',
  maxDiscount?: number,
  freeShippingThreshold = 3000,
  flatShippingFee = 250
): PriceBreakdown {
  // 1. Subtotal in paise
  const subtotalInPaise = items.reduce((acc, item) => {
    const itemPriceInPaise = rupeesToPaise(item.price);
    return acc + itemPriceInPaise * item.quantity;
  }, 0);

  // 2. Discount in paise
  let discountInPaise = 0;
  if (couponDiscountValue && couponDiscountValue > 0) {
    if (couponDiscountType === 'percentage') {
      discountInPaise = Math.round((subtotalInPaise * couponDiscountValue) / 100);
      if (maxDiscount) {
        const maxDiscountInPaise = rupeesToPaise(maxDiscount);
        if (discountInPaise > maxDiscountInPaise) {
          discountInPaise = maxDiscountInPaise;
        }
      }
    } else {
      // Fixed discount
      discountInPaise = rupeesToPaise(couponDiscountValue);
    }
    // Cannot discount more than subtotal
    discountInPaise = Math.min(discountInPaise, subtotalInPaise);
  }

  // 3. Shipping in paise (Complimentary above threshold or if cart is empty)
  const freeShippingThresholdInPaise = rupeesToPaise(freeShippingThreshold);
  const flatShippingFeeInPaise = rupeesToPaise(flatShippingFee);
  const shippingInPaise =
    subtotalInPaise === 0 || subtotalInPaise >= freeShippingThresholdInPaise
      ? 0
      : flatShippingFeeInPaise;

  // 4. In India, MRP is inclusive of all taxes (GST)
  const taxInPaise = 0;

  // 5. Total in paise
  const totalInPaise = Math.max(0, subtotalInPaise - discountInPaise + shippingInPaise + taxInPaise);

  return {
    subtotalInPaise,
    discountInPaise,
    shippingInPaise,
    taxInPaise,
    totalInPaise,
    subtotal: paiseToRupees(subtotalInPaise),
    discount: paiseToRupees(discountInPaise),
    shipping: paiseToRupees(shippingInPaise),
    tax: paiseToRupees(taxInPaise),
    total: paiseToRupees(totalInPaise),
  };
}

/**
 * Format Indian Rupees with proper currency symbol, grouping, and no decimal for integers
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
