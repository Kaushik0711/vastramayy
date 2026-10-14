import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, CartSummary, AppliedCoupon } from '../types';
import { storage } from '../services/storageAdapter';
import { promotionService, CouponRule } from '../services/promotionService';
import { calculateCartFinancials } from '../utils/pricing';

const CART_STORAGE_KEY = 'cart_items';
const COUPON_STORAGE_KEY = 'applied_coupon';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  summary: CartSummary;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | undefined>(undefined);
  const [availableCoupons, setAvailableCoupons] = useState<CouponRule[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted cart and available coupons on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const [storedItems, storedCoupon, coupons] = await Promise.all([
          storage.getItem<CartItem[]>(CART_STORAGE_KEY, []),
          storage.getItem<AppliedCoupon | undefined>(COUPON_STORAGE_KEY, undefined),
          promotionService.getAllCoupons(),
        ]);
        setCartItems(storedItems);
        setAppliedCoupon(storedCoupon);
        setAvailableCoupons(coupons);
      } catch (err) {
        console.error('Failed to load cart from storage:', err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadCart();
  }, []);

  // Save changes to storage after initial load
  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem(CART_STORAGE_KEY, cartItems);
  }, [cartItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
  }, [appliedCoupon, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === item.variantId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + item.quantity, item.stockAvailable);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { ...item, id: `ci-${Date.now()}-${item.variantId}` }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCartItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.stockAvailable) } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(undefined);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = availableCoupons.find((c) => c.code === cleanCode && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }

    const currentSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (coupon.minOrderAmount && currentSubtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrderAmount.toLocaleString('en-IN')}`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else {
      discountAmount = Math.round((currentSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    }

    const applied: AppliedCoupon = {
      code: coupon.code,
      discountAmount,
      discountPercentage: coupon.discountType === 'percentage' ? coupon.discountValue : undefined,
      description: coupon.description,
    };

    setAppliedCoupon(applied);
    return { success: true, message: `Promo code ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(undefined);
  };

  const summary: CartSummary = useMemo(() => {
    const couponObj = appliedCoupon ? availableCoupons.find((c) => c.code === appliedCoupon.code) : undefined;
    const financials = calculateCartFinancials(
      cartItems.map((i) => ({ price: i.price, quantity: i.quantity })),
      couponObj?.discountValue,
      couponObj?.discountType,
      couponObj?.maxDiscountAmount,
      3000,
      250
    );

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      subtotal: financials.subtotal,
      discount: financials.discount,
      shippingFee: financials.shipping,
      estimatedTax: financials.tax,
      total: financials.total,
      totalItems,
      appliedCoupon,
    };
  }, [cartItems, appliedCoupon]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        summary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
