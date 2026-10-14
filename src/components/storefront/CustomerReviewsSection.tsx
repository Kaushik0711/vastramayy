import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { HOMEPAGE_CONFIG } from '../../data/homepageConfig';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews } = HOMEPAGE_CONFIG;

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory-100/50 border-y border-brand-espresso/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-2">
            Client Atelier Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
            Celebrated by Patrons{' '}
            <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
              Across The World
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-ink/70 mt-2 font-light">
            Read verified experiences from couples, grooms, and festive hosts who chose Vastramay for their milestone celebrations.
          </p>
        </div>

        {/* 3-Card Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-7 border border-brand-espresso/12 shadow-subtle hover:shadow-luxury hover:border-brand-gold/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Star Rating & Verified Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                      <span>Verified Client</span>
                    </span>
                  )}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-brand-gold/20 absolute -top-2 -left-2 -z-0" />
                  <p className="relative z-10 text-xs sm:text-sm text-brand-ink/80 leading-relaxed font-light italic">
                    "{rev.quote}"
                  </p>
                </div>
              </div>

              {/* Author & Piece Details */}
              <div className="pt-6 mt-6 border-t border-brand-espresso/8 space-y-1">
                <p className="font-serif text-base font-semibold text-brand-ink">
                  {rev.author}
                </p>
                <p className="text-[11px] text-brand-ink/50 font-medium">
                  {rev.location} · {rev.occasion}
                </p>
                <p className="text-[11px] text-brand-gold-600 font-semibold pt-0.5">
                  Wore: {rev.productName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
