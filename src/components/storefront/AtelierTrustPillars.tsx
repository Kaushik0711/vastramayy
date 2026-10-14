import React from 'react';
import { Sparkles, Ruler, Truck, ShieldCheck } from 'lucide-react';

export const AtelierTrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Pure Handloom Silks',
      description: 'Silk Mark certified Mulberry, Chanderi, and Raw Tussar blends directly from historic loom clusters.',
    },
    {
      icon: <Ruler className="w-5 h-5" />,
      title: '2-Inch Bespoke Margins',
      description: 'Built-in generous seam allowances engineered for easy lifetime tailoring as your body evolves.',
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Express Doorstep Dispatch',
      description: 'Complimentary insured shipping across India on orders over ₹3,000. Worldwide atelier delivery.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: '10-Day Doorstep Returns',
      description: 'Hassle-free complimentary pickup with dedicated concierge support and immediate store credit.',
    },
  ];

  return (
    <section className="bg-brand-ivory-100/70 border-y border-brand-espresso/8 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center shrink-0 text-brand-gold-600">
                {pillar.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-ink uppercase tracking-wider">
                  {pillar.title}
                </h4>
                <p className="text-xs text-brand-ink/70 mt-1 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
