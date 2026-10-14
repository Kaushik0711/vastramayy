import React, { useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { CatalogFilterSidebar } from './CatalogFilterSidebar';
import { ProductFilterOptions, CatalogFacets } from '../../services/productService';
import { Category } from '../../types';
import { modalBackdropVariants, drawerSlideRightVariants } from '../../styles/motionTokens';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilterOptions;
  facets: CatalogFacets;
  categories: Category[];
  totalFilteredCount: number;
  onFilterChange: (newFilters: Partial<ProductFilterOptions>) => void;
  onClearAll: () => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  facets,
  categories,
  totalFilteredCount,
  onFilterChange,
  onClearAll,
}) => {
  // Lock background scroll when open
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
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Ambient Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-brand-espresso/70 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <motion.div
            variants={drawerSlideRightVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-brand-ivory shadow-2xl flex flex-col z-10"
          >
        {/* Drawer Header */}
        <div className="p-4 border-b border-brand-espresso/15 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-gold-600" />
            <h2 className="font-serif text-lg font-semibold text-brand-espresso">
              Filter Collection
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs uppercase tracking-wider font-semibold text-brand-terracotta hover:underline"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-brand-espresso/10 text-brand-espresso transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          <CatalogFilterSidebar
            filters={filters}
            facets={facets}
            categories={categories}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
        </div>

        {/* Bottom Fixed Apply Action Bar */}
        <div className="p-4 border-t border-brand-espresso/15 bg-white space-y-2 safe-area-pb">
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="w-full bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-md py-3"
          >
            Show {totalFilteredCount} {totalFilteredCount === 1 ? 'Masterpiece' : 'Masterpieces'}
          </Button>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
