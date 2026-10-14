import React, { useEffect, useState, useMemo } from 'react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { Order, Product, OrderStatus } from '../../types';
import { formatINR } from '../../utils/pricing';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { OrderDetailModal } from '../../components/storefront/OrderDetailModal';

export const AdminDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [returnsCount, setReturnsCount] = useState(0);
  const [dateFilter, setDateFilter] = useState<'all' | '30d' | '7d'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [o, p, ret] = await Promise.all([
          orderService.getAllOrders(),
          productService.getAllProducts(),
          orderService.getAllReturnRequests(),
        ]);
        setOrders(o);
        setProducts(p);
        setReturnsCount(ret.length);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadData();
  }, []);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (dateFilter === 'all') return orders;
    const now = Date.now();
    const days = dateFilter === '7d' ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
  }, [orders, dateFilter]);

  // Derived metrics
  const totalRevenue = useMemo(() => {
    return filteredOrders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((acc, ord) => acc + ord.total, 0);
  }, [filteredOrders]);

  const averageOrderValue = useMemo(() => {
    const validOrders = filteredOrders.filter((o) => o.orderStatus !== 'cancelled');
    if (validOrders.length === 0) return 0;
    return Math.round(totalRevenue / validOrders.length);
  }, [totalRevenue, filteredOrders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed')
      .length;
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.totalStock <= 5).length;
  }, [products]);

  // Derive bestsellers from order items
  const bestSellers = useMemo(() => {
    const itemCounts: Record<string, { product: Product | undefined; quantity: number }> = {};
    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        if (!itemCounts[item.productId]) {
          const matched = products.find((p) => p.id === item.productId);
          itemCounts[item.productId] = { product: matched, quantity: 0 };
        }
        itemCounts[item.productId].quantity += item.quantity;
      });
    });

    return Object.values(itemCounts)
      .filter((i) => i.product)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);
  }, [orders, products]);

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order status updated to "${newStatus.toUpperCase()}"`, 'success');
    }
  };

  const getStatusVariant = (status: Order['orderStatus']) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return 'gold';
      case 'shipped':
      case 'out_for_delivery':
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
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Executive Operations Briefing
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso mt-0.5">
            Atelier Command Center
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Real-time oversight of Varanasi looms, dispatch logistics, and client orders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date range filter */}
          <div className="flex items-center bg-white rounded-lg border border-brand-espresso/15 p-1 text-xs">
            <button
              onClick={() => setDateFilter('7d')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                dateFilter === '7d'
                  ? 'bg-brand-espresso text-brand-ivory'
                  : 'text-brand-espresso/70 hover:text-brand-espresso'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateFilter('30d')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                dateFilter === '30d'
                  ? 'bg-brand-espresso text-brand-ivory'
                  : 'text-brand-espresso/70 hover:text-brand-espresso'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                dateFilter === 'all'
                  ? 'bg-brand-espresso text-brand-ivory'
                  : 'text-brand-espresso/70 hover:text-brand-espresso'
              }`}
            >
              All Time
            </button>
          </div>

          <Link to="/admin/products">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Garment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-espresso/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Gross Sales Revenue
            </span>
            <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-brand-espresso">
              {formatINR(totalRevenue)}
            </span>
            <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
              Across {filteredOrders.length} registered orders
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-espresso/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Average Order Value
            </span>
            <div className="p-2 rounded-xl bg-brand-espresso/5 text-brand-espresso">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-brand-espresso">
              {formatINR(averageOrderValue)}
            </span>
            <p className="text-[11px] text-brand-espresso/60 font-medium mt-0.5">
              Indian couture basket size
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-espresso/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-amber-900">
              {pendingOrdersCount}
            </span>
            <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
              Awaiting atelier tailoring & packing
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-espresso/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Active Returns & Claims
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-rose-900">
              {returnsCount}
            </span>
            <p className="text-[11px] text-rose-800 font-semibold mt-0.5">
              Requires quality inspection
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-950">
                Low Inventory Warning ({lowStockCount} Garments Critically Low)
              </p>
              <p className="text-amber-800 text-[11px]">
                Several variants have reached 5 or fewer remaining units. Reorder from Varanasi & Chanderi weavers.
              </p>
            </div>
          </div>
          <Link to="/admin/inventory">
            <Button variant="outline" size="sm" className="bg-white text-amber-900 border-amber-300 hover:bg-amber-100">
              Audit Stock
            </Button>
          </Link>
        </div>
      )}

      {/* Visual Sales Chart & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-espresso">
                Seeded Sales Performance
              </h3>
              <p className="text-xs text-brand-espresso/60">
                Derived directly from active order ledger in LocalStorage
              </p>
            </div>
            <span className="text-xs font-bold text-brand-gold bg-brand-gold/15 px-2.5 py-1 rounded">
              INR Volume
            </span>
          </div>

          {/* Simple Dynamic Bar Representation */}
          <div className="space-y-3 pt-2">
            {orders.slice(0, 5).map((o) => {
              const maxOrder = Math.max(...orders.map((ord) => ord.total));
              const pct = Math.max(15, Math.round((o.total / maxOrder) * 100));
              return (
                <div key={o.id} className="space-y-1">
                  <div className="flex justify-between text-xs text-brand-espresso">
                    <span className="font-semibold font-serif">
                      #{o.orderNumber} ({o.customerName})
                    </span>
                    <span className="font-bold text-brand-gold">{formatINR(o.total)}</span>
                  </div>
                  <div className="w-full h-2 bg-brand-ivory rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-espresso rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
          <div className="border-b border-brand-espresso/10 pb-3">
            <h3 className="font-serif text-lg font-bold text-brand-espresso">
              Atelier Bestsellers
            </h3>
            <p className="text-xs text-brand-espresso/60">
              Ranked by total quantity ordered
            </p>
          </div>

          <div className="space-y-3">
            {bestSellers.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <img
                  src={item.product?.images.primary}
                  alt={item.product?.name}
                  className="w-10 h-12 object-cover rounded bg-brand-ivory shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-brand-espresso truncate font-serif">
                    {item.product?.name}
                  </h4>
                  <p className="text-[11px] text-brand-espresso/60">
                    Ordered {item.quantity} times • {formatINR(item.product?.price || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-espresso">
              Recent Orders Feed ({orders.length})
            </h3>
            <p className="text-xs text-brand-espresso/60">
              Latest patron bookings requiring inspection or carrier assignment
            </p>
          </div>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Garments</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Quick Action</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-espresso font-serif">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-espresso">{order.customerName}</p>
                    <p className="text-[11px] text-brand-espresso/60">{order.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-espresso">
                    {formatINR(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusVariant(order.orderStatus) as any} size="sm">
                      {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleQuickStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-white border border-brand-espresso/20 rounded px-2 py-1 text-xs text-brand-espresso font-semibold focus:outline-none focus:border-brand-gold"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">In Tailoring</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
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
