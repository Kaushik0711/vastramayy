import React, { useEffect, useState } from 'react';
import { promotionService, CouponRule } from '../../services/promotionService';
import { formatINR } from '../../utils/pricing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Tag, Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminPromotionsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponRule[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRule | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const list = await promotionService.getAllCoupons();
        setCoupons(list);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      }
    }
    load();
  }, []);

  const handleToggleActive = async (id: string) => {
    const updated = await promotionService.toggleCouponActive(id);
    setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
    showToast(`Coupon ${updated.code} is now ${updated.isActive ? 'Active' : 'Inactive'}.`, 'success');
  };

  const handleDelete = async (id: string, code: string) => {
    await promotionService.deleteCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast(`Coupon ${code} deleted.`, 'info');
  };

  const handleSave = async (data: any) => {
    const saved = await promotionService.saveCoupon(data);
    const updated = await promotionService.getAllCoupons();
    setCoupons(updated);
    setIsEditorOpen(false);
    showToast(`Coupon ${saved.code} saved successfully.`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Privilege Campaigns & Offers
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Coupons & Promotions
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Configure promotional discount codes for wedding trousseau and festive collections
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingCoupon(null);
              setIsEditorOpen(true);
            }}
          >
            Create New Coupon
          </Button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Privilege Value</th>
                <th className="py-3 px-4">Min Spend / Max Cap</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-sm bg-brand-gold/15 text-brand-espresso px-2.5 py-1 rounded border border-brand-gold/30">
                      {coupon.code}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-serif text-brand-espresso font-semibold">
                    {coupon.description}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-brand-espresso">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : formatINR(coupon.discountValue)}
                  </td>

                  <td className="py-3.5 px-4 text-brand-espresso/70">
                    <p>Min: {coupon.minOrderAmount ? formatINR(coupon.minOrderAmount) : 'None'}</p>
                    {coupon.maxDiscountAmount && (
                      <p className="text-[10px] text-brand-espresso/50">
                        Cap: {formatINR(coupon.maxDiscountAmount)}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-brand-espresso">
                    {coupon.usageCount} orders
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(coupon.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        coupon.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-brand-espresso/10 text-brand-espresso/50'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setIsEditorOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-brand-espresso/5 text-brand-espresso/50 hover:text-brand-espresso"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="p-1.5 rounded hover:bg-rose-50 text-brand-espresso/50 hover:text-brand-terracotta"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal */}
      {isEditorOpen && (
        <CouponEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          initialCoupon={editingCoupon}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// --- Sub-Component: Coupon Editor Modal ---
interface CouponEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoupon: CouponRule | null;
  onSave: (data: any) => Promise<void>;
}

const CouponEditorModal: React.FC<CouponEditorModalProps> = ({
  isOpen,
  onClose,
  initialCoupon,
  onSave,
}) => {
  const [code, setCode] = useState(initialCoupon?.code || '');
  const [description, setDescription] = useState(initialCoupon?.description || '');
  const [discountType, setDiscountType] = useState<CouponRule['discountType']>(
    initialCoupon?.discountType || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState(initialCoupon?.discountValue || 10);
  const [minOrderAmount, setMinOrderAmount] = useState(initialCoupon?.minOrderAmount || 2000);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    initialCoupon?.maxDiscountAmount || 2500
  );
  const [isActive, setIsActive] = useState(initialCoupon?.isActive ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Coupon code is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: initialCoupon?.id,
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        isActive,
        validUntil: '2026-12-31T23:59:59Z',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-espresso/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-espresso/10 space-y-4 animate-fade-in text-xs">
        <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-espresso">
              {initialCoupon ? `Edit Coupon: ${initialCoupon.code}` : 'Create Promotion Coupon'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-espresso/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Promo Code (Uppercase)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. WEDDING20"
            required
          />

          <Input
            label="Description / Privilege Message"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 20% privilege on Royal Varanasi Edit"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-espresso mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
              >
                <option value="percentage">Percentage (% OFF)</option>
                <option value="fixed">Fixed INR (₹ Flat OFF)</option>
              </select>
            </div>

            <Input
              label={discountType === 'percentage' ? 'Percentage (%)' : 'Amount (INR)'}
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(parseInt(e.target.value, 10) || 0)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Order Amount (INR)"
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(parseInt(e.target.value, 10) || 0)}
            />

            <Input
              label="Max Discount Cap (INR)"
              type="number"
              value={maxDiscountAmount}
              onChange={(e) => setMaxDiscountAmount(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
            />
            <span className="font-semibold text-brand-espresso">Active and redeemable at checkout</span>
          </label>

          <div className="flex gap-2 justify-end pt-3 border-t border-brand-espresso/10">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Coupon
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
