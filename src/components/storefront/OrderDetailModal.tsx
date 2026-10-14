import React, { useState } from 'react';
import {
  X,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  AlertTriangle,
  RotateCcw,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../../types';
import { formatINR } from '../../utils/pricing';
import { formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { ReturnRequestModal } from './ReturnRequestModal';
import { modalBackdropVariants, modalSurfaceVariants } from '../../styles/motionTokens';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onOrderUpdated,
}) => {
  const { showToast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of event date');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(order);

  // Sync internal activeOrder when prop changes
  React.useEffect(() => {
    setActiveOrder(order);
    setShowCancelConfirm(false);
  }, [order, isOpen]);

  // Lock body scroll and handle Escape key
  React.useEffect(() => {
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

  const cancelEligibility = activeOrder
    ? orderService.canCancelOrder(activeOrder)
    : { eligible: false, reason: undefined };
  const returnEligibility = activeOrder
    ? orderService.canReturnOrder(activeOrder)
    : { eligible: false, reason: undefined, daysRemaining: 0 };

  const handleConfirmCancel = async () => {
    if (!activeOrder) return;
    setIsCancelling(true);
    try {
      const updated = await orderService.cancelOrder(activeOrder.id, cancelReason);
      setActiveOrder(updated);
      setShowCancelConfirm(false);
      showToast(`Order ${activeOrder.orderNumber} has been successfully cancelled.`, 'info');
      if (onOrderUpdated) onOrderUpdated(updated);
    } catch (err: any) {
      showToast(err?.message || 'Failed to cancel order.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSimulateInvoiceDownload = () => {
    if (!activeOrder) return;
    showToast(`Downloading Tax Invoice for ${activeOrder.orderNumber}...`, 'info');
    setTimeout(() => {
      showToast(`Tax Invoice ${activeOrder.orderNumber}.pdf downloaded.`, 'success');
    }, 900);
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return 'gold';
      case 'shipped':
      case 'out_for_delivery':
        return 'emerald';
      case 'delivered':
        return 'emerald';
      case 'cancelled':
      case 'returned':
        return 'maroon';
      default:
        return 'charcoal';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && activeOrder && (
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
            className="relative bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-brand-espresso/10 z-10 space-y-6"
          >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-espresso/10 gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-serif text-2xl font-bold text-brand-espresso">
                Order #{activeOrder.orderNumber}
              </h3>
              <Badge variant={getStatusColor(activeOrder.orderStatus) as any} size="sm">
                {activeOrder.orderStatus.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-brand-espresso/60 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-espresso/40" />
              Placed on {formatDate(activeOrder.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateInvoiceDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-ivory text-brand-espresso text-xs font-semibold rounded-lg border border-brand-espresso/15 hover:border-brand-espresso/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-brand-gold" />
              <span>Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-brand-espresso/50 hover:text-brand-espresso hover:bg-brand-espresso/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tracking & Milestone Timeline */}
        <div className="bg-brand-ivory/60 rounded-xl p-5 border border-brand-espresso/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-espresso/10 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-bold text-brand-espresso tracking-wide uppercase">
                {activeOrder.carrier || 'BlueDart Luxury Express'}
              </span>
            </div>
            {activeOrder.trackingNumber && (
              <span className="text-xs text-brand-espresso/70">
                AWB Tracking: <strong>{activeOrder.trackingNumber}</strong>
              </span>
            )}
          </div>

          {/* Timeline Steps */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-gold/30">
            {activeOrder.timeline.map((event, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    event.completed
                      ? 'bg-brand-gold border-brand-espresso text-white'
                      : 'bg-white border-brand-espresso/30'
                  }`}
                >
                  {event.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <h5
                    className={`text-xs font-semibold ${
                      event.completed ? 'text-brand-espresso font-bold' : 'text-brand-espresso/60'
                    }`}
                  >
                    {event.title}
                  </h5>
                  <p className="text-[11px] text-brand-espresso/60 leading-snug">
                    {event.description}
                  </p>
                  {event.timestamp && (
                    <span className="text-[10px] text-brand-gold-700 font-medium">
                      {formatDate(event.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garments Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso">
            Purchased Garments Snapshot ({activeOrder.items.length})
          </h4>
          <div className="border border-brand-espresso/10 rounded-xl overflow-hidden divide-y divide-brand-espresso/5">
            {activeOrder.items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-4 p-3.5 bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded bg-brand-ivory shrink-0 border border-brand-espresso/5"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-brand-espresso truncate font-serif">
                    {item.name}
                  </h5>
                  <p className="text-xs text-brand-espresso/60 mt-0.5">
                    Size: <span className="font-semibold text-brand-espresso">{item.size}</span> |
                    Color: <span className="font-semibold text-brand-espresso">{item.colorName}</span>
                  </p>
                  <p className="text-xs text-brand-espresso/50 mt-0.5">
                    Unit Price: {formatINR(item.price)} × Qty {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-espresso">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses & Financial Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Shipping Address */}
          <div className="bg-brand-ivory/40 rounded-xl p-4 border border-brand-espresso/10 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-espresso pb-1 border-b border-brand-espresso/10">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              <span>Delivery Address</span>
            </div>
            <p className="font-semibold text-brand-espresso pt-1">
              {activeOrder.shippingAddress.fullName}
            </p>
            <p className="text-brand-espresso/70">{activeOrder.shippingAddress.streetLine1}</p>
            {activeOrder.shippingAddress.streetLine2 && (
              <p className="text-brand-espresso/70">{activeOrder.shippingAddress.streetLine2}</p>
            )}
            <p className="text-brand-espresso/70">
              {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} -{' '}
              {activeOrder.shippingAddress.pincode}
            </p>
            <p className="text-brand-espresso/70 pt-0.5">
              Phone: {activeOrder.shippingAddress.phone}
            </p>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-brand-ivory/40 rounded-xl p-4 border border-brand-espresso/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-brand-espresso pb-1 border-b border-brand-espresso/10">
              <CreditCard className="w-3.5 h-3.5 text-brand-gold" />
              <span>Financial Summary</span>
            </div>
            <div className="flex justify-between text-brand-espresso/70 pt-1">
              <span>Subtotal:</span>
              <span className="font-semibold text-brand-espresso">{formatINR(activeOrder.subtotal)}</span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Atelier Discount:</span>
                <span>-{formatINR(activeOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-espresso/70">
              <span>Delivery Logistics:</span>
              <span>
                {activeOrder.shippingFee === 0 ? (
                  <span className="text-emerald-700 font-semibold">FREE</span>
                ) : (
                  formatINR(activeOrder.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-brand-espresso/20 pt-2 font-bold text-sm text-brand-espresso">
              <span>Total Paid ({activeOrder.paymentMethod.toUpperCase()}):</span>
              <span className="text-brand-gold font-serif text-base">{formatINR(activeOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Cancellation UI */}
        {showCancelConfirm && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-fade-in text-xs">
            <div className="flex items-start gap-2 text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold">Confirm Order Cancellation</h5>
                <p className="text-rose-700 mt-0.5">
                  Are you sure you wish to cancel order #{activeOrder.orderNumber}? If paid online,
                  your refund will be returned to your original payment method within 3–5 working days.
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-rose-900">Reason for cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded p-2 text-xs"
              >
                <option value="Change of event date">Change of event date or wedding schedule</option>
                <option value="Ordered incorrect size">Ordered incorrect size / re-ordering</option>
                <option value="Found alternative silhouette">Found another Vastramay ensemble</option>
                <option value="Delayed travel plans">Delayed travel / unable to accept delivery</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
              >
                Keep Order
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                isLoading={isCancelling}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-brand-espresso/10">
          <div className="text-xs text-brand-espresso/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Need alterations or bespoke help? Contact our master concierge.</span>
          </div>

          <div className="flex items-center gap-2">
            {cancelEligibility.eligible && !showCancelConfirm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(true)}
                className="text-brand-terracotta border-brand-terracotta/30 hover:border-brand-terracotta"
              >
                Cancel Order
              </Button>
            )}

            {returnEligibility.eligible && (
              <Button
                variant="terracotta"
                size="sm"
                onClick={() => setShowReturnModal(true)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Request Return ({returnEligibility.daysRemaining} days left)
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>

        {/* Return Modal */}
        {showReturnModal && (
          <ReturnRequestModal
            isOpen={showReturnModal}
            onClose={() => setShowReturnModal(false)}
            order={activeOrder}
            onSuccess={() => {
              if (activeOrder) {
                const updated: Order = {
                  ...activeOrder,
                  orderStatus: 'returned',
                };
                setActiveOrder(updated);
                if (onOrderUpdated) onOrderUpdated(updated);
              }
            }}
          />
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
