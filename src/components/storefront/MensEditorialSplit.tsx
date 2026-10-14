import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Scissors } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Button } from '../common/Button';

interface MensEditorialSplitProps {
  products: Product[];
}

export const MensEditorialSplit: React.FC<MensEditorialSplitProps> = ({ products }) => {
  const menProducts = products.filter((p) => p.gender === 'men').slice(0, 4);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Tagline */}
      <div className="mb-10 max-w-2xl">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-2">
          Sartorial Distinction
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
          The Men’s Edit{' '}
          <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
            Regal Poise
          </span>
        </h2>
        <p className="text-sm text-brand-ink/70 mt-2 font-light">
          From heavy Banarasi kadwa brocades to lightweight Maheshwari silks, discover menswear tailored for ceremonies that demand architectural elegance.
        </p>
      </div>

      {/* Editorial Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Full-Height Magazine Campaign Banner */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-brand-espresso text-brand-ivory border border-brand-espresso/15 shadow-luxury flex flex-col justify-between min-h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80"
            alt="Men's Festive Campaign"
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-brand-espresso/50 to-transparent" />

          {/* Top Pill Badges */}
          <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-espresso/80 backdrop-blur-md text-[10px] uppercase tracking-widest text-brand-gold font-bold border border-brand-gold/30">
              <Scissors className="w-3 h-3 text-brand-gold" />
              <span>Bespoke Tailoring</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] text-brand-gold uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Silk Mark</span>
            </span>
          </div>

          {/* Bottom Editorial Copy & CTA */}
          <div className="relative z-10 p-6 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
              The Groom & Royal Guest
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-brand-ivory">
              Woven in Varanasi, Sculpted for the Modern Connoisseur.
            </h3>
            <p className="text-xs sm:text-sm text-brand-ivory/80 leading-relaxed font-light">
              Structured shoulder pads, internal phone compartments, and a generous 2-inch side margin make each piece a lifetime companion.
            </p>
            <div className="pt-2">
              <Link to="/products?gender=men">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold"
                >
                  Explore Men's Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: 2-Column Curated Product Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
