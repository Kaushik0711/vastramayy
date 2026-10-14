import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MegaMenuData } from '../../data/navigation';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export interface MegaMenuProps {
  data: MegaMenuData;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  data,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-b border-brand-espresso/15 shadow-luxury transition-all duration-300 z-50 animate-fade-in"
      role="region"
      aria-label="Navigation mega menu"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Navigation Columns (3 cols x 2.6 spans = 8 cols) */}
          <div className="col-span-8 grid grid-cols-3 gap-8">
            {data.columns.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold-700 border-b border-brand-espresso/10 pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="group flex flex-col py-0.5 text-xs text-brand-ink/80 hover:text-brand-ink transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium group-hover:text-brand-gold-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge
                              variant={
                                item.badge === 'New'
                                  ? 'terracotta'
                                  : item.badge === 'Bestseller'
                                  ? 'gold'
                                  : 'espresso'
                              }
                              size="sm"
                              className="text-[8px] px-1.5 py-0.1"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <span className="text-[10px] text-brand-ink/50 font-light mt-0.5">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Campaign Showcase (4 cols) */}
          <div className="col-span-4 border-l border-brand-espresso/10 pl-8">
            <Link
              to={data.featuredCampaign.href}
              onClick={onClose}
              className="group block relative rounded-t-[100px] rounded-b-lg overflow-hidden border border-brand-gold/40 shadow-elevated bg-brand-espresso/5 transition-transform duration-500 hover:-translate-y-1"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={data.featuredCampaign.image}
                  alt={data.featuredCampaign.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/90 via-brand-espresso/30 to-transparent" />

                {/* Floating Handwritten Annotation */}
                {data.featuredCampaign.annotation && (
                  <div className="absolute top-4 right-4 z-10 pointer-events-none">
                    <span className="font-cursive text-2xl text-brand-gold drop-shadow-md">
                      {data.featuredCampaign.annotation}
                    </span>
                  </div>
                )}

                {/* Bottom Campaign Copy */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-brand-ivory space-y-1.5">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-brand-gold">
                    Atelier Spotlight
                  </span>
                  <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-brand-gold transition-colors">
                    {data.featuredCampaign.title}
                  </h3>
                  <p className="text-xs text-brand-ivory/80 font-light line-clamp-2">
                    {data.featuredCampaign.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-gold group-hover:translate-x-1 transition-transform">
                    <span>{data.featuredCampaign.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
