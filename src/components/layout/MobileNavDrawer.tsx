import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronDown, Heart, User, Shield } from 'lucide-react';
import { MEN_MEGA_MENU, WOMEN_MEGA_MENU } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<'men' | 'women' | 'collections' | null>('men');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const { customer, admin } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Prevent background scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      onClose();
      setMobileSearchQuery('');
    }
  };

  const toggleSection = (section: 'men' | 'women' | 'collections') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm bg-brand-ivory-50 shadow-luxury flex flex-col border-r border-brand-gold/30">
          {/* Header */}
          <div className="p-5 border-b border-brand-espresso/10 flex items-center justify-between bg-white">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-brand-espresso border border-brand-gold flex items-center justify-center">
                <span className="font-serif text-brand-gold font-bold text-lg">V</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-[0.18em] text-brand-ink uppercase">
                Vastramay
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-brand-ink/70 hover:text-brand-ink hover:bg-brand-ivory transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-4 bg-white border-b border-brand-espresso/10">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40" />
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Search kurtas, sherwanis, sarees..."
                className="w-full bg-brand-ivory/60 pl-9 pr-3 py-2 text-xs rounded-md border border-brand-espresso/15 focus:outline-none focus:border-brand-gold"
              />
            </form>
          </div>

          {/* Accordion Categories */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Men Accordion */}
            <div className="border border-brand-espresso/10 rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => toggleSection('men')}
                className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-ivory/30"
              >
                <span>Men's Suite</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-gold-600 transition-transform ${
                    expandedSection === 'men' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'men' && (
                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-brand-espresso/5 bg-brand-ivory/20">
                  <Link
                    to="/men"
                    onClick={onClose}
                    className="block py-1 text-xs font-bold text-brand-gold-700 uppercase tracking-wider"
                  >
                    View All Men's ({'>'})
                  </Link>
                  {MEN_MEGA_MENU.columns.flatMap((c) => c.items).map((item, i) => (
                    <Link
                      key={i}
                      to={item.href}
                      onClick={onClose}
                      className="block py-1 text-xs text-brand-ink/80 hover:text-brand-ink font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Women Accordion */}
            <div className="border border-brand-espresso/10 rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => toggleSection('women')}
                className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-brand-ink hover:bg-brand-ivory/30"
              >
                <span>Women's Suite</span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-gold-600 transition-transform ${
                    expandedSection === 'women' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'women' && (
                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-brand-espresso/5 bg-brand-ivory/20">
                  <Link
                    to="/women"
                    onClick={onClose}
                    className="block py-1 text-xs font-bold text-brand-gold-700 uppercase tracking-wider"
                  >
                    View All Women's ({'>'})
                  </Link>
                  {WOMEN_MEGA_MENU.columns.flatMap((c) => c.items).map((item, i) => (
                    <Link
                      key={i}
                      to={item.href}
                      onClick={onClose}
                      className="block py-1 text-xs text-brand-ink/80 hover:text-brand-ink font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <div className="space-y-1.5 pt-2">
              <Link
                to="/products?sort=newest"
                onClick={onClose}
                className="block px-4 py-2.5 rounded-lg bg-white border border-brand-espresso/10 text-xs font-bold uppercase tracking-wider text-brand-ink hover:border-brand-gold"
              >
                New Arrivals
              </Link>
              <Link
                to="/products"
                onClick={onClose}
                className="block px-4 py-2.5 rounded-lg bg-white border border-brand-espresso/10 text-xs font-bold uppercase tracking-wider text-brand-ink hover:border-brand-gold"
              >
                All Festive Collections
              </Link>
              <Link
                to="/about"
                onClick={onClose}
                className="block px-4 py-2.5 rounded-lg bg-white border border-brand-espresso/10 text-xs font-bold uppercase tracking-wider text-brand-ink hover:border-brand-gold"
              >
                Heritage Atelier Story
              </Link>
              <Link
                to="/design-system"
                onClick={onClose}
                className="block px-4 py-2.5 rounded-lg bg-brand-gold/15 border border-brand-gold/40 text-xs font-bold uppercase tracking-wider text-brand-gold-800"
              >
                Design System Showcase
              </Link>
            </div>
          </div>

          {/* Footer Utilities */}
          <div className="p-4 border-t border-brand-espresso/10 bg-white space-y-3 pb-8">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to={customer ? '/account' : '/login'}
                onClick={onClose}
                className="flex items-center gap-2 p-2 rounded bg-brand-ivory/50 hover:bg-brand-ivory text-brand-ink font-medium"
              >
                <User className="w-4 h-4 text-brand-gold-600" />
                <span>{customer ? 'My Account' : 'Sign In'}</span>
              </Link>

              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center gap-2 p-2 rounded bg-brand-ivory/50 hover:bg-brand-ivory text-brand-ink font-medium"
              >
                <Heart className="w-4 h-4 text-brand-terracotta" />
                <span>Wishlist ({wishlistItems.length})</span>
              </Link>
            </div>

            {admin && (
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                className="flex items-center justify-between p-2 rounded bg-brand-espresso text-brand-ivory text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Admin Atelier Console</span>
                </span>
                <span className="text-[10px] text-brand-gold uppercase">Active</span>
              </Link>
            )}

            <div className="text-[11px] text-brand-ink/60 text-center font-light pt-1">
              Atelier Concierge: +91 (022) 8800-4400
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
