import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category, ProductVariant } from '../../types';
import { formatINR } from '../../utils/pricing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Trash2,
  Search,
  Edit2,
  Copy,
  ExternalLink,
  Package,
  X,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [prodList, catList] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load products in admin:', err);
      }
    }
    load();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesCategory = categoryFilter === 'all' || p.categorySlug === categoryFilter;

    return matchesSearch && matchesGender && matchesCategory;
  });

  // Handle Delete
  const handleConfirmDelete = async (id: string, name: string) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setIsDeletingId(null);
    showToast(`Removed "${name}" from atelier catalog.`, 'info');
  };

  // Handle Duplicate
  const handleDuplicate = async (product: Product) => {
    const copyId = `prod-${Date.now()}`;
    const copySlug = `${product.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;
    const duplicated: Product = {
      ...product,
      id: copyId,
      name: `${product.name} (Copy)`,
      slug: copySlug,
      variants: product.variants.map((v) => ({
        ...v,
        id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sku: `${v.sku}-CP`,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await productService.saveProduct(duplicated);
    const updated = await productService.getAllProducts();
    setProducts(updated);
    showToast(`Duplicated "${product.name}" as a new garment.`, 'success');
  };

  // Handle Save from Editor
  const handleSaveProduct = async (product: Product) => {
    await productService.saveProduct(product);
    const updated = await productService.getAllProducts();
    setProducts(updated);
    setIsEditorOpen(false);
    showToast(`Garment "${product.name}" saved to atelier catalog.`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Inventory & SKUs
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">Garment Catalog</h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Manage product titles, variant matrices, fabric specifications, and stock limits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingProduct(null);
              setIsEditorOpen(true);
            }}
          >
            Create New Garment
          </Button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, slug, or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-brand-ivory/40 rounded-lg border border-brand-espresso/15 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1">
            <span className="text-brand-espresso/60 font-semibold">Department:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="bg-brand-ivory/50 border border-brand-espresso/15 rounded-lg px-2.5 py-1.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
            >
              <option value="all">All Departments</option>
              <option value="men">Men's Ensembles</option>
              <option value="women">Women's Couture</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-brand-espresso/60 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-brand-ivory/50 border border-brand-espresso/15 rounded-lg px-2.5 py-1.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({c.gender})
                </option>
              ))}
            </select>
          </div>

          <span className="text-brand-espresso/50 font-medium ml-auto md:ml-0">
            {filteredProducts.length} Garments
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Base SKU</th>
                <th className="py-3 px-4">Department & Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Total Stock</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images.primary}
                        alt={p.name}
                        className="w-12 h-14 object-cover rounded bg-brand-ivory shrink-0 border border-brand-espresso/10"
                      />
                      <div>
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="font-bold text-brand-espresso font-serif hover:text-brand-gold flex items-center gap-1"
                        >
                          {p.name} <ExternalLink className="w-3 h-3 text-brand-espresso/40" />
                        </Link>
                        <p className="text-[11px] text-brand-espresso/60 line-clamp-1">{p.tagline}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {p.featured && (
                            <span className="text-[9px] bg-brand-gold/20 text-brand-espresso px-1.5 py-0.2 rounded font-bold">
                              Featured
                            </span>
                          )}
                          {p.isBestseller && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-brand-espresso font-semibold">
                    {p.variants[0]?.sku || 'VM-PROD-000'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="capitalize font-semibold text-brand-espresso">{p.gender}</span>
                    <p className="text-[11px] text-brand-espresso/60 capitalize">
                      {p.categorySlug.replace(/-/g, ' ')}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-brand-espresso">{formatINR(p.price)}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-brand-espresso/40 line-through block">
                        {formatINR(p.originalPrice)}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        p.totalStock <= 5
                          ? 'bg-rose-100 text-rose-800'
                          : p.totalStock <= 15
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.totalStock} units
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      {p.variants.slice(0, 3).map((v) => (
                        <span
                          key={v.id}
                          className="px-1.5 py-0.5 bg-brand-ivory text-brand-espresso rounded text-[10px] font-semibold"
                        >
                          {v.size}
                        </span>
                      ))}
                      {p.variants.length > 3 && (
                        <span className="text-[10px] text-brand-espresso/50 font-bold">
                          +{p.variants.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsEditorOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-brand-espresso/5 text-brand-espresso/60 hover:text-brand-espresso"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 rounded hover:bg-brand-espresso/5 text-brand-espresso/60 hover:text-brand-gold"
                        title="Duplicate Product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setIsDeletingId(p.id)}
                        className="p-1.5 rounded hover:bg-rose-50 text-brand-espresso/60 hover:text-brand-terracotta"
                        title="Delete Product"
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

        {/* Mobile Cards Alternative View */}
        <div className="md:hidden divide-y divide-brand-espresso/10 p-3 space-y-3">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-xs text-brand-espresso/60 py-4">No matching garments found.</p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 space-y-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={p.images.primary}
                    alt={p.name}
                    className="w-14 h-16 object-cover rounded bg-brand-ivory shrink-0 border border-brand-espresso/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={`/product/${p.slug}`}
                        target="_blank"
                        className="font-bold text-brand-espresso font-serif hover:text-brand-gold text-xs truncate flex items-center gap-1"
                      >
                        {p.name} <ExternalLink className="w-2.5 h-2.5 text-brand-espresso/40 shrink-0" />
                      </Link>
                      <span className="font-bold text-brand-espresso text-xs shrink-0">
                        {formatINR(p.price)}
                      </span>
                    </div>

                    <p className="text-[10px] text-brand-espresso/60 capitalize mt-0.5">
                      {p.gender} • {p.categorySlug.replace(/-/g, ' ')}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.totalStock <= 5
                            ? 'bg-rose-100 text-rose-800'
                            : p.totalStock <= 15
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.totalStock} in stock
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditorOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-brand-espresso/5 hover:bg-brand-espresso/10 text-brand-espresso text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => setIsDeletingId(p.id)}
                          className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-brand-espresso/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-brand-espresso/10 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Permanent Deletion</span>
            </div>
            <p className="text-brand-espresso/70 leading-relaxed">
              Are you sure you want to permanently remove this garment from the atelier catalog? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeletingId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const target = products.find((p) => p.id === isDeletingId);
                  if (target) handleConfirmDelete(target.id, target.name);
                }}
              >
                Delete Garment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rich Product Editor Modal */}
      {isEditorOpen && (
        <ProductEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          initialProduct={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

// --- Product Editor Modal Sub-Component ---
interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct: Product | null;
  categories: Category[];
  onSave: (product: Product) => Promise<void>;
}

const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  categories,
  onSave,
}) => {
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [gender, setGender] = useState<Product['gender']>(initialProduct?.gender || 'men');
  const [categorySlug, setCategorySlug] = useState(
    initialProduct?.categorySlug || categories[0]?.slug || 'sherwanis'
  );
  const [price, setPrice] = useState(initialProduct?.price || 12999);
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.originalPrice || 17999);
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.images.primary ||
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
  );

  // Variant Matrix
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants || [
      {
        id: 'v-01',
        sku: 'VM-SHR-001-CR-38',
        size: '38',
        colorName: 'Royal Crimson',
        colorHex: '#873E36',
        stockQuantity: 5,
        price: 12999,
        originalPrice: 17999,
      },
      {
        id: 'v-02',
        sku: 'VM-SHR-001-CR-40',
        size: '40',
        colorName: 'Royal Crimson',
        colorHex: '#873E36',
        stockQuantity: 8,
        price: 12999,
        originalPrice: 17999,
      },
      {
        id: 'v-03',
        sku: 'VM-SHR-001-CR-42',
        size: '42',
        colorName: 'Royal Crimson',
        colorHex: '#873E36',
        stockQuantity: 6,
        price: 12999,
        originalPrice: 17999,
      },
    ]
  );

  // Flags
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [isBestseller, setIsBestseller] = useState(initialProduct?.isBestseller || false);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(
    initialProduct?.isNewArrival ?? true
  );
  const [isCustomTailorable, setIsCustomTailorable] = useState(
    initialProduct?.isCustomTailorable ?? true
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialProduct) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const addVariantRow = () => {
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      sku: `VM-VAR-${variants.length + 1}`,
      size: '40',
      colorName: 'Standard',
      colorHex: '#B99B69',
      stockQuantity: 10,
      price: price,
      originalPrice: originalPrice,
    };
    setVariants((prev) => [...prev, newV]);
  };

  const removeVariantRow = (id: string) => {
    if (variants.length <= 1) {
      showToast('Garment must have at least one variant.', 'warning');
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof ProductVariant, val: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Garment title is required.', 'error');
      return;
    }
    if (!slug.trim()) {
      showToast('URL slug is required.', 'error');
      return;
    }
    if (price <= 0) {
      showToast('Price must be greater than 0 INR.', 'error');
      return;
    }

    // Check duplicate SKUs in variant matrix
    const skus = variants.map((v) => v.sku.trim().toUpperCase());
    const uniqueSkus = new Set(skus);
    if (uniqueSkus.size !== skus.length) {
      showToast('Duplicate SKUs detected in the variant matrix.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalStock = variants.reduce((acc, v) => acc + (v.stockQuantity || 0), 0);

      const savedProduct: Product = {
        id: initialProduct?.id || `prod-${Date.now()}`,
        name,
        slug,
        tagline: tagline || 'Handcrafted Indian Festive Couture',
        description: description || 'Artisanal ensemble crafted with traditional weaving techniques.',
        gender,
        categorySlug,
        price,
        originalPrice,
        discountPercentage:
          originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0,
        featured,
        isNewArrival,
        isBestseller,
        isCustomTailorable,
        tags: ['Atelier', 'Handloom', gender],
        specifications: initialProduct?.specifications || {
          fabric: 'Pure Silk & Zari Weave',
          fit: 'Structured Slim',
          careInstructions: ['Dry clean only', 'Store in breathable muslin cover'],
          occasion: ['Wedding', 'Festive Reception'],
        },
        ratingAverage: initialProduct?.ratingAverage || 4.9,
        reviewCount: initialProduct?.reviewCount || 1,
        images: {
          primary: imageUrl,
          gallery: initialProduct?.images?.gallery || [imageUrl],
          thumbnail: imageUrl,
        },
        subcategorySlug: initialProduct?.subcategorySlug || categorySlug,
        variants,
        totalStock,
        createdAt: initialProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(savedProduct);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-espresso/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-brand-espresso/10 animate-fade-in space-y-6">
        <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-espresso">
                {initialProduct ? `Edit Garment: ${initialProduct.name}` : 'Create New Garment'}
              </h3>
              <p className="text-xs text-brand-espresso/60">
                Configure garment attributes, pricing, and variant matrix
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso border-b border-brand-espresso/10 pb-1">
              1. General Garment Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Garment Title"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Royal Banarasi Brocade Sherwani"
                required
              />
              <Input
                label="URL Slug (Stable)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="royal-banarasi-brocade-sherwani"
                required
              />
            </div>

            <Input
              label="Editorial Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Pure Mulberry Silk with Handwoven Antique Gold Zari"
            />

            <div>
              <label className="block text-xs font-semibold text-brand-espresso mb-1">
                Product Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-brand-ivory/40 border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-espresso mb-1">
                  Department
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
                >
                  <option value="men">Men's Apparel</option>
                  <option value="women">Women's Couture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-espresso mb-1">
                  Primary Category
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} ({c.gender})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Product Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          </div>

          {/* Pricing Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso border-b border-brand-espresso/10 pb-1">
              2. Base Pricing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Selling Price (INR)"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                required
              />
              <Input
                label="Compare-at Original MRP (INR)"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>

          {/* Variant Matrix Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-espresso">
                3. Variant Matrix (SKU, Size, Color, Stock)
              </h4>
              <button
                type="button"
                onClick={addVariantRow}
                className="text-xs text-brand-gold font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant Row
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-brand-ivory/40 border border-brand-espresso/10 text-xs"
                >
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                      placeholder="SKU"
                      className="w-full bg-white border border-brand-espresso/20 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <select
                      value={v.size}
                      onChange={(e) => updateVariant(v.id, 'size', e.target.value)}
                      className="w-full bg-white border border-brand-espresso/20 rounded px-2 py-1 text-xs"
                    >
                      {['36', '38', '40', '42', '44', '46', 'Free Size'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      value={v.colorName}
                      onChange={(e) => updateVariant(v.id, 'colorName', e.target.value)}
                      placeholder="Color Name"
                      className="w-full bg-white border border-brand-espresso/20 rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div className="col-span-1">
                    <input
                      type="color"
                      value={v.colorHex}
                      onChange={(e) => updateVariant(v.id, 'colorHex', e.target.value)}
                      className="w-8 h-7 rounded border border-brand-espresso/20 cursor-pointer"
                      title="Pick Color"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={v.stockQuantity}
                      onChange={(e) =>
                        updateVariant(v.id, 'stockQuantity', parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="Stock"
                      className="w-full bg-white border border-brand-espresso/20 rounded px-2 py-1 text-xs font-bold"
                    />
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeVariantRow(v.id)}
                      className="p-1 text-brand-espresso/40 hover:text-brand-terracotta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility & Flags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-brand-espresso/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>Featured Spotlight</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>Atelier Bestseller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomTailorable}
                onChange={(e) => setIsCustomTailorable(e.target.checked)}
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>2-Inch Tailorable</span>
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-brand-espresso/10">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Garment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
