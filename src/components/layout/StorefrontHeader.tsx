import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { MegaMenu } from './MegaMenu';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MEN_MEGA_MENU, WOMEN_MEGA_MENU } from '../../data/navigation';

export const StorefrontHeader: React.FC = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<'men' | 'women' | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { summary, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const { customer, admin, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const announcements = [
    'COMPLIMENTARY ATELIER PACKAGING & EXPRESS SHIPPING ABOVE ₹3,000',
    'BESPOKE ATELIER TAILORING AVAILABLE: 2-INCH INTERNAL ALTERATION MARGINS',
    'THE FESTIVE ATELIER 2026: DISCOVER JAIPUR GOTA PATTI & VARANASI BROCADES',
  ];

  // Rotate announcement messages
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Close menus on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setSearchOpen(false);
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Focus search input when drawer opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Hover intent with 180ms grace delay
  const handleMouseEnter = (menu: 'men' | 'women') => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const popularSearches = [
    'Chanderi Silk Kurta',
    'Groom Sherwani',
    'Banarasi Brocade Saree',
    'Jaipur Gota Patti Lehenga',
    'Raw Silk Bundi',
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brand-espresso/12 transition-all">
      {/* 1. Top Announcement Strip */}
      <div className="bg-brand-espresso text-brand-ivory text-[10px] sm:text-[11px] font-medium py-2 px-4 border-b border-brand-gold/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-brand-gold-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="uppercase tracking-widest text-[9px] font-bold">Atelier Guarantee</span>
          </div>

          <div className="flex-1 text-center truncate px-2 font-medium tracking-wider transition-all duration-500">
            {announcements[announcementIndex]}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/design-system"
              className="hidden sm:inline-block text-[9px] sm:text-[10px] bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold-200 px-2 py-0.5 rounded border border-brand-gold/40 font-semibold uppercase tracking-wider"
            >
              Design System
            </Link>
            {admin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-brand-gold text-brand-ink px-2 py-0.5 rounded font-bold uppercase tracking-wider"
              >
                <Shield className="w-3 h-3" /> Admin Mode
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Mobile Menu Hamburger Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-md text-brand-ink hover:text-brand-gold focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Left Nav Links (Men, Women, New Arrivals, Collections, Sale) */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Storefront Navigation">
            {/* Men Menu with Mega Menu Trigger */}
            <div
              className="relative py-7"
              onMouseEnter={() => handleMouseEnter('men')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/men"
                className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors flex items-center gap-1 ${
                  location.pathname === '/men' || activeMegaMenu === 'men'
                    ? 'text-brand-gold-700'
                    : 'text-brand-ink hover:text-brand-gold'
                }`}
                aria-expanded={activeMegaMenu === 'men'}
              >
                <span>Men</span>
                <ChevronDown
                  className={`w-3 h-3 text-brand-gold-600 transition-transform ${
                    activeMegaMenu === 'men' ? 'rotate-180' : ''
                  }`}
                />
              </Link>
            </div>

            {/* Women Menu with Mega Menu Trigger */}
            <div
              className="relative py-7"
              onMouseEnter={() => handleMouseEnter('women')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/women"
                className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors flex items-center gap-1 ${
                  location.pathname === '/women' || activeMegaMenu === 'women'
                    ? 'text-brand-gold-700'
                    : 'text-brand-ink hover:text-brand-gold'
                }`}
                aria-expanded={activeMegaMenu === 'women'}
              >
                <span>Women</span>
                <ChevronDown
                  className={`w-3 h-3 text-brand-gold-600 transition-transform ${
                    activeMegaMenu === 'women' ? 'rotate-180' : ''
                  }`}
                />
              </Link>
            </div>

            {/* New Arrivals */}
            <Link
              to="/products?sort=newest"
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                location.search.includes('sort=newest')
                  ? 'text-brand-gold-700'
                  : 'text-brand-ink hover:text-brand-gold'
              }`}
            >
              New Arrivals
            </Link>

            {/* Collections */}
            <Link
              to="/products"
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                location.pathname === '/products' && !location.search.includes('sort=newest')
                  ? 'text-brand-gold-700'
                  : 'text-brand-ink hover:text-brand-gold'
              }`}
            >
              Collections
            </Link>

            {/* Sale with Terracotta Badge */}
            <Link
              to="/products?sale=true"
              className="text-xs uppercase tracking-[0.2em] font-bold text-brand-terracotta hover:text-brand-terracotta/80 flex items-center gap-1.5"
            >
              <span>Sale</span>
              <span className="text-[9px] bg-brand-terracotta/15 px-1.5 py-0.2 rounded font-semibold">
                Edit
              </span>
            </Link>
          </nav>

          {/* Center Brand Wordmark */}
          <div className="flex-1 lg:flex-none flex items-center justify-center px-1 min-w-0">
            <Link to="/" className="flex flex-col items-center group py-2">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-3xl font-bold tracking-[0.12em] sm:tracking-[0.22em] text-brand-ink uppercase group-hover:text-brand-gold-700 transition-colors">
                  Vastramay
                </span>
              </div>
              <span className="font-cursive text-xs sm:text-base text-brand-gold tracking-wide -mt-0.5 sm:-mt-1 font-normal">
                Contemporary Couture
              </span>
            </Link>
          </div>

          {/* Right Header Utilities (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center space-x-0.5 sm:space-x-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-brand-ink hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold rounded-full"
              aria-label="Search garments"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <Link
              to="/wishlist"
              className="relative p-2 text-brand-ink hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold rounded-full"
              aria-label={`Wishlist (${wishlistItems.length} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-brand-terracotta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Account Profile Menu */}
            <div className="relative group hidden sm:block">
              <Link
                to={customer ? '/account' : '/login'}
                className="p-2 text-brand-ink hover:text-brand-gold transition-colors flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold rounded-full"
                aria-label="Customer account"
              >
                <User className="w-5 h-5" />
              </Link>
              {customer && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-brand-espresso/15 shadow-luxury rounded-lg py-2 hidden group-hover:block z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-brand-espresso/8 text-xs">
                    <p className="font-bold text-brand-ink">{customer.firstName} {customer.lastName}</p>
                    <p className="text-brand-ink/50 truncate text-[11px]">{customer.email}</p>
                  </div>
                  <Link to="/account" className="block px-4 py-2 text-xs text-brand-ink/80 hover:bg-brand-ivory hover:text-brand-ink">
                    My Profile & Measurements
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-xs text-brand-ink/80 hover:bg-brand-ivory hover:text-brand-ink">
                    My Saved Wishlist
                  </Link>
                  <button
                    onClick={() => logoutCustomer()}
                    className="w-full text-left px-4 py-2 text-xs text-brand-terracotta hover:bg-brand-ivory border-t border-brand-espresso/8 mt-1 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-ink rounded-full transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label={`Shopping bag (${summary.totalItems} items)`}
            >
              <ShoppingBag className="w-4 h-4 text-brand-espresso" />
              {summary.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-espresso text-brand-gold text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-brand-gold/50 shadow-xs">
                  {summary.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Desktop Mega-Menu Overlays */}
        <MegaMenu
          data={MEN_MEGA_MENU}
          isOpen={activeMegaMenu === 'men'}
          onClose={() => setActiveMegaMenu(null)}
          onMouseEnter={() => handleMouseEnter('men')}
          onMouseLeave={handleMouseLeave}
        />

        <MegaMenu
          data={WOMEN_MEGA_MENU}
          isOpen={activeMegaMenu === 'women'}
          onClose={() => setActiveMegaMenu(null)}
          onMouseEnter={() => handleMouseEnter('women')}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* 4. Search Overlay Drawer */}
      {searchOpen && (
        <div className="bg-brand-ivory-50 border-b border-brand-espresso/15 p-6 animate-fade-in shadow-elevated">
          <div className="max-w-3xl mx-auto space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by weave, silhouette, fabric, or occasion..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-sm rounded-lg border border-brand-espresso/20 focus:outline-none focus:border-brand-gold shadow-subtle"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg hover:bg-brand-espresso/90 shadow-subtle"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-brand-ink/60 hover:text-brand-ink"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Popular Atelier Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-brand-ink/50 uppercase tracking-widest font-semibold text-[10px]">
                Suggested Searches:
              </span>
              {popularSearches.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    navigate(`/products?search=${encodeURIComponent(s)}`);
                    setSearchOpen(false);
                  }}
                  className="bg-white border border-brand-espresso/10 hover:border-brand-gold text-brand-ink/80 hover:text-brand-ink px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </header>
  );
};
