import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { Button } from '../common/Button';
import { HOMEPAGE_CONFIG } from '../../data/homepageConfig';

export const SeasonalCampaignBanner: React.FC = () => {
  const { seasonalCampaign } = HOMEPAGE_CONFIG;

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-brand-espresso text-brand-ivory border border-brand-gold/40 shadow-2xl">
        {/* Background Layer with Dark Ambient Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={seasonalCampaign.image}
            alt={seasonalCampaign.headline}
            className="w-full h-full object-cover object-center md:object-[center_35%] opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-espresso via-brand-espresso/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-transparent to-brand-espresso/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-14 md:p-20 max-w-3xl space-y-6 sm:space-y-8">
          {/* Campaign Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5 text-brand-gold" />
            <span>{seasonalCampaign.badge}</span>
          </div>

          {/* Heading with Cursive Accent */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-brand-ivory leading-[1.12]">
            {seasonalCampaign.headline} <br />
            <span className="font-cursive text-5xl sm:text-6xl md:text-7xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
              {seasonalCampaign.cursiveAccent}
            </span>
          </h2>

          {/* Editorial Paragraph */}
          <p className="text-sm sm:text-base md:text-lg text-brand-ivory/80 font-light leading-relaxed">
            {seasonalCampaign.description}
          </p>

          {/* Consultation Note */}
          <div className="p-4 rounded-xl bg-black/40 border border-brand-gold/20 backdrop-blur-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />
            <p className="text-xs sm:text-sm text-brand-ivory/90 font-light">
              {seasonalCampaign.atelierConsultationNote}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link to={seasonalCampaign.ctaLink}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold"
              >
                {seasonalCampaign.ctaText}
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="secondary"
                size="lg"
                className="border-brand-gold/40 text-brand-ivory hover:text-white"
              >
                Explore The Silk Route Narrative
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
