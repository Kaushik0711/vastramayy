import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import { paymentAdapter, POPULAR_INDIAN_BANKS, DEMO_TEST_CARDS } from '../../services/paymentAdapter';
import { formatINR } from '../../utils/pricing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { PaymentMethod, Address } from '../../types';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Building,
  Truck,
  ArrowRight,
  Mail,
  Phone,
  Sparkles,
  QrCode,
  Plus,
} from 'lucide-react';
import {
  INDIAN_STATES_AND_UTS,
  AddressFormData,
  validateAddress,
  lookupPincode,
} from '../../utils/addressValidation';
import { AddressModal } from '../../components/storefront/AddressModal';

type CheckoutStep = 1 | 2 | 3 | 4 | 5;

export const CheckoutPage: React.FC = () => {
  const { cartItems, summary, clearCart } = useCart();
  const { customer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<CheckoutStep>(1);

  // Contact Info
  const [email, setEmail] = useState(customer?.email || 'aarav.singhania@example.com');
  const [phone, setPhone] = useState(customer?.phone || '+91 98201 44521');

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);

  // Inline address for guest / fallback
  const [shippingAddress, setShippingAddress] = useState<AddressFormData>({
    fullName: customer ? `${customer.firstName} ${customer.lastName}` : 'Aarav Singhania',
    phone: customer?.phone || '+91 98201 44521',
    streetLine1: 'Bungalow 4, Malabar Hill',
    streetLine2: 'B.G. Kher Marg',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400006',
    country: 'India',
    type: 'home',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Delivery Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const expressSurcharge = 450; // White-glove express dispatch

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [cardNumber, setCardNumber] = useState(DEMO_TEST_CARDS[0].number);
  const [cardExpiry, setCardExpiry] = useState(DEMO_TEST_CARDS[0].expiry);
  const [cardCvv, setCardCvv] = useState(DEMO_TEST_CARDS[0].cvv);
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const list = await customerService.getAddresses();
        setSavedAddresses(list);
        const def = list.find((a) => a.isDefaultShipping) || list[0];
        if (def) {
          setSelectedAddressId(def.id);
          setShippingAddress({
            fullName: def.fullName,
            phone: def.phone,
            streetLine1: def.streetLine1,
            streetLine2: def.streetLine2,
            city: def.city,
            state: def.state,
            pincode: def.pincode,
            country: 'India',
            type: def.type,
          });
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    }
    loadAddresses();
  }, [customer]);

  // Handle empty cart
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-brand-espresso">Your bag is empty</h2>
        <p className="text-xs text-brand-espresso/60">
          Please select your desired garments before proceeding to the checkout atelier.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Browse Collections
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate dynamic financials with express shipping if chosen
  const baseShippingFee = summary.shippingFee;
  const effectiveShippingFee =
    shippingMethod === 'express' ? baseShippingFee + expressSurcharge : baseShippingFee;
  const grandTotal = summary.subtotal - summary.discount + effectiveShippingFee;

  // Validation handlers
  const validateContact = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address for tracking.', 'error');
      return false;
    }
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return false;
    }
    return true;
  };

  const validateAddressStep = () => {
    const val = validateAddress(shippingAddress);
    if (!val.isValid) {
      setAddressErrors(val.errors as Record<string, string>);
      showToast('Please correct the highlighted address fields.', 'error');
      return false;
    }
    setAddressErrors({});
    return true;
  };

  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setShippingAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      streetLine1: addr.streetLine1,
      streetLine2: addr.streetLine2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: 'India',
      type: addr.type,
    });
  };

  const handleSaveNewAddressModal = async (data: Omit<Address, 'id'>) => {
    const created = await customerService.addAddress(data);
    const updated = await customerService.getAddresses();
    setSavedAddresses(updated);
    handleSelectSavedAddress(created);
    showToast('New address saved and selected.', 'success');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateContact()) {
      setActiveStep(1);
      return;
    }

    if (!validateAddressStep()) {
      setActiveStep(2);
      return;
    }

    // COD Validation
    if (paymentMethod === 'cod') {
      const codCheck = paymentAdapter.isEligibleForCOD(grandTotal);
      if (!codCheck.eligible) {
        showToast(codCheck.reason || 'Order not eligible for COD.', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Process simulated payment
      await paymentAdapter.processSimulatedPayment({
        orderId: `ord-pending-${Date.now()}`,
        amountInRupees: grandTotal,
        paymentMethod,
        upiId,
        cardNumber,
        cardExpiry,
        cardCvv,
        bankCode: selectedBank,
      });

      // 2. Build delivery address snapshot
      const addressSnapshot: Address = {
        id: `addr-snap-${Date.now()}`,
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        streetLine1: shippingAddress.streetLine1,
        streetLine2: shippingAddress.streetLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: 'India',
        isDefaultShipping: true,
        isDefaultBilling: true,
        type: shippingAddress.type,
      };

      // 3. Create immutable order snapshot
      const createdOrder = await orderService.createOrder({
        customerId: customer?.id || 'guest-patron',
        customerName: shippingAddress.fullName,
        customerEmail: email,
        items: cartItems,
        shippingAddress: addressSnapshot,
        billingAddress: addressSnapshot,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'confirmed',
        subtotal: summary.subtotal,
        discount: summary.discount,
        shippingFee: effectiveShippingFee,
        total: grandTotal,
        currency: 'INR',
      });

      // 4. Clear shopping cart and redirect
      clearCart();
      showToast(`Order #${createdOrder.orderNumber} placed successfully!`, 'success');
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      showToast(err?.message || 'Payment processing failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header */}
      <div className="border-b border-brand-espresso/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">Atelier Checkout</h1>
          <p className="text-xs text-brand-espresso/60 uppercase tracking-wider font-semibold mt-0.5">
            Encrypted 256-Bit Order Processing • Direct Artisan Dispatch
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>SSL 256-Bit Secured Checkout</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-2 text-xs font-semibold">
        {[
          { num: 1, label: 'Contact' },
          { num: 2, label: 'Delivery' },
          { num: 3, label: 'Shipping' },
          { num: 4, label: 'Review' },
          { num: 5, label: 'Payment' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setActiveStep(s.num as CheckoutStep)}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border transition-all ${
              activeStep === s.num
                ? 'bg-brand-espresso text-brand-ivory border-brand-gold'
                : activeStep > s.num
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-brand-espresso/50 border-brand-espresso/10'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                activeStep === s.num
                  ? 'bg-brand-gold text-brand-espresso'
                  : activeStep > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-espresso/20 text-brand-espresso'
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Step Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: CONTACT INFORMATION */}
          <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-espresso">
                  Patron Contact Information
                </h3>
              </div>
              {!customer && (
                <Link to="/login" className="text-xs text-brand-gold font-bold hover:underline">
                  Sign in for faster checkout
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address for Tracking Updates"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@vastramay.com"
                leftIcon={<Mail className="w-4 h-4 text-brand-espresso/40" />}
                autoComplete="email"
                inputMode="email"
                required
              />
              <Input
                label="Mobile Phone (+91 for SMS Dispatch Notice)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 44521"
                leftIcon={<Phone className="w-4 h-4 text-brand-espresso/40" />}
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-espresso">
                  Delivery Destination
                </h3>
              </div>

              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsNewAddressModalOpen(true)}
                  className="text-xs text-brand-gold font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              )}
            </div>

            {/* Saved Addresses selector */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-espresso/70">
                  Select from Saved Addresses
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-brand-gold bg-brand-gold/10 ring-1 ring-brand-gold'
                          : 'border-brand-espresso/10 bg-brand-ivory/20 hover:border-brand-espresso/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-brand-espresso font-serif">
                          {addr.fullName}
                        </span>
                        <span className="text-[10px] bg-brand-ivory px-2 py-0.5 rounded capitalize">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-brand-espresso/70 truncate">{addr.streetLine1}</p>
                      <p className="text-brand-espresso/70">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address fields */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Recipient Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  autoComplete="name"
                  error={addressErrors.fullName}
                  required
                />
                <Input
                  label="Delivery Phone Number"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  autoComplete="tel"
                  inputMode="tel"
                  error={addressErrors.phone}
                  required
                />
              </div>

              <Input
                label="Flat / House / Suite & Building Name"
                value={shippingAddress.streetLine1}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, streetLine1: e.target.value }))
                }
                autoComplete="address-line1"
                error={addressErrors.streetLine1}
                required
              />

              <Input
                label="Street / Landmark (Optional)"
                value={shippingAddress.streetLine2}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, streetLine2: e.target.value }))
                }
                autoComplete="address-line2"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Postal PIN Code"
                  value={shippingAddress.pincode}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  onChange={(e) => {
                    const pin = e.target.value;
                    setShippingAddress((prev) => ({ ...prev, pincode: pin }));
                    if (pin.length === 6) {
                      const detected = lookupPincode(pin);
                      if (detected) {
                        setShippingAddress((prev) => ({
                          ...prev,
                          city: detected.city,
                          state: detected.state,
                        }));
                      }
                    }
                  }}
                  error={addressErrors.pincode}
                  required
                />

                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  autoComplete="address-level2"
                  error={addressErrors.city}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-brand-espresso mb-1">
                    State / UT
                  </label>
                  <select
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
                  >
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: DELIVERY METHOD */}
          <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-espresso/10 pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-serif text-lg font-bold text-brand-espresso">
                Delivery Experience
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-brand-gold bg-brand-gold/10 ring-1 ring-brand-gold'
                    : 'border-brand-espresso/10 hover:border-brand-espresso/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="font-bold text-xs text-brand-espresso font-serif">
                      Standard Pan-India Dispatch
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-espresso">
                    {baseShippingFee === 0 ? 'FREE' : formatINR(baseShippingFee)}
                  </span>
                </div>
                <p className="text-[11px] text-brand-espresso/60 mt-2">
                  Delivered in 3–5 business days via BlueDart Luxury Express. Packed in breathable muslin garment bag.
                </p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                  shippingMethod === 'express'
                    ? 'border-brand-gold bg-brand-gold/10 ring-1 ring-brand-gold'
                    : 'border-brand-espresso/10 hover:border-brand-espresso/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="font-bold text-xs text-brand-espresso font-serif flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> White-Glove Atelier Express
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-gold">
                    +{formatINR(expressSurcharge)}
                  </span>
                </div>
                <p className="text-[11px] text-brand-espresso/60 mt-2">
                  Priority 24–48 hour dispatch. Hard-shell gold-embossed keepsake box with custom cedar block.
                </p>
              </label>
            </div>
          </div>

          {/* STEP 4: PAYMENT SELECTION */}
          <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-espresso">
                  Simulated Payment Method
                </h3>
              </div>
              <span className="text-[11px] bg-brand-gold/20 text-brand-espresso px-2.5 py-0.5 rounded font-bold">
                Client Simulation
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'upi', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" /> },
                { id: 'credit_card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'net_banking', label: 'NetBanking', icon: <Building className="w-4 h-4" /> },
                { id: 'cod', label: 'Cash on Delivery', icon: <Truck className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === m.id
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-espresso font-bold ring-1 ring-brand-gold'
                      : 'border-brand-espresso/10 text-brand-espresso/70 hover:border-brand-espresso/30'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-espresso/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-espresso">
                    Enter Virtual Payment Address (VPA)
                  </label>
                  <span className="text-[10px] text-brand-gold font-semibold">GPay, PhonePe, Paytm</span>
                </div>
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  leftIcon={<QrCode className="w-4 h-4 text-brand-espresso/40" />}
                />
                <div className="flex gap-2">
                  {['@okhdfcbank', '@oksbi', '@paytm', '@ybl'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setUpiId(`aarav${h}`)}
                      className="text-[11px] px-2 py-1 bg-white rounded border border-brand-espresso/15 text-brand-espresso/70 hover:border-brand-gold"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-espresso/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-espresso">Demo Test Card Fill</span>
                  <div className="flex gap-1.5">
                    {DEMO_TEST_CARDS.map((c) => (
                      <button
                        key={c.brand}
                        type="button"
                        onClick={() => {
                          setCardNumber(c.number);
                          setCardExpiry(c.expiry);
                          setCardCvv(c.cvv);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-white border border-brand-espresso/20 text-brand-espresso font-semibold hover:border-brand-gold"
                      >
                        {c.brand}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="6075 1234 5678 9010"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Expiry (MM/YY)"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                  />
                  <Input
                    label="CVV"
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>
            )}

            {/* NetBanking Bank Selection */}
            {paymentMethod === 'net_banking' && (
              <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-espresso/10 space-y-3">
                <span className="text-xs font-bold text-brand-espresso">
                  Select Scheduled Indian Bank
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POPULAR_INDIAN_BANKS.map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => setSelectedBank(b.code)}
                      className={`p-2 rounded-lg border text-xs text-center flex flex-col items-center gap-1 transition-all ${
                        selectedBank === b.code
                          ? 'border-brand-gold bg-brand-gold/15 font-bold text-brand-espresso'
                          : 'border-brand-espresso/10 bg-white text-brand-espresso/70'
                      }`}
                    >
                      <span className="text-base">{b.logo}</span>
                      <span className="text-[11px] truncate w-full">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash on Delivery Notice */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Cash on Delivery Verification</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  A verification code will be sent to your mobile phone before dispatch. Please keep
                  exact cash or UPI QR scan ready at the time of delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-5 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-brand-espresso border-b border-brand-espresso/10 pb-3">
              Order Summary ({summary.totalItems} Pieces)
            </h3>

            {/* Garments Preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-brand-espresso/5">
              {cartItems.map((item) => (
                <div key={item.variantId} className="flex gap-3 pt-2 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-18 object-cover rounded bg-brand-ivory shrink-0 border border-brand-espresso/5"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-brand-espresso truncate font-serif">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-brand-espresso/60">
                      Size: {item.size} • Color: {item.colorName}
                    </p>
                    <p className="text-xs font-bold text-brand-espresso mt-1">
                      {formatINR(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 text-xs text-brand-espresso/70 pt-2 border-t border-brand-espresso/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-espresso">
                  {formatINR(summary.subtotal)}
                </span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Atelier Privilege ({summary.appliedCoupon?.code})</span>
                  <span>-{formatINR(summary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'express' ? 'Express White-Glove' : 'Standard'})</span>
                <span>
                  {effectiveShippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    formatINR(effectiveShippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed border-brand-espresso/15 pt-2 text-base font-bold text-brand-espresso">
                <span>Total Amount</span>
                <span className="text-brand-gold font-serif text-xl">
                  {formatINR(grandTotal)}
                </span>
              </div>
              <p className="text-[10px] text-brand-espresso/50 text-right italic">
                Inclusive of all Indian taxes & GST
              </p>
            </div>

            {/* Trust and Guarantee Tag */}
            <div className="p-3 bg-brand-ivory/60 rounded-xl border border-brand-espresso/5 text-[11px] text-brand-espresso/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-brand-espresso">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>The Vastramay Patron Promise</span>
              </div>
              <p className="leading-snug">
                100% Silk Mark certified handlooms. 2-inch internal alteration margins on all stitched ensembles.
              </p>
            </div>

            {/* Place Order CTA */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full shadow-lg"
              onClick={handlePlaceOrder}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Confirm & Place Order ({formatINR(grandTotal)})
            </Button>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {isNewAddressModalOpen && (
        <AddressModal
          isOpen={isNewAddressModalOpen}
          onClose={() => setIsNewAddressModalOpen(false)}
          onSave={handleSaveNewAddressModal}
          title="Add New Delivery Address for Checkout"
        />
      )}
    </div>
  );
};
