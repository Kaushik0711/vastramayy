import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, ShieldCheck, Ruler, HeartHandshake, History } from 'lucide-react';
import { Button } from '../common/Button';
import { HOMEPAGE_CONFIG } from '../../data/homepageConfig';

export const BrandStorySection: React.FC = () => {
  const { brandStory } = HOMEPAGE_CONFIG;

  const pillarIcons = [
    <ShieldCheck key="0" className="w-5 h-5 text-brand-gold" />,
    <Ruler key="1" className="w-5 h-5 text-brand-gold" />,
    <HeartHandshake key="2" className="w-5 h-5 text-brand-gold" />,
    <History key="3" className="w-5 h-5 text-brand-gold" />,
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-brand-espresso text-brand-ivory border border-brand-gold/30 shadow-2xl p-8 sm:p-12 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              <Award className="w-4 h-4 text-brand-gold" />
              <span>{brandStory.kicker}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ivory leading-[1.15]">
              {brandStory.title}{' '}
              <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
                {brandStory.cursiveAccent}
              </span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-brand-ivory/80 leading-relaxed font-light">
              {brandStory.storyParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Master Artisan Quote Box */}
            <div className="p-5 rounded-2xl bg-black/30 border border-brand-gold/25 backdrop-blur-xs space-y-2">
              <p className="font-serif italic text-sm text-brand-ivory/90 leading-relaxed">
                {brandStory.artisanQuote}
              </p>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-gold">
                — {brandStory.artisanAuthor}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-ivory/15">
              {brandStory.pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                    {pillarIcons[idx % pillarIcons.length]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] text-brand-ivory/70 font-light mt-0.5 leading-snug">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/about">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold"
                >
                  Read The Complete Atelier Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Artisan Loom Photography with Ornamental Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-t-[120px] rounded-b-2xl overflow-hidden border border-brand-gold/50 shadow-2xl">
              <img
                src={brandStory.loomImage}
                alt="Master Artisan at Varanasi Pit Loom"
                className="w-full h-full object-cover object-center filter brightness-95 contrast-105 hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 inset-x-6 text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block">
                  Varanasi Loom Settlement
                </span>
                <p className="font-serif text-sm text-brand-ivory font-medium mt-0.5">
                  Hand-shuttled pure zari Kadwa brocading
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
