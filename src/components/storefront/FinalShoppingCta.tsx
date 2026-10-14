import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { HOMEPAGE_CONFIG } from '../../data/homepageConfig';

export const FinalShoppingCta: React.FC = () => {
  const { finalCta } = HOMEPAGE_CONFIG;

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory-100/70 border-t border-brand-espresso/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold-600 text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>{finalCta.kicker}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-brand-ink leading-[1.15]">
            {finalCta.title} <br />
            <span className="font-cursive text-5xl sm:text-6xl md:text-7xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
              {finalCta.cursiveAccent}
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-brand-ink/75 font-light leading-relaxed max-w-2xl mx-auto">
            {finalCta.subtext}
          </p>

          {/* Action Portals */}
          <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
            <Link to={finalCta.menLink}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-luxury"
              >
                Shop Men's Collection
              </Button>
            </Link>

            <Link to={finalCta.womenLink}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold"
              >
                Shop Women's Couture
              </Button>
            </Link>

            <Link to={finalCta.appointmentLink}>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Calendar className="w-4 h-4" />}
                className="border-brand-espresso/25 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold"
              >
                Book Styling Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
