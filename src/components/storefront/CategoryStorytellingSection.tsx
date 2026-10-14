import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { HOMEPAGE_CONFIG, HomepageCategoryItem } from '../../data/homepageConfig';

export const CategoryStorytellingSection: React.FC = () => {
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('women');
  const { categoryStorytelling } = HOMEPAGE_CONFIG;

  const categories: HomepageCategoryItem[] =
    activeGender === 'men' ? categoryStorytelling.men : categoryStorytelling.women;

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory-100/60 border-y border-brand-espresso/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Gender Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-2">
              Architectural Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
              Shop by Category{' '}
              <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
                Atelier Chapters
              </span>
            </h2>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border border-brand-espresso/15 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setActiveGender('women')}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeGender === 'women'
                  ? 'bg-brand-espresso text-brand-gold shadow-xs'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              Women's Couture ({categoryStorytelling.women.length})
            </button>
            <button
              onClick={() => setActiveGender('men')}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeGender === 'men'
                  ? 'bg-brand-espresso text-brand-gold shadow-xs'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              Men's Suite ({categoryStorytelling.men.length})
            </button>
          </div>
        </div>

        {/* Category Cards Grid with Architectural Arch Tops */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?gender=${cat.gender}&category=${cat.slug}`}
              className="group relative aspect-[3/4.2] rounded-t-[50px] sm:rounded-t-[70px] rounded-b-xl overflow-hidden border border-brand-espresso/12 bg-brand-ivory shadow-subtle hover:shadow-luxury hover:border-brand-gold transition-all duration-500 flex flex-col justify-end p-4 sm:p-5 text-white"
            >
              {/* Category Imagery */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Ambient Shadow & Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Arch Accent Border on Hover */}
              <div className="absolute inset-2 rounded-t-[44px] sm:rounded-t-[62px] rounded-b-lg border border-brand-gold/0 group-hover:border-brand-gold/40 transition-colors pointer-events-none" />

              {/* Content Overlay */}
              <div className="relative z-10">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-1">
                  <span>{cat.tagline || `${cat.itemCount} Designs`}</span>
                  <span className="p-1 rounded-full bg-white/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-3.5 h-3.5 text-brand-gold" />
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-medium text-brand-ivory group-hover:text-brand-gold transition-colors leading-snug">
                  {cat.name}
                </h3>

                <p className="text-xs text-brand-ivory/70 line-clamp-2 mt-1 font-light opacity-90 group-hover:opacity-100 transition-opacity">
                  {cat.description}
                </p>

                <div className="mt-3 pt-2 border-t border-brand-ivory/15 flex items-center justify-between text-[11px] text-brand-gold font-medium">
                  <span>{cat.itemCount} Curations</span>
                  <span className="underline underline-offset-4 group-hover:text-white transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
