import React from 'react';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { Category, ProductGender } from '../../types';

interface DepartmentHeroProps {
  gender?: ProductGender | 'all';
  category?: Category;
  totalCount: number;
  categories: Category[];
  selectedCategorySlug?: string;
  onSelectCategory?: (slug: string | undefined) => void;
}

export const DepartmentHero: React.FC<DepartmentHeroProps> = ({
  gender,
  category,
  totalCount,
  categories,
  selectedCategorySlug,
  onSelectCategory,
}) => {
  const isMen = gender === 'men';
  const isWomen = gender === 'women';

  // Fallback title / imagery based on context
  let title = 'The Royal Collection';
  let cursiveAccent = 'Atelier Masterpieces';
  let tagline = 'Handcrafted Heirlooms Woven in Varanasi, Chanderi, and Jaipur';
  let bgImage = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85';

  if (category) {
    title = category.name;
    cursiveAccent = category.tagline || 'Curated Silhouettes';
    tagline = category.description;
    bgImage = category.heroBannerImage || category.image;
  } else if (isMen) {
    title = "Men's Sartorial Suite";
    cursiveAccent = 'Regal Poise & Tailoring';
    tagline =
      'From 24kt-dipped Kadwa brocade sherwanis to breathable Chanderi kurtas and bespoke Gurkha trousers.';
    bgImage = 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=2000&q=85';
  } else if (isWomen) {
    title = "Women's Couture Atelier";
    cursiveAccent = 'Noor & Heirloom Drapes';
    tagline =
      'Flared micro-velvet kalidar lehengas, pure Kanjivaram Korvai heirlooms, and contemporary Banarasi gowns.';
    bgImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85';
  }

  // Relevant subcategories or categories
  const filterPills = category
    ? category.subcategories.map((s) => ({ slug: s.slug, name: s.name, count: s.itemCount }))
    : categories
        .filter((c) => (gender && gender !== 'all' ? c.gender === gender : true))
        .map((c) => ({ slug: c.slug, name: c.name, count: c.itemCount }));

  return (
    <div className="relative rounded-3xl overflow-hidden bg-brand-espresso text-brand-ivory border border-brand-gold/30 shadow-luxury mb-8">
      {/* Background Hero Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover object-center md:object-[center_30%] opacity-35 filter brightness-90 scale-102 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-espresso via-brand-espresso/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-transparent to-brand-espresso/40" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-4xl space-y-4">
        {/* Top Department Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-xs">
          <Crown className="w-3.5 h-3.5 text-brand-gold" />
          <span>
            {isMen ? "Men's Department" : isWomen ? "Women's Department" : 'Vastramay Curated'} ·{' '}
            {totalCount} Designs
          </span>
        </div>

        {/* Title & Cursive Subtitle */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-brand-ivory leading-[1.15]">
          {title} <br />
          <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
            {cursiveAccent}
          </span>
        </h1>

        {/* Tagline Description */}
        <p className="text-xs sm:text-sm md:text-base text-brand-ivory/80 font-light leading-relaxed max-w-2xl">
          {tagline}
        </p>

        {/* Quick Filter Pill Rail */}
        {filterPills.length > 0 && (
          <div className="pt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-widest text-brand-gold/70 font-semibold mr-1">
              Explore:
            </span>
            {onSelectCategory ? (
              <>
                <button
                  onClick={() => onSelectCategory(undefined)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    !selectedCategorySlug
                      ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold shadow-xs'
                      : 'bg-black/30 text-brand-ivory/80 border-white/10 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  All ({totalCount})
                </button>
                {filterPills.map((pill) => {
                  const isSelected = selectedCategorySlug === pill.slug;
                  return (
                    <button
                      key={pill.slug}
                      onClick={() => onSelectCategory(isSelected ? undefined : pill.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                        isSelected
                          ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold shadow-xs'
                          : 'bg-black/30 text-brand-ivory/80 border-white/10 hover:border-brand-gold hover:text-brand-gold'
                      }`}
                    >
                      <span>{pill.name}</span>
                      {pill.count && <span className="text-[10px] opacity-70 ml-1">({pill.count})</span>}
                    </button>
                  );
                })}
              </>
            ) : (
              filterPills.map((pill) => (
                <Link
                  key={pill.slug}
                  to={`/products?category=${pill.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/30 text-brand-ivory/80 border border-white/10 hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  {pill.name}
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
