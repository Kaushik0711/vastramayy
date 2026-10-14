import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/pricing';
import { Button } from '../../components/common/Button';
import { Trash2, ArrowRight, ShoppingBag, Tag, ShieldCheck, Truck, Plus, Minus, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { CatalogBreadcrumb } from '../../components/storefront/CatalogBreadcrumb';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, summary, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center mx-auto text-brand-gold-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-espresso">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-brand-ink/70 max-w-md mx-auto leading-relaxed font-light">
          Explore our signature silk kurtas, handcrafted Varanasi sarees, and bespoke groom sherwanis.
        </p>
        <Link to="/products">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-gold"
          >
            Explore The Collection
          </Button>
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 3000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - summary.subtotal);
  const freeShippingProgress = Math.min(100, (summary.subtotal / freeShippingThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <CatalogBreadcrumb items={[{ label: 'Shopping Bag' }]} />

      <div className="border-b border-brand-espresso/12 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-1">
            Atelier Dispatch Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-espresso">
            Your Shopping Bag ({summary.totalItems} {summary.totalItems === 1 ? 'Piece' : 'Pieces'})
          </h1>
        </div>

        <Link
          to="/products"
          className="text-xs uppercase tracking-wider font-semibold text-brand-espresso hover:text-brand-gold-600 underline underline-offset-4"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-brand-ivory-100/70 border border-brand-espresso/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-brand-espresso">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-gold-600" />
            {remainingForFreeShipping === 0 ? (
              <strong className="text-emerald-800">You have qualified for Complimentary Express Shipping!</strong>
            ) : (
              <span>
                Add <strong className="font-bold">{formatINR(remainingForFreeShipping)}</strong> more for Complimentary Express Shipping
              </span>
            )}
          </span>
          <span className="text-brand-ink/60">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="h-1.5 bg-brand-espresso/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.variantId}
              className="bg-white rounded-2xl border border-brand-espresso/12 p-4 sm:p-6 flex gap-4 sm:gap-6 items-start shadow-2xs hover:shadow-subtle transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 sm:w-28 aspect-[3/4] object-cover object-top rounded-xl bg-brand-ivory shrink-0 border border-brand-espresso/10"
              />

              <div className="flex-1 flex flex-col justify-between min-h-[120px]">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="font-serif text-base sm:text-lg font-medium text-brand-espresso hover:text-brand-gold-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-brand-ink/40 hover:text-brand-terracotta p-1 transition-colors"
                      aria-label="Remove item"
                      title="Remove piece"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-brand-ink/60 mt-1">
                    Size: <strong className="font-semibold text-brand-espresso">{item.size}</strong> | Color:{' '}
                    <strong className="font-semibold text-brand-espresso">{item.colorName}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-espresso/8 mt-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-brand-espresso/20 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1.5 text-brand-espresso hover:bg-brand-ivory-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-brand-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockAvailable}
                      className="p-1.5 text-brand-espresso hover:bg-brand-ivory-200 disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pricing Total */}
                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-brand-espresso">
                      {formatINR(item.price * item.quantity)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-brand-ink/40 line-through block">
                        {formatINR(item.originalPrice * item.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl border border-brand-espresso/12 p-6 sm:p-7 shadow-luxury space-y-6">
            <h2 className="font-serif text-xl font-medium text-brand-espresso border-b border-brand-espresso/10 pb-4">
              Atelier Summary
            </h2>

            {/* Financial Rows */}
            <div className="space-y-3 text-xs text-brand-ink/80">
              <div className="flex justify-between">
                <span>Subtotal ({summary.totalItems} Items)</span>
                <span className="font-semibold text-brand-espresso">{formatINR(summary.subtotal)}</span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between text-brand-terracotta font-semibold">
                  <span>Promotional Privilege ({summary.appliedCoupon?.code})</span>
                  <span>- {formatINR(summary.discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Shipping & Handling</span>
                  <span className="text-[10px] text-brand-ink/40">(Doorstep Insured)</span>
                </span>
                <span>
                  {summary.shippingFee === 0 ? (
                    <strong className="text-emerald-700 uppercase font-bold text-[10px]">Free</strong>
                  ) : (
                    formatINR(summary.shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-brand-ink/50 pt-1">
                <span>Estimated Taxes (GST)</span>
                <span>Included in MRP</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="pt-4 border-t border-brand-espresso/10 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-espresso block">
                  Grand Total
                </span>
                <span className="text-[10px] text-brand-ink/50">INR inclusive of all charges</span>
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">
                {formatINR(summary.total)}
              </span>
            </div>

            {/* Promo Coupon Form */}
            <div className="pt-4 border-t border-brand-espresso/10 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-espresso flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-gold-600" />
                <span>Privilege Coupon Code</span>
              </label>

              {summary.appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-gold/15 border border-brand-gold/40 text-xs">
                  <div>
                    <span className="font-bold text-brand-espresso block">{summary.appliedCoupon.code}</span>
                    <span className="text-[10px] text-brand-espresso/80">{summary.appliedCoupon.description}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-brand-terracotta hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ROYAL10, FESTIVE15"
                    className="flex-1 bg-white border border-brand-espresso/20 rounded-xl px-3 py-2 text-xs text-brand-espresso placeholder-brand-ink/40 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout Action */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/checkout')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-luxury py-3.5"
            >
              Proceed to Encrypted Checkout
            </Button>

            {/* Trust Badges */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-[10px] text-brand-ink/60 border-t border-brand-espresso/8">
              <span className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold-600" />
                <span>256-Bit SSL Checkout</span>
              </span>
              <span className="flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
                <span>Atelier Authenticated</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
