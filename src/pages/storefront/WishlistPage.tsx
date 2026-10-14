import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/pricing';
import { Button } from '../../components/common/Button';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { CatalogBreadcrumb } from '../../components/storefront/CatalogBreadcrumb';

export const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToBag = (item: typeof wishlistItems[0]) => {
    addToCart({
      productId: item.productId,
      variantId: `v-default-${item.productId}`,
      name: item.name,
      slug: item.slug,
      image: item.image,
      size: '40 (M)',
      colorName: 'Standard Fit',
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
      stockAvailable: 10,
    });
    removeFromWishlist(item.productId);
    showToast(`Moved "${item.name}" to your shopping bag.`, 'success');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center mx-auto text-brand-terracotta">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-espresso">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-brand-ink/70 max-w-md mx-auto leading-relaxed font-light">
          Save your favorite heirloom kurtas, lehengas, and handcrafted sarees to admire or purchase later.
        </p>
        <div className="pt-2 flex flex-wrap gap-3 justify-center">
          <Link to="/men">
            <Button variant="primary" size="md">
              Explore Men's Suite
            </Button>
          </Link>
          <Link to="/women">
            <Button variant="secondary" size="md">
              Discover Women's Couture
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <CatalogBreadcrumb items={[{ label: 'Saved Pieces (Wishlist)' }]} />

      <div className="border-b border-brand-espresso/12 pb-6">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-1">
          Client Sanctuary
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-brand-espresso">
          My Saved Pieces ({wishlistItems.length})
        </h1>
        <p className="text-xs text-brand-ink/60 font-light mt-1">
          Your personal curation of festive silhouettes and celebratory couture
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl border border-brand-espresso/12 overflow-hidden shadow-subtle hover:shadow-luxury hover:border-brand-gold/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[3/4] bg-brand-ivory overflow-hidden">
                <Link to={`/product/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-brand-ink hover:text-brand-terracotta shadow-xs transition-colors"
                  aria-label={`Remove ${item.name} from wishlist`}
                  title={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <Link to={`/product/${item.slug}`}>
                  <h3 className="font-serif text-base font-medium text-brand-espresso hover:text-brand-gold-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-base font-bold text-brand-espresso">
                    {formatINR(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-brand-ink/40 line-through">
                      {formatINR(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-xs"
                onClick={() => handleMoveToBag(item)}
                leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              >
                Move to Bag
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
