import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { formatINR } from '../../utils/pricing';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Search } from 'lucide-react';
import { OrderDetailModal } from '../../components/storefront/OrderDetailModal';
import { Button } from '../../components/common/Button';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const list = await orderService.getAllOrders();
        setOrders(list);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    }
    load();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order status transitioned to "${newStatus.replace(/_/g, ' ').toUpperCase()}".`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Dispatch & Fulfillment
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Orders Ledger
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Track atelier tailoring progress, BlueDart consignments, and customer fulfillments
          </p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, patron, or garment..."
            className="w-full pl-9 pr-3 py-2 bg-brand-ivory/40 rounded-lg border border-brand-espresso/15 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-brand-espresso/60 font-semibold">Fulfillment:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-brand-ivory/50 border border-brand-espresso/15 rounded-lg px-2.5 py-1.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">In Tailoring</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-1">
            <span className="text-brand-espresso/60 font-semibold">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-brand-ivory/50 border border-brand-espresso/15 rounded-lg px-2.5 py-1.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending (COD)</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <span className="text-brand-espresso/50 font-medium ml-auto md:ml-0">
            {filteredOrders.length} Orders
          </span>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patron Details</th>
                <th className="py-3 px-4">Garments</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-espresso font-serif">
                    #{order.orderNumber}
                  </td>

                  <td className="py-3.5 px-4 text-brand-espresso/60">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-espresso">{order.customerName}</p>
                    <p className="text-[11px] text-brand-espresso/60">{order.customerEmail}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-brand-espresso">
                      {order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'}
                    </span>
                    <p className="text-[10px] text-brand-espresso/50 line-clamp-1">
                      {order.items.map((i) => i.name).join(', ')}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.paymentStatus} ({order.paymentMethod.toUpperCase()})
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-brand-espresso">
                    {formatINR(order.total)}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-white border border-brand-espresso/20 rounded-lg px-2.5 py-1 text-xs text-brand-espresso font-semibold focus:outline-none focus:border-brand-gold"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">In Tailoring</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-brand-gold font-bold hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards Alternative View */}
        <div className="md:hidden divide-y divide-brand-espresso/10 p-3 space-y-3">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-xs text-brand-espresso/60 py-4">No matching orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="pt-3 first:pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-brand-espresso">#{order.orderNumber}</span>
                  <span className="text-[10px] text-brand-espresso/60">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-brand-espresso">{order.customerName}</p>
                    <p className="text-[10px] text-brand-espresso/60">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                  <span className="font-bold text-brand-espresso font-serif text-sm">
                    {formatINR(order.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="bg-white border border-brand-espresso/20 rounded px-2 py-1 text-xs text-brand-espresso font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">In Tailoring</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="text-xs"
                  >
                    Inspect Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          onOrderUpdated={(updated) => {
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          }}
        />
      )}
    </div>
  );
};
