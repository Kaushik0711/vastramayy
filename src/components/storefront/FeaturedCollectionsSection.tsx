import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Crown } from 'lucide-react';
import { HOMEPAGE_CONFIG } from '../../data/homepageConfig';

export const FeaturedCollectionsSection: React.FC = () => {
  const { featuredCollections } = HOMEPAGE_CONFIG;

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-2">
            Curated Capsule Editions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
            Featured Collections{' '}
            <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
              The Atelier Archives
            </span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-brand-ink/70 max-w-md font-light">
          Seasonal capsules built around single-origin textile masteries — from hand-reeled wild tussars to pure gold zari Kadwa brocades.
        </p>
      </div>

      {/* 4-Card Luxury Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredCollections.map((col) => (
          <Link
            key={col.id}
            to={col.link}
            className="group relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-brand-espresso/15 shadow-subtle hover:shadow-luxury hover:border-brand-gold transition-all duration-500 flex flex-col justify-end p-6 sm:p-8 text-brand-ivory"
          >
            {/* Background Image */}
            <img
              src={col.image}
              alt={col.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Ambient Dark Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/50 to-brand-espresso/10 opacity-90 group-hover:opacity-95 transition-opacity" />

            {/* Top Tag Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold/90 text-brand-espresso text-[10px] font-bold uppercase tracking-widest shadow-xs">
                <Crown className="w-3 h-3" />
                <span>{col.tag}</span>
              </span>

              <span className="text-[11px] text-brand-ivory/80 uppercase tracking-widest font-medium bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
                {col.highlightText}
              </span>
            </div>

            {/* Content Details */}
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold block">
                {col.subtitle}
              </span>

              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-brand-ivory group-hover:text-brand-gold transition-colors">
                  {col.title}
                </h3>
                <span className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-espresso transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-ivory/80 line-clamp-2 font-light">
                {col.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
