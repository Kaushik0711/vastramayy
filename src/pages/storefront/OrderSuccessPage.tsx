import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MapPin, CreditCard, FileText, Truck, ShieldCheck } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { formatINR } from '../../utils/pricing';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      if (!orderId) return;
      try {
        const found = await orderService.getOrderById(orderId);
        if (found) {
          setOrder(found);
        }
      } catch (err) {
        console.error('Failed to load order confirmation:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const handleSimulateInvoiceDownload = () => {
    if (!order) return;
    showToast(`Downloading Tax Invoice for ${order.orderNumber}...`, 'info');
    setTimeout(() => {
      showToast(`Tax Invoice ${order.orderNumber}.pdf downloaded.`, 'success');
    }, 900);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-espresso/60 font-medium">Finalizing atelier receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-brand-espresso">Order Reference Not Found</h2>
        <p className="text-xs text-brand-espresso/60">
          The requested order confirmation reference could not be located in your local session.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Explore Collections
          </Button>
        </Link>
      </div>
    );
  }

  // Estimated delivery: 4 days from order creation
  const orderTime = new Date(order.createdAt).getTime();
  const estimatedDelivery = new Date(orderTime + 4 * 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-brand-gold/15 border-2 border-brand-gold flex items-center justify-center mx-auto text-brand-gold shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">
          Atelier Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
          Thank You, {order.customerName.split(' ')[0]}
        </h1>
        <p className="text-xs text-brand-espresso/60 max-w-md mx-auto leading-relaxed">
          Your bespoke order has been registered in the Vastramay Master Ledger. A confirmation
          notification has been dispatched to <strong>{order.customerEmail}</strong>.
        </p>
      </div>

      {/* Order Reference Card */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-espresso/10 gap-2">
          <div>
            <span className="text-xs text-brand-espresso/60 font-medium">Order Reference:</span>
            <h3 className="font-serif text-xl font-bold text-brand-espresso">
              #{order.orderNumber}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateInvoiceDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-ivory text-brand-espresso text-xs font-semibold rounded-lg border border-brand-espresso/15 hover:border-brand-espresso/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-brand-gold" />
              <span>Download Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Estimated Delivery Highlight */}
        <div className="p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-brand-gold shrink-0" />
            <div>
              <p className="font-bold text-brand-espresso">Estimated Atelier Delivery</p>
              <p className="text-brand-espresso/70 text-[11px]">
                By {formatDate(estimatedDelivery.toISOString())} via {order.carrier || 'BlueDart Luxury Express'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            On Schedule
          </span>
        </div>

        {/* Garments List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso">
            Garments in this Shipment ({order.items.length})
          </h4>
          <div className="border border-brand-espresso/10 rounded-xl divide-y divide-brand-espresso/5 overflow-hidden">
            {order.items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-4 p-3.5 bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-18 object-cover rounded bg-brand-ivory shrink-0 border border-brand-espresso/5"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-brand-espresso truncate font-serif">
                    {item.name}
                  </h5>
                  <p className="text-[11px] text-brand-espresso/60 mt-0.5">
                    Size: {item.size} • Color: {item.colorName} • Qty: {item.quantity}
                  </p>
                  <p className="text-xs font-bold text-brand-espresso mt-0.5">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Payment Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="bg-brand-ivory/50 rounded-xl p-4 border border-brand-espresso/10 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-espresso pb-1 border-b border-brand-espresso/10">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              <span>Delivery Address</span>
            </div>
            <p className="font-semibold text-brand-espresso pt-1">{order.shippingAddress.fullName}</p>
            <p className="text-brand-espresso/70">{order.shippingAddress.streetLine1}</p>
            <p className="text-brand-espresso/70">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-brand-espresso/70 pt-0.5">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="bg-brand-ivory/50 rounded-xl p-4 border border-brand-espresso/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-brand-espresso pb-1 border-b border-brand-espresso/10">
              <CreditCard className="w-3.5 h-3.5 text-brand-gold" />
              <span>Payment Details</span>
            </div>
            <div className="flex justify-between text-brand-espresso/70 pt-1">
              <span>Method:</span>
              <span className="font-semibold uppercase text-brand-espresso">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-brand-espresso/70">
              <span>Payment Status:</span>
              <span className="font-semibold text-emerald-800 uppercase">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-brand-espresso/20 pt-1.5 font-bold text-sm text-brand-espresso">
              <span>Total Amount:</span>
              <span className="text-brand-gold font-serif">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Tag */}
      <div className="p-4 bg-brand-ivory rounded-xl border border-brand-espresso/10 flex items-center justify-center gap-2 text-xs text-brand-espresso/70">
        <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
        <span>10-Day Complimentary Door-Step Returns & Atelier Adjustments Active</span>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link to="/account">
          <Button variant="primary" size="md" className="w-full sm:w-auto">
            View in My Orders
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" size="md" className="w-full sm:w-auto">
            Continue Exploring
          </Button>
        </Link>
      </div>
    </div>
  );
};
