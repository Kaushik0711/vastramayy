import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { PriceDisplay } from '../common/PriceDisplay';

export const ProductCard: React.FC<{ product: Product; variantShape?: 'standard' | 'arch' }> = ({
  product,
  variantShape = 'standard',
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    if (!defaultVariant || defaultVariant.stockQuantity <= 0) {
      showToast('This item is currently sold out in all sizes.', 'error');
      return;
    }
    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      slug: product.slug,
      image: product.images.thumbnail || product.images.primary,
      size: defaultVariant.size,
      colorName: defaultVariant.colorName,
      price: defaultVariant.price,
      originalPrice: defaultVariant.originalPrice,
      quantity: 1,
      stockAvailable: defaultVariant.stockQuantity,
    });
    showToast(`Added ${product.name} (${defaultVariant.size}) to your bag.`, 'success');
  };

  // Derive artisan fabric annotation
  const fabricAnnotation = product.specifications.weave || product.tags[1] || 'Handcrafted Silk';

  // Extract unique colors from variants
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex, { name: v.colorName, hex: v.colorHex }])).values()
  );

  const alternateImage = product.images.gallery && product.images.gallery.length > 1 && product.images.gallery[1] !== product.images.primary
    ? product.images.gallery[1]
    : null;

  return (
    <div className="group relative bg-white rounded-lg border border-brand-espresso/12 overflow-hidden shadow-subtle hover:shadow-luxury hover:border-brand-gold/50 hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between">
      {/* Image Container with Badges, Wishlist & Arch */}
      <div
        className={`relative aspect-[3/4] bg-brand-ivory overflow-hidden ${
          variantShape === 'arch' ? 'rounded-t-[80px]' : ''
        }`}
      >
        <Link to={`/product/${product.slug}`} className="block w-full h-full relative">
          <img
            src={product.images.primary}
            alt={product.name}
            className={`w-full h-full object-cover object-top transition-all duration-700 ${
              alternateImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
          {alternateImage && (
            <img
              src={alternateImage}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 pointer-events-none"
              loading="lazy"
            />
          )}
        </Link>

        {/* Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/50 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <Badge variant="espresso" size="sm">
              New Arrival
            </Badge>
          )}
          {product.isBestseller && (
            <Badge variant="gold" size="sm">
              Bestseller
            </Badge>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-terracotta text-white shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button with Heart Micro-Pulse Animation */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 z-10 ${
            isFavorited
              ? 'bg-brand-terracotta text-white shadow-md'
              : 'bg-white/85 backdrop-blur-md text-brand-ink hover:text-brand-terracotta hover:bg-white shadow-xs'
          }`}
          aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <motion.div
            animate={isFavorited ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.div>
        </motion.button>

        {/* Floating Handwritten Fabric Annotation on Card */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none opacity-90 group-hover:opacity-0 transition-opacity">
          <span className="font-cursive text-xl text-brand-ivory drop-shadow-md">
            {fabricAnnotation}
          </span>
        </div>

        {/* Desktop Quick Add To Bag Hover Bar */}
        <div className="hidden md:block absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleQuickAdd}
            className="w-full bg-brand-espresso/95 backdrop-blur-md text-brand-gold hover:text-white hover:bg-brand-espresso text-xs font-semibold py-2.5 px-4 rounded shadow-lg flex items-center justify-center gap-2 border border-brand-gold/40 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
            <span>Quick Add to Bag</span>
          </motion.button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] text-brand-gold-600 font-semibold uppercase tracking-widest mb-1">
            <span>{product.gender} · {product.categorySlug.replace('-', ' ')}</span>
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-brand-ink font-medium">{product.ratingAverage}</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-brand-ink line-clamp-1 hover:text-brand-gold-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-brand-ink/60 line-clamp-1 mt-0.5 font-light">{product.tagline}</p>

          {/* Color Swatches */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {uniqueColors.map((col, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
              <span className="text-[10px] text-brand-ink/40 ml-1">
                {uniqueColors.length} {uniqueColors.length === 1 ? 'Tone' : 'Tones'}
              </span>
            </div>
          )}
        </div>

        {/* Price & Variant Chips with Mobile Quick Add */}
        <div className="pt-2 border-t border-brand-espresso/8 flex items-center justify-between">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discountPercentage={product.discountPercentage}
            size="sm"
          />

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-brand-ink/50 font-medium hidden sm:inline">
              {product.variants.length} {product.variants.length === 1 ? 'Size' : 'Sizes'}
            </span>
            {/* Mobile Touch Quick Add Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleQuickAdd}
              className="md:hidden p-2 rounded-full bg-brand-gold/15 text-brand-espresso hover:bg-brand-gold hover:text-white transition-colors flex items-center justify-center"
              aria-label={`Quick add ${product.name} to bag`}
              title="Quick Add to Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-gold-700" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
