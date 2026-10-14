import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product, ProductVariant } from '../../types';
import { formatINR } from '../../utils/pricing';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/storefront/ProductCard';
import { CatalogBreadcrumb } from '../../components/storefront/CatalogBreadcrumb';
import { ProductImageGallery } from '../../components/storefront/ProductImageGallery';
import { SizeGuideModal } from '../../components/storefront/SizeGuideModal';
import { PincodeLookup } from '../../components/storefront/PincodeLookup';
import { ProductReviewSection } from '../../components/storefront/ProductReviewSection';
import { RecentlyViewedRail } from '../../components/storefront/RecentlyViewedRail';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Ruler,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customTailoring, setCustomTailoring] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await productService.getProductBySlug(slug);
        if (isMounted && item) {
          setProduct(item);

          // Default color from first variant
          const firstColor = item.variants[0]?.colorName || '';
          setSelectedColor(firstColor);

          // Do NOT pre-select size by default if multiple sizes exist, to enforce explicit selection
          if (item.variants.length === 1) {
            setSelectedVariant(item.variants[0]);
          } else {
            setSelectedVariant(null);
          }

          setQuantity(1);
          setSizeError(false);

          // Related items from same category
          const related = await productService.filterProducts({ categorySlug: item.categorySlug });
          setRelatedProducts(related.filter((p) => p.id !== item.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Unique colors from variants
  const colorOptions = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Map(
        product.variants.map((v) => [v.colorName, { name: v.colorName, hex: v.colorHex }])
      ).values()
    );
  }, [product]);

  // Variants filtered by selected color
  const colorVariants = useMemo(() => {
    if (!product) return [];
    if (!selectedColor) return product.variants;
    return product.variants.filter((v) => v.colorName === selectedColor);
  }, [product, selectedColor]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-4 w-48 bg-brand-ivory-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-brand-ivory-200 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-6 w-1/3 bg-brand-ivory-200 rounded" />
            <div className="h-10 w-3/4 bg-brand-ivory-200 rounded" />
            <div className="h-8 w-1/4 bg-brand-ivory-200 rounded" />
            <div className="h-32 bg-brand-ivory-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-brand-espresso">
          Heirloom Garment Not Found
        </h2>
        <p className="text-sm text-brand-ink/60">
          This piece may have been archived or retired from our active atelier collection.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Return to Atelier Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const activeStock = selectedVariant ? selectedVariant.stockQuantity : product.totalStock;

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    // If current selected variant does not match new color, reset size selection
    if (selectedVariant && selectedVariant.colorName !== colorName) {
      setSelectedVariant(null);
    }
  };

  const handleSizeSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSizeError(false);
    // Adjust quantity if exceeds variant stock
    if (quantity > variant.stockQuantity) {
      setQuantity(Math.max(1, variant.stockQuantity));
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setSizeError(true);
      showToast('Please select an available size to add to your bag.', 'warning');
      return;
    }

    if (selectedVariant.stockQuantity <= 0) {
      showToast('This size is currently sold out in our atelier.', 'error');
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      name: `${product.name} ${customTailoring ? '(Bespoke Adjusted)' : ''}`,
      slug: product.slug,
      image: product.images.thumbnail || product.images.primary,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      quantity,
      stockAvailable: selectedVariant.stockQuantity,
    });

    showToast(`Added ${quantity} × ${product.name} (${selectedVariant.size}) to your bag.`, 'success');
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      setSizeError(true);
      showToast('Please select an available size to proceed with Buy Now.', 'warning');
      return;
    }

    if (selectedVariant.stockQuantity <= 0) {
      showToast('This size is currently sold out.', 'error');
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      name: `${product.name} ${customTailoring ? '(Bespoke Adjusted)' : ''}`,
      slug: product.slug,
      image: product.images.thumbnail || product.images.primary,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      quantity,
      stockAvailable: selectedVariant.stockQuantity,
    });

    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images.thumbnail || product.images.primary,
      price: product.price,
      originalPrice: product.originalPrice,
      inStock: product.totalStock > 0,
    });
    showToast(
      added ? `Added "${product.name}" to your wishlist.` : `Removed "${product.name}" from wishlist.`,
      added ? 'success' : 'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Breadcrumbs */}
      <CatalogBreadcrumb
        items={[
          {
            label: product.gender === 'men' ? "Men's Suite" : "Women's Couture",
            link: `/${product.gender}`,
          },
          {
            label: product.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            link: `/products?category=${product.categorySlug}`,
          },
          { label: product.name },
        ]}
      />

      {/* 2. Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery with Hover Magnify & Lightbox */}
        <div className="lg:col-span-6 sticky top-28">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            isNewArrival={product.isNewArrival}
            isBestseller={product.isBestseller}
            discountPercentage={product.discountPercentage}
          />
        </div>

        {/* Right Column: Garment Details & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-brand-gold-600 font-bold uppercase tracking-widest mb-2">
              <span>{product.gender} · {product.categorySlug.replace(/-/g, ' ')}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-brand-espresso font-semibold">{product.ratingAverage}</span>
                <span className="text-brand-ink/50">({product.reviewCount} Reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-espresso leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-brand-ink/75 mt-2 font-light leading-relaxed">
              {product.tagline}
            </p>

            {/* Dynamic SKU Display */}
            <div className="mt-2 text-[11px] text-brand-ink/50 font-mono">
              SKU: <span className="text-brand-espresso font-semibold">{selectedVariant ? selectedVariant.sku : 'Select Size for SKU'}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-brand-espresso">
              {formatINR(activePrice)}
            </span>
            {activeOriginalPrice && (
              <span className="text-lg text-brand-ink/40 line-through">
                {formatINR(activeOriginalPrice)}
              </span>
            )}
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-xs font-bold text-brand-terracotta uppercase tracking-wider bg-brand-terracotta/10 px-2 py-0.5 rounded">
                Save {product.discountPercentage}%
              </span>
            )}
            <span className="text-[11px] text-brand-ink/50 ml-auto font-medium">
              MRP Inclusive of all taxes
            </span>
          </div>

          <div className="border-t border-brand-espresso/10" />

          {/* Color Selection with Swatches */}
          {colorOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-brand-espresso">
                  Tone & Color:{' '}
                  <span className="font-normal text-brand-ink/70 capitalize">{selectedColor}</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {colorOptions.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <motion.button
                      key={c.name}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorChange(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-brand-espresso bg-brand-espresso text-brand-gold shadow-xs'
                          : 'border-brand-espresso/20 bg-white text-brand-ink/80 hover:border-brand-gold'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs flex items-center justify-center"
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                      <span>{c.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Variant Selector with Size Guide Trigger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-bold uppercase tracking-wider ${
                  sizeError ? 'text-rose-700' : 'text-brand-espresso'
                }`}
              >
                Select Size & Fit {sizeError && <span className="text-rose-600 font-semibold">*Required</span>}
              </label>

              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-brand-gold-600 hover:text-brand-gold-700 font-semibold underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide & Margins</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {colorVariants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const isOutOfStock = v.stockQuantity <= 0;

                return (
                  <motion.button
                    key={v.id}
                    type="button"
                    disabled={isOutOfStock}
                    whileTap={isOutOfStock ? undefined : { scale: 0.95 }}
                    onClick={() => handleSizeSelect(v)}
                    className={`py-3 px-2 rounded-xl border text-xs font-semibold uppercase tracking-wider flex flex-col items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-espresso bg-brand-espresso text-brand-gold shadow-md'
                        : isOutOfStock
                        ? 'border-brand-espresso/10 bg-brand-ivory-200 text-brand-ink/30 cursor-not-allowed line-through'
                        : 'border-brand-espresso/20 bg-white text-brand-espresso hover:border-brand-gold'
                    }`}
                  >
                    <span>{v.size}</span>
                    <span
                      className={`text-[10px] font-normal mt-0.5 ${
                        isSelected
                          ? 'text-brand-gold/80'
                          : isOutOfStock
                          ? 'text-brand-ink/30'
                          : v.stockQuantity <= 3
                          ? 'text-amber-700 font-semibold'
                          : 'text-brand-ink/50'
                      }`}
                    >
                      {isOutOfStock ? 'Sold Out' : v.stockQuantity <= 3 ? `Only ${v.stockQuantity} Left` : 'In Stock'}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {sizeError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-700 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please select an available size before adding to bag.</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-espresso">
              Quantity:
            </span>
            <div className="flex items-center border border-brand-espresso/20 rounded-lg bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="p-2 text-brand-espresso hover:bg-brand-ivory-200 disabled:opacity-40 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-xs font-semibold text-brand-espresso">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(activeStock || 10, q + 1))}
                disabled={Boolean(selectedVariant && quantity >= selectedVariant.stockQuantity)}
                className="p-2 text-brand-espresso hover:bg-brand-ivory-200 disabled:opacity-40 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bespoke Tailoring Add-on Option */}
          {product.isCustomTailorable && (
            <div className="p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customTailoring}
                  onChange={(e) => setCustomTailoring(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-brand-espresso focus:ring-brand-gold border-brand-espresso/30 accent-brand-espresso"
                />
                <div className="text-xs">
                  <span className="font-bold text-brand-espresso flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
                    Complimentary Atelier Custom Fit Calibration
                  </span>
                  <p className="text-brand-ink/75 mt-0.5 leading-relaxed font-light">
                    Our master tailor will consult with you after order placement to calibrate chest, sleeve, and hemline specifications before dispatch.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Action CTAs: Add to Bag, Buy Now, Wishlist */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-luxury py-3.5"
              onClick={handleAddToCart}
              leftIcon={<ShoppingBag className="w-5 h-5 text-brand-gold" />}
            >
              Add to Bag
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="flex-1 bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold py-3.5"
              onClick={handleBuyNow}
              leftIcon={<Zap className="w-5 h-5 text-brand-espresso fill-current" />}
            >
              Buy Now
            </Button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={handleWishlistToggle}
              className={`p-3.5 rounded-xl border transition-colors duration-300 shrink-0 ${
                isFavorited
                  ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-md'
                  : 'bg-white border-brand-espresso/20 text-brand-espresso hover:text-brand-terracotta hover:border-brand-terracotta/40'
              }`}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <motion.div
                animate={isFavorited ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </motion.div>
            </motion.button>
          </div>

          {/* Pincode Estimator */}
          <PincodeLookup />

          {/* Value Props */}
          <div className="pt-4 border-t border-brand-espresso/10 grid grid-cols-3 gap-4 text-center text-xs text-brand-espresso">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-gold-600" />
              <span className="font-medium">Express Dispatch (48h)</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-brand-gold-600" />
              <span className="font-medium">10-Day Doorstep Pickup</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-gold-600" />
              <span className="font-medium">Silk Mark Certified</span>
            </div>
          </div>

          {/* Garment Details & Specifications Accordion */}
          <div className="pt-6 border-t border-brand-espresso/10 space-y-4">
            <h3 className="font-serif text-lg font-medium text-brand-espresso">
              Garment Specifications & Craft
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-xs">
              <div>
                <span className="text-brand-ink/50 block font-medium">Fabric:</span>
                <span className="font-semibold text-brand-espresso">{product.specifications.fabric}</span>
              </div>
              <div>
                <span className="text-brand-ink/50 block font-medium">Fit Profile:</span>
                <span className="font-semibold text-brand-espresso">{product.specifications.fit}</span>
              </div>
              <div>
                <span className="text-brand-ink/50 block font-medium">Weave:</span>
                <span className="font-semibold text-brand-espresso">
                  {product.specifications.weave || 'Traditional Handloom'}
                </span>
              </div>
              <div>
                <span className="text-brand-ink/50 block font-medium">Embroidery:</span>
                <span className="font-semibold text-brand-espresso">
                  {product.specifications.embroideryType || 'Plain Classic'}
                </span>
              </div>
              <div>
                <span className="text-brand-ink/50 block font-medium">Occasion:</span>
                <span className="font-semibold text-brand-espresso">
                  {product.specifications.occasion.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-brand-ink/50 block font-medium">Lining:</span>
                <span className="font-semibold text-brand-espresso">
                  {product.specifications.lining || 'Pure Mulmul Cotton Facing'}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-brand-ink/80 space-y-1">
              <span className="font-bold text-brand-espresso block">Care Dossier:</span>
              <ul className="list-disc list-inside space-y-0.5 font-light">
                {product.specifications.careInstructions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Related Curations */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-brand-espresso/12">
          <div className="mb-8">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-1">
              Complementary Ensembles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-brand-espresso">
              You May Also Admire
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Recently Viewed Products */}
      <RecentlyViewedRail currentProductId={product.id} />

      {/* 5. Client Reviews Section */}
      <ProductReviewSection
        productName={product.name}
        ratingAverage={product.ratingAverage}
        reviewCount={product.reviewCount}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        defaultGender={product.gender}
      />
    </div>
  );
};
