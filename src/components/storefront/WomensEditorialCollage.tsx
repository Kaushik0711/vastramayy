import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Button } from '../common/Button';

interface WomensEditorialCollageProps {
  products: Product[];
}

export const WomensEditorialCollage: React.FC<WomensEditorialCollageProps> = ({ products }) => {
  const womenProducts = products.filter((p) => p.gender === 'women');
  const heroProduct = womenProducts.find((p) => p.slug.includes('lehenga')) || womenProducts[0];
  const sideProducts = womenProducts.filter((p) => p.id !== heroProduct?.id).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory-50 border-t border-brand-espresso/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-2">
              Haute Couture & Heritage Drapes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
              The Women’s Edit{' '}
              <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
                Noor & Grace
              </span>
            </h2>
          </div>

          <Link
            to="/products?gender=women"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-ink hover:text-brand-gold-600 border-b border-brand-gold/60 pb-0.5 transition-colors self-start md:self-auto"
          >
            <span>Explore All Women's Couture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Magazine Collage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: 3 Companion Product Cards in staggered responsive grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sideProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          {/* Right Side: Large Editorial Highlight Showcase with Jharokha Arch styling */}
          {heroProduct && (
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-brand-espresso text-brand-ivory border border-brand-gold/30 shadow-luxury p-6 sm:p-8 flex flex-col justify-between">
              {/* Background ambient image */}
              <div className="relative aspect-[4/5] rounded-t-[100px] rounded-b-xl overflow-hidden mb-6 border border-brand-gold/40 shadow-inner">
                <img
                  src={heroProduct.images.primary}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/90 text-brand-espresso text-[10px] font-bold uppercase tracking-widest shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Couture Spotlight</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                  <span className="font-cursive text-3xl text-brand-gold drop-shadow-md">
                    Jaipur Gota Patti
                  </span>
                </div>
              </div>

              {/* Product Info & Direct Action */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-brand-gold font-semibold uppercase tracking-widest">
                  <span>Silk Micro-Velvet Ensemble</span>
                  <span>₹{heroProduct.price.toLocaleString('en-IN')}</span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-brand-ivory leading-snug">
                  {heroProduct.name}
                </h3>

                <p className="text-xs sm:text-sm text-brand-ivory/80 font-light leading-relaxed">
                  {heroProduct.description}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link to={`/product/${heroProduct.slug}`} className="flex-1">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold"
                    >
                      View Couture Details
                    </Button>
                  </Link>
                  <Link to="/products?gender=women&category=lehengas">
                    <Button
                      variant="secondary"
                      size="md"
                      className="border-brand-gold/40 text-brand-ivory hover:text-white"
                    >
                      All Lehengas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
