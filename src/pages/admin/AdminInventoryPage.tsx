import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { inventoryService, InventoryMovement } from '../../services/inventoryService';
import { Product, ProductVariant } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import {
  Boxes,
  AlertTriangle,
  Search,
  Minus,
  History,
  X,
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [activeTab, setActiveTab] = useState<'variants' | 'history'>('variants');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockLevelFilter, setStockLevelFilter] = useState<'all' | 'low' | 'out'>('all');

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState<InventoryMovement['reason']>('Received from Varanasi Weavers');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [pList, mList] = await Promise.all([
          productService.getAllProducts(),
          inventoryService.getMovementLogs(),
        ]);
        setProducts(pList);
        setMovements(mList);
      } catch (err) {
        console.error('Failed to load inventory data:', err);
      }
    }
    load();
  }, []);

  // Flatten all variants with parent product info
  const flattenedVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      product: p,
      variant: v,
    }))
  );

  const filteredVariants = flattenedVariants.filter(({ product, variant }) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.size.toLowerCase().includes(searchTerm.toLowerCase());

    if (stockLevelFilter === 'low') {
      return matchesSearch && variant.stockQuantity > 0 && variant.stockQuantity <= 5;
    }
    if (stockLevelFilter === 'out') {
      return matchesSearch && variant.stockQuantity === 0;
    }
    return matchesSearch;
  });

  const lowStockCount = flattenedVariants.filter(
    ({ variant }) => variant.stockQuantity > 0 && variant.stockQuantity <= 5
  ).length;
  const outOfStockCount = flattenedVariants.filter(({ variant }) => variant.stockQuantity === 0).length;

  const handleOpenAdjust = (p: Product, v: ProductVariant) => {
    setSelectedProduct(p);
    setSelectedVariant(v);
    setNewStock(v.stockQuantity);
    setReason('Received from Varanasi Weavers');
    setNotes('');
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedVariant) return;

    if (newStock < 0) {
      showToast('Stock quantity cannot be negative.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.adjustVariantStock({
        productId: selectedProduct.id,
        variantId: selectedVariant.id,
        newStock,
        reason,
        notes,
      });

      // Reload products and movement logs
      const [pList, mList] = await Promise.all([
        productService.getAllProducts(),
        inventoryService.getMovementLogs(),
      ]);
      setProducts(pList);
      setMovements(mList);

      showToast(`Stock updated for SKU ${selectedVariant.sku}. Audit log recorded.`, 'success');
      setSelectedProduct(null);
      setSelectedVariant(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to adjust stock.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Stock Control & Logistics
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Inventory & Audits
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Monitor real-time variant inventory levels and record verified movements
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-white rounded-lg border border-brand-espresso/15 p-1 text-xs">
          <button
            onClick={() => setActiveTab('variants')}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'variants'
                ? 'bg-brand-espresso text-brand-ivory'
                : 'text-brand-espresso/70 hover:text-brand-espresso'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Variant Stock Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-brand-espresso text-brand-ivory'
                : 'text-brand-espresso/70 hover:text-brand-espresso'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Movement Audit Trail ({movements.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-espresso/60 font-semibold uppercase">Total SKUs Tracked</span>
            <p className="font-serif text-2xl font-bold text-brand-espresso">{flattenedVariants.length}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-espresso/60 font-semibold uppercase">Low Stock SKUs (≤ 5)</span>
            <p className="font-serif text-2xl font-bold text-amber-700">{lowStockCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-espresso/60 font-semibold uppercase">Sold Out SKUs</span>
            <p className="font-serif text-2xl font-bold text-rose-700">{outOfStockCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <Minus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TAB 1: VARIANT STOCK MATRIX */}
      {activeTab === 'variants' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SKU, garment title, color, or size..."
                className="w-full pl-9 pr-3 py-2 bg-brand-ivory/40 rounded-lg border border-brand-espresso/15 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-brand-espresso/60 font-semibold">Filter:</span>
              <button
                onClick={() => setStockLevelFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  stockLevelFilter === 'all'
                    ? 'bg-brand-espresso text-brand-ivory'
                    : 'bg-white border border-brand-espresso/15 text-brand-espresso/70'
                }`}
              >
                All SKUs
              </button>
              <button
                onClick={() => setStockLevelFilter('low')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  stockLevelFilter === 'low'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-brand-espresso/15 text-amber-800'
                }`}
              >
                Low Stock (≤ 5)
              </button>
              <button
                onClick={() => setStockLevelFilter('out')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  stockLevelFilter === 'out'
                    ? 'bg-rose-700 text-white'
                    : 'bg-white border border-brand-espresso/15 text-rose-800'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* Variants Table */}
          <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4 text-right">Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-espresso/5">
                  {filteredVariants.map(({ product, variant }) => (
                    <tr key={variant.id} className="hover:bg-brand-ivory/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-espresso">
                        {variant.sku}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.images.primary}
                            alt={product.name}
                            className="w-8 h-10 object-cover rounded bg-brand-ivory border border-brand-espresso/10"
                          />
                          <div>
                            <p className="font-semibold text-brand-espresso font-serif truncate max-w-xs">
                              {product.name}
                            </p>
                            <span className="text-[10px] text-brand-espresso/50 capitalize">
                              {product.gender} • {product.categorySlug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-brand-espresso">{variant.size}</td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                          <span>{variant.colorName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {variant.stockQuantity === 0 ? (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                            Sold Out
                          </span>
                        ) : variant.stockQuantity <= 5 ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            Healthy
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-sm text-brand-espresso">
                        {variant.stockQuantity} units
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAdjust(product, variant)}
                          className="h-7 text-xs"
                        >
                          Adjust Units
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-brand-espresso/10 p-3 space-y-3">
              {filteredVariants.length === 0 ? (
                <p className="text-center text-xs text-brand-espresso/60 py-4">No matching SKUs found.</p>
              ) : (
                filteredVariants.map(({ product, variant }) => (
                  <div key={variant.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.images.primary}
                          alt={product.name}
                          className="w-10 h-12 object-cover rounded bg-brand-ivory border border-brand-espresso/10 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-brand-espresso font-serif text-xs truncate max-w-[180px]">
                            {product.name}
                          </p>
                          <span className="font-mono text-[10px] text-brand-espresso/60 block">
                            {variant.sku}
                          </span>
                          <span className="text-[10px] text-brand-espresso/50 capitalize">
                            Size: <strong className="text-brand-espresso">{variant.size}</strong> • {variant.colorName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-brand-espresso block">
                          {variant.stockQuantity} u
                        </span>
                        {variant.stockQuantity === 0 ? (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                            Out
                          </span>
                        ) : variant.stockQuantity <= 5 ? (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            Low
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Healthy
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAdjust(product, variant)}
                        className="w-full sm:w-auto h-7 text-xs justify-center"
                      >
                        Adjust Stock Units
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT MOVEMENT LOGS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-brand-espresso/10 bg-[#FAF7F2] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-brand-espresso">
                Verified Movement Ledger
              </h3>
              <p className="text-xs text-brand-espresso/60">
                Immutable audit trail of inbound weaving consignments, damages, and audit adjustments
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">SKU & Garment</th>
                  <th className="py-3 px-4">Size & Color</th>
                  <th className="py-3 px-4">Previous</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">New Balance</th>
                  <th className="py-3 px-4">Audit Reason</th>
                  <th className="py-3 px-4">Adjusted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-espresso/5">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-brand-ivory/20 transition-colors">
                    <td className="py-3 px-4 text-brand-espresso/60">
                      {formatDate(m.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-brand-espresso">{m.sku}</p>
                      <p className="text-[11px] text-brand-espresso/60 truncate max-w-xs font-serif">
                        {m.productName}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {m.size} • {m.colorName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-brand-espresso/70">
                      {m.previousStock}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={
                          m.delta > 0
                            ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'
                            : 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded'
                        }
                      >
                        {m.delta > 0 ? `+${m.delta}` : m.delta}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-brand-espresso">{m.newStock}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-brand-espresso block">{m.reason}</span>
                      {m.notes && (
                        <span className="text-[10px] text-brand-espresso/60 italic">{m.notes}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-brand-espresso/70 font-medium">{m.adjustedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedProduct && selectedVariant && (
        <div className="fixed inset-0 z-50 bg-brand-espresso/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-espresso/10 space-y-5 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brand-gold" />
                <h3 className="font-serif text-lg font-bold text-brand-espresso">
                  Adjust Inventory Stock
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                }}
                className="p-1.5 rounded-full hover:bg-brand-espresso/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div className="p-3 bg-brand-ivory rounded-xl border border-brand-espresso/10 space-y-1">
                <p className="font-serif font-bold text-sm text-brand-espresso">
                  {selectedProduct.name}
                </p>
                <p className="text-[11px] text-brand-espresso/60">
                  SKU: <span className="font-mono font-bold text-brand-espresso">{selectedVariant.sku}</span> | Size:{' '}
                  <strong>{selectedVariant.size}</strong> | Color: <strong>{selectedVariant.colorName}</strong>
                </p>
                <p className="text-[11px] text-brand-espresso font-semibold pt-1">
                  Current In-Hand Stock: <strong>{selectedVariant.stockQuantity} units</strong>
                </p>
              </div>

              <div>
                <Input
                  label="New Available Stock Quantity"
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
                  required
                />
                <span className="text-[10px] text-brand-espresso/50 mt-1 block">
                  Delta adjustment: {newStock - selectedVariant.stockQuantity > 0 ? `+` : ''}
                  {newStock - selectedVariant.stockQuantity} units
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-espresso mb-1">
                  Mandatory Audit Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
                >
                  <option value="Received from Varanasi Weavers">
                    Received from Varanasi Weavers (New Batch)
                  </option>
                  <option value="Damaged in Atelier Inspection">
                    Damaged in Atelier Inspection / Defective Zari
                  </option>
                  <option value="Physical Audit Variance">Physical Audit Stock Variance</option>
                  <option value="Customer Return Restocked">Customer Return Pristine Restock</option>
                  <option value="Manual Stock Correction">Manual Stock Reconciliation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-espresso mb-1">
                  Auditor Notes / Consignment ID (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Courier invoice #BD-9912 received in good condition"
                  className="w-full bg-brand-ivory/40 border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-brand-espresso/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedVariant(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Confirm Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
