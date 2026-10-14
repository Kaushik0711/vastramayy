import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface NewArrivalsRailProps {
  products: Product[];
  loading?: boolean;
}

export const NewArrivalsRail: React.FC<NewArrivalsRailProps> = ({ products, loading = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const newArrivals = products.filter((p) => p.isNewArrival);
  const displayProducts = newArrivals.length > 0 ? newArrivals : products.slice(0, 8);

  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header with Left/Right Scroll Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-2">
            Fresh Loom Creations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
            New Arrivals{' '}
            <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
              The Autumn Edit
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-ink hover:text-brand-gold-600 border-b border-brand-gold/60 pb-0.5 transition-colors"
          >
            <span>Explore All New In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border border-brand-espresso/20 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold transition-colors shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border border-brand-espresso/20 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold transition-colors shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rail Container */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-96 bg-brand-ivory-200 rounded-lg" />
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-brand-gold/30 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[310px] md:w-[320px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
