import React, { useState, useEffect } from 'react';
import { X, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Address } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import {
  INDIAN_STATES_AND_UTS,
  AddressFormData,
  validateAddress,
  lookupPincode,
} from '../../utils/addressValidation';
import { modalBackdropVariants, modalSurfaceVariants } from '../../styles/motionTokens';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: Omit<Address, 'id'>) => Promise<void>;
  initialData?: Address | null;
  title?: string;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = 'Add New Delivery Address',
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    country: 'India',
    type: 'home',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeDetected, setPincodeDetected] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        streetLine1: initialData.streetLine1 || '',
        streetLine2: initialData.streetLine2 || '',
        city: initialData.city || '',
        state: initialData.state || 'Maharashtra',
        pincode: initialData.pincode || '',
        country: 'India',
        type: initialData.type || 'home',
        isDefaultShipping: initialData.isDefaultShipping || false,
        isDefaultBilling: initialData.isDefaultBilling || false,
      });
    } else {
      setFormData({
        fullName: '',
        phone: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
        country: 'India',
        type: 'home',
        isDefaultShipping: false,
        isDefaultBilling: false,
      });
    }
    setErrors({});
    setPincodeDetected(false);
  }, [initialData, isOpen]);

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

  const handlePincodeChange = (pin: string) => {
    setFormData((prev) => ({ ...prev, pincode: pin }));
    if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: undefined }));

    if (pin.length === 6) {
      const lookup = lookupPincode(pin);
      if (lookup) {
        setFormData((prev) => ({
          ...prev,
          city: lookup.city,
          state: lookup.state,
        }));
        setPincodeDetected(true);
      }
    } else {
      setPincodeDetected(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAddress(formData);
    if (!validation.isValid) {
      setErrors(validation.errors as Record<string, string>);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        isDefaultShipping: Boolean(formData.isDefaultShipping),
        isDefaultBilling: Boolean(formData.isDefaultBilling),
      });
      onClose();
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
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-espresso/10 z-10 space-y-5"
          >
        <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-espresso">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-espresso/50 hover:text-brand-espresso hover:bg-brand-espresso/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient Full Name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              placeholder="e.g. Aarav Singhania"
              error={errors.fullName}
              required
            />
            <Input
              label="10-Digit Mobile Phone"
              value={formData.phone}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, phone: e.target.value }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="+91 98201 44521"
              error={errors.phone}
              required
            />
          </div>

          <Input
            label="Flat / House No. & Building Name"
            value={formData.streetLine1}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, streetLine1: e.target.value }));
              if (errors.streetLine1) setErrors((prev) => ({ ...prev, streetLine1: undefined }));
            }}
            placeholder="e.g. Bungalow 4, Malabar Hill"
            error={errors.streetLine1}
            required
          />

          <Input
            label="Street / Landmark (Optional)"
            value={formData.streetLine2}
            onChange={(e) => setFormData((prev) => ({ ...prev, streetLine2: e.target.value }))}
            placeholder="e.g. Near Raj Bhavan, B.G. Kher Marg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Input
                label="Postal PIN Code"
                value={formData.pincode}
                maxLength={6}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="400006"
                error={errors.pincode}
                required
              />
              {pincodeDetected && (
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Auto-detected
                </span>
              )}
            </div>

            <Input
              label="City / District"
              value={formData.city}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, city: e.target.value }));
                if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
              }}
              placeholder="Mumbai"
              error={errors.city}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-brand-espresso mb-1">
                State / UT
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              >
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-espresso mb-1.5">
              Address Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['home', 'office', 'other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                  className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                    formData.type === t
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-espresso font-bold'
                      : 'border-brand-espresso/15 text-brand-espresso/70 hover:border-brand-espresso/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-brand-espresso/10 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-brand-espresso/80">
              <input
                type="checkbox"
                checked={formData.isDefaultShipping}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isDefaultShipping: e.target.checked }))
                }
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>Set as default delivery address</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-brand-espresso/80">
              <input
                type="checkbox"
                checked={formData.isDefaultBilling}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isDefaultBilling: e.target.checked }))
                }
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>Set as default billing address</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Address
            </Button>
          </div>
        </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
