import React, { useState, useEffect } from 'react';
import { X, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, ReturnRequest } from '../../types';
import { formatINR } from '../../utils/pricing';
import { Button } from '../common/Button';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { modalBackdropVariants, modalSurfaceVariants } from '../../styles/motionTokens';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: (returnReq: ReturnRequest) => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { selected: boolean; quantity: number; reason: string }>
  >(() => {
    const initial: Record<string, { selected: boolean; quantity: number; reason: string }> = {};
    order.items.forEach((item) => {
      initial[item.variantId] = {
        selected: false,
        quantity: 1,
        reason: 'sizing_issue',
      };
    });
    return initial;
  });

  const [reasonCategory, setReasonCategory] = useState<ReturnRequest['reasonCategory']>('sizing_issue');
  const [comments, setComments] = useState('');
  const [agreedToCondition, setAgreedToCondition] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const toggleItem = (variantId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        selected: !prev[variantId]?.selected,
      },
    }));
  };

  const updateItemQty = (variantId: string, qty: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        quantity: qty,
      },
    }));
  };

  // Calculate estimated refund
  const estimatedRefund = order.items.reduce((acc, item) => {
    const sel = selectedItems[item.variantId];
    if (sel?.selected) {
      return acc + item.price * sel.quantity;
    }
    return acc;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const returnItems = order.items
      .filter((i) => selectedItems[i.variantId]?.selected)
      .map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: selectedItems[i.variantId].quantity,
        reason: reasonCategory,
      }));

    if (returnItems.length === 0) {
      showToast('Please select at least one garment to return.', 'error');
      return;
    }

    if (!agreedToCondition) {
      showToast('Please confirm that the garments are unworn with tags intact.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await orderService.createReturnRequest({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        items: returnItems,
        reasonCategory,
        comments,
        refundAmount: estimatedRefund,
      });

      showToast(`Return request #${created.id} submitted successfully!`, 'success');
      onSuccess(created);
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit return request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            variants={modalSurfaceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-brand-espresso/10 z-10 space-y-5"
          >
        <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-terracotta/15 flex items-center justify-center text-brand-terracotta">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-espresso">
                Initiate Complimentary Return
              </h3>
              <p className="text-xs text-brand-espresso/60">
                Order Reference: <strong>{order.orderNumber}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-espresso/50 hover:text-brand-espresso hover:bg-brand-espresso/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Garment Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-brand-espresso uppercase tracking-wider">
              1. Select Garments to Return
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto p-1">
              {order.items.map((item) => {
                const isSelected = selectedItems[item.variantId]?.selected;
                return (
                  <div
                    key={item.variantId}
                    onClick={() => toggleItem(item.variantId)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-brand-espresso/10 bg-brand-ivory/30 hover:border-brand-espresso/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Controlled by row click
                      className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded bg-brand-ivory shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-brand-espresso truncate font-serif">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-brand-espresso/60">
                        Size: {item.size} | Color: {item.colorName}
                      </p>
                      <p className="text-xs font-bold text-brand-espresso mt-0.5">
                        {formatINR(item.price)}
                      </p>
                    </div>

                    {isSelected && item.quantity > 1 && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs"
                      >
                        <span className="text-brand-espresso/70 text-[11px]">Qty:</span>
                        <select
                          value={selectedItems[item.variantId]?.quantity || 1}
                          onChange={(e) =>
                            updateItemQty(item.variantId, parseInt(e.target.value, 10))
                          }
                          className="bg-white border border-brand-espresso/20 rounded px-1.5 py-0.5 text-xs font-semibold"
                        >
                          {Array.from({ length: item.quantity }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-espresso uppercase tracking-wider">
              2. Primary Reason for Return
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as any)}
              className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
            >
              <option value="sizing_issue">Fit or Sizing Discrepancy (Need Different Size)</option>
              <option value="fabric_expectation">Fabric Texture or Color Differed from Photography</option>
              <option value="damaged">Weave Defect, Pull, or Shipping Damage</option>
              <option value="wrong_item">Incorrect Garment or Size Delivered</option>
              <option value="other">Changed My Mind</option>
            </select>
          </div>

          {/* Explanation comments */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-brand-espresso">
              Additional Atelier Feedback (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              placeholder="Tell our master tailors how we can improve this silhouette..."
              className="w-full bg-brand-ivory/40 border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Refund Breakdown */}
          {estimatedRefund > 0 && (
            <div className="p-3 bg-brand-ivory rounded-lg border border-brand-espresso/10 flex items-center justify-between text-xs">
              <span className="text-brand-espresso/80 font-medium">Estimated Refund Amount:</span>
              <span className="font-bold font-serif text-base text-brand-espresso">
                {formatINR(estimatedRefund)}
              </span>
            </div>
          )}

          {/* Terms & Condition */}
          <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/60 text-xs space-y-2">
            <div className="flex items-start gap-2 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Vastramay Return Policy:</strong> Items must be completely unworn, unwashed,
                and unaltered with all craft security tags attached in original muslin packaging. Doorstep courier pickup is complimentary.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-amber-950 font-medium text-[11px]">
              <input
                type="checkbox"
                checked={agreedToCondition}
                onChange={(e) => setAgreedToCondition(e.target.checked)}
                className="rounded border-amber-400 text-amber-700 focus:ring-amber-500"
              />
              <span>I certify that the selected garments are pristine, unworn, and have security tags intact.</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="terracotta"
              size="sm"
              isLoading={isSubmitting}
              disabled={estimatedRefund === 0}
            >
              Submit Return Request
            </Button>
          </div>
        </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
