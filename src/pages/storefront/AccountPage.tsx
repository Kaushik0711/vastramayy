import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { Order, Address } from '../../types';
import { formatINR } from '../../utils/pricing';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  MapPin,
  Ruler,
  Crown,
  Heart,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Truck,
  CheckCircle2,
  Sparkles,
  LogOut,
  Loader2,
} from 'lucide-react';
import { AddressModal } from '../../components/storefront/AddressModal';
import { OrderDetailModal } from '../../components/storefront/OrderDetailModal';

type AccountTab = 'overview' | 'orders' | 'addresses' | 'measurements';

export const AccountPage: React.FC = () => {
  const { customer, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(customer?.addresses || []);
  const [loading, setLoading] = useState(true);

  // Filter state for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Bespoke Measurements state
  const [measurements, setMeasurements] = useState({
    chest: customer?.measurements?.chest || 40,
    waist: customer?.measurements?.waist || 34,
    hip: customer?.measurements?.hip || 41,
    shoulder: customer?.measurements?.shoulder || 18.5,
    kurtaLength: customer?.measurements?.kurtaLength || 42,
    sleeveLength: customer?.measurements?.sleeveLength || 25.5,
  });
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [orderList, profile] = await Promise.all([
          orderService.getAllOrders(),
          customerService.getProfile(),
        ]);
        setOrders(orderList);
        if (profile.addresses) {
          setAddresses(profile.addresses);
        }
        if (profile.measurements) {
          setMeasurements({
            chest: profile.measurements.chest || 40,
            waist: profile.measurements.waist || 34,
            hip: profile.measurements.hip || 41,
            shoulder: profile.measurements.shoulder || 18.5,
            kurtaLength: profile.measurements.kurtaLength || 42,
            sleeveLength: profile.measurements.sleeveLength || 25.5,
          });
        }
      } catch (err) {
        console.error('Failed to load account data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await logoutCustomer();
    showToast('You have been signed out of the Vastramay Atelier.', 'info');
    navigate('/');
  };

  // Address CRUD
  const handleSaveAddress = async (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      await customerService.updateAddress(editingAddress.id, data);
      showToast('Delivery address updated successfully.', 'success');
    } else {
      await customerService.addAddress(data);
      showToast('New delivery address added to your address book.', 'success');
    }
    const updated = await customerService.getAddresses();
    setAddresses(updated);
  };

  const handleDeleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      showToast('You must maintain at least one delivery address in your address book.', 'warning');
      return;
    }
    await customerService.deleteAddress(id);
    const updated = await customerService.getAddresses();
    setAddresses(updated);
    showToast('Address removed from address book.', 'info');
  };

  const handleSetDefaultShipping = async (id: string) => {
    await customerService.setDefaultAddress(id, 'shipping');
    const updated = await customerService.getAddresses();
    setAddresses(updated);
    showToast('Default delivery address updated.', 'success');
  };

  // Save Measurements
  const handleSaveMeasurements = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMeasurements(true);
    try {
      await customerService.updateMeasurements(measurements);
      showToast('Bespoke tailoring measurements saved to your atelier profile.', 'success');
    } finally {
      setIsSavingMeasurements(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.orderStatus === orderStatusFilter;
  });

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        <p className="text-xs text-brand-espresso/60 font-medium">Accessing your atelier records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Hero Card */}
      <div className="bg-gradient-to-r from-brand-espresso via-[#482D28] to-brand-espresso text-brand-ivory rounded-2xl p-6 sm:p-8 shadow-xl border border-brand-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={
                customer?.avatarUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
              }
              alt="Customer Avatar"
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-brand-gold shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-gold text-brand-espresso flex items-center justify-center shadow">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
                {customer ? `${customer.firstName} ${customer.lastName}` : 'Aarav Singhania'}
              </h1>
              <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Patron Royale
              </span>
            </div>
            <p className="text-xs text-brand-ivory/70">
              {customer?.email || 'aarav.singhania@example.com'} • {customer?.phone || '+91 98201 44521'}
            </p>
            <p className="text-[11px] text-brand-gold/80 italic flex items-center gap-1.5 pt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              Complimentary Atelier Alterations & White-Glove Support Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/wishlist">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Heart className="w-3.5 h-3.5 text-rose-400" />}
              className="bg-brand-espresso/50 text-brand-ivory border-brand-gold/40 hover:bg-brand-gold/20"
            >
              Wishlist
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            className="bg-brand-espresso/50 text-brand-ivory border-brand-espresso/40 hover:bg-white/10"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-espresso/10 gap-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3.5 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'border-brand-gold text-brand-espresso font-bold'
              : 'border-transparent text-brand-espresso/60 hover:text-brand-espresso'
          }`}
        >
          <Crown className="w-4 h-4 text-brand-gold" />
          <span>Atelier Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-brand-gold text-brand-espresso font-bold'
              : 'border-transparent text-brand-espresso/60 hover:text-brand-espresso'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3.5 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'addresses'
              ? 'border-brand-gold text-brand-espresso font-bold'
              : 'border-transparent text-brand-espresso/60 hover:text-brand-espresso'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Address Book ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('measurements')}
          className={`pb-3.5 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'measurements'
              ? 'border-brand-gold text-brand-espresso font-bold'
              : 'border-transparent text-brand-espresso/60 hover:text-brand-espresso'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Bespoke Measurements</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-brand-espresso/10 shadow-sm space-y-1">
              <span className="text-xs text-brand-espresso/60 font-medium">Total Orders</span>
              <p className="font-serif text-2xl font-bold text-brand-espresso">{orders.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-brand-espresso/10 shadow-sm space-y-1">
              <span className="text-xs text-brand-espresso/60 font-medium">Active Shipments</span>
              <p className="font-serif text-2xl font-bold text-emerald-800">
                {orders.filter((o) => o.orderStatus === 'shipped' || o.orderStatus === 'confirmed').length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-brand-espresso/10 shadow-sm space-y-1">
              <span className="text-xs text-brand-espresso/60 font-medium">Saved Addresses</span>
              <p className="font-serif text-2xl font-bold text-brand-espresso">{addresses.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-brand-espresso/10 shadow-sm space-y-1">
              <span className="text-xs text-brand-espresso/60 font-medium">Atelier Privileges</span>
              <p className="font-serif text-lg font-bold text-brand-gold">VIP Tier 1</p>
            </div>
          </div>

          {/* Recent Order Spotlight */}
          {orders.length > 0 && (
            <div className="bg-white rounded-xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-gold" />
                  <h3 className="font-serif text-lg font-bold text-brand-espresso">
                    Latest Order Spotlight
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-brand-gold font-bold hover:underline flex items-center gap-1"
                >
                  View All Orders <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={orders[0].items[0]?.image}
                    alt={orders[0].items[0]?.name}
                    className="w-16 h-20 object-cover rounded bg-brand-ivory border border-brand-espresso/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-espresso">
                        #{orders[0].orderNumber}
                      </span>
                      <Badge variant={getStatusVariant(orders[0].orderStatus) as any} size="sm">
                        {orders[0].orderStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-espresso/70 mt-1 line-clamp-1 font-serif">
                      {orders[0].items[0]?.name}{' '}
                      {orders[0].items.length > 1 && `+ ${orders[0].items.length - 1} more`}
                    </p>
                    <p className="text-xs text-brand-espresso/50 mt-0.5">
                      Placed on {formatDate(orders[0].createdAt)} • Total: {formatINR(orders[0].total)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => setSelectedOrder(orders[0])}
                  >
                    Track Shipment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Concierge Assistance */}
          <div className="p-6 bg-brand-ivory rounded-xl border border-brand-espresso/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-base font-bold text-brand-espresso">
                Personal Atelier Concierge & Custom Sizing
              </h4>
              <p className="text-xs text-brand-espresso/70 max-w-xl">
                Have questions regarding bridal trousseau styling, fabric swatches, or door-step alterations?
                Our master couturiers are available Monday through Saturday.
              </p>
            </div>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                Contact Concierge
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          {/* Order Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'processing', label: 'In Tailoring' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'returned', label: 'Returned' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  orderStatusFilter === f.id
                    ? 'bg-brand-espresso text-brand-ivory'
                    : 'bg-white border border-brand-espresso/15 text-brand-espresso/70 hover:border-brand-espresso/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-espresso/10 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-espresso">
                No orders match your filter
              </h3>
              <p className="text-xs text-brand-espresso/60 max-w-xs mx-auto">
                Explore our festive ensembles and handcrafted kurtas to begin your bespoke journey.
              </p>
              <Link to="/products">
                <Button variant="primary" size="sm">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-brand-espresso/10 p-5 shadow-sm space-y-4 hover:border-brand-gold/40 transition-all"
                  >
                    {/* Order Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-espresso/10 gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-brand-espresso">
                          #{order.orderNumber}
                        </span>
                        <Badge variant={getStatusVariant(order.orderStatus) as any} size="sm">
                          {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-brand-espresso/60 text-[11px]">
                        <span>Placed: {formatDate(order.createdAt)}</span>
                        <span>•</span>
                        <span>
                          Total: <strong className="text-brand-espresso">{formatINR(order.total)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Garments Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.variantId}
                          className="flex items-center gap-3 p-2 rounded-lg bg-brand-ivory/30 border border-brand-espresso/5"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-14 object-cover rounded bg-brand-ivory shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-brand-espresso truncate font-serif">
                              {item.name}
                            </h5>
                            <p className="text-[11px] text-brand-espresso/60">
                              Size: {item.size} • Qty {item.quantity}
                            </p>
                            <p className="text-xs font-bold text-brand-espresso mt-0.5">
                              {formatINR(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-brand-espresso/5 gap-3">
                      <div className="text-xs text-brand-espresso/60 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-brand-gold" />
                        <span>
                          Carrier: <strong>{order.carrier || 'BlueDart Luxury Express'}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details & Tracking
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: ADDRESS BOOK */}
      {activeTab === 'addresses' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-espresso">
                Saved Delivery Addresses
              </h3>
              <p className="text-xs text-brand-espresso/60">
                Manage your residential, office, and celebration venue addresses
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}
            >
              Add New Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-xl p-5 border shadow-sm space-y-3 transition-all ${
                  addr.isDefaultShipping
                    ? 'border-brand-gold ring-1 ring-brand-gold/30'
                    : 'border-brand-espresso/10 hover:border-brand-espresso/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-espresso font-serif">
                      {addr.fullName}
                    </span>
                    <span className="text-[10px] bg-brand-ivory text-brand-espresso/70 px-2 py-0.5 rounded capitalize font-medium">
                      {addr.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingAddress(addr);
                        setIsAddressModalOpen(true);
                      }}
                      className="p-1.5 text-brand-espresso/50 hover:text-brand-espresso rounded hover:bg-brand-espresso/5 transition-colors"
                      aria-label="Edit address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-brand-espresso/50 hover:text-brand-terracotta rounded hover:bg-brand-espresso/5 transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-brand-espresso/70 space-y-0.5 leading-relaxed">
                  <p>{addr.streetLine1}</p>
                  {addr.streetLine2 && <p>{addr.streetLine2}</p>}
                  <p>
                    {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                  </p>
                  <p className="pt-1 text-brand-espresso font-medium">Phone: {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-brand-espresso/5 flex items-center justify-between text-xs">
                  {addr.isDefaultShipping ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Default Shipping Address
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefaultShipping(addr.id)}
                      className="text-brand-gold hover:underline font-semibold text-[11px]"
                    >
                      Set as Default Shipping
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: BESPOKE MEASUREMENTS */}
      {activeTab === 'measurements' && (
        <div className="bg-white rounded-xl border border-brand-espresso/10 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-brand-gold" />
              <h3 className="font-serif text-2xl font-bold text-brand-espresso">
                Bespoke Tailoring Profile
              </h3>
            </div>
            <p className="text-xs text-brand-espresso/60 mt-1 max-w-xl">
              Save your body measurements in inches. When you request bespoke tailoring, our master
              couturiers craft your sherwanis, bandhgalas, and kurtas to these exact proportions with a
              2-inch internal margin guarantee.
            </p>
          </div>

          <form onSubmit={handleSaveMeasurements} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Chest / Bust (Inches)"
                type="number"
                step="0.5"
                value={measurements.chest}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, chest: parseFloat(e.target.value) || 0 }))
                }
                required
              />
              <Input
                label="Waist Circumference (Inches)"
                type="number"
                step="0.5"
                value={measurements.waist}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, waist: parseFloat(e.target.value) || 0 }))
                }
                required
              />
              <Input
                label="Hip Circumference (Inches)"
                type="number"
                step="0.5"
                value={measurements.hip}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, hip: parseFloat(e.target.value) || 0 }))
                }
                required
              />
              <Input
                label="Shoulder Width (Inches)"
                type="number"
                step="0.5"
                value={measurements.shoulder}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, shoulder: parseFloat(e.target.value) || 0 }))
                }
                required
              />
              <Input
                label="Standard Kurta Length (Inches)"
                type="number"
                step="0.5"
                value={measurements.kurtaLength}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, kurtaLength: parseFloat(e.target.value) || 0 }))
                }
                required
              />
              <Input
                label="Sleeve Length (Inches)"
                type="number"
                step="0.5"
                value={measurements.sleeveLength}
                onChange={(e) =>
                  setMeasurements((prev) => ({ ...prev, sleeveLength: parseFloat(e.target.value) || 0 }))
                }
                required
              />
            </div>

            <div className="p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-xs space-y-1">
              <span className="font-bold text-brand-espresso flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                The Vastramay 2-Inch Margin Guarantee
              </span>
              <p className="text-brand-espresso/70 leading-relaxed">
                All customized garments are crafted with two inches of internal pure silk/cotton seam
                allowances, ensuring easy adjustments by any local tailor without affecting the silhouette drape.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isSavingMeasurements}>
                Save Measurements
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleSaveAddress}
          initialData={editingAddress}
          title={editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        />
      )}

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
