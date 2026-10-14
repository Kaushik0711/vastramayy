import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Ruler, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../common/Button';
import { InteractiveTiltCard } from '../common/InteractiveTiltCard';
import { HOMEPAGE_CONFIG } from '../../data/homepageConfig';
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
} from '../../styles/motionTokens';

export const HeroBanner: React.FC = () => {
  const { hero } = HOMEPAGE_CONFIG;
  const prefersReducedMotion = useReducedMotion();

  const iconMap = [
    <ShieldCheck key="0" className="w-4 h-4 text-brand-gold" />,
    <Ruler key="1" className="w-4 h-4 text-brand-gold" />,
    <Clock key="2" className="w-4 h-4 text-brand-gold" />,
    <Sparkles key="3" className="w-4 h-4 text-brand-gold" />,
  ];

  return (
    <section className="relative overflow-hidden bg-brand-espresso text-brand-ivory border-b border-brand-gold/20">
      {/* Background Hero Layer with Ambient Reveal */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={hero.heroImage}
          alt="Vastramay Festive Atelier"
          loading="eager"
          decoding="sync"
          initial={prefersReducedMotion ? { opacity: 0.35 } : { scale: 1.08, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 0.35 } : { scale: 1.02, opacity: 0.35 }}
          transition={{ duration: 1.2, ease: MOTION_EASINGS.luxury }}
          className="w-full h-full object-cover object-center md:object-[center_25%] filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-espresso via-brand-espresso/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-transparent to-brand-espresso/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Royal Atelier Badge */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATIONS.deliberate, ease: MOTION_EASINGS.luxury }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{hero.badge}</span>
            </motion.div>

            {/* Main Editorial Title */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATIONS.editorial, delay: 0.1, ease: MOTION_EASINGS.luxury }}
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-brand-ivory leading-[1.12]">
                {hero.headline} <br />
                <span className="font-cursive text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
                  {hero.cursiveAccent}
                </span>
              </h1>
            </motion.div>

            {/* Brand Statement */}
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATIONS.deliberate, delay: 0.2, ease: MOTION_EASINGS.luxury }}
              className="text-sm sm:text-base md:text-lg text-brand-ivory/80 font-light leading-relaxed max-w-xl"
            >
              {hero.statement}
            </motion.p>

            {/* Shopping Entry Points & Campaign CTA */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_DURATIONS.deliberate, delay: 0.3, ease: MOTION_EASINGS.luxury }}
              className="pt-2 flex flex-wrap gap-4 items-center"
            >
              <Link to={hero.primaryCta.link}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold hover:scale-102 active:scale-98 transition-transform"
                >
                  {hero.primaryCta.label}
                </Button>
              </Link>
              <Link to={hero.secondaryCta.link}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-brand-gold/40 text-brand-ivory hover:text-white hover:border-brand-gold bg-brand-espresso/60 backdrop-blur-xs hover:scale-102 active:scale-98 transition-transform"
                >
                  {hero.secondaryCta.label}
                </Button>
              </Link>
              <Link
                to={hero.campaignCta.link}
                className="text-xs uppercase tracking-widest font-semibold text-brand-gold hover:text-white underline underline-offset-8 transition-colors ml-1"
              >
                {hero.campaignCta.label} →
              </Link>
            </motion.div>

            {/* Key Atelier Stats Rail */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: MOTION_DURATIONS.deliberate, delay: 0.45 }}
              className="pt-8 border-t border-brand-ivory/15 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl"
            >
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{iconMap[idx % iconMap.length]}</div>
                  <div>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-brand-gold leading-none">
                      {stat.value}
                    </p>
                    <p className="text-brand-ivory/70 text-[10px] sm:text-[11px] uppercase tracking-wider mt-1 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Layered Editorial Fashion Card with Jharokha Arch & 3D Tilt */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: MOTION_DURATIONS.editorial, delay: 0.25, ease: MOTION_EASINGS.luxury }}
              className="relative mx-auto max-w-sm"
            >
              {/* Outer decorative gold frame with subtle parallax rotation */}
              <div className="absolute -inset-3 rounded-t-[140px] rounded-b-2xl border border-brand-gold/30 pointer-events-none transform rotate-1 transition-transform duration-700 hover:rotate-2" />

              {/* Jharokha Arch Framing Card with 3D Tilt */}
              <InteractiveTiltCard maxTilt={3.5} perspective={1100} glareOpacity={0.2}>
                <div className="relative aspect-[3/4.2] rounded-t-[130px] rounded-b-xl overflow-hidden border border-brand-gold/50 shadow-2xl bg-brand-espresso/90 group">
                  <img
                    src={hero.secondaryHeroImage}
                    alt="Vastramay Haute Couture Look"
                    loading="eager"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso via-transparent to-transparent opacity-85" />

                  <div className="absolute bottom-5 inset-x-5 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold block">
                      Signature Wedding Suite
                    </span>
                    <h3 className="font-serif text-lg font-medium text-brand-ivory mt-0.5">
                      Padmavati Crimson Zari Bridal Lehenga
                    </h3>
                    <Link
                      to="/product/padmavati-crimson-zari-bridal-lehenga"
                      className="inline-flex items-center gap-1 text-xs text-brand-gold font-semibold uppercase tracking-wider mt-2 hover:underline"
                    >
                      <span>View Piece Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </InteractiveTiltCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
