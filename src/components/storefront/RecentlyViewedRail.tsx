import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { ProductCard } from './ProductCard';

interface RecentlyViewedRailProps {
  currentProductId: string;
}

const RECENTLY_VIEWED_STORAGE_KEY = 'vastramay_recently_viewed';

export const RecentlyViewedRail: React.FC<RecentlyViewedRailProps> = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Record current product to recently viewed in localStorage
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const updated = [currentProductId, ...ids.filter((id) => id !== currentProductId)].slice(0, 8);
      localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(updated));

      // 2. Load the other products
      productService.getAllProducts().then((all) => {
        const matching = updated
          .filter((id) => id !== currentProductId)
          .map((id) => all.find((p) => p.id === id))
          .filter(Boolean) as Product[];

        setRecentProducts(matching.slice(0, 4));
      });
    } catch (e) {
      console.warn('Failed to update recently viewed:', e);
    }
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="pt-12 border-t border-brand-espresso/12">
      <div className="mb-8">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-1">
          Your Curation History
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-brand-espresso">
          Recently Viewed Pieces
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recentProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
