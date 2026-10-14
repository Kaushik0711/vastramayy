import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface BestsellersSectionProps {
  products: Product[];
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({ products }) => {
  const [filter, setFilter] = useState<'all' | 'men' | 'women'>('all');

  const bestsellers = products.filter((p) => p.isBestseller);
  const filteredBestsellers =
    filter === 'all'
      ? bestsellers
      : bestsellers.filter((p) => p.gender === filter);

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory-100/50 border-y border-brand-espresso/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-brand-gold-600" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600">
                Most Revered Silhouettes
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
              Best Sellers{' '}
              <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
                Celebrated Icons
              </span>
            </h2>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border border-brand-espresso/15 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-brand-espresso text-brand-gold shadow-xs'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setFilter('men')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                filter === 'men'
                  ? 'bg-brand-espresso text-brand-gold shadow-xs'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              Men's Icons
            </button>
            <button
              onClick={() => setFilter('women')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                filter === 'women'
                  ? 'bg-brand-espresso text-brand-gold shadow-xs'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              Women's Icons
            </button>
          </div>
        </div>

        {/* Product Cards Grid with Optional Architectural Arch Variant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBestsellers.slice(0, 4).map((product, idx) => (
            <div key={product.id} className="relative">
              {/* Gold Ranking Medal Pill */}
              <div className="absolute -top-3 left-6 z-20">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-espresso text-[10px] font-bold uppercase tracking-wider shadow-md border border-brand-espresso/10">
                  #{idx + 1} Atelier Favorite
                </span>
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom CTA to view all bestsellers */}
        <div className="mt-12 text-center">
          <Link
            to="/products?sort=rating"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-espresso hover:text-brand-gold-600 border-b border-brand-gold/60 pb-1 transition-colors"
          >
            <span>Browse Full Atelier Hall of Fame</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
