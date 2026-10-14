import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/pricing';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { modalBackdropVariants, drawerSlideRightVariants } from '../../styles/motionTokens';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, summary, applyCoupon, removeCoupon } =
    useCart();
  const [couponCode, setCouponCode] = useState('');
  const { showToast } = useToast();

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsCartOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isCartOpen, setIsCartOpen]);

  const freeShippingThreshold = 3000;
  const progressPercent = Math.min(100, Math.round((summary.subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - summary.subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      showToast(res.message, 'success');
      setCouponCode('');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              variants={drawerSlideRightVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-brand-gold/20 pointer-events-auto"
            >
          {/* Header */}
          <div className="p-5 border-b border-brand-espresso/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold tracking-wide text-brand-espresso">
                  Your Atelier Bag
                </h2>
                <span className="text-xs text-brand-espresso/60 font-medium">
                  {summary.totalItems} {summary.totalItems === 1 ? 'Garment' : 'Garments'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-brand-espresso/60 hover:text-brand-espresso hover:bg-brand-espresso/5 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Tracker */}
          {cartItems.length > 0 && (
            <div className="bg-brand-gold/10 px-5 py-3 border-b border-brand-gold/20">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-brand-espresso flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  {remainingForFree === 0 ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Complimentary Pan-India Shipping Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong>{formatINR(remainingForFree)}</strong> more for free express delivery
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-brand-gold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-espresso/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gold transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-espresso">Your bag is empty</h3>
                <p className="text-sm text-brand-espresso/70 max-w-xs leading-relaxed">
                  Discover our festive silhouettes, hand-embroidered sherwanis, and pure silk kurtas.
                </p>
                <Link to="/products" onClick={() => setIsCartOpen(false)}>
                  <Button variant="primary" size="md" className="mt-2">
                    Explore Collections
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3.5 bg-white rounded-lg border border-brand-espresso/10 shadow-sm transition-all hover:border-brand-gold/40"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded bg-brand-ivory shrink-0 border border-brand-espresso/5"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-brand-espresso line-clamp-1 font-serif">
                        {item.name}
                      </h4>
                      <p className="text-xs text-brand-espresso/60 mt-0.5">
                        Size: <span className="font-semibold text-brand-espresso">{item.size}</span> | Color:{' '}
                        <span className="font-semibold text-brand-espresso">{item.colorName}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold text-brand-espresso">
                          {formatINR(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-brand-espresso/40 line-through">
                            {formatINR(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-espresso/5">
                      <div className="flex items-center border border-brand-espresso/15 rounded-lg bg-brand-ivory/50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-sm text-brand-espresso/70 hover:text-brand-espresso hover:bg-brand-espresso/5 active:bg-brand-espresso/10 font-semibold transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-brand-espresso select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockAvailable}
                          className="w-8 h-8 flex items-center justify-center text-sm text-brand-espresso/70 hover:text-brand-espresso hover:bg-brand-espresso/5 active:bg-brand-espresso/10 font-semibold disabled:opacity-30 transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-brand-espresso/40 hover:text-brand-terracotta hover:bg-rose-50 transition-colors"
                        aria-label={`Remove ${item.name} from bag`}
                        title={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 pb-7 sm:pb-5 border-t border-brand-espresso/10 bg-white space-y-4 safe-area-pb">
              {/* Coupon Form */}
              {summary.appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-brand-gold/10 border border-brand-gold/30 rounded text-xs">
                  <div className="flex items-center gap-2 text-brand-espresso font-medium">
                    <Tag className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Coupon <strong>{summary.appliedCoupon.code}</strong> applied ({summary.appliedCoupon.discountPercentage}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-brand-terracotta hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Try 'ROYAL10' or 'FESTIVE15'"
                      className="flex-1 bg-brand-ivory/60 text-xs px-3 py-2 rounded border border-brand-espresso/15 uppercase tracking-wider focus:outline-none focus:border-brand-gold"
                    />
                    <Button type="submit" variant="outline" size="sm">
                      Apply
                    </Button>
                  </form>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-brand-espresso/70 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-espresso">{formatINR(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Atelier Privilege ({summary.appliedCoupon?.code})</span>
                    <span>-{formatINR(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span>
                    {summary.shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold tracking-wide">FREE</span>
                    ) : (
                      formatINR(summary.shippingFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-dashed border-brand-espresso/15 my-2 pt-2 flex justify-between text-base font-bold text-brand-espresso">
                  <span>Estimated Total</span>
                  <span className="text-brand-gold font-serif text-lg">{formatINR(summary.total)}</span>
                </div>
                <p className="text-[10px] text-brand-espresso/50 italic text-right">
                  Inclusive of all Indian taxes & GST
                </p>
              </div>

              {/* Trust Tag */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-brand-espresso/70 py-1 bg-brand-ivory/80 rounded border border-brand-espresso/5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span>Complimentary 10-day exchange & door-step alterations</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link to="/cart" onClick={() => setIsCartOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    View Bag
                  </Button>
                </Link>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )}
</AnimatePresence>
  );
};
