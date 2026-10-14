import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, ShieldCheck, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const StorefrontFooter: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim()) {
      setNewsletterError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(newsletterEmail.trim())) {
      setNewsletterError('Please provide a valid email format (e.g. patron@domain.com).');
      return;
    }

    setIsSubscribed(true);
    showToast('Welcome to the Royal Gazette. You will receive private atelier invites.', 'success');
  };

  return (
    <footer className="bg-brand-espresso text-brand-ivory border-t border-brand-gold/30">
      {/* 1. Value Pillars Strip */}
      <div className="border-b border-brand-espresso-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center shrink-0 text-brand-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Heirloom Craftsmanship</h4>
                <p className="text-xs text-brand-ivory/70 mt-1 font-light leading-relaxed">
                  Authentic hand-woven Varanasi brocades, Jaipur gota patti & Kanchipuram silks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center shrink-0 text-brand-gold">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Bespoke Atelier Fit</h4>
                <p className="text-xs text-brand-ivory/70 mt-1 font-light leading-relaxed">
                  Every silhouette tailored with generous 2-inch internal margins for future adjustments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center shrink-0 text-brand-gold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">10-Day Doorstep Returns</h4>
                <p className="text-xs text-brand-ivory/70 mt-1 font-light leading-relaxed">
                  Complimentary doorstep pickup across 18,000+ pincodes in India with full refunds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Introduction & Gazette */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex flex-col group">
              <span className="font-serif text-3xl font-bold tracking-[0.22em] text-white uppercase group-hover:text-brand-gold transition-colors">
                Vastramay
              </span>
              <span className="font-cursive text-base text-brand-gold -mt-1 font-normal">
                Contemporary Couture
              </span>
            </Link>

            <p className="text-xs text-brand-ivory/80 font-light leading-relaxed max-w-sm">
              Vastramay revives historic Indian textile artistry. Woven by multigenerational master weavers and tailored with contemporary precision for life’s grandest celebrations.
            </p>

            {/* Newsletter Form */}
            <div className="pt-3 max-w-sm space-y-2">
              <p className="text-xs uppercase font-bold tracking-widest text-brand-gold">
                Join the Royal Gazette
              </p>
              <p className="text-[11px] text-brand-ivory/70 font-light">
                Receive private collection invitations, festive preview drops, and couture notes.
              </p>

              {isSubscribed ? (
                <div className="p-3 bg-brand-gold/20 border border-brand-gold/50 rounded-lg flex items-center gap-2 text-xs text-brand-gold-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Thank you. Your invitation is logged in our atelier directory.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-ivory/40" />
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (newsletterError) setNewsletterError('');
                        }}
                        placeholder="patron@domain.com"
                        className="w-full bg-brand-espresso-700/80 border border-brand-gold/30 pl-9 pr-3 py-2 text-xs rounded text-white placeholder:text-brand-ivory/40 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-brand-gold text-brand-ink px-4 py-2 rounded text-xs font-semibold hover:bg-[#A88A58] transition-colors flex items-center justify-center shrink-0"
                      aria-label="Subscribe to Gazette"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {newsletterError && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{newsletterError}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Shop Men */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold">The Men's Suite</h4>
            <ul className="space-y-2 text-xs text-brand-ivory/75 font-light">
              <li><Link to="/products?category=kurtas" className="hover:text-white transition-colors">Silk Kurtas & Sets</Link></li>
              <li><Link to="/products?category=sherwanis" className="hover:text-white transition-colors">Groom Royal Sherwanis</Link></li>
              <li><Link to="/products?category=nehru-jackets" className="hover:text-white transition-colors">Raw Silk Bundis</Link></li>
              <li><Link to="/men" className="hover:text-white transition-colors">Indo-Western Bandhgalas</Link></li>
              <li><Link to="/men" className="hover:text-white transition-colors">Tailored Churidar & Breeches</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-white transition-colors">New Men's Arrivals</Link></li>
            </ul>
          </div>

          {/* Shop Women */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold">The Women's Suite</h4>
            <ul className="space-y-2 text-xs text-brand-ivory/75 font-light">
              <li><Link to="/products?category=lehengas" className="hover:text-white transition-colors">Bridal & Festive Lehengas</Link></li>
              <li><Link to="/products?category=sarees" className="hover:text-white transition-colors">Pure Banarasi Silk Sarees</Link></li>
              <li><Link to="/products?category=anarkalis" className="hover:text-white transition-colors">Floor-Sweeping Anarkalis</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors">Modern Pre-Draped Sarees</Link></li>
              <li><Link to="/women" className="hover:text-white transition-colors">Jaipur Gota Patti Sets</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-white transition-colors">New Women's Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Care & Atelier Legal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold">Client Atelier</h4>
            <ul className="space-y-2 text-xs text-brand-ivory/75 font-light">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Weaver Legacy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Atelier Concierge Hotline</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">Bespoke Sizing Guide</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Express Delivery Timelines</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">10-Day Doorstep Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
              <li><Link to="/design-system" className="text-brand-gold font-semibold hover:text-white transition-colors">Design System Showcase</Link></li>
              <li><Link to="/admin/login" className="text-brand-ivory/50 hover:text-brand-gold text-[11px] transition-colors">Staff Console Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar & Certified Badges */}
        <div className="mt-14 pt-8 border-t border-brand-espresso-700/80 flex flex-col md:flex-row items-center justify-between text-xs text-brand-ivory/60 gap-4">
          <p>© 2026 Vastramay Atelier Private Limited. Handcrafted in India. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-brand-ivory/70">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>Silk Mark Certified</span>
            </span>
            <span>•</span>
            <span>256-Bit SSL Secured</span>
            <span>•</span>
            <span>BlueDart Luxury Courier</span>
            <span>•</span>
            <span>UPI, RuPay, Visa, MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
